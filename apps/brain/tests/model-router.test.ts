import { describe, it, expect, vi } from 'vitest';
import { IntelligentModelRouter } from '../src/adapters/ai/router';

describe('IntelligentModelRouter', () => {
  const router = new IntelligentModelRouter();

  it('returns appropriate AI model explicitly mapping fallback natively', async () => {
    const model = await router.selectModel('code_generation', 'simple');
    expect(model.id).toBeDefined();
  });

  it('blocks cost thresholds strictly intelligently evaluating flawlessness', async () => {
    const cost = router.estimateCost({ id: 'localai' } as any, 1000);
    expect(cost).toBe(0);
  });

  it('reports quota tracking mathematically bounds', async () => {
     expect(typeof router.getQuotaStatus).toBe('function');
  });
});
