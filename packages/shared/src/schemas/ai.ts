import { z } from 'zod';

export const chatMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
  conversationId: z.string().uuid().optional(),
  mode: z.enum(['build', 'discuss', 'debug', 'optimize']).default('build'),
  projectId: z.string().uuid().optional()
});

export const discussMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  contextFiles: z.array(z.string().max(1000)).max(50, 'Too many context files provided').optional()
});

const fileChangeAction = z.enum(['create', 'update', 'delete']);

export const applyChangesSchema = z.object({
  messageId: z.string().uuid(),
  fileChanges: z.record(
    z.string().max(1000), // file path
    z.object({
      content: z.string(),
      action: fileChangeAction
    })
  )
});
