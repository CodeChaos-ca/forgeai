import { Redis } from 'ioredis';
import * as limits from '../config/free-tier-limits';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function trackUsage(provider: string, amount: number = 1): Promise<void> {
  const dateStr = new Date().toISOString().split('T')[0];
  const key = `ai:quota:${provider}:${dateStr}`;
  await redis.incrby(key, amount);
  // Auto expire keys after 2 days to spare Redis RAM.
  await redis.expire(key, 172800);
}

export async function getQuotaRemaining(provider: string): Promise<{ used: number, limit: number, remaining: number }> {
  const dateStr = new Date().toISOString().split('T')[0];
  const key = `ai:quota:${provider}:${dateStr}`;
  
  const rawUsed = await redis.get(key);
  const used = parseInt(rawUsed || '0', 10);
  
  let limit = 0;
  if (provider === 'gemini-flash') limit = limits.GEMINI_FLASH_FREE_REQUESTS_DAY;
  if (provider === 'gemini-pro') limit = limits.GEMINI_PRO_FREE_REQUESTS_DAY;
  if (provider === 'groq') limit = limits.GROQ_FREE_RPM * 60 * 24; // Approximation for daily total based on RPM cap
  if (provider === 'localai') limit = 999999999; // Unlimited zero-cost proxy essentially.

  const remaining = Math.max(0, limit - used);

  return { used, limit, remaining };
}

export async function isQuotaAvailable(provider: string): Promise<boolean> {
  const q = await getQuotaRemaining(provider);
  // Provide a 5% safety buffer so we don't accidentally get HTTP 429
  return q.remaining > (q.limit * 0.05);
}

export async function resetDailyQuotas(): Promise<void> {
  const dateStr = new Date().toISOString().split('T')[0];
  // Normally automatically handled by TTL, but force delete if requested.
  const keys = await redis.keys(`ai:quota:*:${dateStr}`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export async function getAllQuotaStatus(): Promise<Record<string, {used: number, limit: number, remaining: number, percentage: number}>> {
  const providers = ['gemini-flash', 'gemini-pro', 'groq', 'localai'];
  const res: Record<string, any> = {};

  for (const p of providers) {
    const s = await getQuotaRemaining(p);
    res[p] = {
      ...s,
      percentage: s.limit === 0 ? 100 : Math.min(100, Math.round((s.used / s.limit) * 100))
    };
  }

  return res;
}
