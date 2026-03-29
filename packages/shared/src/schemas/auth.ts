import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(255),
  code: z.string()
    .length(6, '2FA code must be exactly 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers')
    .optional()
});

export const registerSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(255)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100)
});

export const forgotPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255)
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(255)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token is required')
});

export const magicLinkSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255)
});

export const twoFactorSchema = z.object({
  code: z.string()
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers')
});
