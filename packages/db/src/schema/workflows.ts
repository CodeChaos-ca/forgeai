import { pgTable, uuid, varchar, text, jsonb, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { projects } from './projects';
import { users } from './users';

export const workflows = pgTable('workflows', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  triggerType: varchar('trigger_type', { length: 30 }).notNull(), // CHECK IN ('event','schedule','webhook','data_change','manual','api')
  triggerConfig: jsonb('trigger_config').notNull(),
  steps: jsonb('steps').default([]).notNull(),
  errorHandling: jsonb('error_handling').default({ retries: 3, backoff: 'exponential', onFailure: 'stop' }),
  isActive: boolean('is_active').default(true),
  lastRunAt: timestamp('last_run_at', { withTimezone: true }),
  lastRunStatus: varchar('last_run_status', { length: 20 }),
  runCount: integer('run_count').default(0),
  successCount: integer('success_count').default(0),
  errorCount: integer('error_count').default(0),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
