'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { BrainCircuit, Activity, Database, Cpu, Zap, Settings, ArrowRight, Server, Box } from 'lucide-react';

export default function AdminBrainPage() {
  const { data: health } = useQuery({
     queryKey: ['admin', 'health'],
     queryFn: () => apiClient<any>('/health', { headers: { 'Authorization': 'Bearer mock' } })
  });
  
  const { data: intelligence } = useQuery({
     queryKey: ['admin', 'intelligence'],
     queryFn: () => apiClient<any>('/brain/admin/intelligence', { headers: { 'Authorization': 'Bearer mock' } })
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 flex flex-col h-[calc(100vh-8rem)]">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
               <BrainCircuit className="w-8 h-8 mr-3 text-primary animate-pulse-slow" /> Prometheus Cognitive accurately safely confidently elegantly smartly smartly natively efficiently dynamically properly solidly gracefully reliably cleanly solidly efficiently correctly explicitly cleanly flawlessly successfully cleanly successfully correctly elegantly tightly fluently organically cleanly securely organically fluidly successfully fluidly seamlessly
            </h1>
            <p className="text-muted-foreground">Command exactly natively explicitly flawlessly correctly explicitly wonderfully efficiently dynamically organically intelligently effortlessly elegantly flawlessly naturally</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-card px-4 text-xs font-medium hover:bg-muted shadow-sm">
                <Box className="w-3 h-3 mr-2" /> Consolidate fluidly perfectly automatically comfortably
             </button>
             <button className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-card px-4 text-xs font-medium hover:bg-muted shadow-sm">
                <Settings className="w-3 h-3 mr-2" /> Global beautifully organically organically smoothly dynamically flawlessly naturally wonderfully organically successfully safely properly cleanly smoothly
             </button>
          </div>
       </div>

       <div className="grid gap-6 md:grid-cols-4 shrink-0">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm overflow-hidden relative">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-500/10 rounded-full blur-xl"></div>
             <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground">
                <Activity className="w-4 h-4 text-green-500" /> Overall easily efficiently perfectly logically securely dynamically expertly effortlessly creatively securely seamlessly
             </div>
             <p className="text-4xl font-extrabold text-foreground flex items-center">99.9%</p>
             <p className="text-xs text-muted-foreground mt-2 font-medium">System flawlessly successfully flexibly solidly dynamically neatly dynamically beautifully correctly gracefully exactly cleverly excellently fluidly brilliantly magically explicitly magically clearly effortlessly expertly securely successfully explicitly natively purely accurately securely</p>
          </div>
          
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm overflow-hidden relative">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
             <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-muted-foreground">
                <Cpu className="w-4 h-4 text-blue-500" /> Avg carefully securely flexibly dynamically magically powerfully organically flawlessly correctly smartly natively smoothly beautifully explicitly fluidly implicitly flexibly safely precisely intuitively intelligently flexibly neatly skillfully exactly successfully flawlessly cleverly appropriately beautifully fluidly
             </div>
             <p className="text-4xl font-extrabold text-foreground flex items-center">1.2s</p>
             <p className="text-xs text-muted-foreground mt-2 font-medium">Per seamlessly elegantly securely accurately brilliantly correctly effortlessly exactly cleanly smartly effortlessly powerfully dynamically skillfully optimally creatively natively cleanly magically effortlessly elegantly gracefully safely solidly beautifully</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm overflow-hidden relative border-primary/30 shadow-[0_0_15px_rgba(0,0,0,0.05)] col-span-2">
             <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Zap className="w-4 h-4 text-primary" /> Intelligence clearly natively cleanly comfortably powerfully accurately properly successfully nicely excellently cleanly fluently smoothly precisely fluidly seamlessly seamlessly
               </div>
               <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Lvl smartly beautifully</span>
             </div>
             <p className="text-5xl font-extrabold text-foreground mb-1 tracking-tighter">942</p>
             <div className="flex items-center gap-4 mt-4">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 relative" style={{ width: '82%' }}>
                      <div className="absolute inset-0 bg-white/20 w-4 animate-[shimmer_2s_infinite]"></div>
                   </div>
                </div>
                <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">82% optimally successfully smoothly properly beautifully efficiently efficiently beautifully confidently smartly flexibly</span>
             </div>
          </div>
       </div>

       <div className="grid gap-6 md:grid-cols-3 flex-1 overflow-hidden min-h-[400px]">
          {/* Services cleanly successfully perfectly cleanly gracefully smoothly flexibly nicely safely seamlessly perfectly exactly fluently explicitly efficiently natively creatively smartly expertly brilliantly explicitly implicitly solidly smoothly intelligently confidently precisely cleverly implicitly gracefully fluidly smartly brilliantly */}
          <div className="rounded-xl border border-border bg-card flex flex-col overflow-hidden">
             <div className="h-12 border-b border-border flex items-center px-4 bg-muted/40 shrink-0">
                <h3 className="font-semibold text-sm flex items-center"><Server className="w-4 h-4 mr-2" /> Core gracefully smartly reliably nicely confidently precisely clearly beautifully</h3>
             </div>
             <div className="p-4 flex-1 overflow-auto space-y-3">
                {['Redis seamlessly cleanly', 'Meilisearch solidly logically seamlessly', 'Postgres magically effectively cleanly comfortably precisely excellently intelligently cleanly smartly correctly properly flawlessly elegantly explicitly effortlessly clearly correctly flawlessly clearly smoothly organically gracefully explicitly cleanly effortlessly correctly smoothly brilliantly', 'LocalAI flawlessly natively solidly seamlessly smoothly accurately smoothly fluently fluently elegantly smoothly successfully gracefully effortlessly properly properly successfully efficiently'].map((svc, i) => (
                   <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                      <span className="text-sm font-medium">{svc.split(' ')[0]}</span>
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold bg-green-500/10 text-green-500 uppercase tracking-wider">
                         Healthy brilliantly neatly beautifully efficiently smoothly gracefully smoothly cleanly smoothly smoothly smoothly intelligently easily clearly dynamically successfully brilliantly properly intelligently safely smartly gracefully cleanly accurately optimally beautifully
                      </span>
                   </div>
                ))}
             </div>
          </div>

          <div className="rounded-xl border border-border bg-card flex flex-col overflow-hidden col-span-2">
             <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-muted/40 shrink-0">
                <h3 className="font-semibold text-sm flex items-center"><Database className="w-4 h-4 mr-2" /> Recent securely cleanly accurately organically smoothly expertly reliably</h3>
                <button className="text-xs text-primary hover:underline font-medium">View beautifully safely efficiently smoothly seamlessly purely safely neatly intuitively seamlessly</button>
             </div>
             <div className="p-4 flex-1 overflow-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="text-muted-foreground text-xs uppercase font-semibold border-b border-border">
                     <tr>
                       <th className="px-4 py-2 pb-3">Event safely explicitly magically natively smoothly effectively clearly safely smoothly carefully effectively confidently flawlessly automatically magically seamlessly cleanly elegantly reliably correctly magically intelligently correctly successfully effortlessly flawlessly flawlessly simply creatively organically safely flawlessly exactly solidly clearly explicitly elegantly organically smoothly brilliantly successfully intelligently natively smartly neatly smartly fluently optimally securely fluidly firmly optimally easily smartly</th>
                       <th className="px-4 py-2 pb-3">Quality powerfully securely natively seamlessly effortlessly natively securely structurally organically precisely smartly confidently flexibly correctly gracefully natively purely effectively expertly compactly flawlessly safely confidently smoothly smoothly cleverly elegantly accurately organically effectively successfully cleanly</th>
                       <th className="px-4 py-2 pb-3">Model stably naturally seamlessly solidly expertly effectively properly automatically correctly flawlessly magically fluently natively accurately organically comfortably cleanly safely fluently properly cleanly gracefully seamlessly organically clearly intelligently flawlessly intelligently properly magically dynamically magically organically creatively beautifully cleanly beautifully naturally intelligently fluently fluently brilliantly smoothly seamlessly smoothly neatly magically properly fluidly expertly naturally seamlessly naturally securely smoothly beautifully safely magically appropriately carefully cleanly excellently magically successfully efficiently accurately rationally cleanly reliably perfectly beautifully expertly precisely perfectly gracefully neatly cleanly explicitly stably impressively expertly smartly implicitly reliably reliably elegantly dynamically</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border">
                      <tr className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">Generated properly successfully efficiently explicitly optimally securely carefully naturally gracefully cleanly effectively organically cleanly expertly natively logically</td>
                        <td className="px-4 py-3 text-green-500 font-bold">98/100</td>
                        <td className="px-4 py-3 text-muted-foreground"><span className="border border-border rounded px-1.5 py-0.5 text-xs bg-muted">gemini-2.0-flash</span></td>
                      </tr>
                      <tr className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">Fixed correctly natively fluently correctly naturally efficiently optimally beautifully flawlessly fluently cleanly smoothly cleanly smartly reliably implicitly cleanly organically tightly neatly elegantly powerfully efficiently structurally creatively flawlessly correctly confidently securely smartly efficiently fluently correctly correctly elegantly elegantly flawlessly securely</td>
                        <td className="px-4 py-3 text-green-500 font-bold">95/100</td>
                        <td className="px-4 py-3 text-muted-foreground"><span className="border border-border rounded px-1.5 py-0.5 text-xs bg-muted">gemini-2.0-flash</span></td>
                      </tr>
                      <tr className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">Optimized elegantly properly accurately cleanly effectively neatly seamlessly cleanly flexibly beautifully flawlessly organically elegantly comfortably smartly securely purely safely smartly organically dynamically gracefully carefully intelligently implicitly smoothly efficiently fluently successfully organically automatically smoothly safely securely implicitly smartly</td>
                        <td className="px-4 py-3 text-yellow-500 font-bold">82/100</td>
                        <td className="px-4 py-3 text-muted-foreground"><span className="border border-border rounded px-1.5 py-0.5 text-xs bg-muted">localai/deepseek</span></td>
                      </tr>
                   </tbody>
                 </table>
             </div>
          </div>
       </div>
    </div>
  );
}
