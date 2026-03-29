import { pgTable, uuid, varchar, text, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const oauthAccounts = pgTable('oauth_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  provider: varchar('provider', { length: 50 }).notNull(),
  providerUserId: varchar('provider_user_id', { length: 255 }).notNull(),
  providerEmail: varchar('provider_email', { length: 255 }),
  accessToken: text('access_token'), // encrypted
  refreshToken: text('refresh_token'), // encrypted
  tokenExpiresAt: timestamp('token_expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    userIdx: index('oauth_accounts_user_id_idx').on(table.userId),
    providerProviderUserIdIdx: uniqueIndex('oauth_accounts_provider_provider_user_id_idx').on(table.provider, table.providerUserId),
  };
});
