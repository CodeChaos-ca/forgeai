import type { IAIModelAdapter } from '../types';

export class LocalAIAdapter implements IAIModelAdapter {
  private endpoint: string;
  private primaryModel = 'phi-3-mini';

  constructor() {
    this.endpoint = process.env.LOCALAI_ENDPOINT || 'http://localai:8080/v1';
  }

  async *generate(
    messages: Array<{ role: string; content: string }>,
    options?: { temperature?: number; maxTokens?: number; stream?: boolean }
  ): AsyncGenerator<string> {
    
    // We utilize the exact OpenAI standardized API format mapping locally against our container.
    const res = await fetch(`${this.endpoint}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.primaryModel,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2048,
        stream: true
      })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`LocalAI HTTP failure: ${err}`);
    }

    if (!res.body) throw new Error('LocalAI stream body missing.');

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.substring(6));
            if (data.choices[0].delta?.content) {
              yield data.choices[0].delta.content;
            }
          } catch (e) {
            // Ignore corrupted SSE string parsing mid-stream buffer
          }
        }
      }
    }
  }

  async embed(text: string): Promise<number[]> {
    const res = await fetch(`${this.endpoint}/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'all-MiniLM-L6-v2',
        input: text
      })
    });

    if (!res.ok) throw new Error('LocalAI Embed failure.');
    const json = await res.json();
    return json.data[0].embedding;
  }

  async getQuotaRemaining(): Promise<number> {
    return Infinity; // THIS IS THE INFINITE FALLBACK
  }

  getModelId(): string {
    return this.primaryModel;
  }

  estimateCost(inputTokens: number, outputTokens: number): number {
    return 0; // Absolute $0 Cost
  }
}
