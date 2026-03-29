import { z } from 'zod';

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  avatarUrl: z.string().url('Invalid URL').max(1000).optional().or(z.literal('')),
  locale: z.string().max(10).optional(),
  timezone: z.string().max(50).optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(255)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

export const changeEmailSchema = z.object({
  newEmail: z.string().min(1, 'Email is required').email('Invalid email address').max(255),
  password: z.string().min(1, 'Password is required to change email')
});
