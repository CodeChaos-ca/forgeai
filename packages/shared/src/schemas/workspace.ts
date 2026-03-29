import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, 'Workspace name must be at least 2 characters').max(255),
  slug: z.string()
    .min(2, 'Slug must be at least 2 characters')
    .max(255)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).max(255).optional(),
  logoUrl: z.string().url().max(1000).optional().or(z.literal('')),
  settings: z.record(z.any()).optional()
});

export const inviteMemberSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address').max(255),
  role: z.enum(['admin', 'editor', 'viewer', 'owner'])
});
