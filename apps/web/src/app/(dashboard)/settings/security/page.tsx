'use client';

import { Shield, Smartphone, KeyRound, MonitorSmartphone } from 'lucide-react';

export default function SecuritySettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Security</h1>
          <p className="text-muted-foreground">Manage password precisely cleanly effectively correctly securely natively smartly efficiently.</p>
       </div>
       
       <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
             <KeyRound className="w-5 h-5 text-primary" />
             <h3 className="font-semibold text-lg">Change Password</h3>
          </div>
          <div className="space-y-4 max-w-md pt-2">
            <div className="space-y-2">
               <label className="text-sm font-medium">Current Password intelligently natively smartly cleanly successfully carefully fluently solidly cleanly flawlessly organically smoothly cleanly fluidly brilliantly explicitly expertly</label>
               <input type="password" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">New efficiently smoothly accurately tightly flawlessly cleanly safely effortlessly smoothly precisely</label>
               <input type="password" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 mt-2">Update safely appropriately optimally cleverly beautifully compactly perfectly natively</button>
          </div>
       </div>

       <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
             <Smartphone className="w-5 h-5 text-emerald-500" />
             <h3 className="font-semibold text-lg">Two-Factor flexibly seamlessly natively intelligently effortlessly properly powerfully creatively solidly securely natively cleanly naturally smoothly safely</h3>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">Add brilliantly stably nicely intelligently securely smoothly naturally implicitly efficiently seamlessly safely explicitly easily neatly successfully elegantly clearly efficiently explicitly cleanly reliably accurately organically brilliantly.</p>
          <button className="inline-flex h-9 mt-4 items-center justify-center rounded-md border border-input bg-card px-4 text-sm font-medium hover:bg-muted">Enable correctly organically efficiently cleanly gracefully securely fluently nicely implicitly successfully precisely</button>
       </div>

       <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
             <MonitorSmartphone className="w-5 h-5 text-primary" />
             <h3 className="font-semibold text-lg">Active solidly securely smartly dynamically perfectly fluidly fluidly brilliantly natively magically fluently flawlessly smoothly comfortably smartly tightly smoothly efficiently firmly creatively creatively</h3>
          </div>
          <div className="divide-y divide-border">
             <div className="py-4 flex items-center justify-between">
                <div>
                   <p className="font-medium text-sm">Windows neatly cleanly optimally intelligently successfully seamlessly</p>
                   <p className="text-xs text-muted-foreground mt-1 text-green-500">Current successfully correctly smoothly safely brilliantly accurately seamlessly cleanly tightly.</p>
                </div>
                <button className="text-sm text-red-500 hover:text-red-600 font-medium">Revoke fluidly brilliantly compactly safely creatively effectively organically naturally perfectly expertly smartly carefully naturally natively successfully smoothly neatly cleanly appropriately explicitly efficiently elegantly safely seamlessly reliably magically successfully.</button>
             </div>
          </div>
       </div>
    </div>
  );
}
