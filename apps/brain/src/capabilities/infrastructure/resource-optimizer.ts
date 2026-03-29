import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class ResourceOptimizer {

  async getContainerStats(): Promise<Array<{ name: string; cpuPercent: number; memoryMB: number; memoryLimitMB: number }>> {
    try {
      // Using exactly `docker stats` dynamically for the OS limit arrays
      const { stdout } = await execAsync('docker stats --no-stream --format "{{.Name}}|{{.CPUPerc}}|{{.MemUsage}}"');
      const lines = stdout.split('\n').filter(l => l.trim().length > 0);

      const stats = [];
      for (const line of lines) {
        const [name, cpuStr, memStr] = line.split('|');
        const cpuPercent = parseFloat(cpuStr.replace('%', ''));
        
        const [usedBlock, limitBlock] = memStr.split(' / ');
        
        const parseMem = (s: string) => {
          if (!s) return 0;
          if (s.includes('GiB')) return parseFloat(s) * 1024;
          if (s.includes('MiB')) return parseFloat(s);
          if (s.includes('kB')) return parseFloat(s) / 1024;
          return 0;
        };

        stats.push({
          name: name.trim(),
          cpuPercent,
          memoryMB: parseMem(usedBlock),
          memoryLimitMB: parseMem(limitBlock)
        });
      }

      return stats;
    } catch (e) {
      console.warn('[RESOURCES] Failed to fetch docker bounds:', e);
      return [];
    }
  }

  async analyzeUsage(): Promise<Array<{ container: string; recommendation: string }>> {
    const stats = await this.getContainerStats();
    const recommendations = [];

    for (const stat of stats) {
      const memUsagePerc = stat.memoryLimitMB > 0 ? (stat.memoryMB / stat.memoryLimitMB) : 0;
      
      if (stat.cpuPercent > 90) {
         recommendations.push({ container: stat.name, recommendation: 'Critical CPU starvation. Consider caching aggressive pathways.' });
      }
      if (memUsagePerc > 0.90) {
         recommendations.push({ container: stat.name, recommendation: 'Memory near explicit OOM threshold. Flush caches.' });
      }
      if (stat.cpuPercent < 2 && memUsagePerc > 0.5 && stat.name.includes('localai')) {
         recommendations.push({ container: stat.name, recommendation: 'LocalAI holding dormant tensors. Explicitly free memory if idle securely.' });
      }
    }

    return recommendations;
  }

  async getSystemResources(): Promise<{ totalMemoryMB: number; usedMemoryMB: number; diskUsedPercent: number; cpuCores: number }> {
    try {
      // Portable node-native bounds securely evaluated for the Brain Application Host exclusively
      const os = require('os');
      const totalMemoryMB = os.totalmem() / 1024 / 1024;
      const freeMemoryMB = os.freemem() / 1024 / 1024;
      
      return {
        totalMemoryMB: Math.round(totalMemoryMB),
        usedMemoryMB: Math.round(totalMemoryMB - freeMemoryMB),
        diskUsedPercent: 50, // Hard to natively ping cross-platform df without dependencies, stubbing average
        cpuCores: os.cpus().length
      };
    } catch {
      return { totalMemoryMB: 0, usedMemoryMB: 0, diskUsedPercent: 0, cpuCores: 1 };
    }
  }
}
