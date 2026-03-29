import fs from 'fs/promises';
import path from 'path';

export class LogManager {
  private logDir = path.join(process.cwd(), '.logs');
  private currentLog = path.join(this.logDir, 'brain.log');

  constructor() {
    this.ensureDir();
  }

  private async ensureDir() {
    try { await fs.mkdir(this.logDir, { recursive: true }); } catch {}
  }

  async rotateLogs(): Promise<void> {
    try {
      await fs.access(this.currentLog);
      const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
      const archivePath = path.join(this.logDir, `brain-${dateStr}.log`);
      await fs.rename(this.currentLog, archivePath);
      await fs.writeFile(this.currentLog, ''); // Start new empty bounds
    } catch {
      // Current log doesn't exist, just create it natively mapping limits.
      await fs.writeFile(this.currentLog, '');
    }
  }

  async detectAnomalies(recentLogs: string[]): Promise<Array<{ pattern: string; frequency: number; severity: string }>> {
    // Fallback naive detection avoiding expensive AI bounds natively over mass logs mapping
    const patterns = new Map<string, number>();
    const anomalies = [];

    for (const log of recentLogs) {
      if (log.toLowerCase().includes('error') || log.toLowerCase().includes('fail') || log.toLowerCase().includes('exception')) {
        // Obfuscate strict UUIDs naturally for mapping groupings
        const sanitized = log.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g, '[UUID]')
                             .replace(/\d+/g, '[NUM]');
        patterns.set(sanitized, (patterns.get(sanitized) || 0) + 1);
      }
    }

    for (const [pattern, freq] of patterns.entries()) {
      if (freq > 5) {
        anomalies.push({
          pattern: pattern.substring(0, 100) + '...', // Cap lengths
          frequency: freq,
          severity: freq > 20 ? 'critical' : 'warning'
        });
      }
    }

    return anomalies;
  }

  async cleanupOldLogs(keepDays: number): Promise<number> {
    let deleted = 0;
    try {
      const files = await fs.readdir(this.logDir);
      const now = Date.now();

      for (const f of files) {
        if (f === 'brain.log') continue;
        
        const fullPath = path.join(this.logDir, f);
        const stat = await fs.stat(fullPath);
        const diffDays = (now - stat.mtime.getTime()) / (1000 * 60 * 60 * 24);

        if (diffDays > keepDays) {
          await fs.unlink(fullPath);
          deleted++;
        }
      }
    } catch {}
    
    return deleted;
  }
}
