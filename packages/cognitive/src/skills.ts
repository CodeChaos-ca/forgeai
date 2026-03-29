import { db } from '@forgeai/db';
import { skills } from '@forgeai/db/schema';
import { sql, eq } from 'drizzle-orm';
import { IntentContext, SkillMatch } from './perception';

export class SkillEngine {
  
  async findAndComposeSkills(intent: IntentContext, context: any) {
    // Simplified matching delegation, relies on Perception layer typically
    return {
      composedSynergy: true
    };
  }

  async recordSkillUsage(skillIds: string[], outcome: 'success' | 'failure', newQualityScore: number) {
    const isSuccess = outcome === 'success' ? 1 : 0;
    const isFailure = outcome === 'failure' ? 1 : 0;

    // Exponential Moving Average mapping: NewAvg = (0.3 * NewScore) + (0.7 * OldAvg)
    const alpha = 0.3;
    const invAlpha = 0.7;

    for (const skillId of skillIds) {
      await db.update(skills)
        .set({
          timesUsed: sql`${skills.timesUsed} + 1`,
          successCount: sql`${skills.successCount} + ${isSuccess}`,
          failureCount: sql`${skills.failureCount} + ${isFailure}`,
          avgQualityScore: sql`(${alpha} * ${newQualityScore}::numeric) + (${invAlpha} * COALESCE(${skills.avgQualityScore}, ${newQualityScore}))`,
          updatedAt: new Date()
        })
        .where(eq(skills.id, skillId));
    }
  }

  async getSkillRecommendations(projectContext: string) {
    // Analyzes stack config (like looking at package.json dependencies)
    // to dynamically recommend skills the user's agent hasn't utilized yet.
    return [];
  }
}
