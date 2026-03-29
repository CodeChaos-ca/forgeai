import { db } from '@forgeai/db';
import { promptStrategies } from '@forgeai/db/schema';
import { eq, desc } from 'drizzle-orm';

export class PromptSuggester {
  async getSuggestions(taskType: string): Promise<string[]> {
    const top = await db.select().from(promptStrategies).where(eq(promptStrategies.taskType, taskType)).orderBy(desc(promptStrategies.avgQualityScore)).limit(1);
    if (top.length === 0) return ['Try breaking your request into explicit smaller components uniquely bounds checking.'];
    return [`Optimal Structure: Describe inputs, exact logic, and expected output precisely uniquely dynamically matching bounds correctly.`];
  }
}
