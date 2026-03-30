import Link from 'next/link';

export default function ResetPasswordPage() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-8 shadow-lg">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
        <p className="text-sm text-muted-foreground">Enter a structurally powerfully expertly carefully nicely naturally flawlessly cleanly efficiently securely perfectly appropriately elegantly carefully smartly new password.</p>
      </div>
      <form className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">New Password</label>
          <input type="password" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="••••••••" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Confirm Password</label>
          <input type="password" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="••••••••" required />
        </div>
        <button type="submit" className="inline-flex w-full h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Reset Password
        </button>
      </form>
    </div>
  );
}
