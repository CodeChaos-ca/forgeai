import { eq, gt } from 'drizzle-orm';
import { db } from '../client';
import { sessions } from '../schema';

export async function createSession(data: typeof sessions.$inferInsert) {
  const [session] = await db.insert(sessions).values(data).returning();
  return session;
}

export async function getSessionByToken(token: string) {
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.sessionToken, token))
    .limit(1);
  return session || null;
}

export async function deleteSession(token: string) {
  const [deleted] = await db
    .delete(sessions)
    .where(eq(sessions.sessionToken, token))
    .returning();
  return deleted;
}

export async function deleteUserSessions(userId: string) {
  return db.delete(sessions).where(eq(sessions.userId, userId)).returning();
}

export async function getActiveSessions(userId: string) {
  return db
    .select()
    .from(sessions)
    .where(eq(sessions.userId, userId))
    .where(gt(sessions.expiresAt, new Date()));
}
