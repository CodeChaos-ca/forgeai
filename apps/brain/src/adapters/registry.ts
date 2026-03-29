export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private adapters: Map<string, {
    primary: any;
    fallbacks: any[];
    active: any;
    healthStatus: 'healthy' | 'degraded' | 'down';
  }> = new Map();

  private constructor() {}

  public static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  public register(interfaceName: string, primary: any, fallbacks: any[]): void {
    this.adapters.set(interfaceName, {
      primary,
      fallbacks,
      active: primary,
      healthStatus: 'healthy'
    });
    console.log(`[REGISTRY] Registered ${interfaceName} with primary ${primary.constructor.name} and ${fallbacks.length} fallbacks.`);
  }

  public getAdapter<T>(interfaceName: string): T {
    const registryEntry = this.adapters.get(interfaceName);
    if (!registryEntry) throw new Error(`Adapter ${interfaceName} not found.`);
    return registryEntry.active as T;
  }

  public switchAdapter(interfaceName: string, index: number): void {
    const entry = this.adapters.get(interfaceName);
    if (!entry) throw new Error(`Adapter ${interfaceName} not found.`);
    
    // Index -1 means primary
    if (index === -1) {
      entry.active = entry.primary;
    } else {
      if (index >= entry.fallbacks.length) throw new Error(`Fallback index ${index} out of bounds for ${interfaceName}`);
      entry.active = entry.fallbacks[index];
    }
    
    console.log(`[REGISTRY WARNING] Forced manual hot-swap for ${interfaceName} to ${entry.active.constructor.name}`);
  }

  public async autoFailover(interfaceName: string): Promise<boolean> {
    const entry = this.adapters.get(interfaceName);
    if (!entry) return false;

    // Scan fallbacks for availability
    for (const fallback of entry.fallbacks) {
      try {
        // If a health ping exists, test it
        if (typeof fallback.healthCheck === 'function') {
          await fallback.healthCheck();
        }
        entry.active = fallback;
        entry.healthStatus = 'degraded';
        console.warn(`[REGISTRY ALERT] Auto-Failover triggered for ${interfaceName}. Now using ${fallback.constructor.name}`);
        return true;
      } catch (e) {
        continue;
      }
    }
    
    entry.healthStatus = 'down';
    console.error(`[REGISTRY CRITICAL] Complete failure of ${interfaceName} module. No healthy fallbacks remain.`);
    return false;
  }

  public async healthCheckAll(): Promise<Record<string, { healthy: boolean; active: string }>> {
    const report: Record<string, { healthy: boolean; active: string }> = {};

    for (const [name, entry] of this.adapters.entries()) {
      let isHealthy = true;
      try {
        if (typeof entry.active.healthCheck === 'function') {
          await entry.active.healthCheck();
        }
      } catch (error) {
        isHealthy = false;
        await this.autoFailover(name);
      }
      report[name] = { healthy: isHealthy, active: entry.active.constructor.name };
    }
    return report;
  }

  public getStatus(): Record<string, { active: string; health: string }> {
    const res: Record<string, any> = {};
    for (const [name, entry] of this.adapters.entries()) {
      res[name] = { active: entry.active.constructor.name, health: entry.healthStatus };
    }
    return res;
  }
}

export const registry = ServiceRegistry.getInstance();
