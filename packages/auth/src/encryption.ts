import crypto from 'crypto';

// 256-bit encryption key requires 32 exact bytes
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default1234567890123456789012345';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

export function encrypt(text: string): string {
  if (!text) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf-8'), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  // Combine IV, authData, and encrypted sequence uniquely
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string): string {
  if (!text) return '';
  const textParts = text.split(':');
  if (textParts.length !== 3) throw new Error('Invalid encrypted payload structure');

  const iv = Buffer.from(textParts[0], 'hex');
  const authTag = Buffer.from(textParts[1], 'hex');
  const encryptedText = Buffer.from(textParts[2], 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf-8'), iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText, undefined, 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

export function encryptJSON(obj: Record<string, any>): string {
  return encrypt(JSON.stringify(obj));
}

export function decryptJSON<T = Record<string, any>>(text: string): T {
  return JSON.parse(decrypt(text)) as T;
}
