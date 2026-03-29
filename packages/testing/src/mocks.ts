import { vi } from 'vitest';

export const mockRedisClient = {
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  expire: vi.fn(),
  incrby: vi.fn(),
  exists: vi.fn(),
  pipeline: () => ({
    set: vi.fn(),
    exec: vi.fn(),
  }),
};

export const mockAIClient = {
  generate: vi.fn().mockResolvedValue({
    [Symbol.asyncIterator]: async function* () {
      yield { choices: [{ delta: { content: 'Mocked ' } }] };
      yield { choices: [{ delta: { content: 'AI Response.' } }] };
    }
  }),
  embed: vi.fn().mockResolvedValue(new Array(1536).fill(0.1)),
  getQuotaRemaining: vi.fn().mockResolvedValue(1000),
};

export function setupGlobalMocks() {
  vi.stubEnv('DATABASE_URL', 'postgresql://mock:mock@localhost:5432/mock');
  vi.stubEnv('REDIS_URL', 'redis://localhost:6379');
}
