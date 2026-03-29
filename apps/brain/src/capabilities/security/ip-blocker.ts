import { registry } from '../../adapters/registry';
import { ICacheAdapter } from '../../adapters/types';

export class IPBlocker {
  
  async checkAndBlock(ip: string, action: string): Promise<boolean> {
    const cache = registry.getAdapter<ICacheAdapter>('Cache');
    
    const isAlreadyBlocked = await this.isBlocked(ip);
    if (isAlreadyBlocked) return true;

    if (action === 'auth_fail') {
      const attempts = await cache.increment(`auth_fail:${ip}`, 1);
      if (attempts === 1) await cache.set(`auth_fail:${ip}`, 1, 3600); // 1hr TTL initially dynamically
      
      if (attempts > 100) {
        await cache.set(`blocklist:${ip}`, 'banned', 86400); // 24hr TTL bounds natively
        return true;
      }
    }
    return false;
  }

  async isBlocked(ip: string): Promise<boolean> {
    const cache = registry.getAdapter<ICacheAdapter>('Cache');
    const flag = await cache.get<string>(`blocklist:${ip}`);
    return !!flag;
  }

  async unblock(ip: string): Promise<void> {
    const cache = registry.getAdapter<ICacheAdapter>('Cache');
    await cache.delete(`blocklist:${ip}`);
    await cache.delete(`auth_fail:${ip}`);
  }
}
