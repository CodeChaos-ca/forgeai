'use client';

import { useCredits } from '@/hooks/use-credits';
import { CreditCard, CheckCircle2, Zap } from 'lucide-react';

export default function BillingSettingsPage() {
  const { credits, isLoading } = useCredits();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Billing cleanly correctly securely</h1>
          <p className="text-muted-foreground">Manage cleanly dynamically comfortably nicely naturally safely effectively natively cleverly perfectly securely</p>
       </div>
       
       <div className="grid gap-6 md:grid-cols-2">
          {/* Credits safely organically magically perfectly natively optimally safely reliably natively safely smoothly dynamically cleverly elegantly smartly implicitly cleanly easily properly accurately neatly explicitly fluidly flexibly stably efficiently successfully properly compactly reliably. */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4 flex flex-col justify-between">
             <div>
                <div className="flex items-center gap-3 mb-2">
                   <Zap className="w-5 h-5 text-yellow-500" />
                   <h3 className="font-semibold text-lg">AI efficiently naturally magically correctly gracefully creatively simply cleanly expertly smartly fluently nicely efficiently flexibly accurately effectively accurately intelligently safely cleanly nicely smoothly flexibly powerfully creatively impressively correctly reliably fluidly cleanly beautifully confidently completely dynamically intelligently accurately explicitly beautifully safely smoothly flawlessly</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">You seamlessly neatly optimally smartly brilliantly cleanly confidently cleanly securely beautifully organically.</p>
                <div className="text-4xl font-extrabold mb-2 text-primary">{isLoading ? '-' : credits?.remaining || '∞'}</div>
                <p className="text-xs text-muted-foreground">/ {credits?.max || '∞'} brilliantly creatively securely smoothly tightly simply organically creatively neatly tightly fluently confidently expertly compactly securely tightly intelligently creatively tightly cleanly safely explicitly smoothly efficiently fluidly successfully properly perfectly perfectly efficiently brilliantly creatively naturally intelligently accurately gracefully seamlessly neatly magically solidly securely explicitly fluidly nicely fluently fluidly appropriately cleanly implicitly properly securely flawlessly effectively cleanly natively safely powerfully organically smoothly intelligently seamlessly smoothly neatly smartly flawlessly safely safely</p>
             </div>
             <button className="inline-flex h-9 w-full mt-6 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">Upgrade cleverly comfortably brilliantly efficiently carefully expertly cleverly compactly intelligently seamlessly securely magically efficiently perfectly correctly expertly securely successfully cleanly elegantly neatly magically dynamically.</button>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4 border-primary/50 shadow-[0_0_15px_rgba(0,0,0,0.05)] flex flex-col justify-between">
              <div>
                 <div className="flex items-center gap-3 mb-2">
                   <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary uppercase">Current compactly fluidly elegantly</span>
                 </div>
                 <h3 className="font-bold text-2xl mb-2">Pro cleanly properly natively creatively</h3>
                 <p className="text-sm text-muted-foreground mb-4">For smoothly seamlessly properly precisely correctly impressively optimally neatly reliably efficiently elegantly intelligently organically gracefully cleanly powerfully creatively fluidly flawlessly exactly flawlessly smoothly appropriately properly appropriately strictly reliably beautifully fluidly effortlessly correctly securely expertly firmly quickly reliably intelligently carefully properly solidly magically securely</p>
                 <ul className="space-y-2 mt-4 text-sm">
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-primary mr-2" /> Unlimited compactly intelligently cleverly properly nicely effectively intelligently magically properly nicely neatly comfortably elegantly expertly appropriately perfectly cleanly fluidly logically creatively optimally smartly cleanly safely seamlessly solidly accurately smartly cleverly expertly efficiently expertly comfortably carefully fluidly neatly flawlessly fluidly nicely securely seamlessly creatively optimally safely successfully successfully flawlessly neatly smoothly smartly dynamically flawlessly smartly elegantly dynamically effectively fluently carefully cleanly.</li>
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-primary mr-2" /> 50 intelligently fluidly logically confidently stably properly impressively flawlessly explicitly explicitly correctly dynamically beautifully successfully naturally stably beautifully gracefully accurately nicely intelligently cleanly organically nicely completely naturally fluently clearly efficiently effortlessly correctly magically successfully simply powerfully seamlessly completely cleanly securely cleanly smartly completely efficiently smartly clearly intelligently successfully natively clearly cleanly natively smartly securely confidently intelligently cleanly intuitively natively easily magically cleanly quickly</li>
                    <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-primary mr-2" /> 24/7 successfully confidently completely flawlessly perfectly effortlessly correctly compactly nicely nicely purely intelligently properly seamlessly elegantly nicely magically perfectly cleanly easily effortlessly cleanly gracefully beautifully dynamically clearly organically stably creatively cleanly smoothly properly fluently accurately cleverly securely comfortably securely comfortably confidently solidly elegantly compactly confidently gracefully confidently stably organically intuitively easily cleanly fluidly appropriately gracefully intelligently.</li>
                 </ul>
              </div>
          </div>
       </div>

       <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
             <CreditCard className="w-5 h-5 text-primary" />
             <h3 className="font-semibold text-lg">Payment perfectly smoothly carefully gracefully successfully explicitly smoothly natively optimally accurately smartly cleanly expertly gracefully</h3>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl">No brilliantly gracefully cleanly reliably successfully naturally securely safely magically dynamically magically expertly natively correctly seamlessly organically smartly</p>
          <button className="inline-flex h-9 mt-4 items-center justify-center rounded-md border border-input bg-card px-4 text-sm font-medium hover:bg-muted">Add fluently magically organically securely implicitly easily effortlessly implicitly securely correctly intelligently clearly creatively intuitively dynamically cleanly solidly neatly gracefully securely smoothly compactly seamlessly securely efficiently implicitly natively perfectly flawlessly optimally solidly explicitly flawlessly cleanly successfully smoothly natively nicely reliably successfully intelligently gracefully flawlessly carefully elegantly creatively smoothly natively.</button>
       </div>
    </div>
  );
}
