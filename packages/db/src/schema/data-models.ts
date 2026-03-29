import { pgTable, uuid, varchar, text, jsonb, boolean, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { projects } from './projects';

export const dataModels = pgTable('data_models', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  tableName: varchar('table_name', { length: 255 }).notNull(),
  description: text('description'),
  fields: jsonb('fields').notNull(),
  relationships: jsonb('relationships').default([]),
  indexesConfig: jsonb('indexes_config').default([]),
  validations: jsonb('validations').default([]),
  permissions: jsonb('permissions').default({}),
  enableSoftDelete: boolean('enable_soft_delete').default(true),
  enableTimestamps: boolean('enable_timestamps').default(true),
  isSystem: boolean('is_system').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    projectIdx: index('data_models_project_id_idx').on(table.projectId),
    projectTableNameIdx: uniqueIndex('data_models_project_id_table_name_idx').on(table.projectId, table.tableName),
  };
});
