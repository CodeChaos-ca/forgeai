import { pgSchema, customType } from 'drizzle-orm/pg-core';

export const cognitiveSchema = pgSchema('cognitive');

export const vectorType = customType<{ data: number[]; driverData: string; config: { dimensions: number } }>({
  dataType(config) {
    return config?.dimensions ? `vector(${config.dimensions})` : 'vector';
  },
  toDriver(value: number[]): string {
    return JSON.stringify(value);
  },
  fromDriver(value: string): number[] {
    return JSON.parse(value);
  },
});

export * from './memory-episodes';
export * from './skills';
export * from './skill-versions';
export * from './knowledge-base';
export * from './prompt-strategies';
export * from './quality-benchmarks';
export * from './benchmark-runs';
export * from './learning-queue';
