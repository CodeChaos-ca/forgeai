import { uuid, varchar, text, jsonb, decimal, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { cognitiveSchema, vectorType } from './index';
// Need to reference up to projects and users
import { projects } from '../projects';
import { users } from '../users';

export const memoryEpisodes = cognitiveSchema.table('memory_episodes', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  episodeType: varchar('episode_type', { length: 30 }), // CHECK IN [...]
  userPrompt: text('user_prompt').notNull(),
  contextSummary: text('context_summary').notNull(),
  approachTaken: text('approach_taken').notNull(),
  codeGenerated: jsonb('code_generated'),
  modelsUsed: jsonb('models_used'),
  skillsUsed: uuid('skills_used').array().default([]), // UUID[]
  outcome: varchar('outcome', { length: 20 }), // CHECK IN ('success','partial','failure','unknown')
  userFeedback: varchar('user_feedback', { length: 10 }).default('none'), // CHECK IN ('positive','negative','none')
  qualityScore: decimal('quality_score', { precision: 5, scale: 2 }),
  wasRolledBack: boolean('was_rolled_back').default(false),
  errorEncountered: text('error_encountered'),
  lessonsExtracted: jsonb('lessons_extracted').default([]),
  embedding: vectorType('embedding', { dimensions: 1536 }),
  tags: text('tags').array().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    episodeTypeIdx: index('memory_episode_type_idx').on(table.episodeType),
    outcomeIdx: index('memory_outcome_idx').on(table.outcome),
    // Descending index trick for qualityScore
    // For vector IVFFlat: we leave creating it exactly as raw SQL in migrations or manually configure:
    qualityScoreIdx: index('memory_quality_score_idx').on(table.qualityScore),
    createdIdx: index('memory_created_idx').on(table.createdAt),
  };
});
