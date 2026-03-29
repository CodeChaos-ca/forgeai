import Groq from 'groq-sdk';
import { Redis } from 'ioredis';
import { AIMessage, AIOptions } from './gemini-free';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'fake-key' });

function getTodayString() {
  const date = new Date();
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

const QUOTA_LIMIT = 14400; // Groq limit requests per day roughly

async function retryWithBackoff<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let latestError: any;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      latestError = err;
      if (err.status === 408 || err.status === 429 || err.status >= 500) {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
        continue;
      }
      throw err;
    }
  }
  throw latestError;
}

export class GroqFreeClient {
  public maxContextTokens = 8192; // Llama-3-70b-8192

  async generate(messages: AIMessage[], options: AIOptions = {}) {
    return retryWithBackoff(async () => {
      const stream = await groq.chat.completions.create({
        messages,
        model: 'llama3-70b-8192',
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 1024,
        stream: true,
      }, { timeout: 30000 }); // 30s timeout configured in SDK

      return stream;
    });
  }

  async getQuotaRemaining(): Promise<number> {
    const key = `ai:quota:groq:${getTodayString()}`;
    const used = parseInt(await redis.get(key) || '0', 10);
    return Math.max(0, QUOTA_LIMIT - used);
  }
}
