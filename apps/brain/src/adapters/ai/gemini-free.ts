import { GoogleGenerativeAI } from '@google/generative-ai';
import type { IAIModelAdapter } from '../types';
import { trackUsage, getQuotaRemaining, isQuotaAvailable } from '../../utils/quota-tracker';
import { GEMINI_FLASH_FREE_REQUESTS_DAY } from '../../config/free-tier-limits';

export class GeminiFreeAdapter implements IAIModelAdapter {
  private ai: GoogleGenerativeAI;
  private primaryModel = 'gemini-2.0-flash';
  private embedModel = 'text-embedding-004';

  constructor() {
    this.ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'fake_key');
  }

  async *generate(
    messages: Array<{ role: string; content: string }>,
    options?: { temperature?: number; maxTokens?: number; stream?: boolean }
  ): AsyncGenerator<string> {
    const available = await isQuotaAvailable('gemini-flash');
    if (!available) {
      throw new Error('Gemini Flash FREE quota limits exhausted.');
    }

    const model = this.ai.getGenerativeModel({
      model: this.primaryModel,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 8192,
      }
    });

    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : m.role,
      parts: [{ text: m.content }]
    }));

    // Start Generation Phase
    let requestFailed = false;
    let stream;
    
    try {
      const result = await model.generateContentStream({ contents: contents as any });
      stream = result.stream;
    } catch (e: any) {
      requestFailed = true;
      throw new Error(`Gemini SDK failed: ${e.message}`);
    }

    if (!requestFailed && stream) {
      for await (const chunk of stream) {
        const textChunk = chunk.text();
        yield textChunk;
      }
      
      // Successfully finished generation chunking, record mapping usage telemetry.
      await trackUsage('gemini-flash', 1);
    }
  }

  async embed(text: string): Promise<number[]> {
    const available = await isQuotaAvailable('gemini-flash');
    if (!available) {
      throw new Error('Gemini Flash FREE quota limits exhausted for embeddings.');
    }

    const model = this.ai.getGenerativeModel({ model: this.embedModel });
    const res = await model.embedContent(text);
    const vec = res.embedding.values;
    
    await trackUsage('gemini-flash', 1); // Shared token/request counter pool tracking
    return vec;
  }

  async getQuotaRemaining(): Promise<number> {
    const q = await getQuotaRemaining('gemini-flash');
    return q.remaining;
  }

  getModelId(): string {
    return this.primaryModel;
  }

  estimateCost(inputTokens: number, outputTokens: number): number {
    return 0; // Pure free-tier zero-cost boundary
  }
}
