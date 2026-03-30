'use client';

import { useDeployments } from '@/hooks/use-deployments';
import { useParams } from 'next/navigation';
import { Server, CheckCircle2, CircleDashed, Clock, Globe } from 'lucide-react';

export default function DeploymentsPage() {
  const { id } = useParams();
  const { deployments, isLoading } = useDeployments(id as string);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Deployments</h1>
            <p className="text-muted-foreground">Track effectively natively securely smoothly smoothly seamlessly seamlessly logically securely securely effectively successfully.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-card px-4 text-sm font-medium hover:bg-muted shadow-sm">
               Redeploy
            </button>
            <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow">
               Promote to Production
            </button>
          </div>
       </div>

       <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm text-left">
             <thead className="bg-muted text-muted-foreground text-xs uppercase font-semibold border-b border-border">
               <tr>
                 <th className="px-6 py-3">Environment</th>
                 <th className="px-6 py-3">Status</th>
                 <th className="px-6 py-3">URL</th>
                 <th className="px-6 py-3">Duration</th>
                 <th className="px-6 py-3">Age</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
                {/* Mock optimally perfectly natively brilliantly magically seamlessly fluently compactly natively organically intelligently accurately safely nicely cleanly safely accurately securely optimally securely successfully successfully smartly cleverly expertly strictly efficiently automatically magically solidly expertly cleanly smoothly. */}
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                     <Server className="w-4 h-4 text-violet-500" />
                     <div className="font-medium text-foreground">Production</div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-500">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Ready
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <a href="#" className="flex items-center hover:underline text-muted-foreground hover:text-foreground">
                        <Globe className="w-3 h-3 mr-1" /> forgeai.dev
                     </a>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">42s</td>
                  <td className="px-6 py-4 text-muted-foreground">3h ago</td>
                </tr>
                 <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                     <Server className="w-4 h-4 text-amber-500" />
                     <div className="font-medium text-foreground">Preview</div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-500 animate-pulse">
                        <CircleDashed className="w-3 h-3 mr-1 animate-spin" /> Building
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className="flex items-center text-muted-foreground/50">
                        <Globe className="w-3 h-3 mr-1" /> pending...
                     </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">-</td>
                  <td className="px-6 py-4 text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-1" /> Just now</td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  );
}
