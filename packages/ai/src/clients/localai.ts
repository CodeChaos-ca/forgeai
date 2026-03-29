import OpenAI from 'openai';
import { AIMessage, AIOptions } from './gemini-free';

// LocalAI instances emulate exactly the OpenAI API format
const localAI = new OpenAI({ 
  baseURL: process.env.LOCAL_AI_URL || 'http://localai:8080/v1',
  apiKey: 'placeholder' // LocalAI doesn't strictly need a genuine key 
});

async function retryWithBackoff<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let latestError: any;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err: any) {
      latestError = err;
      if (err.status === 408 || err.status === 429 || err.status >= 500 || err.code === 'ECONNREFUSED') {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
        continue;
      }
      throw err;
    }
  }
  throw latestError;
}

export class LocalAIClient {
  public maxContextTokens = 32000; // Depends on loaded model, assuming openhermes/mistral

  async generate(messages: AIMessage[], options: AIOptions = {}) {
    return retryWithBackoff(async () => {
      const stream = await localAI.chat.completions.create({
        messages,
        model: 'local-model', // Mapped behind the scenes in docker-compose models/ config
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
        stream: true,
      }, { timeout: 30000 });

      return stream;
    });
  }

  // LocalAI always has quota because it runs completely locally
  async getQuotaRemaining(): Promise<number> {
    return Number.MAX_SAFE_INTEGER;
  }
}
