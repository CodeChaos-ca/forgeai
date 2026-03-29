import { IntelligentModelRouter, testGenerationPrompt, codeGenerationPrompt, buildSystemPrompt } from '@forgeai/ai';
import { PerceptionLayer } from './perception';
import { MemorySystem } from './memory';
import { SkillEngine } from './skills';
import { QualityJudge } from './quality-judge';
import { outputFormatter } from './output-generator';

const router = new IntelligentModelRouter();
const perception = new PerceptionLayer();
const memory = new MemorySystem();
const skillEngine = new SkillEngine();
const judge = new QualityJudge();

export class ReasoningCore {
  
  async plan(prompt: string, projectId: string) {
    const intent = await perception.classifyIntent(prompt, "Project Config Metadata");
    const matchedSkills = await perception.matchSkills(intent, "");
    
    // Estimate cost/model tracking dynamically based on constraints
    const contextSizeEstimation = 5000;
    const selection = await router.selectModel(intent.taskTypes[0] as any || 'code', contextSizeEstimation);

    return {
      intent,
      skills: matchedSkills,
      modelAssigned: selection.providerId,
      estimatedCost: 0
    };
  }

  async *generate(plan: any, prompt: string) {
    // Synthesize final massive system payload via prompt architecture
    const sysPrompt = buildSystemPrompt(
      "Project specific layout definitions",
      plan.skills.map((s: any) => s.promptStrategy),
      plan.skills.map((s: any) => s.antiPatterns).flat().filter(Boolean),
      ['Ensure absolute Zero Placeholders.']
    );

    const messages: any[] = [
      { role: 'system', content: sysPrompt },
      { role: 'user', content: codeGenerationPrompt('unknown.ts', prompt) }
    ];

    const { stream } = await router.dynamicExecute('code', messages, { temperature: 0.5 }, 5000);

    for await (const chunk of stream) {
      if (chunk.choices && chunk.choices[0]?.delta?.content) {
        yield chunk.choices[0].delta.content;
      } else if (typeof chunk.text === 'function') { // Gemini syntax wrapper fallback logic
        yield chunk.text();
      }
    }
  }

  async validateAndPolish(code: string, contextState: any) {
    // Static code validation phase
    const evaluation = await judge.scoreOutput(code, contextState, 'code-mutation');

    if (evaluation.total < 60) {
      // Regenerate immediately if baseline logic scores fail hard
      console.warn('CRITICAL: Code scored poorly on validation.', evaluation.breakdown);
      return { action: 'regenerate', issues: evaluation.issues };
    }

    // Auto format
    const polishedCode = await outputFormatter(code);
    return { action: 'success', code: polishedCode, score: evaluation.total };
  }
}
