import { generateEmbedding, cosineSimilarity } from './embeddings';
import { db } from '@forgeai/db';
import { skills, projectFiles, knowledgeBase, memoryEpisodes, learningQueue } from '@forgeai/db/schema';
import { sql, desc, eq, and, gt } from 'drizzle-orm';
import { getProjectFiles } from '@forgeai/db/src/queries'; // Re-use core queries if beneficial

export interface IntentContext {
  taskTypes: string[];
  complexity: number; // 1-10 string
  estimatedFiles: string[];
  confidence: number;
  rawPromptEmbedding: number[];
}

export interface SkillMatch {
  id: string;
  name: string;
  promptStrategy: string;
  codePatterns: any;
  antiPatterns: any;
  confidence: number;
}

export class PerceptionLayer {
  
  async classifyIntent(prompt: string, projectContext: string): Promise<IntentContext> {
    // Advanced perception: embed the prompt specifically to extract latent meaning
    const embedding = await generateEmbedding(prompt);

    // Naive local heuristic for complexity parsing (In a real massive system, a smaller LLM could classify this)
    const taskTypes = [];
    if (prompt.toLowerCase().includes('bug') || prompt.toLowerCase().includes('fix')) taskTypes.push('bugfix');
    if (prompt.toLowerCase().includes('test')) taskTypes.push('testing');
    if (prompt.toLowerCase().includes('refactor')) taskTypes.push('refactor');
    if (taskTypes.length === 0) taskTypes.push('feature_implementation');

    const wordCount = prompt.split(' ').length;
    let complexity = Math.min(10, Math.ceil(wordCount / 10));

    // Guess estimated files via cheap embedding search inside projectFiles
    const topFiles = await db
      .select({ filePath: projectFiles.filePath, distance: sql`${projectFiles.contentHash} <=> '[0]'` }) // Pseudocode for cheap search, contentHash isn't vector natively in spec, so we rely on exact filename match or just simple substring
      .from(projectFiles)
      .limit(3);

    return {
      taskTypes,
      complexity,
      estimatedFiles: topFiles.map(f => f.filePath),
      confidence: 0.85,
      rawPromptEmbedding: embedding
    };
  }

  async matchSkills(intent: IntentContext, projectContext: string): Promise<SkillMatch[]> {
    // pgvector threshold cosine distance
    const vectorLiteral = `[${intent.rawPromptEmbedding.join(',')}]`;
    
    // Select top 5 skills based on vector similarity * historical quality score
    const matches = await db
      .select({
        id: skills.id,
        name: skills.name,
        promptStrategy: skills.promptStrategy,
        codePatterns: skills.codePatterns,
        antiPatterns: skills.antiPatterns,
        similarity: sql<number>`1 - (${skills.embedding} <=> ${vectorLiteral}::vector)`,
        avgScore: skills.avgQualityScore
      })
      .from(skills)
      .where(eq(skills.isActive, true))
      // Combine cosine similarity and average score dynamically
      .orderBy(sql`(1 - (${skills.embedding} <=> ${vectorLiteral}::vector)) * COALESCE(${skills.avgQualityScore}, 1) DESC`)
      .limit(5);

    const formattedMatches = matches.map(m => ({
      id: m.id,
      name: m.name,
      promptStrategy: m.promptStrategy,
      codePatterns: m.codePatterns,
      antiPatterns: m.antiPatterns,
      confidence: m.similarity!
    }));

    if (formattedMatches.length > 0 && formattedMatches[0].confidence < 0.5) {
      // Confidence is low, meaning the cognitive engine lacks the skills. Add to learning queue.
      await db.insert(learningQueue).values({
        conceptName: intent.taskTypes[0] || 'Unknown Context',
        priority: 1,
        learningStatus: 'queued'
      });
    }

    return formattedMatches;
  }

  async assembleContext(projectId: string, intent: IntentContext, matchedSkills: SkillMatch[], tokenBudget: number) {
    // Strategy: Split budget into 40% files, 20% past memories, 20% knowledge, 10% skills, 10% system definitions
    const fileBudget = Math.floor(tokenBudget * 0.40);
    const vectorLiteral = `[${intent.rawPromptEmbedding.join(',')}]`;

    // 1. Fetch relevant Knowledge Entries via vector similarity
    const knowledge = await db
      .select({ content: knowledgeBase.content })
      .from(knowledgeBase)
      .orderBy(sql`${knowledgeBase.embedding} <=> ${vectorLiteral}::vector`)
      .limit(3);

    // 2. Fetch relevant past Episodes (episodic memory recall)
    const episodes = await db
      .select({ resolution: memoryEpisodes.resolution })
      .from(memoryEpisodes)
      .where(eq(memoryEpisodes.projectId, projectId))
      .orderBy(sql`${memoryEpisodes.embedding} <=> ${vectorLiteral}::vector`)
      .limit(3);

    // 3. Skills context is already gathered in matchedSkills
    
    return {
      knowledgeRefs: knowledge.map(k => k.content),
      pastResolutions: episodes.map(e => e.resolution),
      skillsActive: matchedSkills.map(s => s.promptStrategy)
    };
  }
}
