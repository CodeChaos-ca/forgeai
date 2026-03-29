import { uuid, varchar, jsonb, integer, timestamp } from 'drizzle-orm/pg-core';
import { cognitiveSchema } from './index';

// Exported purely for table definition. Relation resolves dependencies lazily in relations.ts
export const benchmarkRuns = cognitiveSchema.table('benchmark_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  benchmarkId: uuid('benchmark_id').notNull(), // lazy reference
  promptStrategyId: uuid('prompt_strategy_id').notNull(), // lazy reference
  modelUsed: varchar('model_used', { length: 50 }).notNull(),
  skillsUsed: uuid('skills_used').array(), // UUID[]
  score: integer('score').notNull(),
  maxScore: integer('max_score').notNull(),
  scoreBreakdown: jsonb('score_breakdown'),
  latencyMs: integer('latency_ms'),
  tokensUsed: integer('tokens_used'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
