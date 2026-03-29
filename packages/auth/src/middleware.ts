import { Context, Next } from 'hono';
import { verifyAccessToken } from './jwt';

interface AuthContextVariables {
  user: {
    userId: string;
    role: string;
  } | null;
}

export const optionalAuth = async (c: Context<{ Variables: AuthContextVariables }>, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    c.set('user', null);
    return next();
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  if (payload) {
    c.set('user', payload);
  } else {
    c.set('user', null);
  }

  return next();
};

export const requireAuth = async (c: Context<{ Variables: AuthContextVariables }>, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized', message: 'Missing or malformed Authorization header' }, 401);
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    return c.json({ error: 'Unauthorized', message: 'Token is invalid or expired' }, 401);
  }

  c.set('user', payload);
  return next();
};

export const requireRole = (allowedRoles: string[]) => {
  return async (c: Context<{ Variables: AuthContextVariables }>, next: Next) => {
    const user = c.get('user');
    
    // We expect requireAuth to have run prior to this middleware. If the user is unauth'd entirely, block.
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json({ error: 'Forbidden', message: 'You do not have the required permissions for this action.' }, 403);
    }

    return next();
  };
};
