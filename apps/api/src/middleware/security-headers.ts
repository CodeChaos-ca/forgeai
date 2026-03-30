import { Context, Next } from 'hono';

export const securityHeaders = async (c: Context, next: Next) => {
  await next();
  
  c.header('X-Frame-Options', 'DENY');
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Content-Security-Policy', "default-src 'self'; frame-ancestors 'none';");
};
