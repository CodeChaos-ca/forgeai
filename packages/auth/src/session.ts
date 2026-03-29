import { Redis } from 'ioredis';
import { db } from '@forgeai/db';
import { sessions } from '@forgeai/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateAccessToken, generateRefreshToken } from './jwt';
import { encrypt, decrypt } from './encryption';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function createSession(userId: string, userAgent: string, ipAddress: string) {
  const token = generateRefreshToken(userId, '30d');
  
  // Encrypt the token for database storage
  const hashedToken = encrypt(token);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  // Store in DB
  const [session] = await db.insert(sessions).values({
    userId,
    token: hashedToken,
    expiresAt,
    userAgent,
    ipAddress,
    isValid: true,
  }).returning();

  // Cache in Redis (store id -> true for quick validation check)
  await redis.set(`session:${session.id}`, 'valid', 'EX', 30 * 24 * 60 * 60);

  return {
    sessionId: session.id,
    refreshToken: token, // Used by the client, but only encrypted version in DB
    accessToken: generateAccessToken(userId),
  };
}

export async function validateSession(sessionId: string): Promise<boolean> {
  const cached = await redis.get(`session:${sessionId}`);
  if (cached === 'valid') return true;
  if (cached === 'invalid') return false;

  // Cache miss, check DB
  const [session] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, sessionId), eq(sessions.isValid, true)));

  if (!session || session.expiresAt < new Date()) {
    await redis.set(`session:${sessionId}`, 'invalid', 'EX', 3600);
    if (session) await revokeSession(sessionId);
    return false;
  }

  // Session is valid, cache it
  await redis.set(`session:${sessionId}`, 'valid', 'EX', 3600 * 24);
  return true;
}

export async function refreshSession(sessionId: string, oldRefreshToken: string) {
  const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
  
  if (!session || !session.isValid) throw new Error('Session is invalid');
  if (session.expiresAt < new Date()) throw new Error('Session expired');

  // Verify token matches (decrypting the stored token)
  const storedToken = decrypt(session.token);
  if (storedToken !== oldRefreshToken) {
    // SECURITY: Token mismatch! Potential token theft. Revoke all user sessions.
    await revokeAllUserSessions(session.userId);
    throw new Error('Token mismatch. Security violation.');
  }

  // Rotate token
  const newRefreshToken = generateRefreshToken(session.userId, '30d');
  const hashedToken = encrypt(newRefreshToken);
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await db.update(sessions)
    .set({ token: hashedToken, expiresAt, updatedAt: new Date() })
    .where(eq(sessions.id, sessionId));

  // Extend cache
  await redis.set(`session:${sessionId}`, 'valid', 'EX', 30 * 24 * 60 * 60);

  return {
    refreshToken: newRefreshToken,
    accessToken: generateAccessToken(session.userId),
  };
}

export async function revokeSession(sessionId: string) {
  await db.update(sessions).set({ isValid: false, updatedAt: new Date() }).where(eq(sessions.id, sessionId));
  await redis.set(`session:${sessionId}`, 'invalid', 'EX', 24 * 3600);
}

export async function revokeAllUserSessions(userId: string) {
  const userSessions = await db.select({ id: sessions.id }).from(sessions).where(and(eq(sessions.userId, userId), eq(sessions.isValid, true)));
  
  await db.update(sessions).set({ isValid: false, updatedAt: new Date() }).where(eq(sessions.userId, userId));
  
  // Invalidate all in cache
  const pipeline = redis.pipeline();
  for (const s of userSessions) {
    pipeline.set(`session:${s.id}`, 'invalid', 'EX', 24 * 3600);
  }
  await pipeline.exec();
}
