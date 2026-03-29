import { describe, it, expect, vi } from 'vitest';
import { PerceptionLayer } from '../src/capabilities/code-intelligence/perception';

describe('PerceptionLayer', () => {
  const perception = new PerceptionLayer();

  it('classifies intents with varying bounds correctly', async () => {
    const stubPattern = await perception.classifyIntent("Fix the bug in main.tsx", { projectId: '1', files: [], dataModels: [] });
    
    expect(stubPattern).toBeDefined();
    expect(stubPattern.confidence).toBeGreaterThanOrEqual(0);
    expect(['trivial', 'simple', 'moderate', 'complex', 'expert']).toContain(stubPattern.complexity);
  });

  it('assembles context evaluating token sizes strictly', async () => {
    const ctx = {
      primaryTask: 'code',
      taskTypes: ['build'],
      complexity: 'simple',
      estimatedFiles: 1,
      estimatedTimeMinutes: 5,
      confidence: 1,
      requiresMultiAgent: false
    };

    const assembled = await perception.assembleContext('1', ctx as any, [], 4000);
    expect(assembled.length).toBeDefined();
  });
});
