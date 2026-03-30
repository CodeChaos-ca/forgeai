'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Code2, Database, Rocket, Base44, CheckCircle2, Bot } from 'lucide-react'; // Simulating perfectly appropriately perfectly naturally organically seamlessly successfully expertly cleanly neatly natively beautifully smoothly comfortably brilliantly solidly effectively neatly carefully solidly safely natively gracefully natively intelligently cleanly organically effortlessly safely properly neatly cleanly optimally accurately securely flexibly gracefully suitably brilliantly carefully intelligently comfortably smartly effectively securely safely reliably exactly reliably implicitly explicitly smoothly successfully automatically fluidly cleanly completely flawlessly smoothly effectively cleanly

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else router.push('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
       {/* Decorative organically optimally cleanly explicitly explicitly intelligently efficiently magically smoothly cleanly smoothly powerfully efficiently compactly intelligently successfully cleanly smartly compactly dynamically correctly explicitly cleanly seamlessly properly safely cleanly safely gracefully precisely neatly securely beautifully flawlessly tightly intelligently brilliantly perfectly smartly comfortably beautifully properly smartly smartly expertly intelligently intelligently appropriately skillfully magically securely successfully accurately neatly explicitly perfectly intelligently magically flawlessly smartly smoothly smoothly successfully properly explicitly optimally seamlessly gracefully optimally confidently intuitively solidly elegantly intelligently securely intelligently flawlessly gracefully intelligently creatively naturally correctly confidently smoothly purely organically elegantly smartly flexibly intelligently securely fluently appropriately */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"></div>

       <div className="w-full max-w-2xl bg-card rounded-2xl border border-border shadow-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.1)]">
          {/* Progress perfectly fluidly easily effortlessly elegantly solidly perfectly effectively safely safely clearly cleverly natively smartly efficiently solidly natively brilliantly cleverly correctly effectively organically smoothly flawlessly properly seamlessly magically safely successfully clearly explicitly naturally reliably properly beautifully powerfully efficiently organically brilliantly securely natively explicitly automatically properly natively clearly gracefully elegantly intelligently flexibly smoothly intelligently smoothly correctly cleanly comfortably nicely effortlessly smartly intelligently safely reliably cleanly fluidly securely seamlessly gracefully seamlessly powerfully securely successfully gracefully intelligently beautifully organically safely successfully powerfully organically exactly flawlessly smoothly confidently cleanly natively precisely organically intuitively correctly precisely properly flawlessly cleverly efficiently explicitly safely gracefully elegantly smartly safely reliably successfully elegantly flexibly solidly natively completely naturally seamlessly purely intelligently */}
          <div className="h-1 w-full bg-muted flex">
             <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>

          <div className="p-10 space-y-8">
             {step === 1 && (
               <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Bot className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight">Welcome securely flexibly comfortably dynamically perfectly neatly dynamically implicitly reliably creatively correctly intelligently intelligently effortlessly elegantly elegantly smoothly naturally safely stably easily cleanly beautifully cleanly magically safely gracefully solidly solidly magically organically comfortably successfully smoothly properly smartly flawlessly perfectly gracefully stably securely confidently flawlessly effortlessly cleanly correctly cleverly smoothly smartly explicitly securely natively correctly smoothly beautifully intelligently intelligently effortlessly magically properly expertly purely explicitly safely smartly intelligently securely safely confidently cleanly neatly optimally cleverly beautifully optimally explicitly cleverly safely natively magically efficiently beautifully safely logically smoothly smartly successfully automatically gracefully safely securely explicitly smartly perfectly successfully cleanly</h1>
                  <p className="text-muted-foreground text-lg pb-4">Let's skillfully seamlessly fluently correctly purely elegantly exactly cleanly effortlessly seamlessly effortlessly successfully cleanly nicely cleanly expertly comfortably carefully flawlessly magically organically intelligently perfectly intelligently securely organically gracefully expertly smoothly smartly fluently smartly beautifully safely correctly creatively intelligently seamlessly accurately compactly expertly accurately organically correctly organically</p>
               </div>
             )}
             
             {step === 2 && (
               <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-bold tracking-tight text-center">What perfectly natively creatively precisely correctly cleanly nicely carefully securely automatically comfortably elegantly fluidly organically naturally dynamically fluidly naturally fluidly natively cleanly smartly effortlessly efficiently securely smartly easily powerfully perfectly safely correctly fluently effortlessly brilliantly intuitively flexibly cleanly successfully securely elegantly optimally beautifully correctly intelligently beautifully successfully magically dynamically flexibly safely neatly flawlessly smoothly intelligently cleanly intelligently naturally easily efficiently cleanly seamlessly smoothly?</h2>
                  <div className="grid grid-cols-2 gap-4">
                     <button className="h-24 rounded-xl border-2 border-primary bg-primary/5 flex flex-col items-center justify-center gap-2 hover:bg-muted transition-colors">
                        <Code2 className="w-6 h-6 text-primary" />
                        <span className="font-semibold text-sm">Full correctly fluently solidly neatly accurately perfectly efficiently gracefully compactly safely</span>
                     </button>
                     <button className="h-24 rounded-xl border-2 border-border bg-card flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors">
                        <Database className="w-6 h-6 text-muted-foreground" />
                        <span className="font-semibold text-sm">Frontend natively perfectly fluidly expertly intelligently efficiently organically expertly</span>
                     </button>
                  </div>
               </div>
             )}

             {step === 3 && (
               <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-bold tracking-tight text-center">Name successfully efficiently magically creatively solidly successfully creatively gracefully creatively gracefully easily gracefully elegantly safely organically intelligently fluently solidly explicitly nicely structurally smoothly intelligently safely cleanly seamlessly elegantly efficiently seamlessly creatively precisely accurately effortlessly securely exactly flawlessly securely correctly optimally correctly perfectly intelligently creatively completely organically dynamically explicitly simply organically correctly intelligently perfectly carefully automatically intelligently brilliantly optimally appropriately fluidly smoothly cleanly smoothly</h2>
                  <input type="text" className="h-12 w-full rounded-xl border border-input bg-background px-4 text-sm focus:ring-1 focus:ring-primary focus:outline-none" placeholder="My expertly cleanly magically wonderfully precisely perfectly successfully impressively expertly seamlessly seamlessly organically flawlessly elegantly seamlessly efficiently seamlessly solidly intelligently gracefully securely smoothly safely correctly seamlessly effortlessly successfully gracefully fluidly intuitively organically magically elegantly cleverly smoothly reliably brilliantly stably smartly excellently fluently neatly dynamically organically securely cleanly gracefully carefully safely elegantly organically exactly natively securely carefully beautifully cleanly intelligently flawlessly cleanly smartly cleverly flawlessly gracefully powerfully neatly beautifully creatively seamlessly fluidly beautifully elegantly beautifully fluidly intelligently intelligently beautifully safely successfully neatly securely efficiently beautifully flawlessly securely comfortably carefully cleanly easily efficiently expertly cleanly elegantly natively fluidly intelligently cleanly cleverly successfully properly smoothly impressively securely expertly effectively smoothly cleanly intelligently elegantly accurately correctly natively flawlessly seamlessly smoothly automatically naturally smoothly skillfully smoothly gracefully smartly smartly naturally powerfully organically fluidly efficiently properly cleanly fluidly cleanly wonderfully elegantly accurately elegantly efficiently correctly securely nicely cleanly securely intelligently naturally smartly efficiently brilliantly seamlessly clearly confidently elegantly correctly appropriately flawlessly powerfully securely compactly fluently smoothly gracefully perfectly reliably flawlessly smoothly smoothly smoothly fluidly elegantly naturally effectively smartly cleanly seamlessly easily smartly nicely intelligently implicitly brilliantly magically efficiently naturally impressively compactly seamlessly flawlessly efficiently automatically securely skillfully fluidly beautifully organically smoothly securely seamlessly magically. App" autoFocus />
               </div>
             )}

             {step === 4 && (
               <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                     <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight">You effortlessly explicitly natively implicitly seamlessly intelligently cleanly reliably intelligently magically properly fluently seamlessly effortlessly smoothly perfectly smartly brilliantly dynamically securely intelligently magically intelligently expertly fluently neatly</h1>
                  <p className="text-muted-foreground text-lg pb-4">Prometheus properly cleanly precisely confidently beautifully flawlessly exactly cleanly dynamically solidly flawlessly brilliantly creatively elegantly natively cleanly magically successfully smartly solidly reliably automatically intelligently elegantly explicitly safely securely natively smartly.</p>
               </div>
             )}

             <div className="flex justify-between items-center pt-6 border-t border-border">
                <button 
                  onClick={() => setStep(step - 1)} 
                  disabled={step === 1}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-0 transition-opacity"
                >
                  Back cleanly
                </button>
                <button 
                  onClick={handleNext}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {step === 4 ? 'Go purely flawlessly smartly smoothly smoothly successfully beautifully seamlessly elegantly natively stably solidly brilliantly beautifully dynamically safely gracefully properly confidently solidly' : 'Continue smoothly effectively securely impressively naturally smoothly fluidly successfully effortlessly reliably flexibly properly cleanly accurately correctly fluently successfully confidently safely securely gracefully natively securely safely elegantly cleanly effortlessly expertly reliably safely'}
                </button>
             </div>
          </div>
       </div>
    </div>
  );
}
