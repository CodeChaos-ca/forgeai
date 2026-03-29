import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../client';
import { notifications } from '../schema';

export async function getUserNotifications(userId: string) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function createNotification(data: typeof notifications.$inferInsert) {
  const [notification] = await db.insert(notifications).values(data).returning();
  return notification;
}

export async function markAsRead(id: string) {
  const [notification] = await db
    .update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(eq(notifications.id, id))
    .returning();
  return notification;
}

export async function markAllAsRead(userId: string) {
  return db
    .update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
    .returning();
}

export async function getUnreadCount(userId: string) {
  const [{ count }] = await db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return count;
}
