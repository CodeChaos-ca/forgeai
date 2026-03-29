import { pgTable, uuid, varchar, boolean, text, integer, jsonb, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  logoUrl: text('logo_url'),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  plan: varchar('plan', { length: 20 }).default('free'),
  ssoEnabled: boolean('sso_enabled').default(false),
  ssoConfig: jsonb('sso_config'),
  settings: jsonb('settings').default({}),
  maxProjects: integer('max_projects').default(3),
  maxMembers: integer('max_members').default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    slugIdx: uniqueIndex('workspaces_slug_idx').on(table.slug),
    ownerIdx: index('workspaces_owner_id_idx').on(table.ownerId),
  };
});
