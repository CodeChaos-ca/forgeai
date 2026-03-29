import prettier from 'prettier';
import { testGenerationPrompt, IntelligentModelRouter } from '@forgeai/ai';

const aiRouter = new IntelligentModelRouter();

export async function outputFormatter(rawCode: string): Promise<string> {
  // Strip Markdown bounds if the AI returned them improperly despite system instructions
  let cleaned = rawCode;
  
  const mdMatch = cleaned.match(/```[a-z]*\n([\s\S]*?)```/);
  if (mdMatch) {
    cleaned = mdMatch[1];
  }

  // Prettier standard formatting enforce
  try {
    const formatted = await prettier.format(cleaned, {
      parser: 'typescript',
      singleQuote: true,
      trailingComma: 'es5',
      printWidth: 100
    });
    return formatted;
  } catch (err: any) {
    console.warn('[OUTPUT GENERATOR] Prettier parse failed, outputting raw code. Error:', err.message);
    return cleaned; // Failsafe
  }
}

export async function generateVitestTests(fileName: string, sourceCode: string) {
  const prompt = testGenerationPrompt(fileName, sourceCode, 'Vitest');
  
  // Call AI independently for tests
  const { stream } = await aiRouter.dynamicExecute('code', [
    { role: 'system', content: 'Generate expert test files exactly as requested.' },
    { role: 'user', content: prompt }
  ], { temperature: 0.2 }, 5000);

  let output = '';
  for await (const chunk of stream) {
    if (chunk.choices && chunk.choices[0]?.delta?.content) {
      output += chunk.choices[0].delta.content;
    } else if (typeof chunk.text === 'function') {
      output += chunk.text();
    }
  }

  return await outputFormatter(output);
}
