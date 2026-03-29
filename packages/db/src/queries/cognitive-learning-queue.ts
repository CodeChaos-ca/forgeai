import { eq, desc, and, count } from 'drizzle-orm';
import { db } from '../client';
import { learningQueue, memoryEpisodes } from '../schema';

export async function addToQueue(data: typeof learningQueue.$inferInsert) {
  const [item] = await db.insert(learningQueue).values(data).returning();
  return item;
}

export async function getNextItems(limitCount: number = 5) {
  return db
    .select({
      item: learningQueue,
      episode: memoryEpisodes,
    })
    .from(learningQueue)
    .leftJoin(memoryEpisodes, eq(learningQueue.sourceEpisodeId, memoryEpisodes.id))
    .where(eq(learningQueue.learningStatus, 'queued'))
    .orderBy(desc(learningQueue.priority), learningQueue.createdAt)
    .limit(limitCount);
}

export async function updateStatus(
  id: string,
  status: typeof learningQueue.$inferInsert.learningStatus,
  results?: any
) {
  const isCompleted = status === 'completed' || status === 'failed';
  const [item] = await db
    .update(learningQueue)
    .set({
      learningStatus: status,
      ...(results ? { researchResults: results } : {}),
      ...(status === 'researching' ? { attemptedAt: new Date() } : {}),
      ...(isCompleted ? { completedAt: new Date() } : {}),
    })
    .where(eq(learningQueue.id, id))
    .returning();
  return item;
}

export async function getPendingCount() {
  const [{ total }] = await db
    .select({ total: count() })
    .from(learningQueue)
    .where(eq(learningQueue.learningStatus, 'queued'));
  
  return total;
}
