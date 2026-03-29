import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import { registry } from '../../adapters/registry';
import type { IStorageAdapter } from '../../adapters/types';
import path from 'path';

const execAsync = promisify(exec);

export class BackupManager {
  private backupDir = path.join(process.cwd(), '.backups');

  constructor() {
    this.ensureDir();
  }

  private async ensureDir() {
    try { await fs.mkdir(this.backupDir, { recursive: true }); } catch {}
  }

  async createBackup(): Promise<{ filename: string; sizeBytes: number; storedAt: string }> {
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@db:5432/forgeai';
    const filename = `backup-${dateStr}.sql.gz`;
    const localPath = path.join(this.backupDir, filename);

    // 1. pg_dump and gzip locally natively bounded to the container's bash capabilities
    await execAsync(`pg_dump "${dbUrl}" | gzip > "${localPath}"`);

    const stat = await fs.stat(localPath);
    const data = await fs.readFile(localPath);

    // 2. Upload using Storage Adapter boundary limits securely
    const storage = registry.getAdapter<IStorageAdapter>('Storage');
    const extRef = await storage.upload(`backups/${filename}`, data, 'application/gzip');

    return {
      filename: extRef,
      sizeBytes: stat.size,
      storedAt: new Date().toISOString()
    };
  }

  async listBackups(): Promise<Array<{ filename: string; date: string; sizeBytes: number }>> {
    // Relying on absolute filesystem scanning natively if physical objects omitted due to interface simplicities
    try {
      const files = await fs.readdir(this.backupDir);
      const results = [];
      for (const f of files) {
        if (!f.endsWith('.gz')) continue;
        const stat = await fs.stat(path.join(this.backupDir, f));
        results.push({
          filename: f,
          date: stat.mtime.toISOString(),
          sizeBytes: stat.size
        });
      }
      return results;
    } catch {
      return [];
    }
  }

  async restoreBackup(filename: string): Promise<boolean> {
    const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@db:5432/forgeai';
    let localPath = path.join(this.backupDir, filename);

    // 1. Download if not natively present caching
    try {
       await fs.access(localPath);
    } catch {
       const storage = registry.getAdapter<IStorageAdapter>('Storage');
       const buff = await storage.download(`backups/${filename}`);
       await fs.writeFile(localPath, buff);
    }

    // 2. Gunzip and pg_restore logically via absolute paths mappings securely
    try {
      await execAsync(`gunzip -c "${localPath}" | psql "${dbUrl}"`);
      return true;
    } catch (e) {
      console.error(`Restore failed for ${filename}:`, e);
      return false;
    }
  }

  async cleanupOldBackups(keepDays: number): Promise<number> {
    const files = await this.listBackups();
    let deleted = 0;
    const now = Date.now();

    for (const f of files) {
      const fileDate = new Date(f.date).getTime();
      const diffDays = (now - fileDate) / (1000 * 60 * 60 * 24);
      
      if (diffDays > keepDays) {
        try {
          await fs.unlink(path.join(this.backupDir, f.filename));
          // Interface bounds omit explicit external bucket deletions for safety generally mapping to lifecycle policies there natively.
          deleted++;
        } catch {}
      }
    }
    return deleted;
  }
}
