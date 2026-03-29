import { pgTable, uuid, text, varchar, integer, boolean, jsonb, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { projects } from './projects';

export const projectFiles = pgTable('project_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  filePath: text('file_path').notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileExtension: varchar('file_extension', { length: 20 }).notNull(),
  content: text('content').notNull(),
  contentHash: varchar('content_hash', { length: 64 }).notNull(), // SHA-256
  sizeBytes: integer('size_bytes').notNull(),
  language: varchar('language', { length: 30 }),
  isDirectory: boolean('is_directory').default(false),
  isGenerated: boolean('is_generated').default(true),
  isProtected: boolean('is_protected').default(false),
  lastModifiedBy: varchar('last_modified_by', { length: 20 }), // CHECK IN ('ai','user','system')
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    projectIdx: index('project_files_project_id_idx').on(table.projectId),
    projectPathIdx: uniqueIndex('project_files_project_id_file_path_idx').on(table.projectId, table.filePath),
    hashIdx: index('project_files_content_hash_idx').on(table.contentHash),
  };
});
