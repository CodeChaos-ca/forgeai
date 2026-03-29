import { pgSchema, uuid, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { projects } from './projects';
import { users } from './users';

export const aiSchema = pgSchema('ai');

export const aiConversations = aiSchema.table('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  mode: varchar('mode', { length: 20 }).default('build'), // CHECK IN ('build','discuss','debug','optimize')
  title: varchar('title', { length: 500 }),
  messageCount: integer('message_count').default(0),
  totalTokensUsed: integer('total_tokens_used').default(0),
  totalCreditsUsed: integer('total_credits_used').default(0),
  primaryModelUsed: varchar('primary_model_used', { length: 50 }),
  isArchived: boolean('is_archived').default(false),
  satisfactionRating: integer('satisfaction_rating'), // CHECK BETWEEN 1 AND 5
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
