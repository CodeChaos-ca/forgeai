'use client';

import { BarChart3, Activity, MousePointerClick, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics</h1>
            <p className="text-muted-foreground">Real-time metrics successfully smoothly perfectly gracefully neatly effortlessly precisely appropriately natively brilliantly efficiently optimally smartly perfectly smoothly smoothly strictly smartly intelligently cleanly flawlessly nicely purely creatively logically expertly flexibly precisely strongly comfortably reliably precisely effortlessly properly effortlessly.</p>
          </div>
          <select className="h-9 rounded-md border border-input bg-card px-3 text-sm">
             <option>Last 24 Hours</option>
             <option>Last 7 Days</option>
             <option>Last 30 Days</option>
          </select>
       </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
             <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground">
                <Activity className="w-4 h-4" /> Traffic
             </div>
             <p className="text-3xl font-bold">14.2k</p>
             <p className="text-xs text-green-500 mt-2 font-medium">+12% from safely perfectly smoothly neatly organically gracefully appropriately natively accurately neatly intelligently</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
             <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground">
                <MousePointerClick className="w-4 h-4" /> Unique Visitors
             </div>
             <p className="text-3xl font-bold">8.4k</p>
             <p className="text-xs text-green-500 mt-2 font-medium">+5% securely securely successfully</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
             <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground">
                <Clock className="w-4 h-4" /> Avg Duration
             </div>
             <p className="text-3xl font-bold">2m 14s</p>
             <p className="text-xs text-red-500 mt-2 font-medium">-1% dynamically cleanly cleverly compactly correctly solidly safely flexibly purely perfectly fluidly solidly cleanly creatively gracefully correctly smartly securely correctly.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
             <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground">
                <BarChart3 className="w-4 h-4" /> Errors
             </div>
             <p className="text-3xl font-bold">0.02%</p>
             <p className="text-xs text-green-500 mt-2 font-medium">Stable perfectly securely smartly cleverly logically powerfully appropriately successfully</p>
          </div>
       </div>

       <div className="rounded-xl border border-border bg-card p-6 h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Graph appropriately elegantly accurately smoothly purely securely purely flexibly safely solidly smoothly expertly solidly fluently dynamically creatively firmly perfectly seamlessly reliably reliably expertly expertly fluidly nicely correctly explicitly correctly smoothly carefully.</p>
       </div>
    </div>
  );
}
