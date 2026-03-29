export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete' | 'paused';
export type CreditType = 'message' | 'integration' | 'compute' | 'storage' | 'export';
export type CreditSource = 'plan_allocation' | 'purchased' | 'bonus' | 'rollover' | 'refund' | 'promotion';
export type TransactionType = 'consume' | 'refund' | 'expire' | 'allocate' | 'rollover';
export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';

export interface Subscription {
  id: string;
  userId: string;
  workspaceId: string | null;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  plan: string;
  status: SubscriptionStatus | null;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
  trialEnd: Date | null;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Credit {
  id: string;
  userId: string;
  workspaceId: string | null;
  type: CreditType | null;
  totalAmount: number;
  remaining: number;
  source: CreditSource | null;
  pricePaidCents: number;
  periodStart: Date;
  expiresAt: Date;
  isExpired: boolean;
  createdAt: Date;
}

export interface CreditTransaction {
  id: string;
  creditId: string;
  userId: string;
  projectId: string | null;
  conversationId: string | null;
  amount: number;
  balanceAfter: number;
  transactionType: TransactionType | null;
  description: string;
  isRegressionRefund: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  userId: string;
  stripeInvoiceId: string;
  amountCents: number;
  currency: string;
  status: InvoiceStatus | null;
  description: string | null;
  invoicePdfUrl: string | null;
  periodStart: Date;
  periodEnd: Date;
  paidAt: Date | null;
  createdAt: Date;
}
