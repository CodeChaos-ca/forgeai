import { pgTable, uuid, varchar, boolean, text, timestamp, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  passwordHash: varchar('password_hash', { length: 255 }), // null for OAuth-only
  fullName: varchar('full_name', { length: 255 }).notNull(),
  avatarUrl: text('avatar_url'),
  locale: varchar('locale', { length: 10 }).default('en'),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  role: varchar('role', { length: 20 }).default('user'), // CHECK IN ('user','admin','super_admin') handled via app logic / CHECK constraint
  plan: varchar('plan', { length: 20 }).default('free'), // CHECK IN ('free','starter','builder','pro','enterprise')
  onboardingCompleted: boolean('onboarding_completed').default(false),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  twoFactorSecret: varchar('two_factor_secret', { length: 255 }), // encrypted
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => {
  return {
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
    planIdx: index('users_plan_idx').on(table.plan),
    createdIdx: index('users_createdAt_idx').on(table.createdAt),
    // PARTIAL index for deleted_at
    notDeletedIdx: index('users_not_deleted_idx').on(table.id).where(sql`${table.deletedAt} IS NULL`),
  };
});
