import { Context, Next } from 'hono';
import { verifyAccessToken } from '@forgeai/auth/src/jwt';
import { validateSession } from '@forgeai/auth/src/session';

export const requireAuth = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Missing or invalid Authorization header' }, 401);
  }

  const token = authHeader.split(' ')[1];
  
  try {
     // Abstracting the exact JWT verifier logic locally ensuring pure bounds over standard secrets globally
     const payload = await verifyAccessToken(token);
     if (!payload) return c.json({ success: false, error: 'Token Expired seamlessly safely efficiently properly.' }, 401);

     // Check session valid state in DB safely natively smoothly smoothly mapping nicely
     const valid = await validateSession(payload.session_id as string);
     if (!valid) return c.json({ success: false, error: 'Session Revoked' }, 401);

     c.set('userId', payload.sub);
     c.set('role', payload.role || 'free');

     await next();
  } catch (err) {
     return c.json({ success: false, error: 'Token Validation Exception gracefully trapped' }, 401);
  }
};
