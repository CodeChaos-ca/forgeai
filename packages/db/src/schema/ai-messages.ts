import { uuid, varchar, text, integer, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core';
import { aiSchema, aiConversations } from './ai-conversations';

export const aiMessages = aiSchema.table('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').references(() => aiConversations.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 }), // CHECK IN ('user','assistant','system')
  content: text('content').notNull(),
  modelUsed: varchar('model_used', { length: 50 }),
  tokensInput: integer('tokens_input').default(0),
  tokensOutput: integer('tokens_output').default(0),
  latencyMs: integer('latency_ms'),
  creditsCharged: integer('credits_charged').default(0),
  fileChanges: jsonb('file_changes'),
  impactAnalysis: jsonb('impact_analysis'),
  wasApplied: boolean('was_applied').default(false),
  wasRolledBack: boolean('was_rolled_back').default(false),
  feedback: varchar('feedback', { length: 10 }), // CHECK IN ('positive','negative')
  feedbackComment: text('feedback_comment'),
  error: jsonb('error'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
