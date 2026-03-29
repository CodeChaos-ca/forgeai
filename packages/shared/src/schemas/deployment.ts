import { z } from 'zod';

export const createDeploymentSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  versionId: z.string().uuid('Invalid version ID').optional(),
  environment: z.enum(['preview', 'staging', 'production']).default('preview')
});
