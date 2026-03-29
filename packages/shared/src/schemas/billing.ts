import { z } from 'zod';
import { PLANS } from '../constants/plans';

export const createSubscriptionSchema = z.object({
  plan: z.enum([PLANS.FREE.id as 'free', 'starter', 'builder', 'pro', 'enterprise']),
  workspaceId: z.string().uuid().optional(),
  successUrl: z.string().url('Invalid success URL').max(1000),
  cancelUrl: z.string().url('Invalid cancel URL').max(1000)
});

export const purchaseCreditsSchema = z.object({
  packId: z.number().int().min(0, 'Pack ID must be positive').max(2, 'Invalid pack ID'),
  workspaceId: z.string().uuid().optional(),
  successUrl: z.string().url('Invalid success URL').max(1000),
  cancelUrl: z.string().url('Invalid cancel URL').max(1000)
});
