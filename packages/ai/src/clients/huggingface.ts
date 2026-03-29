const HF_TOKEN = process.env.HF_TOKEN || '';

async function retryWithBackoff<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let latestError: any;
  for (let i = 0; i < attempts; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const res = await Promise.race([
        fn(),
        new Promise((_, reject) => {
          controller.signal.addEventListener('abort', () => reject(new Error('AI Request Timeout')));
        })
      ]);
      
      clearTimeout(timeoutId);
      return res as T;
    } catch (err: any) {
      latestError = err;
      if (err.message === 'AI Request Timeout' || err.status === 429 || err.status === 503) {
        // Models on HF might be loading (503). Backoff longer.
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 2000));
        continue;
      }
      throw err;
    }
  }
  throw latestError;
}

export class HuggingFaceClient {
  public maxSequenceLength = 512;

  // We primarily use HF for free open-source 384d or 768d embeddings when absolutely necessary 
  // though we prefer Gemini's text-embedding-004
  async embed(text: string): Promise<number[]> {
    return retryWithBackoff(async () => {
      const res = await fetch('https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: text })
      });

      if (!res.ok) {
        const errbody = await res.text();
        throw Object.assign(new Error(`HuggingFace error: ${errbody}`), { status: res.status });
      }

      const result = await res.json();
      return result as number[];
    });
  }
}
