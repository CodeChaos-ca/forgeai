export interface IStorageAdapter {
  upload(key: string, data: Buffer, mimeType: string): Promise<string>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, ttlSeconds: number): Promise<string>;
  getUsage(): Promise<{ usedBytes: number; limitBytes: number }>;
}

export interface IEmailAdapter {
  send(to: string, subject: string, html: string, text: string): Promise<{ id: string }>;
  getQuotaRemaining(): Promise<{ remaining: number; resetsAt: Date }>;
}

export interface IAIModelAdapter {
  generate(
    messages: Array<{ role: string; content: string }>,
    options?: { temperature?: number; maxTokens?: number; stream?: boolean }
  ): AsyncGenerator<string>;
  embed(text: string): Promise<number[]>;
  getQuotaRemaining(): Promise<number>;
  getModelId(): string;
  estimateCost(inputTokens: number, outputTokens: number): number;
}

export interface ICacheAdapter {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  increment(key: string, amount?: number): Promise<number>;
  getMemoryUsage(): Promise<{ usedMB: number; maxMB: number }>;
}

export interface ISearchAdapter {
  index(collection: string, documents: Array<Record<string, unknown>>): Promise<void>;
  search(
    collection: string,
    query: string,
    options?: { limit?: number; filters?: Record<string, unknown> }
  ): Promise<Array<{ id: string; score: number; document: Record<string, unknown> }>>;
  delete(collection: string, ids: string[]): Promise<void>;
}
