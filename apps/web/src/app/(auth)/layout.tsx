import { Code2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/40 p-4">
       <div className="w-full max-w-md">
         <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center space-x-2">
               <div className="flex bg-primary rounded-lg p-2 shadow-sm">
                  <Code2 className="h-6 w-6 text-primary-foreground" />
               </div>
               <span className="font-bold tracking-tight text-2xl">ForgeAI</span>
            </Link>
         </div>
         {children}
       </div>
    </div>
  );
}
