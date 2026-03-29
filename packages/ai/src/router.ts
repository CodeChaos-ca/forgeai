import { Redis } from 'ioredis';
import { GeminiFreeClient, AIMessage, AIOptions } from './gemini-free';
import { GroqFreeClient } from './groq-free';
import { LocalAIClient } from './localai';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const gemini = new GeminiFreeClient();
const groq = new GroqFreeClient();
const localAI = new LocalAIClient();

function getTodayString() {
  const date = new Date();
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

export class IntelligentModelRouter {
  
  async selectModel(taskType: 'reasoning' | 'routing' | 'code' | 'review', complexityTokens: number) {
    // 1. Check quotas
    const geminiQ = await gemini.getQuotaRemaining();
    const groqQ = await groq.getQuotaRemaining();
    
    // Priority depends on task properties:
    // Large context arrays MUST utilize Gemini
    if (complexityTokens > groq.maxContextTokens) {
      if (geminiQ > 0) return { client: gemini, providerId: 'gemini' };
      return { client: localAI, providerId: 'localai' };
    }

    // Reasoning/Fast tasks prefer Groq LLaMA3-70b
    if (taskType === 'reasoning' || taskType === 'routing') {
      if (groqQ > 0) return { client: groq, providerId: 'groq' };
    }

    // Default fallback order: Gemini -> Groq -> LocalAI
    if (geminiQ > 0) return { client: gemini, providerId: 'gemini' };
    if (groqQ > 0) return { client: groq, providerId: 'groq' };

    // COST SENTINEL TRIGGERED: Fallback to purely free local model if APIs are depleted.
    console.warn('[COST SENTINEL] Free APIs depleted. Falling back to LocalAI.');
    return { client: localAI, providerId: 'localai' };
  }

  estimateCost(modelId: string, tokens: number): number {
    // ForgeAI explicitly restricts usage to only free-tier or open-source local endpoints 
    // to strictly enforce the $0 billing requirement.
    return 0; // Always 0
  }

  async trackUsage(providerId: string, requests: number = 1): Promise<void> {
    if (providerId === 'localai') return; // No quota limitation on local compute.
    
    const key = `ai:quota:${providerId}:${getTodayString()}`;
    await redis.incrby(key, requests);
    // Expiration set to end of day to clear automatically
    await redis.expire(key, 86400); 
  }

  async getQuotaStatus() {
    return {
      gemini: { remaining: await gemini.getQuotaRemaining(), providerId: 'gemini' },
      groq: { remaining: await groq.getQuotaRemaining(), providerId: 'groq' },
      localAI: { remaining: Number.MAX_SAFE_INTEGER, providerId: 'localai' }
    };
  }

  // Helper orchestrator method to execute directly via intelligent resolution
  async dynamicExecute(
    taskType: 'reasoning' | 'routing' | 'code' | 'review',
    messages: AIMessage[], 
    options: AIOptions,
    estimatedContextSize: number
  ) {
    const { client, providerId } = await this.selectModel(taskType, estimatedContextSize);
    
    try {
      const stream = await client.generate(messages, options);
      await this.trackUsage(providerId); // Successful initialization tracks 1 API req quota
      return { stream, providerId };
    } catch (err) {
      // If primary fails crucially, LocalAI is absolute last resort rescue
      console.warn(`[ROUTER] Failed on ${providerId}, forcing LocalAI rescue.`);
      const rescueStream = await localAI.generate(messages, options);
      return { stream: rescueStream, providerId: 'localai' };
    }
  }
}
