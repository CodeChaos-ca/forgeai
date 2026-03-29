import { uuid, varchar, text, integer, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { cognitiveSchema } from './index';

export const learningQueue = cognitiveSchema.table('learning_queue', {
  id: uuid('id').primaryKey().defaultRandom(),
  topic: varchar('topic', { length: 500 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  priority: integer('priority').default(50), // (1-100)
  reason: text('reason').notNull(),
  detectedFrom: varchar('detected_from', { length: 30 }), // CHECK IN ...
  sourceEpisodeId: uuid('source_episode_id'), // fk defined in relations
  learningStatus: varchar('learning_status', { length: 20 }).default('queued'), // CHECK IN ('queued','researching',...)
  researchResults: jsonb('research_results'),
  skillCreatedId: uuid('skill_created_id'), // fk defined in relations
  knowledgeCreatedIds: uuid('knowledge_created_ids').array(), // UUID[]
  attemptedAt: timestamp('attempted_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    statusIdx: index('learning_queue_status_idx').on(table.learningStatus),
    priorityIdx: index('learning_queue_priority_idx').on(table.priority),
  };
});
