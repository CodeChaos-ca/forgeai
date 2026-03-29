export type UserRole = 'user' | 'admin' | 'super_admin';
export type UserPlan = 'free' | 'starter' | 'builder' | 'pro' | 'enterprise';

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  passwordHash: string | null;
  fullName: string;
  avatarUrl: string | null;
  locale: string;
  timezone: string;
  role: UserRole;
  plan: UserPlan;
  onboardingCompleted: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  lastActiveAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface Session {
  id: string;
  userId: string;
  tokenHash: string;
  refreshTokenHash: string;
  userAgent: string | null;
  ipAddress: string | null;
  deviceName: string | null;
  isActive: boolean;
  lastUsedAt: Date;
  expiresAt: Date;
  createdAt: Date;
}

export interface OAuthAccount {
  id: string;
  userId: string;
  provider: string;
  providerUserId: string;
  providerEmail: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: Date | null;
  createdAt: Date;
}
