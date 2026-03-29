import { pgSchema, uuid, varchar, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';
import { workspaces } from './workspaces';

export const billingSchema = pgSchema('billing');

export const subscriptions = billingSchema.table('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  workspaceId: uuid('workspace_id').references(() => workspaces.id),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }).notNull(),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }).unique(),
  plan: varchar('plan', { length: 20 }).notNull(),
  status: varchar('status', { length: 20 }), // CHECK IN ('active','past_due','canceled','trialing','incomplete','paused')
  currentPeriodStart: timestamp('current_period_start', { withTimezone: true }).notNull(),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }).notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  canceledAt: timestamp('canceled_at', { withTimezone: true }),
  trialEnd: timestamp('trial_end', { withTimezone: true }),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
