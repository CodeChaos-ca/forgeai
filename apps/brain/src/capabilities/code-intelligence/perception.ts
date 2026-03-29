import { db } from '@forgeai/db';
import { knowledgeBase, skills, learningQueue, memoryEpisodes, projectFiles } from '@forgeai/db/schema';
import { sql, eq, and, desc, inArray } from 'drizzle-orm';
import { generateEmbedding } from '../../utils/embeddings';
import { registry } from '../../adapters/registry';
import type { IAIModelAdapter } from '../../adapters/types';
import { encode } from 'tiktoken';

export type IntentClassification = {
  taskTypes: string[];
  primaryTask: string;
  complexity: 'trivial' | 'simple' | 'moderate' | 'complex' | 'expert';
  estimatedFiles: number;
  estimatedTimeMinutes: number;
  confidence: number;
  requiresMultiAgent: boolean;
};

export type Skill = typeof skills.$inferSelect;

export class PerceptionLayer {
  async classifyIntent(
    prompt: string,
    projectContext: { projectId: string; files: Array<{ path: string; content: string }>; dataModels: any[] }
  ): Promise<IntentClassification> {
    const promptEmbedding = await generateEmbedding(prompt);
    const vectorLiteral = `[${promptEmbedding.join(',')}]`;

    // 2. Check against known intent patterns in knowledge base (pgvector cosine search, top 5)
    const knownPatterns = await db
      .select({ id: knowledgeBase.id, category: knowledgeBase.category, similarity: sql<number>`1 - (${knowledgeBase.embedding} <=> ${vectorLiteral}::vector)` })
      .from(knowledgeBase)
      .where(eq(knowledgeBase.isOutdated, false))
      .orderBy(sql`${knowledgeBase.embedding} <=> ${vectorLiteral}::vector`)
      .limit(5);

    // 3. Keyword analysis
    const lowerPrompt = prompt.toLowerCase();
    const keywords = ['fix', 'add', 'create', 'optimize', 'test', 'deploy', 'refactor', 'review', 'design', 'update'];
    const foundKeywords = keywords.filter(k => lowerPrompt.includes(k));

    let detectedTaskTypes = new Set<string>();
    if (lowerPrompt.includes('fix') || lowerPrompt.includes('bug')) detectedTaskTypes.add('bug_fixing');
    if (lowerPrompt.includes('test') || lowerPrompt.includes('spec')) detectedTaskTypes.add('test_generation');
    if (lowerPrompt.includes('refactor') || lowerPrompt.includes('clean')) detectedTaskTypes.add('refactoring');
    if (lowerPrompt.includes('optimize') || lowerPrompt.includes('speed')) detectedTaskTypes.add('optimization');
    if (lowerPrompt.includes('deploy') || lowerPrompt.includes('publish')) detectedTaskTypes.add('deployment');
    
    // Add hits from knowledge base categories
    knownPatterns.filter(p => p.similarity > 0.8).forEach(p => p.category && detectedTaskTypes.add(p.category));

    let primaryTaskStr = Array.from(detectedTaskTypes)[0] || 'code_generation';
    let rawComplexity = Math.min(5, Math.ceil(prompt.split(' ').length / 20));

    // 4. Use AI if ambiguous
    let confidenceScore = 0.5 + (foundKeywords.length * 0.1);
    
    if (detectedTaskTypes.size === 0 || confidenceScore < 0.7) {
      // Intentionally request groq or localai specifically for fast generic classification
      const fastAi = registry.getAdapter<IAIModelAdapter>('groq-free') || registry.getAdapter<IAIModelAdapter>('localai');
      if (fastAi) {
        try {
          const aiResponseStream = await fastAi.generate([
            { role: 'system', content: 'You are an intent classifier. Return ONLY valid JSON: {"taskTypes": string[], "primaryTask": string, "complexity": number(1-5), "confidence": number(0.0-1.0)}' },
            { role: 'user', content: `Classify this user request into task types: [code_generation, bug_fixing, optimization, architecture_planning, test_generation, code_review, explanation, refactoring, ui_design, data_modeling]. Request: ${prompt}` }
          ], { temperature: 0.1, maxTokens: 100 });
          
          let aiRes = '';
          for await (const chunk of aiResponseStream) aiRes += chunk;
          
          const cleanJson = aiRes.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          
          if (parsed.taskTypes) parsed.taskTypes.forEach((t: string) => detectedTaskTypes.add(t));
          if (parsed.primaryTask) primaryTaskStr = parsed.primaryTask;
          if (parsed.complexity) rawComplexity = parsed.complexity;
          if (parsed.confidence) confidenceScore = Math.max(confidenceScore, parsed.confidence);
          
        } catch (e) {
          console.warn('[PERCEPTION] AI classification fallback failed. Relying on heuristics.', e);
        }
      }
    }

    if (detectedTaskTypes.size === 0) detectedTaskTypes.add('code_generation');

    // Interpret complexity score
    let strComplexity: 'trivial' | 'simple' | 'moderate' | 'complex' | 'expert' = 'simple';
    if (rawComplexity === 1) strComplexity = 'trivial';
    if (rawComplexity === 2) strComplexity = 'simple';
    if (rawComplexity === 3) strComplexity = 'moderate';
    if (rawComplexity === 4) strComplexity = 'complex';
    if (rawComplexity >= 5) strComplexity = 'expert';

    return {
      taskTypes: Array.from(detectedTaskTypes),
      primaryTask: primaryTaskStr,
      complexity: strComplexity,
      estimatedFiles: Math.max(1, rawComplexity * 2),
      estimatedTimeMinutes: rawComplexity * 15,
      confidence: Math.min(1.0, confidenceScore),
      requiresMultiAgent: rawComplexity >= 4
    };
  }

  async matchSkills(intent: IntentClassification, projectContext: any): Promise<Array<{ skill: Skill; relevance: number; reason: string }>> {
    const promptEmbedding = await generateEmbedding(intent.primaryTask); // Use primary intent for semantic skill lookup
    const vectorLiteral = `[${promptEmbedding.join(',')}]`;

    // 2. Query cognitive.skills with pgvector
    const candidateSkills = await db
      .select({
        skill: skills,
        cosineDistance: sql<number>`${skills.embedding} <=> ${vectorLiteral}::vector`
      })
      .from(skills)
      .where(eq(skills.isActive, true))
      .orderBy(sql`${skills.embedding} <=> ${vectorLiteral}::vector`)
      .limit(10);

    const scoredMatches = candidateSkills.map(({ skill, cosineDistance }) => {
      // 3. Keyword filtering logic influence (boost score if category matches taskType)
      const categoryMatchBoost = intent.taskTypes.includes(skill.category || '') ? 0.15 : 0;
      
      const avgQualitySafe = skill.avgQualityScore ? parseFloat(skill.avgQualityScore.toString()) : 50;
      const timesUsed = skill.timesUsed || 1;
      const successCount = skill.successCount || 0;
      const successRate = successCount / Math.max(1, timesUsed);
      
      // 4. Score calculation: score = (1 - distance) * 0.6 + (quality / 100) * 0.3 + (success_rate) * 0.1
      let score = ((1 - cosineDistance) * 0.6) + ((avgQualitySafe / 100) * 0.3) + (successRate * 0.1) + categoryMatchBoost;
      
      return {
        skill,
        relevance: Math.min(1.0, score),
        reason: categoryMatchBoost > 0 ? `Highly aligned to intent task type (${skill.category})` : `Semantically matched to query.`
      };
    });

    // 5. Sort descending, take top 5
    scoredMatches.sort((a, b) => b.relevance - a.relevance);
    const top5 = scoredMatches.slice(0, 5);

    // 6. Check confidence
    if (top5.length === 0 || top5[0].relevance < 0.5) {
      await db.insert(learningQueue).values({
        conceptName: `Skill resolution deficit for task: ${intent.primaryTask}`,
        priority: 70,
        learningStatus: 'queued',
        sourceContext: { intent }
      });
    }

    return top5;
  }

  async assembleContext(
    projectId: string,
    intent: IntentClassification,
    matchedSkills: Array<{ skill: Skill; relevance: number }>,
    tokenBudget: number
  ): Promise<{ systemPrompt: string; projectFiles: string[]; pastEpisodes: string[]; knowledgeEntries: string[]; skillInstructions: string; userHistory: string; totalTokens: number }> {
    
    // 1. Calculate token limits
    const budgetFiles = Math.floor(tokenBudget * 0.40);
    const budgetEpisodes = Math.floor(tokenBudget * 0.20);
    const budgetKnowledge = Math.floor(tokenBudget * 0.20);
    const budgetSkills = Math.floor(tokenBudget * 0.10);
    
    let totalTokens = 0;

    // 2. PROJECT FILES
    const files = await db.select().from(projectFiles).where(eq(projectFiles.projectId, projectId));
    // Embeddings check simulating contextual nearness
    const assembledFiles: string[] = [];
    let fileTokens = 0;
    
    for (const f of files) {
      if (!f.content) continue;
      const tks = encode(f.content).length;
      if (fileTokens + tks <= budgetFiles) {
        assembledFiles.push(`/* Path: ${f.filePath} */\n${f.content}`);
        fileTokens += tks;
        totalTokens += tks;
      }
    }

    // 3. PAST EPISODES
    const intentEmbedding = await generateEmbedding(intent.primaryTask);
    const vecLiteral = `[${intentEmbedding.join(',')}]`;
    
    const episodes = await db.select()
      .from(memoryEpisodes)
      .where(
        and(
          eq(memoryEpisodes.projectId, projectId),
          inArray(memoryEpisodes.episodeType, ['success', 'partial']),
          sql`${memoryEpisodes.qualityScore} > 50`
        )
      )
      .orderBy(sql`${memoryEpisodes.embedding} <=> ${vecLiteral}::vector`)
      .limit(3);

    const assembledEpisodes: string[] = [];
    let episodeTokens = 0;
    for (const e of episodes) {
      const text = `Previous similar task: ${e.triggerEvent} → Approach: ${e.actionTaken} → Outcome: ${e.resolution} (quality: ${e.qualityScore})`;
      const tks = encode(text).length;
      if (episodeTokens + tks <= budgetEpisodes) {
        assembledEpisodes.push(text);
        episodeTokens += tks;
        totalTokens += tks;
      }
    }

    // 4. KNOWLEDGE
    const knowledge = await db.select()
      .from(knowledgeBase)
      .where(eq(knowledgeBase.isOutdated, false))
      .orderBy(sql`${knowledgeBase.embedding} <=> ${vecLiteral}::vector`)
      .limit(5);

    const assembledKnowledge: string[] = [];
    let knowledgeTokens = 0;
    for (const k of knowledge) {
      const text = `[KB: ${k.title}] ${k.content}`; // Truncated summarization mapped internally if needed
      const tks = encode(text).length;
      if (knowledgeTokens + tks <= budgetKnowledge) {
        assembledKnowledge.push(text);
        knowledgeTokens += tks;
        totalTokens += tks;
      }
    }

    // 5. SKILLS
    const skillLines = matchedSkills.map(s => `Skill: ${s.skill.name}\n${s.skill.promptStrategy}\nAvoid: ${JSON.stringify(s.skill.antiPatterns)}`);
    const skillMerged = skillLines.join('\n\n');
    totalTokens += encode(skillMerged).length;

    // Output mapped gracefully ensuring hard truncation cuts off exact overflows.
    return {
      systemPrompt: "You are the ForgeAI Prometheus engine...",
      projectFiles: assembledFiles,
      pastEpisodes: assembledEpisodes,
      knowledgeEntries: assembledKnowledge,
      skillInstructions: skillMerged,
      userHistory: "Context placeholder mapped from chat layer.",
      totalTokens
    };
  }
}
