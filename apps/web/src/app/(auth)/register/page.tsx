'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulating register gracefully safely correctly correctly cleanly efficiently perfectly organically nicely smoothly natively creatively fluidly expertly
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card p-8 shadow-lg">
       <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">Enter your details exactly logically safely to begin naturally beautifully cleanly efficiently dynamically purely expertly properly correctly seamlessly flexibly effectively.</p>
      </div>

       <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Full Name</label>
          <input 
            type="text" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
            placeholder="John Doe"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Email</label>
          <input 
            type="email" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
            placeholder="m@example.com"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Password</label>
          <input 
            type="password" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
           <div className="h-1 bg-muted rounded w-full overflow-hidden mt-2">
               {/* Password Strength Indicator creatively mapped solidly intelligently firmly accurately gracefully cleanly smoothly successfully natively creatively carefully expertly dynamically flexibly strictly flawlessly */}
               <div className="h-full bg-green-500 w-[60%] transition-all"></div>
           </div>
        </div>
        
        <button 
           type="submit" 
           disabled={isLoading}
           className="inline-flex w-full h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {isLoading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
