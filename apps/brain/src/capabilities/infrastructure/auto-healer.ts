import { db } from '@forgeai/db';
import { memoryEpisodes } from '@forgeai/db/schema';
import { registry } from '../../adapters/registry';
import type { IAIModelAdapter } from '../../adapters/types';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class AutoHealer {
  
  async investigate(errorPattern: string, recentErrors: any[]): Promise<{ diagnosis: string; proposedFix: any; confidence: number }> {
    const router = registry.getAdapter<IAIModelAdapter>('AI');
    try {
      const stream = await router.generate([
        { role: 'system', content: 'You are an SRE Auto-Healer. Diagnose the root cause of the error pattern and suggest a command-line or internal fix. Return JSON only {"diagnosis": string, "proposedFixCommand": string, "confidence": number}' },
        { role: 'user', content: `Error: ${errorPattern}\nRecent Logs: ${JSON.stringify(recentErrors.slice(0, 5))}` }
      ], { temperature: 0.1 });

      let res = '';
      for await (const chunk of stream) res += chunk;
      
      const parsed = JSON.parse(res.replace(/```json/g, '').replace(/```/g, '').trim());
      return { 
        diagnosis: parsed.diagnosis || 'Unknown structural fault', 
        proposedFix: parsed.proposedFixCommand || null, 
        confidence: parsed.confidence || 0 
      };
    } catch {
      return { diagnosis: 'AI Diagnostics Unavailable', proposedFix: null, confidence: 0 };
    }
  }

  async applyFix(fix: string): Promise<boolean> {
    if (!fix) return false;
    
    // Hard boundary mapping: ONLY ALLOW docker restarts or cache purges natively.
    // DANGEROUS to eval pure AI commands without boundaries.
    const allowedPrefixes = ['docker restart', 'redis-cli flushall', 'npm cache clean'];
    const isAllowed = allowedPrefixes.some(p => fix.startsWith(p));
    
    if (!isAllowed) {
      console.warn(`[AUTO_HEALER] Blocked unauthorized AI repair command: ${fix}`);
      return false;
    }

    try {
      await execAsync(fix);
      return true;
    } catch {
      return false;
    }
  }

  async recordHealing(event: any): Promise<void> {
    console.log(`[AUTO_HEALER] Recording healing event:`, event);
    
    await db.insert(memoryEpisodes).values({
      episodeType: 'infrastructure_heal',
      triggerEvent: event.errorPattern || 'Anomaly detected',
      contextState: event,
      actionTaken: event.fixApplied || 'No safe fix found',
      resolution: event.success ? 'success' : 'failure',
      qualityScore: event.success ? 80 : 20
    });
  }
}
