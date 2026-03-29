import { generateSecureRandomToken } from './password';
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function generateCSRFToken(sessionId: string): Promise<string> {
  const token = generateSecureRandomToken(32);
  
  // Tie the CSRF token specifically to the active session for absolute boundary protection
  await redis.set(`csrf:${sessionId}:${token}`, 'valid', 'EX', 3600); // 1-hour expiry
  
  return token;
}

export async function validateCSRFToken(sessionId: string, token: string, useDisposable: boolean = true): Promise<boolean> {
  const cacheKey = `csrf:${sessionId}:${token}`;
  const exists = await redis.exists(cacheKey);
  
  if (exists && useDisposable) {
    // Single-use guarantee per critical mutation if requested
    await redis.del(cacheKey);
  }
  
  return exists === 1;
}
