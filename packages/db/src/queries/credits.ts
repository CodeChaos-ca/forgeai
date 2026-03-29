import { eq, and, desc, sql, gte } from 'drizzle-orm';
import { db } from '../client';
import { credits, creditTransactions } from '../schema';

export async function getCreditBalance(userId: string) {
  const result = await db
    .select({ totalRemaining: sql<number>`SUM(${credits.remaining})` })
    .from(credits)
    .where(and(
      eq(credits.userId, userId),
      eq(credits.isExpired, false),
      gte(credits.expiresAt, new Date())
    ));
    
  return result[0]?.totalRemaining || 0;
}

export async function consumeCredits(
  userId: string,
  amount: number,
  projectId?: string,
  conversationId?: string,
  description: string = 'Service usage'
) {
  return await db.transaction(async (tx) => {
    // Basic greedy consumption for highest expiring first could be added
    // Simplify for now: get valid credits ordered by expiration (earliest first)
    const validCredits = await tx
      .select()
      .from(credits)
      .where(and(
        eq(credits.userId, userId),
        eq(credits.isExpired, false),
        gte(credits.expiresAt, new Date())
      ))
      .orderBy(credits.expiresAt);

    let remainingToConsume = amount;
    
    for (const creditGroup of validCredits) {
      if (remainingToConsume <= 0) break;
      
      const toTake = Math.min(creditGroup.remaining, remainingToConsume);
      remainingToConsume -= toTake;
      
      const newRemaining = creditGroup.remaining - toTake;
      
      await tx
        .update(credits)
        .set({ remaining: newRemaining })
        .where(eq(credits.id, creditGroup.id));
        
      await tx.insert(creditTransactions).values({
        creditId: creditGroup.id,
        userId,
        projectId,
        conversationId,
        amount: -toTake,
        balanceAfter: newRemaining,
        transactionType: 'consume',
        description,
      });
    }

    if (remainingToConsume > 0) {
      throw new Error('Insufficient valid credits');
    }

    return true;
  });
}

export async function checkSufficientCredits(userId: string, requiredAmount: number) {
  const balance = await getCreditBalance(userId);
  return balance >= requiredAmount;
}

export async function refundCredits(
  creditId: string,
  userId: string,
  amount: number,
  description: string = 'Refund'
) {
  return await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(credits)
      .set({ remaining: sql`${credits.remaining} + ${amount}` })
      .where(eq(credits.id, creditId))
      .returning();
      
    await tx.insert(creditTransactions).values({
      creditId,
      userId,
      amount,
      balanceAfter: updated.remaining,
      transactionType: 'refund',
      description,
    });
    
    return updated;
  });
}

export async function allocateCredits(data: typeof credits.$inferInsert) {
  return await db.transaction(async (tx) => {
    const [allocation] = await tx.insert(credits).values(data).returning();
    
    await tx.insert(creditTransactions).values({
      creditId: allocation.id,
      userId: allocation.userId,
      workspaceId: allocation.workspaceId,
      amount: allocation.totalAmount,
      balanceAfter: allocation.remaining,
      transactionType: 'allocate',
      description: `Allocated ${allocation.totalAmount} credits via ${allocation.source || 'system'}`,
    });
    
    return allocation;
  });
}

export async function rolloverCredits(userId: string, oldCreditId: string, amount: number, newExpiresAt: Date) {
  // Typical rollover allocates a new batch and zeroes old out, highly custom per platform.
  // We'll wrap an allocation + zero out old logic here
  return await db.transaction(async (tx) => {
    await tx.update(credits).set({ remaining: 0, isExpired: true }).where(eq(credits.id, oldCreditId));
    
    const [newCredit] = await tx.insert(credits).values({
      userId,
      totalAmount: amount,
      remaining: amount,
      source: 'rollover',
      periodStart: new Date(),
      expiresAt: newExpiresAt
    }).returning();
    
    return newCredit;
  });
}

export async function getCreditHistory(userId: string) {
  return db
    .select()
    .from(creditTransactions)
    .where(eq(creditTransactions.userId, userId))
    .orderBy(desc(creditTransactions.createdAt));
}
