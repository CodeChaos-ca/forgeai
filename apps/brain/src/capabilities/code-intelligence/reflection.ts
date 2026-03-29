import { db } from '@forgeai/db';
import { memoryEpisodes, skills, creditTransactions } from '@forgeai/db/schema';
import { sql, eq, and } from 'drizzle-orm';
import { MemorySystem } from './memory';
import { SkillEngine } from './skills';
import { registry } from '../../adapters/registry';
import type { IAIModelAdapter } from '../../adapters/types';

export class ReflectionLoop {
  private memory = new MemorySystem();
  private skillEngine = new SkillEngine();

  async reflect(episode: { projectId: string; userId: string; prompt: string; approach: string; generatedCode: any; modelsUsed: any; skillsUsed: string[]; qualityScore: number; mode: string }, userFeedback?: 'positive' | 'negative'): Promise<{ episodeId: string; lessonsLearned: string[]; skillsUpdated: string[] }> {
    
    // 1. Determine outcome mappings
    let outcome: 'success' | 'partial' | 'failure' = 'failure';
    if (episode.qualityScore >= 75) outcome = 'success';
    else if (episode.qualityScore >= 50) outcome = 'partial';

    // 2. Remember Episode
    const episodeId = await this.memory.remember({
      projectId: episode.projectId,
      userId: episode.userId,
      episodeType: episode.mode,
      userPrompt: episode.prompt,
      contextSummary: 'Reflection State Check',
      approachTaken: episode.approach,
      codeGenerated: episode.generatedCode,
      modelsUsed: episode.modelsUsed,
      skillsUsed: episode.skillsUsed,
      outcome,
      qualityScore: episode.qualityScore
    });

    // 3. Record Skill Usage natively
    if (episode.skillsUsed.length > 0) {
      await this.skillEngine.recordSkillUsage(episode.skillsUsed, outcome, episode.qualityScore);
    }

    let lessonsLearned: string[] = [];
    const skillsUpdated: string[] = [];

    // 4 & 5. User Feedback mapping
    if (userFeedback === 'positive') {
      await db.update(memoryEpisodes).set({ qualityScore: sql`${memoryEpisodes.qualityScore} + 15` }).where(eq(memoryEpisodes.id, episodeId));
    } else if (userFeedback === 'negative') {
      await db.update(memoryEpisodes).set({ qualityScore: sql`${memoryEpisodes.qualityScore} - 20` }).where(eq(memoryEpisodes.id, episodeId));
      
      const ai = registry.getAdapter<IAIModelAdapter>('groq-free') || registry.getAdapter<IAIModelAdapter>('localai');
      try {
        const str = await ai.generate([{ role: 'user', content: `Extract a ONE-SENTENCE anti-pattern from this failure context: Prompt: ${episode.prompt}, Approach: ${episode.approach}` }]);
        let reason = '';
        for await (const chunk of str) reason += chunk;
        
        // Add to matching skills anti_patterns
        if (episode.skillsUsed.length > 0) {
           await db.update(skills)
             .set({ antiPatterns: sql`array_append(COALESCE(${skills.antiPatterns}, ARRAY[]::jsonb[]), ${JSON.stringify({ description: reason })}::jsonb)` })
             .where(eq(skills.name, episode.skillsUsed[0])); // Assigning to primary skill locally
           skillsUpdated.push(episode.skillsUsed[0]);
        }
      } catch (e) {}
    }

    // 6. Outcome failure extraction
    if (outcome === 'failure' && !userFeedback) {
      lessonsLearned.push('Automated QA routines failed AST boundaries entirely. Semantic degradation tracked.');
    }

    // 7. cognitive-prompts usage record stub mapped
    // (We update promptStrategies score dynamically if bound to explicitly loaded champions here)

    return { episodeId, lessonsLearned, skillsUpdated };
  }

  async handleRollback(episodeId: string, reason: string): Promise<void> {
    // 1. Update Episode flags dynamically
    const eps = await db.update(memoryEpisodes)
      .set({ 
        metadata: sql`jsonb_set(COALESCE(${memoryEpisodes.metadata}, '{}'::jsonb), '{was_rolled_back}', 'true'::jsonb)`,
        resolution: 'failure'
      })
      .where(eq(memoryEpisodes.id, episodeId))
      .returning();
      
    if (eps.length === 0) return;
    const ep = eps[0];

    // 2 & 3. Analyze vs working code (Stubbed AI logic dynamically generating "Avoid X" rules)
    const antiPatternStr = `Regression Rollback Reason: ${reason}. Approach avoided: ${ep.actionTaken}`;

    // 4. Add anti-pattern globally
    if (ep.skillsUsed && ep.skillsUsed.length > 0) {
      for (const skill of ep.skillsUsed) {
        await db.update(skills)
         .set({ antiPatterns: sql`array_append(COALESCE(${skills.antiPatterns}, ARRAY[]::jsonb[]), ${JSON.stringify({ description: antiPatternStr })}::jsonb)` })
         .where(eq(skills.name, skill));
      }
    }

    // 5. Refund credits
    if (ep.metadata && (ep.metadata as any).userId) {
       await db.insert(creditTransactions).values({
         userId: (ep.metadata as any).userId,
         amount: 1, // Refund 1 credit linearly assuming base transaction cost
         transactionType: 'refund',
         description: `Regression refund for rolled-back episode ${episodeId}`
       });
    }
  }
}
