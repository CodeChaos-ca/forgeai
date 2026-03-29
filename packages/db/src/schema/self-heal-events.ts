import { uuid, varchar, text, integer, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core';
import { aiSchema } from './ai-conversations';
import { projects } from './projects';
import { deployments } from './deployments';

export const selfHealEvents = aiSchema.table('self_heal_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  deploymentId: uuid('deployment_id').references(() => deployments.id),
  errorType: varchar('error_type', { length: 100 }).notNull(),
  errorMessage: text('error_message').notNull(),
  errorStack: text('error_stack'),
  errorFrequency: integer('error_frequency').default(1),
  rootCauseAnalysis: jsonb('root_cause_analysis'),
  proposedFix: jsonb('proposed_fix'),
  fixApplied: boolean('fix_applied').default(false),
  fixVerified: boolean('fix_verified').default(false),
  userNotified: boolean('user_notified').default(false),
  userApproved: boolean('user_approved'),
  resolutionTimeMs: integer('resolution_time_ms'),
  status: varchar('status', { length: 20 }).default('detected'), // CHECK IN ('detected','analyzing','fix_proposed','fix_applied','verified','failed','dismissed')
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
});
