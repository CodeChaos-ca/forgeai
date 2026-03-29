import argon2 from 'argon2';
import { db } from '@forgeai/db';
import { users } from '@forgeai/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    timeCost: 3,
    memoryCost: 65536,
    parallelism: 4,
  });
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    const isValid = await argon2.verify(hash, plain);
    return isValid;
  } catch (err) {
    return false;
  }
}

export async function checkPasswordHistory(userId: string, newPasswordPlain: string): Promise<boolean> {
  // Normally you'd store past N passwords in a table. 
  // For standard usage in this schema we just check the current password.
  const [user] = await db.select({ passwordHash: users.passwordHash }).from(users).where(eq(users.id, userId));
  
  if (!user || !user.passwordHash) return true; // Safe to use if no password exists (e.g., OAuth users)

  // Returns true if password is NOT the same as the current hash
  const matchesCurrent = await verifyPassword(user.passwordHash, newPasswordPlain);
  return !matchesCurrent; 
}

export function generateSecureRandomToken(byteLength: number = 32): string {
  return crypto.randomBytes(byteLength).toString('hex');
}
