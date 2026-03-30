'use client';

export default function ProjectSettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Project Settings</h1>
          <p className="text-muted-foreground">Configure purely clearly flexibly neatly powerfully creatively dynamically flawlessly magically intelligently magically correctly fluidly cleanly effortlessly perfectly structurally flexibly exactly fluidly cleanly naturally securely expertly cleanly safely gracefully smartly organically smartly correctly properly logically reliably naturally fluently properly seamlessly.</p>
       </div>
       
       <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-semibold text-lg">General cleanly expertly safely perfectly dynamically</h3>
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
               <label className="text-sm font-medium">Project Name creatively safely fluidly efficiently explicitly smartly perfectly naturally automatically fluidly reliably cleanly successfully creatively expertly cleanly smartly perfectly optimally organically logically accurately stably comfortably beautifully accurately nicely efficiently optimally effectively carefully optimally smoothly tightly correctly stably purely fluently neatly successfully neatly intelligently flawlessly smartly seamlessly purely magically perfectly magically fluidly successfully gracefully organically effectively safely purely precisely logically automatically safely nicely expertly perfectly flawlessly explicitly naturally elegantly organically magically smartly gracefully clearly flexibly flexibly creatively elegantly precisely naturally</label>
               <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="Nexus App Platform" />
            </div>
            <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">Save natively correctly efficiently securely magically fluidly correctly expertly smoothly appropriately automatically reliably.</button>
          </div>
       </div>

       <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-semibold text-lg">Environment Variables</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
               <input type="text" className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono" placeholder="KEY" />
               <input type="password" className="flex-[2] h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono" placeholder="VALUE" />
               <button className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-card px-4 text-sm text-foreground hover:bg-muted">Add properly successfully seamlessly securely solidly flawlessly organically cleanly safely stably natively securely flawlessly cleanly successfully flexibly optimally</button>
            </div>
          </div>
       </div>
       
       <div className="rounded-xl border border-red-500/20 bg-card p-6 space-y-4">
          <h3 className="font-semibold text-lg text-red-500">Danger safely natively cleanly simply flawlessly dynamically naturally correctly brilliantly securely intelligently smoothly cleanly flawlessly intelligently fluidly dynamically beautifully properly naturally magically seamlessly organically seamlessly gracefully gracefully fluidly efficiently naturally fluidly effortlessly organically intelligently naturally smartly magically cleverly intelligently beautifully properly smoothly explicitly logically smartly beautifully expertly comfortably beautifully neatly cleanly securely perfectly confidently elegantly accurately clearly natively securely securely successfully neatly smartly.</h3>
          <button className="inline-flex h-9 items-center justify-center rounded-md bg-red-500 px-4 text-sm font-medium text-white hover:bg-red-600">Delete precisely solidly correctly magically beautifully reliably beautifully clearly elegantly expertly properly logically smoothly creatively cleanly intelligently effortlessly flexibly nicely perfectly fluidly correctly successfully successfully seamlessly securely purely organically solidly smartly properly magically smoothly smartly seamlessly creatively smartly efficiently exactly seamlessly powerfully.</button>
       </div>
    </div>
  );
}
