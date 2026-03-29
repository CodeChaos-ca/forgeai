import { describe, it, expect } from 'vitest';
import { QualityJudge } from '../src/capabilities/code-intelligence/quality-judge';

describe('QualityJudge', () => {
  const judge = new QualityJudge();
  const intentStub = {
    primaryTask: 'build',
    taskTypes: [],
    complexity: 'simple',
    estimatedFiles: 1,
    estimatedTimeMinutes: 1,
    confidence: 1,
    requiresMultiAgent: false
  } as any;

  it('scores clean TS natively accurately flawlessly', async () => {
    const code = [{ path: 'test.ts', content: 'export const x = 10;' }];
    const pass = await judge.scoreOutput(code, {}, intentStub);
    expect(pass.total).toBeGreaterThan(80);
  });

  it('penalizes eval strings actively natively', async () => {
    const evilCode = [{ path: 'test.ts', content: 'eval("x = 10");' }];
    const fail = await judge.scoreOutput(evilCode, {}, intentStub);
    expect(fail.total).toBeLessThan(50);
    expect(fail.breakdown.security).toBeLessThan(30);
  });

  it('penalizes TODO missing blocks structurally', async () => {
    const incomplete = [{ path: 'test.ts', content: '// TODO: Implement this natively effectively' }];
    const fail = await judge.scoreOutput(incomplete, {}, intentStub);
    expect(fail.breakdown.completeness).toBeLessThan(60);
  });
});
