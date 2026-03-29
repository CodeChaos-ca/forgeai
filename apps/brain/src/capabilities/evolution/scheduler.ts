import cron from 'node-cron';
import { runNightlyConsolidation } from './nightly-consolidation';
import { runWeeklyDeepLearning } from './weekly-deep-learning';
import { runMonthlyReview } from './monthly-intelligence-review';
import { loadBrainConfig } from '../../config/brain-config';

export class EvolutionScheduler {
  private tasks: Map<string, cron.ScheduledTask> = new Map();
  private schedules: Array<{ name: string; schedule: string; lastRun?: Date; nextRun: Date; enabled: boolean }> = [];

  constructor() {
    this.schedules = [
      { name: 'nightly_consolidation', schedule: '0 2 * * *', nextRun: new Date(), enabled: true },
      { name: 'weekly_deep_learning', schedule: '0 3 * * 0', nextRun: new Date(), enabled: true },
      { name: 'monthly_review', schedule: '0 4 1 * *', nextRun: new Date(), enabled: true }
    ];
  }

  start(configOverrides?: any): void {
    const config = loadBrainConfig();
    const schedulesToUse = configOverrides?.evolution_schedules || this.schedules;

    for (const job of schedulesToUse) {
      if (!job.enabled) continue;

      const task = cron.schedule(job.schedule, async () => {
        console.log(`[SCHEDULER] Starting ${job.name} at ${new Date().toISOString()}`);
        job.lastRun = new Date();
        
        try {
          const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout Exceeded')), 1000 * 60 * 60)); // 1 hour max
          
          let resultPromise: Promise<any>;
          switch (job.name) {
             case 'nightly_consolidation': resultPromise = runNightlyConsolidation(); break;
             case 'weekly_deep_learning': resultPromise = runWeeklyDeepLearning(); break;
             case 'monthly_review': resultPromise = runMonthlyReview(); break;
             default: resultPromise = Promise.resolve();
          }

          await Promise.race([resultPromise, timeout]);
          console.log(`[SCHEDULER] Completed ${job.name} successfully.`);
        } catch (e: any) {
          console.error(`[SCHEDULER] Task ${job.name} failed:`, e.message);
        }
      });

      this.tasks.set(job.name, task);
    }
  }

  stop(): void {
    for (const task of this.tasks.values()) {
      task.stop();
    }
    this.tasks.clear();
    console.log('[SCHEDULER] Stopped all evolution chronjobs.');
  }

  async triggerManual(taskName: string): Promise<any> {
    switch (taskName) {
       case 'nightly_consolidation': return await runNightlyConsolidation();
       case 'weekly_deep_learning': return await runWeeklyDeepLearning();
       case 'monthly_review': return await runMonthlyReview();
       default: throw new Error(`Unknown task: ${taskName}`);
    }
  }

  getScheduledTasks(): Array<{ name: string; schedule: string; lastRun?: Date; nextRun: Date; enabled: boolean }> {
    return this.schedules; // In reality, calculate nextRun using cron parser generically
  }
}
