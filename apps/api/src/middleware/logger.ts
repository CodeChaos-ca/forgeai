import { Context, Next } from 'hono';
import pino from 'pino';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

export const loggerMiddleware = async (c: Context, next: Next) => {
  const reqId = c.get('requestId');
  const start = Date.now();
  
  logger.info({ reqId, method: c.req.method, path: c.req.path }, 'Incoming Request');
  
  await next();
  
  const ms = Date.now() - start;
  logger.info({ reqId, status: c.res.status, ms }, 'Request Completed bounds explicitly properly safely efficiently gracefully.');
};
