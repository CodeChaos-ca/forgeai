import { uuid, varchar, text, jsonb, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { cognitiveSchema } from './index';

export const qualityBenchmarks = cognitiveSchema.table('quality_benchmarks', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  difficulty: varchar('difficulty', { length: 20 }).notNull(),
  inputPrompt: text('input_prompt').notNull(),
  expectedFeatures: jsonb('expected_features').notNull(),
  rubric: jsonb('rubric').notNull(),
  maxScore: integer('max_score').default(100),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
