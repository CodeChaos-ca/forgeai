import { uuid, varchar, text, jsonb, integer, decimal, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { cognitiveSchema } from './index';

export const promptStrategies = cognitiveSchema.table('prompt_strategies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  taskType: varchar('task_type', { length: 30 }), // CHECK IN ('code_generation','bug_fixing',...)
  systemPrompt: text('system_prompt').notNull(),
  variables: jsonb('variables').default([]),
  strategyNotes: text('strategy_notes'),
  generation: integer('generation').default(1),
  parentId: uuid('parent_id'), // Self-ref
  mutationDescription: text('mutation_description'),
  timesUsed: integer('times_used').default(0),
  totalQualityScore: decimal('total_quality_score', { precision: 10, scale: 2 }).default('0'),
  avgQualityScore: decimal('avg_quality_score', { precision: 5, scale: 2 }).default('0'),
  positiveFeedbackCount: integer('positive_feedback_count').default(0),
  negativeFeedbackCount: integer('negative_feedback_count').default(0),
  rollbackCount: integer('rollback_count').default(0),
  isActive: boolean('is_active').default(true),
  isChampion: boolean('is_champion').default(false),
  tournamentWins: integer('tournament_wins').default(0),
  tournamentLosses: integer('tournament_losses').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    taskTypeIdx: index('prompt_strategies_task_type_idx').on(table.taskType),
    avgQualityScoreIdx: index('prompt_strategies_avg_quality_score_idx').on(table.avgQualityScore),
  };
});
