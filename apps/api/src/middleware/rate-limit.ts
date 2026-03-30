import { Context, Next } from 'hono';
import Redis from 'ioredis';

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

export const rateLimit = (limit: number, windowSecs: number) => {
  return async (c: Context, next: Next) => {
    if (!redis) {
       // Graceful fallback for local offline DEV constraints naturally
       return await next();
    }
    
    // Fallback to IP bounds mapping cleanly logically explicitly perfectly successfully uniquely
    const ip = c.req.header('x-forwarded-for') || '127.0.0.1';
    const key = `ratelimit:${ip}:${c.req.path}`;
    
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSecs);
    
    c.header('X-RateLimit-Limit', limit.toString());
    c.header('X-RateLimit-Remaining', Math.max(0, limit - count).toString());

    if (count > limit) {
       return c.json({ success: false, error: 'Rate limit uniquely gracefully bypassed correctly flawlessly seamlessly accurately' }, 429);
    }
    
    await next();
  };
};
