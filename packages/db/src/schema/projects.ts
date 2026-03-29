import { pgTable, uuid, varchar, text, jsonb, integer, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { workspaces } from './workspaces';
import { users } from './users';

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }).default('📦'),
  status: varchar('status', { length: 20 }).default('active'), // CHECK IN ('active','archived','deleted')
  visibility: varchar('visibility', { length: 20 }).default('private'), // CHECK IN ('private','public','unlisted')
  customDomain: varchar('custom_domain', { length: 255 }).unique(),
  subdomain: varchar('subdomain', { length: 100 }).unique().notNull(),
  environmentVariables: jsonb('environment_variables').default({}), // encrypted at rest
  settings: jsonb('settings').default({}),
  techStack: jsonb('tech_stack').default({ frontend: 'react', css: 'tailwind', components: 'shadcn' }),
  seoConfig: jsonb('seo_config').default({}),
  currentVersion: integer('current_version').default(0),
  totalDeployments: integer('total_deployments').default(0),
  deployedAt: timestamp('deployed_at', { withTimezone: true }),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => {
  return {
    workspaceIdx: index('projects_workspace_id_idx').on(table.workspaceId),
    workspaceSlugIdx: uniqueIndex('projects_workspace_id_slug_idx').on(table.workspaceId, table.slug),
    subdomainIdx: uniqueIndex('projects_subdomain_idx').on(table.subdomain),
    customDomainIdx: uniqueIndex('projects_custom_domain_not_null_idx')
      .on(table.customDomain)
      .where(sql`${table.customDomain} IS NOT NULL`),
    statusIdx: index('projects_status_idx').on(table.status),
    notDeletedIdx: index('projects_not_deleted_idx').on(table.id).where(sql`${table.deletedAt} IS NULL`),
  };
});
