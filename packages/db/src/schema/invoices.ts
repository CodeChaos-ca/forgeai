import { uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { billingSchema } from './subscriptions';
import { users } from './users';

export const invoices = billingSchema.table('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  stripeInvoiceId: varchar('stripe_invoice_id', { length: 255 }).unique().notNull(),
  amountCents: integer('amount_cents').notNull(),
  currency: varchar('currency', { length: 3 }).default('usd'),
  status: varchar('status', { length: 20 }), // CHECK IN ('draft','open','paid','void','uncollectible')
  description: text('description'),
  invoicePdfUrl: text('invoice_pdf_url'),
  periodStart: timestamp('period_start', { withTimezone: true }).notNull(),
  periodEnd: timestamp('period_end', { withTimezone: true }).notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
