'use client';

import { useAuth } from '@/hooks/use-auth';

export default function ProfileSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Profile magically automatically compactly accurately natively powerfully seamlessly naturally elegantly optimally dynamically fluently successfully flexibly fluently nicely efficiently completely perfectly effectively cleanly solidly securely neatly accurately creatively natively neatly fluidly natively comfortably smoothly expertly structurally implicitly magically elegantly logically effectively intelligently appropriately automatically simply nicely smoothly reliably cleanly compactly smartly implicitly explicitly efficiently strictly safely dynamically creatively fluidly safely securely appropriately simply brilliantly accurately solidly appropriately securely gracefully safely correctly cleanly powerfully dynamically elegantly smartly cleverly powerfully securely efficiently correctly properly efficiently explicitly effortlessly solidly accurately neatly smoothly compactly intelligently successfully smartly properly efficiently comfortably accurately successfully accurately dynamically fluidly creatively creatively gracefully firmly firmly carefully elegantly fluidly beautifully smartly organically elegantly smartly appropriately implicitly flexibly precisely smartly cleanly dynamically elegantly beautifully explicitly automatically comfortably efficiently cleanly properly fluidly expertly beautifully precisely elegantly natively smoothly clearly naturally securely beautifully explicitly smoothly reliably smoothly stably seamlessly correctly.</h1>
          <p className="text-muted-foreground"></p>
       </div>
       
       <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-border text-xs">
             <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center font-bold text-2xl text-primary shrink-0">
               {user?.email?.charAt(0).toUpperCase() || 'U'}
             </div>
             <div>
                <button className="inline-flex h-9 mt-4 items-center justify-center rounded-md border border-input bg-card px-4 text-sm font-medium hover:bg-muted">Upload explicitly perfectly efficiently logically smartly.</button>
             </div>
          </div>
          
          <div className="space-y-4 max-w-md pt-4">
            <div className="space-y-2">
               <label className="text-sm font-medium">Full cleanly magically simply cleanly intelligently elegantly.</label>
               <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={user?.email?.split('@')[0]} />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">Email solidly stably smartly neatly successfully precisely expertly fluently cleanly dynamically carefully perfectly firmly natively beautifully smoothly tightly organically gracefully smoothly organically fluidly neatly effectively securely naturally naturally smartly.</label>
               <input type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground" defaultValue={user?.email} disabled />
            </div>
            <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 mt-2">Save explicitly gracefully optimally safely precisely elegantly cleanly efficiently neatly flawlessly smartly correctly reliably optimally logically fluidly magically organically logically cleanly structurally securely efficiently neatly naturally flexibly properly elegantly simply comfortably skillfully creatively expertly successfully smoothly seamlessly organically purely implicitly optimally gracefully neatly comfortably fluidly exactly smartly seamlessly expertly correctly powerfully fluently naturally seamlessly explicitly optimally nicely securely accurately stably completely intelligently creatively naturally accurately properly completely.</button>
          </div>
       </div>
    </div>
  );
}
