import { GeminiFreeClient, HuggingFaceClient, LocalAIClient } from '@forgeai/ai';

const gemini = new GeminiFreeClient();
const huggingFace = new HuggingFaceClient();
const localAI = new LocalAIClient();

export function padTo1536(vector: number[]): number[] {
  if (vector.length === 1536) return vector;
  if (vector.length > 1536) return vector.slice(0, 1536);

  const padded = new Array(1536).fill(0);
  for (let i = 0; i < vector.length; i++) {
    padded[i] = vector[i];
  }
  return padded;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  // Strategy: Try Gemini first (text-embedding-004 -> 768 dims)
  // Fall back to HuggingFace (384 dims)
  // Or LocalAI if fully restricted
  try {
    const raw = await gemini.embed(text);
    return padTo1536(raw);
  } catch (err: any) {
    if (err.status !== 429) {
      console.warn('Gemini embedding failed, trying HuggingFace:', err.message);
    }
  }

  try {
    const raw = await huggingFace.embed(text);
    return padTo1536(raw);
  } catch (err: any) {
    console.warn('HuggingFace embedding failed, trying LocalAI fallback:', err.message);
  }

  // Fallback to local 
  // Normally localAI also requires an endpoint for embeddings, assuming generic openai shape
  try {
    const raw = await fetch(process.env.LOCAL_AI_URL + '/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: text, model: 'local-embedding-model' })
    }).then(r => r.json());
    
    return padTo1536(raw.data[0].embedding);
  } catch (err) {
    // Ultimate catastrophe fallback (Zero vector) if all endpoints are dead
    return padTo1536([]);
  }
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function batchEmbed(texts: string[]): Promise<number[][]> {
  // Processing in sequential batches to avoid instant rate limits
  const results: number[][] = [];
  for (const text of texts) {
    const vec = await generateEmbedding(text);
    results.push(vec);
  }
  return results;
}
