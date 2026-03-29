import { eq, desc, and, isNull } from 'drizzle-orm';
import { db } from '../client';
import { aiConversations, aiMessages } from '../schema';

export async function createConversation(data: typeof aiConversations.$inferInsert) {
  const [conversation] = await db.insert(aiConversations).values(data).returning();
  return conversation;
}

export async function addMessage(data: typeof aiMessages.$inferInsert) {
  return await db.transaction(async (tx) => {
    const [message] = await tx.insert(aiMessages).values(data).returning();
    
    // Update conversation stats if needed
    if (data.conversationId) {
      await tx
        .update(aiConversations)
        .set({ updatedAt: new Date() })
        .where(eq(aiConversations.id, data.conversationId));
    }
    
    return message;
  });
}

export async function getConversationMessages(conversationId: string) {
  return db
    .select()
    .from(aiMessages)
    .where(eq(aiMessages.conversationId, conversationId))
    .orderBy(aiMessages.createdAt);
}

export async function getProjectConversations(projectId: string) {
  return db
    .select()
    .from(aiConversations)
    .where(eq(aiConversations.projectId, projectId))
    .orderBy(desc(aiConversations.updatedAt));
}
