import { HfInference } from '@huggingface/inference';
import type { IAIModelAdapter } from '../types';

export class HuggingFaceAdapter implements IAIModelAdapter {
  private hf: HfInference;
  private embedModel = 'sentence-transformers/all-MiniLM-L6-v2';

  constructor() {
    this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY || 'fake_key');
  }

  async *generate(): AsyncGenerator<string> {
    throw new Error('HuggingFace adapter mapped exclusively for embeddings. Use fallback.');
  }

  async embed(text: string): Promise<number[]> {
    const res = await this.hf.featureExtraction({
      model: this.embedModel,
      inputs: text
    });

    // HF might return 1D or 2D arrays depending on the model and inputs
    if (Array.isArray(res) && Array.isArray(res[0])) {
      return res[0] as number[];
    }
    return res as number[];
  }

  async getQuotaRemaining(): Promise<number> {
    return Infinity; // HuggingFace free API is virtually unlimited for lightweight tasks
  }

  getModelId(): string {
    return this.embedModel;
  }

  estimateCost(inputTokens: number, outputTokens: number): number {
    return 0;
  }
}
