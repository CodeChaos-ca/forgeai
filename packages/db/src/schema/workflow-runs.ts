import { pgTable, uuid, varchar, jsonb, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { workflows } from './workflows';

export const workflowRuns = pgTable('workflow_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  workflowId: uuid('workflow_id').references(() => workflows.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 20 }), // CHECK IN ('queued','running','completed','failed','cancelled','timed_out')
  triggerData: jsonb('trigger_data'),
  stepResults: jsonb('step_results').default([]),
  errorMessage: text('error_message'),
  retryCount: integer('retry_count').default(0),
  durationMs: integer('duration_ms'),
  creditsConsumed: integer('credits_consumed').default(0),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});
