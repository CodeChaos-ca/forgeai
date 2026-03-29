import { uuid, varchar, integer, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { billingSchema } from './subscriptions';
import { users } from './users';
import { workspaces } from './workspaces';

export const credits = billingSchema.table('credits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  type: varchar('type', { length: 30 }), // CHECK IN ('message','integration','compute','storage','export')
  totalAmount: integer('total_amount').notNull(),
  remaining: integer('remaining').notNull(),
  source: varchar('source', { length: 30 }), // CHECK IN ('plan_allocation','purchased','bonus','rollover','refund','promotion')
  pricePaidCents: integer('price_paid_cents').default(0),
  periodStart: timestamp('period_start', { withTimezone: true }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  isExpired: boolean('is_expired').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => {
  return {
    userIdx: index('credits_user_id_idx').on(table.userId),
    userTypeIdx: index('credits_user_id_type_idx').on(table.userId, table.type),
    validCreditsIdx: index('credits_valid_idx')
      .on(table.userId, table.isExpired, table.expiresAt)
      .where(sql`${table.isExpired} = false AND ${table.remaining} > 0`),
  };
});
