import { db } from '@forgeai/db';
import { skills } from '@forgeai/db/schema';
import { registry } from '../../adapters/registry';
import type { IAIModelAdapter, ISearchAdapter } from '../../adapters/types';
import { generateEmbedding } from '../../utils/embeddings';
import { QualityJudge } from '../code-intelligence/quality-judge';

export type LearningQueueItem = {
  id: string;
  conceptName: string;
  sourceContext?: any;
};

export class SkillAcquisition {
  private qualityJudge = new QualityJudge();

  async acquireSkill(queueItem: LearningQueueItem): Promise<{ success: boolean; skillId?: string; reason?: string }> {
    const ai = registry.getAdapter<IAIModelAdapter>('AI');
    const search = registry.getAdapter<ISearchAdapter>('Search');

    // 1. RESEARCH
    // Fetch related semantic docs
    let researchStr = '';
    try {
      const docs = await search.search('knowledge_base', queueItem.conceptName, { limit: 3 });
      researchStr = docs.map(d => JSON.stringify(d.document)).join('\n');
    } catch {}

    // 2. LEARN
    let promptStrategy = '';
    let codePatterns: any[] = [];
    let antiPatterns: any[] = [];
    
    try {
      const stream = await ai.generate([
         { role: 'system', content: 'You are an advanced Skill Synthesizer. Output JSON strictly {"promptStrategy": string, "codePatterns": [string], "antiPatterns": [{"description": string}]}. Generate the comprehensive instruction manual for this coding concept.' },
         { role: 'user', content: `Concept: ${queueItem.conceptName}\nContext: ${JSON.stringify(queueItem.sourceContext)}\nResearch: ${researchStr}` }
      ], { temperature: 0.2, maxTokens: 2000 });
      
      let res = '';
      for await (const chunk of stream) res += chunk;
      const parsed = JSON.parse(res.replace(/```json/g, '').replace(/```/g, '').trim());
      
      promptStrategy = parsed.promptStrategy;
      codePatterns = parsed.codePatterns || [];
      antiPatterns = parsed.antiPatterns || [];
    } catch {
      return { success: false, reason: 'AI Synthesizer Fallback Error.' };
    }

    // 3. TEST
    try {
      const testCodeStream = await ai.generate([
         { role: 'system', content: `Write a minimal, complete TypeScript file demonstrating this skill accurately. ONLY output code exactly as written mapping standard boundaries.` },
         { role: 'user', content: `Skill Strategy: ${promptStrategy}` }
      ]);
      
      let testCode = '';
      for await (const chunk of testCodeStream) testCode += chunk;
      
      const intentStub = { primaryTask: 'skill_test', taskTypes: [], complexity: 'simple', estimatedFiles: 1, estimatedTimeMinutes: 1, confidence: 1, requiresMultiAgent: false } as any;
      const score = await this.qualityJudge.scoreOutput([{ path: 'test_demo.ts', content: testCode }], {}, intentStub);

      if (score.total < 60) {
         return { success: false, reason: `Generated pattern failed Quality Test (Score: ${score.total})` };
      }
    } catch {
       return { success: false, reason: 'Test execution fallback securely skipped due to bounds execution native exception.' };
    }

    // 4. REGISTER
    const embedArr = await generateEmbedding(queueItem.conceptName + ' ' + promptStrategy);
    const [inserted] = await db.insert(skills).values({
       name: `Skill_${queueItem.conceptName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}`,
       category: 'learned_acquired',
       description: `Autonomously learned: ${queueItem.conceptName.substring(0, 100)}`,
       promptStrategy,
       codePatterns,
       antiPatterns,
       embedding: embedArr,
       avgQualityScore: 70
    }).returning({ id: skills.id });

    return { success: true, skillId: inserted.id };
  }
}
