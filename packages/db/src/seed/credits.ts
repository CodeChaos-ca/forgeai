import { db } from '../client';
import { credits, creditTransactions } from '../schema';

export async function seedCredits(userIds: string[], workspaceIds: string[]) {
  const [adminId, editorId, viewerId] = userIds;
  const [coreWorkspaceId] = workspaceIds;

  const now = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const allocations = [
    {
      userId: adminId,
      workspaceId: coreWorkspaceId,
      type: 'message',
      totalAmount: 100000,
      remaining: 95000,
      source: 'plan_allocation',
      periodStart: now,
      expiresAt: nextMonth,
    },
    {
      userId: editorId,
      workspaceId: coreWorkspaceId,
      type: 'message',
      totalAmount: 50000,
      remaining: 45000,
      source: 'plan_allocation',
      periodStart: now,
      expiresAt: nextMonth,
    },
    {
      userId: viewerId,
      type: 'message',
      totalAmount: 1000,
      remaining: 50,
      source: 'plan_allocation',
      periodStart: now,
      expiresAt: nextMonth,
    }
  ];

  const createdCredits = await db.insert(credits).values(allocations).returning();

  for (const c of createdCredits) {
    const amountUsed = c.totalAmount - c.remaining;
    if (amountUsed > 0) {
      await db.insert(creditTransactions).values({
        creditId: c.id,
        userId: c.userId,
        amount: -amountUsed,
        balanceAfter: c.remaining,
        transactionType: 'consume',
        description: 'Simulated past usage.',
      });
    }
  }
}
