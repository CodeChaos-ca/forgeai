import { pgTable, uuid, varchar, text, boolean, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  tokenHash: varchar('token_hash', { length: 255 }).notNull().unique(),
  refreshTokenHash: varchar('refresh_token_hash', { length: 255 }).notNull().unique(),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 45 }), // using varchar for INET representation
  deviceName: varchar('device_name', { length: 255 }),
  isActive: boolean('is_active').default(true),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }).defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    userIdx: index('sessions_user_id_idx').on(table.userId),
    tokenHashIdx: uniqueIndex('sessions_token_hash_idx').on(table.tokenHash),
    expiresIdx: index('sessions_expires_idx').on(table.expiresAt),
  };
});
