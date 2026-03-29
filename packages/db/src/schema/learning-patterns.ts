import { uuid, varchar, integer, decimal, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core';
import { aiSchema } from './ai-conversations';

export const learningPatterns = aiSchema.table('learning_patterns', {
  id: uuid('id').primaryKey().defaultRandom(),
  patternType: varchar('pattern_type', { length: 50 }), // CHECK IN ('prompt_pattern','error_pattern','feature_demand','code_optimization','template_candidate','integration_demand')
  patternSignature: varchar('pattern_signature', { length: 255 }).unique().notNull(),
  patternData: jsonb('pattern_data').notNull(),
  exampleInstances: jsonb('example_instances').default([]),
  frequency: integer('frequency').default(1),
  confidence: decimal('confidence', { precision: 5, scale: 4 }).default('0'),
  actionTaken: varchar('action_taken', { length: 50 }),
  actionResult: jsonb('action_result'),
  isResolved: boolean('is_resolved').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
