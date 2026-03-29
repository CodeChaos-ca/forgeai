import { uuid, varchar, text, jsonb, integer, decimal, boolean, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { cognitiveSchema, vectorType } from './index';

export const skills = cognitiveSchema.table('skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  category: varchar('category', { length: 50 }), // CHECK IN ('frontend','backend',...)
  description: text('description').notNull(),
  difficultyLevel: varchar('difficulty_level', { length: 20 }), // CHECK IN ('trivial','simple',...)
  promptStrategy: text('prompt_strategy').notNull(),
  codePatterns: jsonb('code_patterns').notNull(),
  dependencies: uuid('dependencies').array().default([]), // UUID[]
  requiredPackages: jsonb('required_packages').default([]),
  exampleInput: text('example_input'),
  exampleOutput: jsonb('example_output'),
  antiPatterns: jsonb('anti_patterns').default([]),
  commonMistakes: jsonb('common_mistakes').default([]),
  timesUsed: integer('times_used').default(0),
  successCount: integer('success_count').default(0),
  failureCount: integer('failure_count').default(0),
  avgQualityScore: decimal('avg_quality_score', { precision: 5, scale: 2 }).default('0'),
  lastImprovedAt: timestamp('last_improved_at', { withTimezone: true }),
  version: integer('version').default(1),
  source: varchar('source', { length: 30 }), // CHECK IN ('built_in','learned_from_usage',...)
  isActive: boolean('is_active').default(true),
  embedding: vectorType('embedding', { dimensions: 1536 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    categoryIdx: index('skills_category_idx').on(table.category),
    nameIdx: uniqueIndex('skills_name_idx').on(table.name),
    avgQualityScoreIdx: index('skills_avg_quality_score_idx').on(table.avgQualityScore),
    timesUsedIdx: index('skills_times_used_idx').on(table.timesUsed),
  };
});
