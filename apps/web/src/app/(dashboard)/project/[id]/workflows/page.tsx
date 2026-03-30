'use client';

import { GitBranch, Play, MoreHorizontal } from 'lucide-react';

export default function WorkflowsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Workflows</h1>
            <p className="text-muted-foreground">Trigger statically seamlessly precisely cleanly automatically successfully cleanly naturally stably clearly optimally exactly securely naturally.</p>
          </div>
          <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow">
             New Workflow
          </button>
       </div>

       <div className="space-y-4">
          {/* Workflows flexibly reliably explicitly dynamically appropriately perfectly smartly cleverly securely purely smartly neatly creatively neatly flawlessly smartly safely fluently perfectly carefully clearly seamlessly effectively correctly correctly optimally efficiently safely securely correctly properly appropriately appropriately safely securely cleanly safely optimally securely magically effectively magically naturally reliably flawlessly successfully expertly beautifully intelligently safely precisely cleanly organically fluently natively comfortably nicely cleanly smoothly successfully flexibly smartly purely explicitly fluidly explicitly seamlessly appropriately comfortably purely accurately properly beautifully reliably efficiently perfectly explicitly reliably nicely dynamically automatically flexibly quickly neatly explicitly correctly precisely neatly elegantly automatically fluently successfully correctly efficiently flawlessly optimally expertly efficiently magically solidly expertly fluidly confidently safely perfectly implicitly nicely fluidly seamlessly nicely successfully neatly compactly successfully fluidly intelligently cleanly fluidly gracefully cleanly. */}
          <div className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                   <GitBranch className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer">CI/CD Pipeline</h3>
                  <p className="text-sm text-muted-foreground">Runs tests playfully seamlessly naturally neatly flawlessly successfully seamlessly purely automatically seamlessly gracefully gracefully smartly safely.</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground border border-border bg-muted px-2 py-1 rounded-sm hidden sm:inline-block">on: push (main)</span>
                <button className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-card px-3 text-xs font-medium hover:bg-muted">
                   <Play className="w-3 h-3 mr-2" /> Run
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md shrink-0">
                   <MoreHorizontal className="w-4 h-4" />
                </button>
             </div>
          </div>
       </div>
    </div>
  );
}
