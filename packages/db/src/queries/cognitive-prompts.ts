import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../client';
import { promptStrategies } from '../schema';

export async function getChampionPrompt(taskType: string) {
  const [champion] = await db
    .select()
    .from(promptStrategies)
    .where(and(
      eq(promptStrategies.taskType, taskType),
      eq(promptStrategies.isChampion, true),
      eq(promptStrategies.isActive, true)
    ))
    .limit(1);
    
  return champion || null;
}

export async function getAllPromptsForTask(taskType: string) {
  return db
    .select()
    .from(promptStrategies)
    .where(and(eq(promptStrategies.taskType, taskType), eq(promptStrategies.isActive, true)))
    .orderBy(desc(promptStrategies.avgQualityScore));
}

export async function createPromptMutation(data: typeof promptStrategies.$inferInsert) {
  const [mutation] = await db.insert(promptStrategies).values(data).returning();
  return mutation;
}

export async function recordPromptUsage(id: string, qualityScore: number, feedback: 'positive' | 'negative' | 'none', wasRolledBack: boolean) {
  const isPos = feedback === 'positive' ? 1 : 0;
  const isNeg = feedback === 'negative' ? 1 : 0;
  const isRollback = wasRolledBack ? 1 : 0;
  
  const [strategy] = await db
    .update(promptStrategies)
    .set({
      timesUsed: sql`${promptStrategies.timesUsed} + 1`,
      totalQualityScore: sql`${promptStrategies.totalQualityScore} + ${qualityScore}`,
      // Re-calculate average on the fly: (totalScore + newScore) / (timesUsed + 1)
      avgQualityScore: sql`(${promptStrategies.totalQualityScore} + ${qualityScore}::numeric) / (${promptStrategies.timesUsed} + 1)`,
      positiveFeedbackCount: sql`${promptStrategies.positiveFeedbackCount} + ${isPos}`,
      negativeFeedbackCount: sql`${promptStrategies.negativeFeedbackCount} + ${isNeg}`,
      rollbackCount: sql`${promptStrategies.rollbackCount} + ${isRollback}`,
      updatedAt: new Date()
    })
    .where(eq(promptStrategies.id, id))
    .returning();
    
  return strategy;
}

export async function runTournament(aId: string, bId: string, aWon: boolean) {
  return await db.transaction(async (tx) => {
    const aWinsInc = aWon ? 1 : 0;
    const aLossInc = aWon ? 0 : 1;
    const bWinsInc = aWon ? 0 : 1;
    const bLossInc = aWon ? 1 : 0;
    
    await tx.update(promptStrategies)
      .set({ 
        tournamentWins: sql`${promptStrategies.tournamentWins} + ${aWinsInc}`,
        tournamentLosses: sql`${promptStrategies.tournamentLosses} + ${aLossInc}`,
        updatedAt: new Date()
      })
      .where(eq(promptStrategies.id, aId));
      
    await tx.update(promptStrategies)
      .set({ 
        tournamentWins: sql`${promptStrategies.tournamentWins} + ${bWinsInc}`,
        tournamentLosses: sql`${promptStrategies.tournamentLosses} + ${bLossInc}`,
        updatedAt: new Date()
      })
      .where(eq(promptStrategies.id, bId));
      
    return true;
  });
}

export async function promoteChampion(id: string, taskType: string) {
  return await db.transaction(async (tx) => {
    // Demote current champion
    await tx.update(promptStrategies)
      .set({ isChampion: false, updatedAt: new Date() })
      .where(and(eq(promptStrategies.taskType, taskType), eq(promptStrategies.isChampion, true)));
      
    // Crown new champion
    const [newChamp] = await tx.update(promptStrategies)
      .set({ isChampion: true, updatedAt: new Date() })
      .where(eq(promptStrategies.id, id))
      .returning();
      
    return newChamp;
  });
}
