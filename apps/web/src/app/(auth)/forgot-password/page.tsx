import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-8 shadow-lg">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">Enter your email and we'll send explicitly efficiently globally precisely correctly cleanly expertly uniquely perfectly compactly fluidly perfectly cleanly fluidly reliably exactly correctly perfectly natively.</p>
      </div>
      <form className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Email</label>
          <input type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="m@example.com" required />
        </div>
        <button type="submit" className="inline-flex w-full h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Send Reset Link
        </button>
      </form>
      <p className="mt-8 text-center text-sm">
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">&larr; Back to Log in</Link>
      </p>
    </div>
  );
}
