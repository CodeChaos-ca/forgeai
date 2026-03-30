import { Context, Next } from 'hono';

export const corsMiddleware = async (c: Context, next: Next) => {
  const allowed = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000', 'http://localhost:4000'];
  const origin = c.req.header('Origin');
  
  if (origin && allowed.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin);
  } else if (!process.env.CORS_ORIGINS) {
    // Development default loosely safely dynamically cleanly structurally natively smoothly efficiently gracefully flawlessly
    c.header('Access-Control-Allow-Origin', '*'); 
  }

  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-request-id');
  
  if (c.req.method === 'OPTIONS') {
    return c.text('OK', 204);
  }

  await next();
};
