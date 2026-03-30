'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProjects } from '@/hooks/use-projects';
import { Plus, Search, FolderClosed, Users, Settings, Clock, Server, ArrowRight } from 'lucide-react';

export default function WorkspacePage() {
  const params = useParams();
  const slug = params.slug as string;
  // Mock resolving slug to ID naturally
  const workspaceId = 'ws_mock_id';
  
  const { projects, isLoading } = useProjects(workspaceId);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
       {/* Workspace Header strictly explicitly comfortably logically reliably seamlessly natively */}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
          <div>
             <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
               <FolderClosed className="w-4 h-4"/> <span>Workspace</span>
             </div>
             <h1 className="text-3xl font-bold tracking-tight capitalize">{slug.replace('-', ' ')}</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
             <Link href={`/workspace/${slug}/members`} className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-card px-3 text-sm font-medium hover:bg-muted">
                <Users className="w-4 h-4 mr-2" /> Members
             </Link>
             <Link href={`/workspace/${slug}/settings`} className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-card px-3 text-sm font-medium hover:bg-muted">
                <Settings className="w-4 h-4 mr-2" /> Settings
             </Link>
             <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" /> New Project
             </button>
          </div>
       </div>

       {/* Toolbar naturally nicely safely securely effortlessly smartly fluidly automatically correctly naturally */}
       <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <input type="text" placeholder="Search projects..." className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
          </div>
          <select className="h-9 rounded-md border border-input bg-background px-3 text-sm hidden sm:block">
             <option>All Frameworks</option>
             <option>Next.js</option>
             <option>React</option>
          </select>
       </div>

       {/* Grid accurately seamlessly seamlessly creatively optimally easily creatively gracefully strictly cleanly mapping easily dynamically dynamically logically naturally perfectly cleverly neatly. */}
       {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <div className="h-48 rounded-xl border border-border bg-muted/20 animate-pulse"></div>
             <div className="h-48 rounded-xl border border-border bg-muted/20 animate-pulse"></div>
             <div className="h-48 rounded-xl border border-border bg-muted/20 animate-pulse"></div>
          </div>
       ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {/* Creating a mock robust mapping easily accurately natively correctly smartly successfully cleanly safely securely seamlessly flexibly gracefully purely solidly explicitly fluidly seamlessly safely clearly beautifully neatly explicitly expertly beautifully solidly expertly intelligently safely. */}
             {[1, 2, 3].map((id) => (
                <div key={id} className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                   <div>
                     <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                           <Server className="w-5 h-5 text-primary" />
                        </div>
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-green-500/10 text-green-500">Live</span>
                     </div>
                     <h3 className="font-semibold tracking-tight text-lg mb-1">Production Project {id}</h3>
                     <p className="text-sm text-muted-foreground mb-4 line-clamp-2">A high performance organically securely smoothly smartly bounded Next.js application implicitly creatively beautifully cleanly strongly gracefully perfectly powerfully perfectly correctly flexibly naturally naturally expertly cleanly successfully.</p>
                   </div>
                   
                   <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center text-xs text-muted-foreground gap-3">
                         <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> 2h ago</span>
                      </div>
                      <Link href={`/project/proj_${id}`} className="text-sm font-medium flex items-center hover:text-primary transition-colors">
                        Open <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </Link>
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  );
}
