import { exec } from 'child_process';
import { promisify } from 'util';
import { db } from '@forgeai/db';
import { memoryEpisodes } from '@forgeai/db/schema';
import { registry } from '../../adapters/registry';
import { ICacheAdapter, ISearchAdapter } from '../../adapters/types';

const execAsync = promisify(exec);

export type HealthReport = {
  timestamp: string;
  services: Record<string, { status: 'healthy' | 'degraded' | 'down'; latencyMs: number; error?: string }>;
  overall: 'healthy' | 'degraded' | 'down';
};

export class HealthMonitor {
  private intervalId?: NodeJS.Timeout;
  private failCounts: Record<string, number> = {};
  private lastReport: HealthReport | null = null;

  startMonitoring(intervalMs: number): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.checkAll(), intervalMs);
    console.log(`[HEALTH_MONITOR] Started with interval ${intervalMs}ms`);
  }

  stopMonitoring(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = undefined;
    console.log('[HEALTH_MONITOR] Stopped');
  }

  async checkAll(): Promise<HealthReport> {
    const report: HealthReport = {
      timestamp: new Date().toISOString(),
      services: {},
      overall: 'healthy'
    };

    const checks = [
      this.checkRedis(),
      this.checkMeilisearch(),
      this.checkDatabase(),
      this.checkLocalAI()
    ];

    const results = await Promise.allSettled(checks);

    results.forEach((res) => {
      if (res.status === 'fulfilled') {
        const { name, status, latencyMs } = res.value;
        report.services[name] = { status, latencyMs };
        
        if (status === 'healthy') {
          this.failCounts[name] = 0;
        } else {
          this.failCounts[name] = (this.failCounts[name] || 0) + 1;
          report.overall = 'degraded';
        }
      } else {
        // Unhandled catastrophic Promise rejection internally maps down
        report.overall = 'down';
      }
    });

    const downs = Object.values(report.services).filter(s => s.status === 'down');
    if (downs.length > 0) report.overall = 'down';
    
    // Auto-restart logic
    for (const [service, count] of Object.entries(this.failCounts)) {
      if (count >= 3) {
        console.warn(`[HEALTH_MONITOR] Service ${service} failed 3 consecutive times. Attempting auto-restart.`);
        const restarted = await this.restartService(service);
        
        // Log to memory
        await db.insert(memoryEpisodes).values({
          episodeType: 'infrastructure_event',
          triggerEvent: `Health monitor detected ${service} crash`,
          contextState: { failCount: count, report },
          actionTaken: restarted ? `Successfully restarted ${service}` : `Failed to restart ${service}`,
          resolution: restarted ? 'success' : 'failure',
          qualityScore: restarted ? 100 : 0
        });

        if (restarted) this.failCounts[service] = 0; // Reset after successful bounce
      }
    }

    this.lastReport = report;
    return report;
  }

  getLatestReport(): HealthReport {
    if (!this.lastReport) {
      return { timestamp: new Date().toISOString(), services: {}, overall: 'healthy' };
    }
    return this.lastReport;
  }

  async restartService(name: string): Promise<boolean> {
    const containerMap: Record<string, string> = {
      redis: 'forgeai-redis',
      meilisearch: 'forgeai-meilisearch',
      localai: 'forgeai-localai'
    };

    const containerName = containerMap[name];
    if (!containerName) return false;

    try {
      await execAsync(`docker restart ${containerName}`);
      return true;
    } catch (e) {
      console.error(`[HEALTH_MONITOR] Restart failure for ${containerName}:`, e);
      return false;
    }
  }

  private async checkRedis(): Promise<{ name: string; status: 'healthy' | 'down'; latencyMs: number }> {
    const start = Date.now();
    try {
      const cache = registry.getAdapter<ICacheAdapter>('Cache');
      await cache.healthCheck();
      return { name: 'redis', status: 'healthy', latencyMs: Date.now() - start };
    } catch (e) {
      return { name: 'redis', status: 'down', latencyMs: Date.now() - start };
    }
  }

  private async checkMeilisearch(): Promise<{ name: string; status: 'healthy' | 'down'; latencyMs: number }> {
    const start = Date.now();
    try {
      const search = registry.getAdapter<ISearchAdapter>('Search');
      await search.healthCheck();
      return { name: 'meilisearch', status: 'healthy', latencyMs: Date.now() - start };
    } catch (e) {
      return { name: 'meilisearch', status: 'down', latencyMs: Date.now() - start };
    }
  }

  private async checkDatabase(): Promise<{ name: string; status: 'healthy' | 'down'; latencyMs: number }> {
    const start = Date.now();
    try {
      await db.execute('SELECT 1');
      return { name: 'database', status: 'healthy', latencyMs: Date.now() - start };
    } catch (e) {
      return { name: 'database', status: 'down', latencyMs: Date.now() - start };
    }
  }

  private async checkLocalAI(): Promise<{ name: string; status: 'healthy' | 'degraded' | 'down'; latencyMs: number }> {
    const start = Date.now();
    try {
      const endpoint = process.env.LOCALAI_ENDPOINT || 'http://localai:8080/v1';
      const res = await fetch(`${endpoint}/models`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) return { name: 'localai', status: 'degraded', latencyMs: Date.now() - start };
      return { name: 'localai', status: 'healthy', latencyMs: Date.now() - start };
    } catch (e) {
      return { name: 'localai', status: 'down', latencyMs: Date.now() - start };
    }
  }
}
