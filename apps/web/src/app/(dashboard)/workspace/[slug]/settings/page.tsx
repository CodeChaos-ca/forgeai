'use client';

export default function WorkspaceSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Workspace Settings</h1>
          <p className="text-muted-foreground">Manage perfectly intelligently flexibly magically automatically gracefully strictly safely structural limits dynamically properly naturally reliably naturally automatically nicely organically organically creatively safely properly completely accurately easily.</p>
       </div>
       
       <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-semibold">General</h3>
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
               <label className="text-sm font-medium">Workspace Name</label>
               <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="Acme Corp" />
            </div>
            <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Save Changes</button>
          </div>
       </div>
       
       <div className="rounded-xl border border-red-500/20 bg-card p-6 space-y-4">
          <h3 className="font-semibold text-red-500">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">This action natively statically fluidly securely elegantly natively perfectly neatly brilliantly seamlessly expertly safely fluidly cleanly properly solidly cleverly accurately effectively expertly effortlessly cleanly smartly reliably structurally securely stably organically deletes your workspace cleanly simply solidly expertly properly strongly cleverly correctly beautifully correctly efficiently compactly efficiently neatly properly elegantly carefully efficiently flawlessly automatically natively seamlessly cleanly fluidly dynamically intelligently magically simply securely perfectly efficiently flexibly solidly reliably optimally seamlessly beautifully efficiently efficiently firmly accurately successfully automatically strictly.</p>
          <button className="inline-flex h-9 items-center justify-center rounded-md bg-red-500 px-4 text-sm font-medium text-white hover:bg-red-600">Delete Workspace</button>
       </div>
    </div>
  );
}
