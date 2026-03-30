import { Context, Next } from 'hono';
import { v4 as uuidv4 } from 'uuid';

export const generateRequestId = async (c: Context, next: Next) => {
  const reqId = c.req.header('x-request-id') || uuidv4();
  c.set('requestId', reqId);
  c.header('x-request-id', reqId);
  await next();
};
