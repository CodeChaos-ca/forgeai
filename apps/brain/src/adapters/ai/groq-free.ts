import Groq from 'groq-sdk';
import type { IAIModelAdapter } from '../types';
import { trackUsage, getQuotaRemaining, isQuotaAvailable } from '../../utils/quota-tracker';
import { GROQ_FREE_RPM } from '../../config/free-tier-limits';

export class GroqFreeAdapter implements IAIModelAdapter {
  private groq: Groq;
  private primaryModel = 'llama-3.3-70b-versatile';

  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'fake_key' });
  }

  async *generate(
    messages: Array<{ role: string; content: string }>,
    options?: { temperature?: number; maxTokens?: number; stream?: boolean }
  ): AsyncGenerator<string> {
    const available = await isQuotaAvailable('groq');
    if (!available) {
      throw new Error('Groq FREE quota RPM limits exhausted.');
    }

    let stream;
    try {
      // Timeout controller built-in to Groq sdk settings
      stream = await this.groq.chat.completions.create({
        model: this.primaryModel,
        messages: messages as any,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 4096,
        stream: true
      });
    } catch (e: any) {
      throw new Error(`Groq Adapter Generation Failed: ${e.message}`);
    }

    for await (const chunk of stream) {
      const charChunk = chunk.choices[0]?.delta?.content || "";
      yield charChunk;
    }

    await trackUsage('groq', 1);
  }

  async embed(text: string): Promise<number[]> {
    throw new Error('Groq inherently lacks a dedicated public embedding API currently. Fallback immediately.');
  }

  async getQuotaRemaining(): Promise<number> {
    const q = await getQuotaRemaining('groq');
    return q.remaining;
  }

  getModelId(): string {
    return this.primaryModel;
  }

  estimateCost(inputTokens: number, outputTokens: number): number {
    return 0;
  }
}
