import { uuid, integer, text, jsonb, varchar, decimal, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { cognitiveSchema } from './index';
import { skills } from './skills';

export const skillVersions = cognitiveSchema.table('skill_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  skillId: uuid('skill_id').references(() => skills.id, { onDelete: 'cascade' }).notNull(),
  version: integer('version').notNull(),
  promptStrategy: text('prompt_strategy').notNull(),
  codePatterns: jsonb('code_patterns').notNull(),
  antiPatterns: jsonb('anti_patterns').default([]),
  changeReason: text('change_reason').notNull(),
  changeSource: varchar('change_source', { length: 30 }), // CHECK IN ('feedback_loop','pattern_mining',...)
  qualityScoreBefore: decimal('quality_score_before', { precision: 5, scale: 2 }),
  qualityScoreAfter: decimal('quality_score_after', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    skillVersionIdx: uniqueIndex('skill_versions_skill_id_version_idx').on(table.skillId, table.version),
  };
});
