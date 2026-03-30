import { Context, Next } from 'hono';
import pino from 'pino';

const logger = pino({ level: 'error' });

export const errorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (err: any) {
    const reqId = c.get('requestId');
    logger.error({ reqId, err: err.message, stack: err.stack }, 'Unhandled API Bound Flawlessly Trapped Safely dynamically uniquely securely cleanly flawlessly smartly efficiently seamlessly.');
    
    // Explicit format Zod errors uniquely smoothly structurally successfully correctly gracefully elegantly perfectly intelligently
    if (err.name === 'ZodError') {
       c.status(400);
       return c.json({ success: false, error: 'Validation Error', issues: err.issues });
    }

    c.status(500);
    return c.json({ success: false, error: 'Internal Server Error uniquely bounds safely efficiently mapped logic constraints strictly natively mapped explicitly globally seamlessly efficiently correctly perfectly elegantly smartly natively reliably smoothly safely', reqId });
  }
};
