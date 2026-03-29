import { getAllQuotaStatus } from '../../utils/quota-tracker';
import { loadBrainConfig } from '../../config/brain-config';

export type AllQuotaStatus = Record<string, { used: number; total: number; remaining: number; resetAt: Date; } | null>;

export class QuotaTracker {
  private intervalId?: NodeJS.Timeout;

  startTracking(intervalMs: number): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.checkAndAdjust(), intervalMs);
    console.log(`[QUOTA_TRACKER] Started with interval ${intervalMs}ms`);
  }

  stopTracking(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = undefined;
    console.log('[QUOTA_TRACKER] Stopped');
  }

  async checkAndAdjust(): Promise<void> {
    const status = await this.getStatus();
    const config = loadBrainConfig();
    let configChanged = false;

    // We mutate active configuration bounds dynamically in-memory temporarily to throttle traffic
    // Real deployment maps back to database persistent configs usually.
    for (const [provider, stats] of Object.entries(status)) {
      if (!stats) continue;
      
      const usagePercent = stats.used / Math.max(1, stats.total);

      if (usagePercent > 0.95) {
        console.warn(`[QUOTA_TRACKER] Disabled ${provider} - over 95% capacity mapped.`);
        for (const task of Object.keys(config.ai_routing_weights)) {
          if (config.ai_routing_weights[task][provider]) {
            config.ai_routing_weights[task][provider] = 0;
            configChanged = true;
          }
        }
      // Threshold throttling gracefully shifting weight to infinite fallbacks
      } else if (usagePercent > 0.80) {
        console.warn(`[QUOTA_TRACKER] Throttling ${provider} - over 80% capacity mapped.`);
        for (const task of Object.keys(config.ai_routing_weights)) {
          if (config.ai_routing_weights[task][provider]) {
            config.ai_routing_weights[task][provider] = Math.max(0.1, config.ai_routing_weights[task][provider] * 0.5);
            configChanged = true;
          }
        }
      }
    }

    if (configChanged) {
      console.log('[QUOTA_TRACKER] Dynamic config shifts applied mitigating limits seamlessly.');
    }
  }

  async getStatus(): Promise<AllQuotaStatus> {
    return await getAllQuotaStatus();
  }

  async predictTomorrowUsage(): Promise<Record<string, number>> {
    const stats = await this.getStatus();
    const predictions: Record<string, number> = {};
    
    // Abstracting a simple 7-day flat multiplier simulating real SMA
    // Assuming 'used' is exactly what we're consuming today.
    for (const [provider, value] of Object.entries(stats)) {
      if (value) {
        // A real system would query Redis historical hashes. Here we project linearly + 10% daily growth heuristic.
        predictions[provider] = Math.round(value.used * 1.10);
      } else {
        predictions[provider] = 0;
      }
    }
    return predictions;
  }
}
