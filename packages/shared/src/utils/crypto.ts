import { randomBytes, createHash, createCipheriv, createDecipheriv } from 'crypto';

export function generateToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function generateId(prefix: string = ''): string {
  const id = randomBytes(12).toString('hex');
  return prefix ? `${prefix}_${id}` : id;
}

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const KEY_LENGTH = 32;

export function encrypt(text: string, base64Key: string): string {
  const key = Buffer.from(base64Key, 'base64');
  if (key.length !== KEY_LENGTH) {
    throw new Error(`Encryption key must be ${KEY_LENGTH} bytes long`);
  }
  
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(encryptedText: string, base64Key: string): string {
  const key = Buffer.from(base64Key, 'base64');
  if (key.length !== KEY_LENGTH) {
    throw new Error(`Encryption key must be ${KEY_LENGTH} bytes long`);
  }
  
  const parts = encryptedText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format');
  }
  
  const iv = Buffer.from(parts[0]!, 'hex');
  const authTag = Buffer.from(parts[1]!, 'hex');
  const encrypted = parts[2]!;
  
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
