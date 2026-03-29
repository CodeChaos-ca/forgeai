import * as prettier from 'prettier';
import { registry } from '../../adapters/registry';
import type { IAIModelAdapter } from '../../adapters/types';
import { IntentClassification } from './perception';
import { diffLines } from 'diff';

export type GenerationResponse = {
  files: Array<{ path: string; content: string }>;
  tests: Array<{ path: string; content: string }>;
  summary: string;
  diff: Array<{ path: string; diff: string; linesAdded: number; linesRemoved: number }>;
  qualityScore: number;
  skillsUsed: string[];
  episodeId?: string;
};

export class OutputGenerator {
  
  async formatCode(files: Array<{ path: string; content: string }>): Promise<Array<{ path: string; content: string }>> {
    const formatted = [];
    for (const f of files) {
      try {
        const content = await prettier.format(f.content, { filepath: f.path, semi: true, singleQuote: true });
        formatted.push({ path: f.path, content });
      } catch (e) {
        formatted.push(f); // Push unformatted if Prettier faults natively
      }
    }
    return formatted;
  }

  async generateTests(files: Array<{ path: string; content: string }>, context: any): Promise<Array<{ path: string; content: string }>> {
    const ai = registry.getAdapter<IAIModelAdapter>('AI');
    const tests = [];

    for (const f of files) {
      if (f.path.includes('.test.') || f.path.includes('.spec.')) continue;
      
      const testPath = f.path.replace(/\.(ts|tsx|js|jsx)$/, '.test.$1');
      if (testPath === f.path) continue; // Safety bounds

      try {
        const stream = await ai.generate([
          { role: 'system', content: 'You are a test engineer. Generate Vitest unit tests for the provided code. Output ONLY code without markdown blocks.' },
          { role: 'user', content: `Generate tests for: \n${f.content}` }
        ]);

        let testContent = '';
        for await (const chunk of stream) testContent += chunk;

        tests.push({ path: testPath, content: testContent });
      } catch (e) {
        console.warn(`[OUTPUT_GEN] Failed to generate tests for ${f.path}`);
      }
    }
    return tests;
  }

  async generateSummary(files: Array<{ path: string; content: string }>, intent: IntentClassification): Promise<string> {
    const ai = registry.getAdapter<IAIModelAdapter>('AI');
    try {
      const stream = await ai.generate([
        { role: 'system', content: 'Generate a human-readable high-level 2 sentence summary of what this code changes.' },
        { role: 'user', content: `Intent: ${intent.primaryTask}. Files changed: ${files.map(f => f.path).join(', ')}` }
      ], { temperature: 0.1, maxTokens: 100 });
      
      let res = '';
      for await (const chunk of stream) res += chunk;
      return res;
    } catch {
      return `Processed ${files.length} files successfully.`;
    }
  }

  generateDiff(originalFiles: Array<{ path: string; content: string }>, newFiles: Array<{ path: string; content: string }>): Array<{ path: string; diff: string; linesAdded: number; linesRemoved: number }> {
    const diffs = [];
    
    for (const newFile of newFiles) {
      const orig = originalFiles.find(f => f.path === newFile.path)?.content || '';
      const changes = diffLines(orig, newFile.content);
      
      let diffStr = '';
      let added = 0;
      let removed = 0;

      changes.forEach(part => {
        const prefix = part.added ? '+' : part.removed ? '-' : ' ';
        if (part.added) added += part.count || 0;
        if (part.removed) removed += part.count || 0;
        
        diffStr += part.value.split('\n').map(line => line ? `${prefix} ${line}` : '').join('\n') + '\n';
      });

      diffs.push({ path: newFile.path, diff: diffStr, linesAdded: added, linesRemoved: removed });
    }

    return diffs;
  }

  packageResponse(files: any[], tests: any[], summary: string, diff: any[], qualityScore: number, skillsUsed: string[], episodeId?: string): GenerationResponse {
    return { files, tests, summary, diff, qualityScore, skillsUsed, episodeId };
  }
}
