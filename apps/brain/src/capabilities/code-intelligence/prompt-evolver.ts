import { db } from '@forgeai/db';
import { promptStrategies } from '@forgeai/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { registry } from '../../adapters/registry';
import type { IAIModelAdapter } from '../../adapters/types';

export type PromptStrategy = typeof promptStrategies.$inferSelect;

export class PromptEvolver {
  
  async generateMutation(parent: PromptStrategy): Promise<{ mutatedPrompt: string; mutationDescription: string }> {
    const ai = registry.getAdapter<IAIModelAdapter>('AI');
    try {
      const gen = await ai.generate([
        { role: 'system', content: `Here is a system prompt for ${parent.taskType}. Suggest ONE specific improvement. The prompt currently scores avg ${parent.avgQualityScore}. Generate an improved version entirely. Return valid JSON only {"mutatedPrompt": string, "mutationDescription": string}` },
        { role: 'user', content: parent.content }
      ], { temperature: 0.8, maxTokens: 2000 });

      let result = '';
      for await (const chunk of gen) result += chunk;

      const parsed = JSON.parse(result.replace(/```json/g, '').replace(/```/g, '').trim());
      return { mutatedPrompt: parsed.mutatedPrompt, mutationDescription: parsed.mutationDescription };
    } catch {
      throw new Error('AI Mutation Fallback Fault');
    }
  }

  async runTournament(taskType: string): Promise<{ champion: PromptStrategy | null; promoted: boolean; retired: string[] }> {
    // 1. Get all active strategies with > 20 uses
    const active = await db.select().from(promptStrategies)
      .where(and(
        eq(promptStrategies.taskType, taskType),
        eq(promptStrategies.isActive, true),
        sql`${promptStrategies.timesUsed} > 20`
      ))
      .orderBy(desc(promptStrategies.avgQualityScore));

    if (active.length < 2) return { champion: active[0] || null, promoted: false, retired: [] };

    const top1 = active[0];
    const top2 = active[1];

    // 3. Welch's t-test logic dynamically mapped inline
    const mean1 = parseFloat(top1.avgQualityScore?.toString() || '0');
    const mean2 = parseFloat(top2.avgQualityScore?.toString() || '0');
    // Using approximated variance based on usage constants to simulate standard deviations natively
    const var1 = 15.0; 
    const var2 = 15.0;
    const n1 = top1.timesUsed || 1;
    const n2 = top2.timesUsed || 1;

    const tStat = (mean1 - mean2) / Math.sqrt((var1 / n1) + (var2 / n2));
    const df = Math.pow((var1/n1) + (var2/n2), 2) / ( Math.pow(var1/n1, 2)/(n1-1) + Math.pow(var2/n2, 2)/(n2-1) );
    
    // Abstracted rough p-value estimation for df>20 logic
    const isSignificantlyBetter = (tStat > 1.96); // Approx 0.05 p-value cutoff tail

    let promoted = false;
    let newChampion = top1;

    // 4. If p < 0.05 and diff > 5
    if (isSignificantlyBetter && (mean1 - mean2) > 5) {
      if (!top1.isChampion) {
        // Demote old
        await db.update(promptStrategies).set({ isChampion: false }).where(eq(promptStrategies.taskType, taskType));
        // Promote new
        await db.update(promptStrategies).set({ isChampion: true }).where(eq(promptStrategies.id, top1.id));
        promoted = true;
      }
    }

    // 5. Retire bottom 20% if > 5 exist
    const retired: string[] = [];
    if (active.length > 5) {
      const bottomCount = Math.floor(active.length * 0.2);
      for (let i = active.length - 1; i >= active.length - bottomCount; i--) {
        await db.update(promptStrategies).set({ isActive: false }).where(eq(promptStrategies.id, active[i].id));
        retired.push(active[i].id);
      }
    }

    return { champion: newChampion, promoted, retired };
  }

  async crossover(promptA: PromptStrategy, promptB: PromptStrategy): Promise<{ crossedPrompt: string; description: string }> {
    const ai = registry.getAdapter<IAIModelAdapter>('AI');
    try {
      const gen = await ai.generate([
        { role: 'system', content: `Merge the best elements of these two prompts into one superior prompt. Return valid JSON only {"crossedPrompt": string, "description": string}` },
        { role: 'user', content: `A (${promptA.avgQualityScore}): ${promptA.content}\n\nB (${promptB.avgQualityScore}): ${promptB.content}` }
      ]);
      
      let result = '';
      for await (const chunk of gen) result += chunk;
      
      const parsed = JSON.parse(result.replace(/```json/g, '').replace(/```/g, '').trim());
      return { crossedPrompt: parsed.crossedPrompt, description: parsed.description };
    } catch {
       throw new Error('AI Crossover Fault');
    }
  }
}
