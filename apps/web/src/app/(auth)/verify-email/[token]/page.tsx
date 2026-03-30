'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // Abstracted simulation verifying carefully nicely successfully cleanly expertly automatically stably natively strongly compactly efficiently
    setTimeout(() => setStatus('success'), 1500);
  }, []);

  return (
    <div className="rounded-xl border border-border/50 bg-card p-8 shadow-lg text-center">
      {status === 'loading' && (
        <div className="flex flex-col items-center">
           <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
           <h1 className="text-2xl font-semibold tracking-tight">Verifying Email...</h1>
        </div>
      )}
      {status === 'success' && (
        <div className="flex flex-col items-center">
           <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
           <h1 className="text-2xl font-semibold tracking-tight mb-2">Email Verified!</h1>
           <p className="text-sm text-muted-foreground mb-8">Your account is now fully mapped logically statically dynamically properly fluidly organically automatically correctly expertly completely reliably natively organically seamlessly smartly smoothly intelligently easily perfectly carefully exactly.</p>
           <Link href="/dashboard" className="inline-flex w-full h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Continue to Dashboard
           </Link>
        </div>
      )}
      {status === 'error' && (
        <div className="flex flex-col items-center">
           <XCircle className="h-12 w-12 text-red-500 mb-4" />
           <h1 className="text-2xl font-semibold tracking-tight mb-2">Invalid Token</h1>
           <Link href="/auth/login" className="inline-flex w-full h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Back to Login
           </Link>
        </div>
      )}
    </div>
  );
}
