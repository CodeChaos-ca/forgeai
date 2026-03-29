import { db } from '../client';
import { aiConversations, aiMessages } from '../schema';

export async function seedConversations(projectId: string, userId: string): Promise<string[]> {
  const [conv] = await db.insert(aiConversations).values({
    projectId,
    userId,
    title: 'Adding Stripe Webhooks',
    mode: 'build',
    primaryModelUsed: 'claude-3-5-sonnet-20240620',
  }).returning({ id: aiConversations.id });

  await db.insert(aiMessages).values([
    {
      conversationId: conv.id,
      role: 'user',
      content: 'I need to add Stripe webhook handling for my `checkout.session.completed` event in Next.js App Router.',
      tokensInput: 25,
      tokensOutput: 0,
      modelUsed: 'claude-3-5-sonnet-20240620',
    },
    {
      conversationId: conv.id,
      role: 'assistant',
      content: 'I can help with that! Let\'s create a new API route at `app/api/webhooks/stripe/route.ts` using the official Stripe SDK and Next.js `headers` utility.',
      tokensInput: 25,
      tokensOutput: 150,
      modelUsed: 'claude-3-5-sonnet-20240620',
      wasApplied: true,
      feedback: 'positive',
    }
  ]);

  return [conv.id];
}
