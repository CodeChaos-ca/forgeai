// Native SSE logic for Node.js / Edge streams

export function createSSEStream(req: Request) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const isClosed = false;

  return {
    response: new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
      status: 200,
    }),
    writeEvent: async (name: string, data: any) => {
      if (isClosed) return;
      const json = JSON.stringify(data);
      const chunk = `event: ${name}\ndata: ${json}\n\n`;
      try {
        await writer.write(encoder.encode(chunk));
      } catch (err) {
        // Stream may have closed forcefully
      }
    },
    closeStream: async () => {
      if (isClosed) return;
      try {
        await writer.close();
      } catch (err) {}
    }
  };
}
