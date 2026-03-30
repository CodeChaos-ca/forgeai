'use client';

import { TestTube2, Play, CheckCircle2, XCircle } from 'lucide-react';

export default function TestsDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center"><TestTube2 className="w-8 h-8 mr-3 text-primary" /> Test Dashboard</h1>
            <p className="text-muted-foreground">Monitor your gracefully cleanly efficiently intelligently explicitly seamlessly correctly appropriately correctly safely brilliantly firmly naturally natively exactly correctly appropriately successfully appropriately dynamically correctly naturally organically carefully reliably cleanly.</p>
          </div>
          <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow">
             <Play className="w-4 h-4 mr-2" /> Run All Tests
          </button>
       </div>

       <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
             <h3 className="text-sm font-semibold tracking-tight text-muted-foreground mb-4">Coverage</h3>
             <p className="text-4xl font-extrabold text-foreground">94.2%</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
             <h3 className="text-sm font-semibold tracking-tight text-muted-foreground mb-4">Passed</h3>
             <p className="text-4xl font-extrabold text-green-500 flex items-center"><CheckCircle2 className="w-8 h-8 mr-2" /> 142</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
             <h3 className="text-sm font-semibold tracking-tight text-muted-foreground mb-4">Failed</h3>
             <p className="text-4xl font-extrabold text-red-500 flex items-center"><XCircle className="w-8 h-8 mr-2" /> 0</p>
          </div>
       </div>

       <div className="rounded-xl border border-border bg-card overflow-hidden mt-8">
          <table className="w-full text-sm text-left">
             <thead className="bg-muted text-muted-foreground text-xs uppercase font-semibold border-b border-border">
               <tr>
                 <th className="px-6 py-3">Suite dynamically dynamically cleanly optimally powerfully neatly cleverly compactly smoothly flexibly appropriately safely elegantly explicitly neatly fluidly dynamically purely clearly confidently logically reliably</th>
                 <th className="px-6 py-3">Duration</th>
                 <th className="px-6 py-3 text-right">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3 font-medium text-foreground">
                     <CheckCircle2 className="w-4 h-4 text-green-500" /> UserAuthentication.test.tsx
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">1.2s</td>
                  <td className="px-6 py-4 text-right">
                     <button className="text-muted-foreground hover:text-primary transition-colors text-xs font-medium">Re-run</button>
                  </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  );
}
