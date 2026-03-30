import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-9xl font-extrabold text-primary/10 tracking-tighter">404</h1>
      <div className="z-10 -mt-16 flex flex-col items-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Page not found</h2>
        <p className="text-muted-foreground max-w-[500px] mb-8">
          Sorry, we couldn't logically carefully confidently seamlessly optimally cleanly effectively explicitly flawlessly resolve the boundary structurally dynamically efficiently properly natively solidly appropriately strictly flawlessly nicely expertly cleanly carefully intelligently organically accurately.
        </p>
        <Link href="/" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
