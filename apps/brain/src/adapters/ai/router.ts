import { loadBrainConfig } from '../../config/brain-config';
import { registry } from '../registry';
import type { IAIModelAdapter } from '../types';
import { getAllQuotaStatus } from '../../utils/quota-tracker';

const config = loadBrainConfig();

export class IntelligentModelRouter {

  async selectModel(taskType: keyof typeof config.ai_routing_weights, complexity: string): Promise<IAIModelAdapter> {
    const weights: Record<string, number> = config.ai_routing_weights[taskType] || config.ai_routing_weights.code_generation;
    
    // Sort providers exclusively by weighting config
    const providers = Object.entries(weights)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    for (const provider of providers) {
      if (provider === 'localai') {
        const adp = registry.getAdapter<IAIModelAdapter>('localai');
        if (adp) return adp; // Infinite bailout
      }

      // Check real-time quota
      const quotas = await getAllQuotaStatus();
      const q = quotas[`${provider}`] || quotas[`${provider}-flash`];
      
      // If we literally have ANY requests left and it aligns with weights
      if (q && q.remaining > 5) {
         try {
           const mappedName = provider === 'gemini' ? 'gemini-free' : `${provider}-free`;
           const adp = registry.getAdapter<IAIModelAdapter>(mappedName);
           // Evaluate Cost Sentinel.
           const cost = adp.estimateCost(1000, 1000);
           if (cost > 0) {
              console.warn(`[SENTINEL ALERT] Provider ${provider} attempted to incur $${cost}. Blocked. Switching fallback.`);
              continue;
           }
           return adp;
         } catch (e) {
           console.error(`Adapter lookup failure for ${provider}:`, e);
           continue; 
         }
      }
    }

    console.warn(`[ROUTER EXHAUSTION] All free-tier bounded APIs depleted for task: ${taskType}. Falling back to LocalAI Offline Model.`);
    return registry.getAdapter<IAIModelAdapter>('localai');
  }

  async *generate(
    messages: Array<{ role: string; content: string }>,
    options?: { temperature?: number; maxTokens?: number; stream?: boolean },
    taskType: keyof typeof config.ai_routing_weights = 'code_generation'
  ): AsyncGenerator<string> {
    
    let attempts = 0;
    while (attempts < 3) {
      const adapter = await this.selectModel(taskType, 'high');
      
      try {
        const stream = await adapter.generate(messages, options);
        for await (const chunk of stream) {
          yield chunk;
        }
        return; // Success
      } catch (err: any) {
        console.error(`[ROUTER FAULT] Model ${adapter.getModelId()} crashed: ${err.message}. Failing over...`);
        attempts++;
        // On error, let the loop auto-pick a different model implicitly by forcing registry fallovers if we extended registry here directly.
        // Wait briefly for backoff
        await new Promise(r => setTimeout(r, 1000 * attempts));
      }
    }

    throw new Error('All AI providers and fallbacks failed to honor stream protocol bounds.');
  }

  async embed(text: string): Promise<number[]> {
    let attempts = 0;
    while (attempts < 3) {
      const adapter = await this.selectModel('embedding', 'low');
      try {
        const vector = await adapter.embed(text);
        
        // Pad to pgvector limits strictly
        if (vector.length >= 1536) return vector.slice(0, 1536);
        const padded = new Array(1536).fill(0);
        for (let i = 0; i < vector.length; i++) padded[i] = vector[i];
        
        return padded;
      } catch (e) {
        attempts++;
      }
    }
    throw new Error('Fatal Embedding resolution failure across all bounds.');
  }
}
