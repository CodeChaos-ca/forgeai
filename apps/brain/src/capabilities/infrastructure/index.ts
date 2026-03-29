export * from './health-monitor';
export * from './quota-tracker';
export * from './auto-healer';
export * from './cost-sentinel';
export * from './backup-manager';
export * from './log-manager';
export * from './resource-optimizer';

// Centralize exports naturally allowing `apps/brain` root bounds access seamlessly.

import { HealthMonitor } from './health-monitor';
import { QuotaTracker } from './quota-tracker';
import { CostSentinel } from './cost-sentinel';

// System singletons logically active immediately if launched natively.
export const systemHealth = new HealthMonitor();
export const systemQuota = new QuotaTracker();
export const costObserver = new CostSentinel();
