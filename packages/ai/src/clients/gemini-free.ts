import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'fake-key');

export interface AIOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

function getTodayString() {
  const date = new Date();
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

const QUOTA_LIMIT = 1500; // Requests per day

// 30 second timeout, 3 retries
async function retryWithBackoff<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let latestError: any;
  for (let i = 0; i < attempts; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const res = await Promise.race([
        fn(),
        new Promise((_, reject) => {
          controller.signal.addEventListener('abort', () => reject(new Error('AI Request Timeout')));
        })
      ]);
      
      clearTimeout(timeoutId);
      return res as T;
    } catch (err: any) {
      latestError = err;
      if (err.message === 'AI Request Timeout' || err.status === 429 || err.status >= 500) {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
        continue;
      }
      throw err;
    }
  }
  throw latestError;
}

export class GeminiFreeClient {
  public maxContextTokens = 1000000;

  async generate(messages: AIMessage[], options: AIOptions = {}) {
    return retryWithBackoff(async () => {
      // Setup the model
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? 8192,
        },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      });

      // Construct history
      const systemMessage = messages.find(m => m.role === 'system')?.content;
      // In latest Gemini SDK, system instructions can be bound to the model setup, but typically we send them as the first message if using chat
      const chatMessages = messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      if (systemMessage) {
        chatMessages.unshift({ role: 'user', parts: [{ text: `System Instruction: ${systemMessage}` }] });
        chatMessages.unshift({ role: 'model', parts: [{ text: `Acknowledged.` }] });
      }

      const lastMessage = chatMessages.pop()!;
      const chat = model.startChat({ history: chatMessages });
      
      const result = await chat.sendMessageStream([{text: lastMessage.parts[0].text}]);
      return result.stream;
    });
  }

  async embed(text: string): Promise<number[]> {
    return retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const result = await model.embedContent(text);
      return result.embedding.values;
    });
  }

  async getQuotaRemaining(): Promise<number> {
    const key = `ai:quota:gemini:${getTodayString()}`;
    const used = parseInt(await redis.get(key) || '0', 10);
    return Math.max(0, QUOTA_LIMIT - used);
  }
}
