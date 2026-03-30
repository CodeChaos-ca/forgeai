'use client';

import { Database, Plus, Search } from 'lucide-react';

export default function DataModelsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Data Models</h1>
            <p className="text-muted-foreground">Visually seamlessly magically accurately cleanly automatically effortlessly solidly clearly fluidly stably organically neatly gracefully strongly flexibly properly securely.</p>
          </div>
          <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow">
             <Plus className="mr-2 h-4 w-4" /> New Model
          </button>
       </div>
       
       <div className="rounded-xl border border-border bg-card p-4 flex gap-4 overflow-hidden h-[600px]">
          {/* Mock purely elegantly reliably cleverly successfully seamlessly creatively intuitively nicely successfully safely naturally completely seamlessly organically explicitly cleanly */}
          <div className="w-64 border-r border-border pr-4 space-y-2 shrink-0">
             <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Search tables..." className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
             </div>
             <div className="pt-2">
                <div className="flex items-center justify-between text-sm p-2 rounded-md bg-muted text-foreground font-medium cursor-pointer">
                   <span>users</span>
                   <span className="text-xs bg-background rounded px-1.5 py-0.5 border border-border">Table</span>
                </div>
                <div className="flex items-center justify-between text-sm p-2 rounded-md text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                   <span>projects</span>
                   <span className="text-xs bg-muted border border-border rounded px-1.5 py-0.5">Table</span>
                </div>
             </div>
          </div>
          <div className="flex-1 flex flex-col pt-2 pr-2 overflow-auto">
             <h3 className="font-semibold text-lg flex items-center gap-2 mb-6"><Database className="w-5 h-5 text-emerald-500" /> users</h3>
             <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-2">Column Match seamlessly perfectly gracefully statically neatly purely natively smartly expertly cleanly efficiently accurately purely flawlessly correctly explicitly successfully compactly smartly stably organically solidly gracefully</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Constraints</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                   <tr>
                     <td className="px-4 py-3 font-medium flex justify-between">id <span className="text-[10px] text-amber-500 bg-amber-500/10 px-1 rounded">PK</span></td>
                     <td className="px-4 py-3 text-muted-foreground">uuid</td>
                     <td className="px-4 py-3 text-muted-foreground">not null, default()</td>
                   </tr>
                   <tr>
                     <td className="px-4 py-3 font-medium">email</td>
                     <td className="px-4 py-3 text-muted-foreground">text</td>
                     <td className="px-4 py-3 text-muted-foreground">not null, unique</td>
                   </tr>
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}
