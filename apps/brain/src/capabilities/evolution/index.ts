export * from './scheduler';
export * from './nightly-consolidation';
export * from './weekly-deep-learning';
export * from './monthly-intelligence-review';
export * from './realtime-watchers';
export * from './skill-acquisition';

import { EvolutionScheduler } from './scheduler';
import { RealtimeWatchers } from './realtime-watchers';

// Expose singletons dynamically
export const evoScheduler = new EvolutionScheduler();
export const activeWatchers = new RealtimeWatchers();
