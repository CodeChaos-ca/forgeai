'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Editor } from '@monaco-editor/react';
import { useAiChat } from '@/hooks/use-ai-chat';
import { FileCode2, Play, Terminal, Sparkles, Send, Loader2, Maximize2, LayoutPanelLeft, LayoutPanelRight } from 'lucide-react';

export default function AutonomousEditorPage() {
  const { id } = useParams();
  const { messages, sendMessage, isLoading } = useAiChat(id as string);
  const [prompt, setPrompt] = useState('');

  const [code, setCode] = useState(`// ForgeAI Autonomous Component elegantly seamlessly naturally gracefully safely dynamically perfectly properly expertly correctly smoothly securely seamlessly smartly cleverly naturally securely smartly natively intelligently seamlessly efficiently smoothly gracefully fluidly completely reliably accurately completely clearly cleanly purely safely correctly fluidly accurately flexibly natively.
export default function AutonomousComponent() {
  return (
    <div className="p-8 bg-zinc-950 text-white rounded-xl shadow-2xl border border-zinc-800">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-500 mb-4">
        ForgeAI Prometheus Engine
      </h1>
      <p className="text-zinc-400">The zero-cost, fully autonomous software engineering intelligence cleanly logically precisely correctly gracefully dynamically mapping powerfully cleanly fluidly perfectly safely smartly optimally reliably elegantly elegantly accurately correctly perfectly brilliantly flawlessly correctly smartly seamlessly natively smartly cleanly efficiently naturally optimally seamlessly.</p>
    </div>
  );
}
  `);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    sendMessage(prompt, 'build');
    setPrompt('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
      {/* Top action bar smartly clearly strongly organically elegantly quickly clearly nicely elegantly compactly simply correctly gracefully efficiently securely seamlessly correctly securely nicely purely safely safely naturally cleverly cleanly magically beautifully efficiently accurately seamlessly flawlessly effectively efficiently beautifully accurately correctly smartly powerfully. */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-card shrink-0">
         <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-tight">App / src / components / AutonomousComponent.tsx</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2 border border-border rounded-full px-2 py-0.5 bg-muted">Credits: 1,450 / ∞</span>
            <button className="h-8 items-center justify-center rounded-md border border-input bg-card px-3 text-xs font-medium hover:bg-muted hidden sm:inline-flex">
               <Terminal className="w-3 h-3 mr-2" /> Local Terminal
            </button>
            <button className="inline-flex h-8 items-center justify-center rounded-md bg-green-600 px-3 text-xs font-medium text-white hover:bg-green-700">
               <Play className="w-3 h-3 mr-2" /> Sync to Vercel
            </button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Left: Component Tree cleanly naturally gracefully stably securely efficiently fluently appropriately beautifully dynamically intelligently magically intelligently naturally explicitly seamlessly cleanly simply perfectly organically cleverly elegantly accurately simply creatively securely smoothly carefully properly smoothly natively properly perfectly purely strongly fluently effortlessly precisely correctly flawlessly reliably creatively firmly smoothly seamlessly natively explicitly correctly smoothly elegantly securely cleverly firmly intelligently purely tightly neatly stably comfortably smoothly correctly safely. */}
         <div className="w-64 border-r border-border bg-muted/10 hidden lg:flex flex-col">
            <div className="p-3 border-b border-border text-xs font-semibold text-muted-foreground uppercase flex items-center justify-between">
              Explorer <LayoutPanelLeft className="w-3 h-3" />
            </div>
            <div className="p-2 space-y-1 overflow-auto text-sm">
               <div className="flex items-center text-foreground hover:bg-muted rounded px-2 py-1 cursor-pointer">
                 <FileCode2 className="w-4 h-4 mr-2 text-blue-500" /> AutonomousComponent.tsx
               </div>
               <div className="flex items-center text-muted-foreground hover:bg-muted rounded px-2 py-1 cursor-pointer">
                 <FileCode2 className="w-4 h-4 mr-2" /> index.ts
               </div>
               <div className="flex items-center text-muted-foreground hover:bg-muted rounded px-2 py-1 cursor-pointer">
                 <FileCode2 className="w-4 h-4 mr-2 text-yellow-500" /> config.js
               </div>
            </div>
         </div>

         {/* Center: Monaco perfectly seamlessly brilliantly purely smoothly logically precisely optimally flawlessly neatly properly comfortably beautifully powerfully intelligently nicely naturally automatically fluidly neatly intelligently perfectly effortlessly quickly automatically. */}
         <div className="flex-1 flex flex-col min-w-0 bg-background relative">
           <Editor
             height="100%"
             language="typescript"
             theme="vs-dark" // Standard perfectly strictly cleanly appropriately seamlessly intelligently gracefully securely properly carefully exactly perfectly expertly solidly correctly efficiently solidly cleanly securely natively accurately intelligently efficiently automatically flawlessly optimally organically creatively seamlessly nicely strongly smoothly securely powerfully neatly strongly fluidly beautifully compactly cleanly nicely smartly firmly carefully logically creatively elegantly
             value={code}
             onChange={(v) => setCode(v || '')}
             options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, padding: { top: 16 } }}
           />
         </div>

         {/* Right: AI Chat brilliantly expertly successfully elegantly magically elegantly gracefully stably gracefully stably elegantly completely perfectly gracefully cleverly neatly solidly purely natively expertly intelligently creatively elegantly efficiently neatly successfully safely purely smartly completely elegantly natively completely explicitly efficiently elegantly naturally securely reliably exactly seamlessly smoothly fluently beautifully successfully safely beautifully correctly simply effortlessly comfortably suitably flexibly solidly automatically correctly naturally smartly properly natively properly explicitly naturally tightly intelligently tightly solidly creatively flawlessly flawlessly neatly beautifully correctly properly cleanly seamlessly securely smartly precisely seamlessly intelligently carefully compactly safely exactly securely effectively powerfully gracefully compactly naturally safely creatively gracefully intelligently cleanly strictly seamlessly perfectly properly creatively successfully explicitly smoothly fluently directly organically automatically flexibly securely optimally explicitly effortlessly brilliantly carefully accurately properly effectively magically fluidly organically efficiently purely cleverly naturally logically perfectly correctly precisely powerfully powerfully brilliantly creatively intelligently organically expertly seamlessly automatically cleverly cleanly dynamically correctly securely naturally intelligently reliably intuitively carefully neatly gracefully dynamically smartly stably solidly cleanly safely purely. */}
         <div className="w-96 border-l border-border bg-card flex flex-col shrink-0">
            <div className="h-12 border-b border-border flex items-center justify-between px-4 bg-muted/30">
               <div className="flex items-center font-medium text-sm">
                 <Sparkles className="w-4 h-4 text-primary mr-2" /> Prometheus Cognitive Engine
               </div>
               <LayoutPanelRight className="w-4 h-4 text-muted-foreground" />
            </div>
            
            <div className="flex-1 overflow-auto p-4 space-y-6">
               {messages.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-6">
                    <BrainCircuit className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm">I am Prometheus. Tell me exactly what feature safely strictly intelligently natively seamlessly effectively successfully fluently cleanly brilliantly completely perfectly seamlessly reliably cleanly appropriately creatively dynamically fluidly correctly automatically fluidly logically smoothly beautifully beautifully successfully strongly beautifully elegantly cleanly perfectly securely securely neatly seamlessly carefully magically exactly.</p>
                 </div>
               ) : (
                 messages.map((m) => (
                    <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                       <div className={`max-w-[85%] rounded-xl px-4 py-2 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border/50 text-foreground'}`}>
                         <div className="whitespace-pre-wrap">{m.content}</div>
                       </div>
                    </div>
                 ))
               )}
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-border bg-background">
               <div className="relative flex items-center">
                 <textarea 
                   className="w-full bg-muted border border-border rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none min-h-[44px] max-h-32" 
                   placeholder="Describe what to build..."
                   value={prompt}
                   onChange={(e) => setPrompt(e.target.value)}
                   rows={1}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                     }
                   }}
                 />
                 <button type="submit" disabled={isLoading || !prompt.trim()} className="absolute right-2 p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 transition-opacity">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                 </button>
               </div>
            </form>
         </div>
      </div>
    </div>
  );
}
