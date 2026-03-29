import { pgTable, uuid, varchar, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { workspaces } from './workspaces';
import { users } from './users';

export const workspaceMembers = pgTable('workspace_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: varchar('role', { length: 20 }).default('member'), // CHECK IN ('owner','admin','editor','viewer')
  invitedEmail: varchar('invited_email', { length: 255 }),
  inviteToken: varchar('invite_token', { length: 255 }),
  inviteStatus: varchar('invite_status', { length: 20 }).default('accepted'), // CHECK IN ('pending','accepted','declined')
  invitedBy: uuid('invited_by').references(() => users.id),
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    workspaceIdx: index('workspace_members_workspace_id_idx').on(table.workspaceId),
    userIdx: index('workspace_members_user_id_idx').on(table.userId),
    workspaceUserIdx: uniqueIndex('workspace_members_workspace_id_user_id_idx').on(table.workspaceId, table.userId),
  };
});
