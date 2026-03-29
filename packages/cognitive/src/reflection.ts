import { MemorySystem } from './memory';
import { SkillEngine } from './skills';
import { db } from '@forgeai/db';
import { creditTransactions } from '@forgeai/db/schema';
import { sql, eq } from 'drizzle-orm';

const memory = new MemorySystem();
const skillEngine = new SkillEngine();

export interface ReflectionFeedback {
  outcome: 'success' | 'failure';
  qualityScore: number;
  userId: string;
  creditCost: number;
  wasRolledBack: boolean; // Indicates the user manually hit "undo" or rejected the commit entirely
}

export class ReflectionEngine {
  
  async reflect(episodeId: string, payload: any, feedback: ReflectionFeedback): Promise<void> {

    // 1. Update historical memory ledger marking this resolution as either successful or flawed
    await db.update(db._.fullSchema.memoryEpisodes)
      .set({ 
        qualityScore: feedback.qualityScore,
        episodeType: feedback.outcome,
        updatedAt: new Date()
      })
      .where(eq(db._.fullSchema.memoryEpisodes.id, episodeId));

    // 2. Adjust skill scores exponentially if particular skills were utilized dynamically
    if (payload.utilizedSkillIds && payload.utilizedSkillIds.length > 0) {
      await skillEngine.recordSkillUsage(
        payload.utilizedSkillIds, 
        feedback.outcome, 
        feedback.qualityScore
      );
    }

    // 3. Refund mechanism mapping the Cost Sentinel heuristic
    // If the system utterly failed (regression or explicitly rolled back by user)
    // we must refund the AI quota / platform credits seamlessly
    if (feedback.wasRolledBack || feedback.outcome === 'failure') {
      console.log(`[REFLECT] Processing failure refund for ${feedback.creditCost} credits to user ${feedback.userId}`);

      await db.insert(creditTransactions).values({
        creditId: 'resolution-refund-trigger', // Real implementation resolves user's primary active credit block
        userId: feedback.userId,
        amount: feedback.creditCost,
        balanceAfter: 0, // This is normally incremented cleanly in a strict pg transaction
        transactionType: 'refund',
        description: 'Auto-refund for rolled-back or failed AI interaction.',
      });
      // In a real scenario, we do this natively inside db/src/queries/credits.ts: refundCredits().
    }
  }
}
