import { IntelligentModelRouter } from '@forgeai/ai';

const router = new IntelligentModelRouter();

// Fallback logic for pure zero-cost embeddings mapping pad conditions for pgvector 1536 limit.
function padTo1536(vector: number[]): number[] {
  if (vector.length >= 1536) return vector.slice(0, 1536);
  const padded = new Array(1536).fill(0);
  for (let i = 0; i < vector.length; i++) {
    padded[i] = vector[i];
  }
  return padded;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const rawEmbedding = await router.generateEmbedding(text);
    return padTo1536(rawEmbedding);
  } catch (err: any) {
    console.error(`[EMBEDDING] Vector generation failed routing layer: ${err.message}. Retrying LocalAI...`);
    // Absolute fallback: manual direct localai invocation if router crashes entirely.
    const res = await fetch('http://localai:8080/v1/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: text, model: 'all-MiniLM-L6-v2' })
    });
    if (!res.ok) throw new Error('LocalAI catastrophic failure.');
    const embedData = await res.json();
    return padTo1536(embedData.data[0].embedding);
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new Error('Vector dimension mismatch');
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function batchEmbed(texts: string[], batchSize = 10): Promise<number[][]> {
  const results: number[][] = [];
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const promises = batch.map(t => generateEmbedding(t));
    const solved = await Promise.all(promises);
    results.push(...solved);
  }
  return results;
}
