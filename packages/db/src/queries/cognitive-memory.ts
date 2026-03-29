import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../client';
import { memoryEpisodes } from '../schema';

export async function storeEpisode(data: typeof memoryEpisodes.$inferInsert) {
  const [episode] = await db.insert(memoryEpisodes).values(data).returning();
  return episode;
}

export async function searchSimilarEpisodes(embedding: number[], projectId: string, limitCount: number = 5) {
  const embeddingStr = `[${embedding.join(',')}]`;
  
  return db
    .select({
      id: memoryEpisodes.id,
      userPrompt: memoryEpisodes.userPrompt,
      contextSummary: memoryEpisodes.contextSummary,
      approachTaken: memoryEpisodes.approachTaken,
      outcome: memoryEpisodes.outcome,
      qualityScore: memoryEpisodes.qualityScore,
      similarity: sql<number>`1 - (${memoryEpisodes.embedding} <=> ${embeddingStr}::vector)`
    })
    .from(memoryEpisodes)
    .where(sql`${memoryEpisodes.projectId} = ${projectId} AND ${memoryEpisodes.embedding} IS NOT NULL`)
    .orderBy(sql`${memoryEpisodes.embedding} <=> ${embeddingStr}::vector`)
    .limit(limitCount);
}

export async function updateEpisodeOutcome(id: string, outcome: string, qualityScore: number) {
  const [episode] = await db
    .update(memoryEpisodes)
    .set({ outcome, qualityScore })
    .where(eq(memoryEpisodes.id, id))
    .returning();
  return episode;
}

export async function getRecentEpisodes(projectId: string, limitCount: number = 10) {
  return db
    .select()
    .from(memoryEpisodes)
    .where(eq(memoryEpisodes.projectId, projectId))
    .orderBy(desc(memoryEpisodes.createdAt))
    .limit(limitCount);
}

export async function consolidateEpisodes() {
  // Helper for batch data engineering sweeps
  return [];
}
