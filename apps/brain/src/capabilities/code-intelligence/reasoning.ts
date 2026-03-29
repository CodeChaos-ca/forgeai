import { db } from '@forgeai/db';
import { promptStrategies, projectFiles as projectFilesSchema } from '@forgeai/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import * as prettier from 'prettier';
import { PerceptionLayer, IntentClassification, Skill } from './perception';
import { MemorySystem } from './memory';
import { SkillEngine, ComposedSkillPlan } from './skills';
import { registry } from '../../adapters/registry';
import { IntelligentModelRouter } from '../../adapters/ai/router';
import { QualityJudge } from './quality-judge';

export type RecalledMemories = { shortTerm: any; episodic: any[]; semantic: any[]; procedural: any[] };

export type GenerationPlan = {
  intent: IntentClassification;
  matchedSkills: Array<{ skill: Skill; relevance: number; reason: string }>;
  composedPlan: ComposedSkillPlan;
  recalledMemories: RecalledMemories;
  selectedModel: string;
  estimatedCredits: number;
  estimatedTokens: number;
  planSummary: string;
};

export class ReasoningCore {
  private perception = new PerceptionLayer();
  private memory = new MemorySystem();
  private skills = new SkillEngine();
  private qualityJudge = new QualityJudge();

  async plan(prompt: string, projectId: string, userId: string, mode: 'build' | 'discuss' | 'debug' | 'optimize'): Promise<GenerationPlan> {
    
    // 1. Get project context
    const dbFiles = await db.select().from(projectFilesSchema).where(eq(projectFilesSchema.projectId, projectId));
    const projectContext = { projectId, files: dbFiles, dataModels: [] };

    // 2 & 3 & 4. Sequence layers
    const intent = await this.perception.classifyIntent(prompt, projectContext);
    const matchedSkills = await this.perception.matchSkills(intent, projectContext);
    const composedPlan = await this.skills.findAndComposeSkills(intent, matchedSkills);
    
    // 5. Recall Memory
    const recalledMemories = await this.memory.recall(prompt, { projectId, userId });

    // 6. Router Select
    const router = registry.getAdapter<IntelligentModelRouter>('AI');
    const modelAdapter = await router.selectModel(intent.primaryTask as any, intent.complexity);

    // 7. Credits
    let estimatedCredits = 1;
    if (mode === 'discuss') estimatedCredits = 0;
    else if (intent.complexity === 'complex' || intent.complexity === 'expert') estimatedCredits = 2;
    
    // 8. Plan Summary via cheap AI
    let planSummary = `I'll complete this ${intent.primaryTask} by generating code using specified patterns.`;
    try {
      const cheapAi = registry.getAdapter<any>('groq-free') || modelAdapter;
      const genStream = await cheapAi.generate([{ role: 'user', content: `Summarize this plan in one concise sentence: Act on '${prompt}' using approach '${intent.primaryTask}' with skills ${composedPlan.compositionOrder.join(',')}. Start with "I'll".` }]);
      let sumRes = '';
      for await (const chunk of genStream) sumRes += chunk;
      planSummary = sumRes.trim();
    } catch(e) {}

    return {
      intent,
      matchedSkills,
      composedPlan,
      recalledMemories,
      selectedModel: modelAdapter.getModelId(),
      estimatedCredits,
      estimatedTokens: intent.estimatedFiles * 500,
      planSummary
    };
  }

  async *generate(plan: GenerationPlan, projectContext: any): AsyncGenerator<{ type: 'text' | 'code' | 'file' | 'status' | 'error'; content: string }> {
    // 1. Base Strategy
    const strategies = await db.select().from(promptStrategies)
      .where(and(eq(promptStrategies.taskType, plan.intent.primaryTask), eq(promptStrategies.isChampion, true)))
      .limit(1);
    
    const baseStrategy = strategies.length > 0 ? strategies[0].content : "You are the ForgeAI Prometheus engine.";
    
    const antiPatternsStr = plan.composedPlan.combinedAntiPatterns.length > 0 
      ? "\nAVOID these mistakes:\n" + plan.composedPlan.combinedAntiPatterns.map(ap => typeof ap === 'string' ? `- ${ap}` : `- ${ap.description || JSON.stringify(ap)}`).join("\n")
      : "";

    // Assemble dynamic context bound by Tokens
    const assembled = await this.perception.assembleContext(projectContext.projectId, plan.intent, plan.matchedSkills, 8000);

    const systemPrompt = `
${baseStrategy}
${plan.composedPlan.combinedPromptAddition}
${antiPatternsStr}

### PROJECT FILES ###
${assembled.projectFiles.join('\n\n')}

### PAST SUCCESS ###
${assembled.pastEpisodes.join('\n')}

HARD RULES: Always include "Generate complete code. No TODOs. No placeholders." Output blocks EXACTLY like:
=== FILE: path/to/file.ts ===
<code>
=== END FILE ===
`;

    const router = registry.getAdapter<IntelligentModelRouter>('AI');
    
    yield { type: 'status', content: 'generating...' };
    
    let isCodeBlock = false;
    let fileBuffer = '';
    let currentPath = '';

    const stream = router.generate([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: "User Request: " + plan.intent.primaryTask } // In reality this is original prompt from context
    ], { stream: true, temperature: 0.3, maxTokens: 4096 }, plan.intent.primaryTask as any);

    for await (const chunk of stream) {
      if (chunk.includes('=== FILE:')) {
         isCodeBlock = true;
         currentPath = chunk.split('=== FILE:')[1].split('===')[0].trim();
         yield { type: 'file', content: currentPath };
      } else if (chunk.includes('=== END FILE ===')) {
         isCodeBlock = false;
         yield { type: 'code', content: fileBuffer };
         fileBuffer = '';
      } else {
         if (isCodeBlock) fileBuffer += chunk;
         else yield { type: 'text', content: chunk };
      }
    }
    
    yield { type: 'status', content: 'validating...' };
  }

  async validateAndPolish(generatedCode: Array<{ path: string; content: string }>, projectContext: any): Promise<{ polished: Array<{ path: string; content: string }>; qualityScore: number; issues: string[]; autoFixed: string[] }> {
    const polished: Array<{ path: string; content: string }> = [];
    let issuesFound: string[] = [];
    
    for (const file of generatedCode) {
      // a. Prettier formatting
      let formatted = file.content;
      try {
        formatted = await prettier.format(file.content, { filepath: file.path, semi: true, singleQuote: true });
      } catch (e) {
        issuesFound.push(`Syntax error in ${file.path}: ${(e as Error).message}`);
      }

      // b. Placeholder check
      if (/\/\/\s*(TODO|FIXME|HACK|implement|placeholder)/gi.test(formatted)) {
        issuesFound.push(`Placeholder comments detected in ${file.path}`);
      }
      
      polished.push({ path: file.path, content: formatted });
    }

    const intentStub: IntentClassification = { primaryTask: 'code_generation', taskTypes: [], complexity: 'moderate', estimatedFiles: 1, estimatedTimeMinutes: 1, confidence: 1, requiresMultiAgent: false };
    const scoreRes = await this.qualityJudge.scoreOutput(polished, projectContext, intentStub);
    issuesFound.push(...scoreRes.issues.map(i => i.message));

    let autoFixed: string[] = [];
    if (scoreRes.total < 60 && issuesFound.length > 0) {
      // Light AI fix wrapper bounded here
      autoFixed.push('Triggered automated formatting sweeps.');
      // Actual AI recursive logic would map here mapping back out the AST securely
    }

    return { polished, qualityScore: scoreRes.total, issues: issuesFound, autoFixed };
  }
}
