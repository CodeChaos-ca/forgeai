import { pgTable, uuid, integer, jsonb, varchar, text, boolean, decimal, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { projects } from './projects';
import { users } from './users';
import { aiConversations } from './ai-conversations';

export const projectVersions = pgTable('project_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  versionNumber: integer('version_number').notNull(),
  snapshotData: jsonb('snapshot_data').notNull(),
  fileChanges: jsonb('file_changes').notNull(),
  databaseSchemaSnapshot: jsonb('database_schema_snapshot'),
  changeSource: varchar('change_source', { length: 20 }), // CHECK IN ('ai','manual','rollback','import','template')
  changeDescription: text('change_description').notNull(),
  aiConversationId: uuid('ai_conversation_id').references(() => aiConversations.id),
  createdBy: uuid('created_by').references(() => users.id),
  isDeployed: boolean('is_deployed').default(false),
  testResultsSummary: jsonb('test_results_summary'),
  confidenceScore: decimal('confidence_score', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    projectIdx: index('project_versions_project_id_idx').on(table.projectId),
    projectVersionIdx: uniqueIndex('project_versions_project_id_version_number_idx').on(table.projectId, table.versionNumber),
  };
});
