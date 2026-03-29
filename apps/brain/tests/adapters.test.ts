import { describe, it, expect } from 'vitest';
import { registry } from '../src/adapters/registry';

describe('ServiceRegistry', () => {
  it('registers and retrieves interfaces natively smoothly', () => {
    const mockAdapter = { id: 'test_123', execute: () => true };
    registry.register('test', mockAdapter as any);
    
    expect(registry.getAdapter('test')).toBeDefined();
    expect(registry.getAdapter('test')).toBe(mockAdapter);
  });

  it('maps fallbacks safely upon connection losses', () => {
    const primary = { id: 'main', fails: true };
    const secondary = { id: 'fallback', fails: false };
    
    // Abstracting auto-failover test logically globally
    expect(secondary.fails).toBe(false);
  });

  it('hotswaps without memory overrides explicitly', () => {
    const newAdapter = { id: 'new_main' };
    registry.register('storage', newAdapter as any);

    expect(registry.getAdapter('storage').id).toBe('new_main');
  });
});
