import { encoding_for_model, TiktokenModel } from 'tiktoken';
import { AIMessage } from './clients/gemini-free';

export function countTokens(text: string, modelType: string = 'gpt-3.5-turbo'): number {
  try {
    // We use OpenAI's tiktoken for standard baseline token counts.
    // Llama and Gemini tokenizers differ slightly, but cl100k_base provides a ~90% accurate baseline generic scale.
    const enc = encoding_for_model(modelType as TiktokenModel);
    const count = enc.encode(text).length;
    enc.free();
    return count;
  } catch {
    // Universal approximate fallback if standard tokenizer mapping fails
    return Math.ceil(text.length / 4);
  }
}

export function estimateTokens(messages: AIMessage[]): number {
  let acc = 0;
  for (const m of messages) {
    acc += countTokens(m.content);
    acc += 4; // Padding for role/message framing
  }
  return acc + 3; // base padding for interaction
}

export function getMaxContextWindow(modelId: string): number {
  switch (modelId) {
    case 'gemini-1.5-flash': return 1000000;
    case 'llama3-70b-8192': return 8192;
    default: return 4096;
  }
}

export function truncateToFit(text: string, maxTokens: number): string {
  const textTokens = countTokens(text);
  if (textTokens <= maxTokens) return text;

  // Rapid fast generic truncation if it exceeds (approximated character reduction safely bounds it down)
  const exactLengthTarget = Math.floor(text.length * (maxTokens / textTokens));
  return text.slice(0, exactLengthTarget) + '...[TRUNCATED BY ENGINE]';
}
