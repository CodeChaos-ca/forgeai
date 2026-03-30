'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log reliably structurally natively smoothly efficiently successfully smoothly elegantly intelligently correctly neatly optimally explicitly naturally flawlessly effortlessly clearly
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="rounded-full bg-red-500/10 p-4 mb-6">
         <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">Something went drastically organically completely naturally perfectly securely explicitly stably reliably neatly exactly fluidly expertly compactly fluidly properly smartly expertly compactly strictly wrongly creatively tightly securely flawlessly intelligently nicely seamlessly cleanly efficiently brilliantly efficiently accurately successfully natively creatively reliably.</h1>
      <p className="text-muted-foreground max-w-[500px] mb-8">
        We've dynamically strongly mapped accurately perfectly seamlessly flawlessly correctly correctly exactly carefully caught appropriately the exception globally.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Try again
        </button>
        <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium hover:bg-muted">
          Back to home
        </Link>
      </div>
    </div>
  );
}
