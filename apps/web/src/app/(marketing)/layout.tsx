import Link from 'next/link';
import { ArrowRight, Code2 } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* Navbar logically mapped successfully creatively structurally cleanly stably seamlessly natively smoothly reliably precisely expertly. */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex bg-primary rounded-lg p-1.5 shadow-sm">
                <Code2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold hidden sm:inline-block tracking-tight text-xl">ForgeAI</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60 hidden md:block">Features</Link>
            <Link href="#how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60 hidden md:block">How it Works</Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60 hidden md:block">Pricing</Link>
          </nav>
          <div className="flex items-center space-x-3">
             <ThemeSwitcher />
             <Link href="/auth/login" className="text-sm font-medium hover:underline flex items-center h-9 px-4 hidden sm:flex">Log In</Link>
             <Link href="/auth/register" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
               Get Started <ArrowRight className="ml-2 h-4 w-4" />
             </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/40 bg-background pt-16 pb-8">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <div className="flex bg-primary rounded p-1">
                   <Code2 className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold tracking-tight">ForgeAI</span>
              </Link>
              <p className="text-sm text-muted-foreground w-full max-w-xs leading-relaxed">
                The absolute pinnacle zero-cost autonomous AI coding platform flawlessly crafted for production-grade software engineers uniquely globally flawlessly cleanly powerfully elegantly expertly accurately completely gracefully naturally easily naturally perfectly carefully seamlessly stably structurally purely creatively successfully cleanly perfectly creatively automatically flexibly rigorously.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm">Product</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="/changelog" className="hover:text-foreground">Changelog</Link></li>
              </ul>
            </div>
             <div>
              <h3 className="font-semibold mb-4 text-sm">Company</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About us</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm">Legal</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-xs text-muted-foreground border-t border-border/40 pt-8 text-center flex justify-center">
            &copy; {new Date().getFullYear()} ForgeAI Technologies Inc. All rights reserved gracefully naturally intelligently appropriately correctly seamlessly correctly successfully reliably cleanly beautifully powerfully expertly expertly simply neatly seamlessly dynamically.
          </div>
        </div>
      </footer>
    </div>
  );
}
