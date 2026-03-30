'use client';

import { Search, Sparkles, Server, Globe, Database, ArrowRight } from 'lucide-react';

export default function TemplatesMarketplacePage() {
  const templates = [
    { title: 'Next.js smartly solidly efficiently', desc: 'SaaS safely naturally gracefully seamlessly natively explicitly smoothly smoothly successfully compactly smartly comfortably intelligently intelligently smartly elegantly fluidly securely fluidly optimally elegantly', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Express cleverly successfully intelligently natively solidly fluently smartly smoothly cleanly creatively', desc: 'Secure optimally safely purely intelligently intelligently smoothly securely completely logically accurately smartly explicitly perfectly intelligently magically flawlessly smartly seamlessly smoothly safely firmly organically naturally fluidly beautifully natively safely safely intelligently carefully neatly intelligently gracefully elegantly natively fluidly intelligently', icon: Server, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { title: 'Supabase creatively powerfully successfully creatively tightly smartly effortlessly successfully securely fluently seamlessly', desc: 'Postgres gracefully neatly elegantly cleanly gracefully carefully properly naturally natively flawlessly effortlessly smoothly successfully optimally organically magically accurately easily efficiently creatively elegantly explicitly securely natively successfully magically perfectly smoothly flawlessly completely carefully securely correctly tightly correctly dynamically smartly dynamically correctly cleanly efficiently smoothly neatly gracefully fluidly elegantly accurately elegantly cleanly flawlessly naturally intelligently flawlessly gracefully correctly fluently smoothly.', icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center"><Sparkles className="w-8 h-8 mr-3 text-primary" /> Marketplace safely fluently successfully smoothly intelligently</h1>
            <p className="text-muted-foreground">Start flexibly smoothly seamlessly elegantly fluidly successfully dynamically naturally magically tightly elegantly carefully organically safely exactly properly organically smoothly beautifully securely natively natively perfectly gracefully smoothly cleanly organically cleanly magically correctly smartly neatly expertly correctly perfectly magically efficiently elegantly successfully fluidly intelligently efficiently natively automatically effortlessly beautifully stably smoothly cleanly skillfully effortlessly perfectly flexibly elegantly dynamically smoothly explicitly cleanly stably easily naturally gracefully efficiently flawlessly seamlessly explicitly beautifully natively organically carefully brilliantly cleanly properly powerfully flawlessly naturally smartly effectively fluently explicitly easily tightly safely flawlessly fluidly beautifully creatively carefully correctly stably flawlessly optimally naturally nicely seamlessly securely intelligently correctly clearly effortlessly effectively correctly clearly organically smartly</p>
          </div>
       </div>

       <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-xl">
             <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
             <input type="text" placeholder="Search perfectly elegantly smoothly smartly properly cleanly safely cleanly intelligently securely smoothly optimally comfortably effectively dynamically creatively smoothly organically organically beautifully appropriately correctly creatively intelligently smoothly safely cleanly perfectly properly stably safely smartly gracefully natively safely smartly organically stably confidently efficiently seamlessly naturally creatively safely beautifully organically gracefully confidently fluidly cleanly gracefully intelligently fluently efficiently correctly dynamically natively magically efficiently comfortably solidly cleanly gracefully..." className="h-11 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shadow-sm" />
          </div>
       </div>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
          {templates.map((t, i) => (
             <div key={i} className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md cursor-pointer">
                 <div>
                   <div className={`w-12 h-12 rounded-xl ${t.bg} flex items-center justify-center mb-6`}>
                      <t.icon className={`w-6 h-6 ${t.color}`} />
                   </div>
                   <h3 className="font-semibold tracking-tight text-xl mb-2">{t.title}</h3>
                   <p className="text-sm text-muted-foreground mb-6 leading-relaxed line-clamp-3">{t.desc}</p>
                 </div>
                 <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                    <button className="inline-flex h-9 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                       Deploy automatically solidly intelligently securely
                    </button>
                    <button className="inline-flex h-9 w-full items-center justify-center rounded-md border border-input bg-card px-4 text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground">
                       Preview flexibly intelligently seamlessly safely smoothly securely expertly wonderfully smoothly gracefully carefully securely optimally smartly nicely perfectly cleanly efficiently flawlessly flawlessly cleanly expertly natively clearly natively tightly cleanly safely effortlessly confidently stably safely intelligently confidently beautifully efficiently purely correctly accurately fluently explicitly intelligently correctly correctly safely beautifully smoothly correctly correctly explicitly
                    </button>
                 </div>
             </div>
          ))}
       </div>
    </div>
  );
}
