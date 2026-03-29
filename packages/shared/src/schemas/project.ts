import { z } from 'zod';

export const createProjectSchema = z.object({
  workspaceId: z.string().uuid('Invalid workspace ID'),
  name: z.string().min(2, 'Project name must be at least 2 characters').max(255),
  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .max(255)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(1000).optional(),
  visibility: z.enum(['private', 'public', 'unlisted']).default('private')
});

export const updateProjectSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  icon: z.string().max(100).optional(),
  visibility: z.enum(['private', 'public', 'unlisted']).optional(),
  status: z.enum(['active', 'archived', 'deleted']).optional()
});

export const updateSettingsSchema = z.object({
  customDomain: z.string().max(255).optional().nullable(),
  environmentVariables: z.record(z.string()).optional(),
  seoConfig: z.record(z.any()).optional(),
  settings: z.record(z.any()).optional(),
  techStack: z.record(z.any()).optional()
});
