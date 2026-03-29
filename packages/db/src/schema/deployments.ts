import { pgSchema, pgTable, uuid, varchar, integer, boolean, text, jsonb, timestamp, index } from 'drizzle-orm/pg-core';
import { projects } from './projects';
import { users } from './users';
import { AnyPgColumn } from 'drizzle-orm/pg-core';

// We import projectVersions later or use type trick due to circular dependency on aiConversations
// Just referencing it by relation is cleaner, or use foreignKey

export const deployments = pgTable('deployments', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  versionId: uuid('version_id'), // fk to project_versions
  environment: varchar('environment', { length: 20 }).notNull(), // CHECK IN ('preview','staging','production')
  status: varchar('status', { length: 20 }).default('queued'), // CHECK IN ('queued','building','deploying','deployed','failed','rolled_back','cancelled')
  url: text('url'),
  buildLogs: text('build_logs'),
  buildDurationMs: integer('build_duration_ms'),
  deployDurationMs: integer('deploy_duration_ms'),
  bundleSizeBytes: integer('bundle_size_bytes'),
  lighthouseScores: jsonb('lighthouse_scores'),
  deployedBy: uuid('deployed_by').references(() => users.id),
  errorMessage: text('error_message'),
  healthCheckStatus: varchar('health_check_status', { length: 20 }).default('pending'), // CHECK IN ('pending','healthy','unhealthy','timeout')
  rollbackFromId: uuid('rollback_from_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
}, (table) => {
  return {
    projectIdx: index('deployments_project_id_idx').on(table.projectId),
    projectEnvIdx: index('deployments_project_id_environment_idx').on(table.projectId, table.environment),
    statusIdx: index('deployments_status_idx').on(table.status),
  };
});
