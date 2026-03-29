import { db } from '@forgeai/db';
import { skills } from '@forgeai/db/schema';
import { sql, eq, desc } from 'drizzle-orm';
import type { IntentClassification, Skill } from './perception';

export type ComposedSkillPlan = {
  skills: Skill[];
  compositionOrder: string[];
  combinedPromptAddition: string;
  combinedCodePatterns: any[];
  combinedAntiPatterns: any[];
};

export class SkillEngine {
  
  async findAndComposeSkills(intent: IntentClassification, matchedSkills: Array<{ skill: Skill; relevance: number }>): Promise<ComposedSkillPlan> {
    // 1. Take matched skills sorted by relevance
    const sorted = [...matchedSkills].sort((a, b) => b.relevance - a.relevance);
    const activeSkillSet = new Map<string, Skill>();
    
    // 2. Extract and check dependencies (Assuming metadata contains dependencies array)
    for (const match of sorted) {
      activeSkillSet.set(match.skill.name, match.skill);
      const metadataStr = typeof match.skill.metadata === 'string' ? match.skill.metadata : JSON.stringify(match.skill.metadata || {});
      const meta = JSON.parse(metadataStr || '{}');
      if (Array.isArray(meta.dependencies)) {
        for (const depName of meta.dependencies) {
          if (!activeSkillSet.has(depName)) {
            // Fetch dependency from DB if missing natively
            const depSkill = await db.select().from(skills).where(eq(skills.name, depName)).limit(1);
            if (depSkill.length > 0) activeSkillSet.set(depName, depSkill[0]);
          }
        }
      }
    }

    const finalSkills = Array.from(activeSkillSet.values());
    
    // 3. Simple Topological sort simulation (alphabetical fallback for linear execution context blocks)
    const compositionOrder = finalSkills.map(s => s.name).sort();

    // 4. Combine prompt strategy texts
    const combinedPrompts: string[] = [];
    const combinedCodePatterns: any[] = [];
    const combinedAntiPatterns: any[] = [];

    for (const skill of finalSkills) {
      if (skill.promptStrategy) combinedPrompts.push(`### Skill: ${skill.name}\n${skill.promptStrategy}`);
      if (skill.codePatterns) {
        if (Array.isArray(skill.codePatterns)) combinedCodePatterns.push(...skill.codePatterns);
        else combinedCodePatterns.push(skill.codePatterns);
      }
      if (skill.antiPatterns) {
        if (Array.isArray(skill.antiPatterns)) combinedAntiPatterns.push(...skill.antiPatterns);
        else combinedAntiPatterns.push(skill.antiPatterns);
      }
    }

    return {
      skills: finalSkills,
      compositionOrder,
      combinedPromptAddition: combinedPrompts.join('\n\n'),
      combinedCodePatterns,
      combinedAntiPatterns
    };
  }

  async recordSkillUsage(skillIds: string[], outcome: 'success' | 'partial' | 'failure', qualityScore: number): Promise<void> {
    const alpha = 0.3;
    const isSuccess = outcome === 'success' ? 1 : 0;
    const isFailure = outcome === 'failure' ? 1 : 0;

    for (const id of skillIds) {
      await db.update(skills)
        .set({
          timesUsed: sql`${skills.timesUsed} + 1`,
          successCount: sql`${skills.successCount} + ${isSuccess}`,
          failureCount: sql`${skills.failureCount} + ${isFailure}`,
          avgQualityScore: sql`(${alpha} * ${qualityScore}::numeric) + ((1.0 - ${alpha}) * COALESCE(${skills.avgQualityScore}, ${qualityScore}))`,
          updatedAt: new Date()
        })
        .where(eq(skills.id, id));
    }
  }

  async getSkillRecommendations(projectContext: { dataModels: any[]; existingFeatures: string[] }): Promise<Array<{ skill: Skill; reason: string }>> {
    const recommendations: Array<{ skill: Skill; reason: string }> = [];

    // Analyze data models statically
    const hasUsers = projectContext.dataModels.some(dm => dm.name?.toLowerCase().includes('user'));
    if (hasUsers && !projectContext.existingFeatures.includes('auth')) {
      const authSkill = await db.select().from(skills).where(eq(skills.category, 'auth')).limit(1);
      if (authSkill.length > 0) recommendations.push({ skill: authSkill[0], reason: 'Project contains User schema but lacks explicit Auth capabilities.' });
    }

    // Query highest avg_quality_score skills generally not explicitly bound
    const topSkills = await db.select().from(skills).orderBy(desc(skills.avgQualityScore)).limit(3);
    for (const ts of topSkills) {
      if (!recommendations.some(r => r.skill.id === ts.id)) {
        recommendations.push({ skill: ts, reason: 'Highly rated procedural capability universally applicable.' });
      }
    }

    return recommendations.slice(0, 3);
  }
}
