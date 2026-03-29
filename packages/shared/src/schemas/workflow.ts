import { z } from 'zod';

export const workflowStepSchema = z.object({
  id: z.string().uuid().or(z.string().min(1).max(255)),
  type: z.enum(['action', 'condition', 'loop', 'delay']),
  config: z.record(z.any()),
  nextStepId: z.string().max(255).optional().nullable()
});

export const createWorkflowSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(2, 'Workflow name must be at least 2 characters').max(255),
  description: z.string().max(1000).optional(),
  triggerType: z.enum(['event', 'schedule', 'webhook', 'data_change', 'manual', 'api']),
  triggerConfig: z.record(z.any()),
  steps: z.array(workflowStepSchema).min(1, 'Workflow must have at least 1 step'),
  errorHandling: z.record(z.any()).optional()
});

export const updateWorkflowSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  triggerType: z.enum(['event', 'schedule', 'webhook', 'data_change', 'manual', 'api']).optional(),
  triggerConfig: z.record(z.any()).optional(),
  steps: z.array(workflowStepSchema).min(1).optional(),
  errorHandling: z.record(z.any()).optional(),
  isActive: z.boolean().optional()
});
