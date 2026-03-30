import { db } from '@forgeai/db';
import { memoryEpisodes, skills, knowledgeBase } from '@forgeai/db/schema';
import { generateEmbedding } from './embeddings';
import { sql, eq, lt, and } from 'drizzle-orm';
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export interface EpisodePayload {
  projectId: string;
  triggerEvent: string;
  contextState: any;
  actionTaken: string;
  resolution: string;
  qualityScore: number;
}

export class MemorySystem {
  
  async remember(episode: EpisodePayload): Promise<string> {
    const memoryString = `Event: ${episode.triggerEvent}. Action: ${episode.actionTaken}. Resolution: ${episode.resolution}`;
    const embedding = await generateEmbedding(memoryString);

    const [inserted] = await db.insert(memoryEpisodes).values({
      projectId: episode.projectId,
      episodeType: 'success', // or inference based on score
      triggerEvent: episode.triggerEvent,
      contextState: episode.contextState,
      actionTaken: episode.actionTaken,
      resolution: episode.resolution,
      embedding, // array to pgvector
      qualityScore: episode.qualityScore
    }).returning({ id: memoryEpisodes.id });

    return inserted.id;
  }

  async recall(query: string, projectId: string): Promise<string[]> {
    // 1. Check Short-term Memory (Redis cache for exact query hits or recent workspace session)
    const shortTerm = await this.getShortTerm(projectId);

    // 2. Episodic Search
    const embedding = await generateEmbedding(query);
    const vectorLiteral = `[${embedding.join(',')}]`;

    const episodicHits = await db
      .select({ resolution: memoryEpisodes.resolution })
      .from(memoryEpisodes)
      .where(eq(memoryEpisodes.projectId, projectId))
      .orderBy(sql`${memoryEpisodes.embedding} <=> ${vectorLiteral}::vector`)
      .limit(3);

    return [...(shortTerm ? [shortTerm] : []), ...episodicHits.map(e => e.resolution!)];
  }

  async forget() {
    // Archive/Delete episodes older than 6mo with extremely low quality scores
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    await db.delete(memoryEpisodes).where(
      and(
        lt(memoryEpisodes.createdAt, sixMonthsAgo),
        lt(memoryEpisodes.qualityScore, 30) // Useless memories
      )
    );
  }

  async consolidate() {
    // Batch process memory episodes to promote persistent patterns into 'skills' organically
    // Batch process memory episodes to promote persistent patterns into 'skills' organically
    const episodes = await db.select().from(memoryEpisodes).where(lt(memoryEpisodes.createdAt, new Date())); // All pending
    
    // Group episodes by triggerEvent
    const groups: Record<string, typeof episodes> = {};
    for (const ep of episodes) {
      if (!groups[ep.triggerEvent!]) groups[ep.triggerEvent!] = [];
      groups[ep.triggerEvent!].push(ep);
    }
    
    for (const [trigger, groupedEpisodes] of Object.entries(groups)) {
      if (groupedEpisodes.length >= 3) {
        // High density cluster detected! Promote to a primitive skill
        const bestEpisode = groupedEpisodes.sort((a,b) => (b.qualityScore || 0) - (a.qualityScore || 0))[0];
        await db.insert(skills).values({
          name: `Auto-Learned Skill for ${trigger.substring(0,20)}`,
          description: `Automatically consolidated from ${groupedEpisodes.length} successful memories.`,
          codePatterns: [bestEpisode.resolution!]
        }).onConflictDoNothing();
      }
    }
  }

  async getShortTerm(projectId: string): Promise<string | null> {
    return await redis.get(`stm_project:${projectId}`);
  }

  async setShortTerm(projectId: string, memoryStr: string): Promise<void> {
    // Expire short-term scratchpad memory automatically after 24 hours
    await redis.set(`stm_project:${projectId}`, memoryStr, 'EX', 86400); 
  }
}
