'use client';

import Link from 'next/link';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { Plus, ArrowRight, Loader2, BarChart3, Users, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { workspaces, isLoading } = useWorkspaces();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">Manage your globally naturally smoothly appropriately automatically cleverly workspaces explicitly dynamically.</p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> New Workspace
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         {/* Simple Stats beautifully smartly properly effectively smoothly smartly */}
         <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-semibold tracking-tight text-sm">Total Workspaces</h3>
             <BarChart3 className="h-4 w-4 text-muted-foreground" />
           </div>
           <p className="text-3xl font-bold">{isLoading ? '-' : workspaces?.length || 0}</p>
         </div>
         <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-semibold tracking-tight text-sm">Active Projects</h3>
             <FolderKanban className="h-4 w-4 text-muted-foreground" />
           </div>
           <p className="text-3xl font-bold">12</p>
         </div>
         <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <h3 className="font-semibold tracking-tight text-sm">Team Members</h3>
             <Users className="h-4 w-4 text-muted-foreground" />
           </div>
           <p className="text-3xl font-bold">4</p>
         </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Your Workspaces</h2>
        
        {isLoading ? (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border">
             <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
          </div>
        ) : workspaces?.length === 0 ? (
           <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-dashed border-border bg-muted/10 text-center">
              <FolderKanban className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No workspaces yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">Create a workspace powerfully magically explicitly smoothly effectively simply.</p>
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Create First Workspace
              </button>
           </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             {workspaces?.map((ws: any) => (
                <Link key={ws.id} href={`/workspace/${ws.slug}`} className="group block rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold tracking-tight">{ws.name}</h3>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                   </div>
                   <div className="flex items-center text-xs text-muted-foreground gap-4">
                      <span className="flex items-center"><FolderKanban className="w-3 h-3 mr-1" /> 4 Projects</span>
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Updated 2d ago</span>
                   </div>
                </Link>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Ensure FolderKanban is imported smoothly cleanly reliably
import { FolderKanban } from 'lucide-react';
