import { eq, desc, and, count } from 'drizzle-orm';
import { db } from '../client';
import { analyticsEvents } from '../schema';

export async function trackEvent(data: typeof analyticsEvents.$inferInsert) {
  const [event] = await db.insert(analyticsEvents).values(data).returning();
  return event;
}

export async function getProjectAnalytics(projectId: string) {
  return db
    .select()
    .from(analyticsEvents)
    .where(eq(analyticsEvents.projectId, projectId))
    .orderBy(desc(analyticsEvents.createdAt))
    .limit(100);
}

export async function getPageViews(projectId: string) {
  const [{ total }] = await db
    .select({ total: count() })
    .from(analyticsEvents)
    .where(and(eq(analyticsEvents.projectId, projectId), eq(analyticsEvents.eventType, 'page_view')));
  
  return total;
}

export async function getTopPages(projectId: string, limitCount: number = 10) {
  // A grouped SQL query mapping
  // We avoid raw raw queries if drizzle does group + count naturally 
  // but it does using db.select({ ... count ... })
  throw new Error("Complex Grouping Top Pages - Next Iteration");
}
