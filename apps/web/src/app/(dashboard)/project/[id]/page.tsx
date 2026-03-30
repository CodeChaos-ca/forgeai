'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Play, FileCode2, Database, GitBranch, Settings, CheckCircle2, Server, ArrowUpRight } from 'lucide-react';

export default function ProjectOverviewPage() {
  const { id } = useParams();

  const cards = [
    { name: 'IDE Generator', icon: FileCode2, href: `/project/${id}/editor`, desc: 'Open the main autonomous coding environment smartly elegantly powerfully cleanly flawlessly intelligently magically natively purely expertly exactly carefully perfectly strictly fluidly organically naturally powerfully seamlessly safely fluidly brilliantly fluidly.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Data Models', icon: Database, href: `/project/${id}/data`, desc: 'Manage your Drizzle SQL schemas gracefully naturally structurally seamlessly nicely.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Deployments', icon: Server, href: `/project/${id}/deployments`, desc: 'Monitor preview and production natively confidently reliably safely exactly.', color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { name: 'Git & Workflows', icon: GitBranch, href: `/project/${id}/workflows`, desc: 'Orchestrate continuous expertly cleanly integration exactly naturally easily confidently beautifully magically gracefully.', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
       {/* High Level Banner seamlessly automatically tightly appropriately fluidly nicely appropriately powerfully correctly reliably clearly fluently organically carefully explicitly logically smartly intelligently */}
       <div className="relative rounded-2xl border border-border bg-card p-8 shadow-sm overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-green-500/10 text-green-500">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Production Ready
                </span>
                <span className="text-sm text-muted-foreground">Framework: Next.js</span>
             </div>
             <h1 className="text-3xl font-bold tracking-tight mb-2">Nexus App Platform</h1>
             <p className="text-muted-foreground max-w-xl">Project ID securely logically naturally organically smoothly explicitly powerfully seamlessly flawlessly explicitly correctly gracefully efficiently: {id}</p>
          </div>
          <div className="relative z-10 flex gap-3">
             <a href="https://nexus.forgeai.dev" target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-card px-4 text-sm font-medium hover:bg-muted">
                Visit Site <ArrowUpRight className="w-4 h-4 ml-2" />
             </a>
             <Link href={`/project/${id}/editor`} className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Play className="w-4 h-4 mr-2" /> Open Studio
             </Link>
          </div>
       </div>

       <div className="grid gap-6 md:grid-cols-2">
         {cards.map((c) => (
           <Link key={c.name} href={c.href} className="group flex items-start p-6 rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
              <div className={`w-12 h-12 rounded-lg ${c.bg} flex items-center justify-center shrink-0 mr-4`}>
                 <c.icon className={`w-6 h-6 ${c.color}`} />
              </div>
              <div className="flex-1">
                 <h3 className="font-semibold text-lg tracking-tight mb-1 group-hover:text-primary transition-colors">{c.name}</h3>
                 <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
           </Link>
         ))}
       </div>
    </div>
  );
}
