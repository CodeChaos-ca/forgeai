import { pgTable, uuid, varchar, text, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  link: text('link'),
  icon: varchar('icon', { length: 50 }),
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at', { withTimezone: true }),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
