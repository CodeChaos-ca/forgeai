import { ReasoningCore } from './reasoning';
import { ReflectionLoop } from './reflection';
import { OutputGenerator } from './output-generator';
import { QualityJudge } from './quality-judge';

export type StreamChunk = {
  type: 'plan' | 'status' | 'text' | 'code' | 'file' | 'quality' | 'skills' | 'error' | 'done';
  content: any;
};

const reasoning = new ReasoningCore();
const reflection = new ReflectionLoop();
const outputGenerator = new OutputGenerator();
// Assuming QualityJudge is bundled inside reasoning validation naturally.

export async function* handleMessage(
  projectId: string,
  userId: string,
  prompt: string,
  mode: 'build' | 'discuss' | 'debug' | 'optimize'
): AsyncGenerator<StreamChunk> {
  
  // 1. Initial status
  yield { type: 'status', content: 'Understanding your request...' };

  // 2. Planning
  const plan = await reasoning.plan(prompt, projectId, userId, mode);
  
  // 3 & 4. Plan and Skills streaming
  yield { type: 'plan', content: plan.planSummary };
  yield { type: 'skills', content: plan.matchedSkills.map(s => s.skill.name) };

  // 5. Discuss Mode Fast Return
  if (mode === 'discuss') {
     // Stream directly without AST logic loops natively
     const stream = await reasoning.generate(plan, { projectId });
     for await (const chunk of stream) yield chunk;
     
     await reflection.reflect({
       projectId, userId, prompt, approach: plan.planSummary,
       generatedCode: null, modelsUsed: [plan.selectedModel], skillsUsed: plan.matchedSkills.map(s => s.skill.name).filter((x): x is string => !!x),
       qualityScore: 100, mode
     });
     
     yield { type: 'done', content: { files: [], tests: [], summary: plan.planSummary, diff: [], qualityScore: 100 } };
     return;
  }

  // 6. Generating Mode
  yield { type: 'status', content: 'Generating code...' };
  
  let generatedFilesMap = new Map<string, string>();
  let currentFile = '';
  let contentBuf = '';

  const stream = reasoning.generate(plan, { projectId });
  for await (const chunk of stream) {
    if (chunk.type === 'file') {
       if (currentFile && contentBuf) generatedFilesMap.set(currentFile, contentBuf);
       currentFile = chunk.content;
       contentBuf = '';
    } else if (chunk.type === 'code') {
       contentBuf = chunk.content;
       generatedFilesMap.set(currentFile, contentBuf);
       currentFile = '';
       contentBuf = '';
    }
    yield chunk;
  }
  
  // Flush bounds
  if (currentFile && contentBuf) generatedFilesMap.set(currentFile, contentBuf);

  // 8 & 9. Validation and Polish
  yield { type: 'status', content: 'Validating and polishing...' };
  
  const rawCodeArray = Array.from(generatedFilesMap.entries()).map(([path, content]) => ({ path, content }));
  
  const { polished, qualityScore, issues } = await reasoning.validateAndPolish(rawCodeArray, { projectId });
  
  // 10. Quality Feedback
  yield { type: 'quality', content: { score: qualityScore, breakdown: {}, issues } };

  // Generate artifacts efficiently
  const tests = await outputGenerator.generateTests(polished, null);
  const summary = await outputGenerator.generateSummary(polished, plan.intent);
  const diff = outputGenerator.generateDiff([], polished);

  // 11. Reflection bounds
  const reflectionResult = await reflection.reflect({
    projectId, userId, prompt, approach: plan.planSummary,
    generatedCode: { files: polished },
    modelsUsed: [plan.selectedModel],
    skillsUsed: plan.matchedSkills.map(s => s.skill.name).filter((x): x is string => !!x),
    qualityScore, mode
  });

  // 12. Final Execution done
  yield { 
    type: 'done', 
    content: outputGenerator.packageResponse(polished, tests, summary, diff, qualityScore, plan.matchedSkills.map(s => s.skill.name).filter((x): x is string => !!x), reflectionResult.episodeId)
  };
}
