import { uuid, integer, varchar, text, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { billingSchema } from './subscriptions';
import { credits } from './credits';
import { users } from './users';
import { projects } from './projects';
// We use AnyPgColumn or just loose ref later if aiConversations import causes loop
// However, since it sits in another schema export, we can import it.
import { aiConversations } from './ai-conversations';

export const creditTransactions = billingSchema.table('credit_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  creditId: uuid('credit_id').references(() => credits.id),
  userId: uuid('user_id').references(() => users.id),
  projectId: uuid('project_id').references(() => projects.id),
  conversationId: uuid('conversation_id').references(() => aiConversations.id),
  amount: integer('amount').notNull(), // negative=consume, positive=refund
  balanceAfter: integer('balance_after').notNull(),
  transactionType: varchar('transaction_type', { length: 30 }), // CHECK IN ('consume','refund','expire','allocate','rollover')
  description: text('description').notNull(),
  isRegressionRefund: boolean('is_regression_refund').default(false),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
