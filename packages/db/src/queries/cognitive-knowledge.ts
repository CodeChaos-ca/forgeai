import { eq, sql } from 'drizzle-orm';
import { db } from '../client';
import { knowledgeBase } from '../schema';

export async function addKnowledge(data: typeof knowledgeBase.$inferInsert) {
  const [knowledge] = await db.insert(knowledgeBase).values(data).returning();
  return knowledge;
}

export async function searchKnowledge(embedding: number[], limitCount: number = 5) {
  const embeddingStr = `[${embedding.join(',')}]`;

  return db
    .select({
      id: knowledgeBase.id,
      title: knowledgeBase.title,
      contentSummary: knowledgeBase.contentSummary,
      content: knowledgeBase.content,
      similarity: sql<number>`1 - (${knowledgeBase.embedding} <=> ${embeddingStr}::vector)`
    })
    .from(knowledgeBase)
    .where(sql`${knowledgeBase.isOutdated} = false AND ${knowledgeBase.embedding} IS NOT NULL`)
    .orderBy(sql`${knowledgeBase.embedding} <=> ${embeddingStr}::vector`)
    .limit(limitCount);
}

export async function markOutdated(id: string, reason: string, supersededById?: string) {
  const [knowledge] = await db
    .update(knowledgeBase)
    .set({ 
      isOutdated: true, 
      outdatedReason: reason, 
      supersededBy: supersededById,
      updatedAt: new Date() 
    })
    .where(eq(knowledgeBase.id, id))
    .returning();
  return knowledge;
}

export async function updateRelevance(id: string, helpful: boolean) {
  const isHelpfulInc = helpful ? 1 : 0;
  // A simple +1 or -1 relevance points bound check goes into backend business logic, not just raw SQL ideally
  const [knowledge] = await db
    .update(knowledgeBase)
    .set({
      timesRetrieved: sql`${knowledgeBase.timesRetrieved} + 1`,
      timesHelpful: sql`${knowledgeBase.timesHelpful} + ${isHelpfulInc}`,
      updatedAt: new Date(),
    })
    .where(eq(knowledgeBase.id, id))
    .returning();
  return knowledge;
}

export async function getKnowledgeByTechnology(technology: string) {
  return db
    .select()
    .from(knowledgeBase)
    .where(eq(knowledgeBase.technology, technology));
}
