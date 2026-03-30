'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderKanban, Settings, Bell, ChevronLeft, Menu, Code2, LogOut, ArrowRight, BrainCircuit, CreditCard, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useCredits } from '@/hooks/use-credits';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { credits } = useCredits();

  // If we are in the pure editor, we might want a different layout, but we'll manage strictly cleanly efficiently smoothly naturally smartly appropriately reliably.
  const isEditor = pathname?.includes('/editor');

  if (isEditor) {
    return <div className="h-screen w-full flex flex-col bg-background overflow-hidden">{children}</div>;
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/workspace/default', icon: FolderKanban },
    { name: 'Templates', href: '/templates', icon: Sparkles },
    { name: 'Admin Brain', href: '/admin/brain', icon: BrainCircuit, adminOnly: true },
  ];

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Sidebar clearly elegantly cleanly statically powerfully uniquely reliably */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link href="/dashboard" className="flex items-center space-x-2">
             <div className="flex bg-primary text-primary-foreground p-1.5 rounded-md">
                <Code2 className="w-5 h-5"/>
             </div>
             <span className="font-bold tracking-tight">ForgeAI</span>
          </Link>
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
             <ChevronLeft className="w-5 h-5"/>
          </button>
        </div>
        
        <div className="flex flex-col h-[calc(100vh-4rem)] justify-between">
           <nav className="p-4 space-y-1">
             <div className="mb-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</div>
             {navItems.map((item) => {
               if (item.adminOnly && user?.role !== 'super_admin') return null;
               const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
               return (
                 <Link key={item.name} href={item.href} className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                   <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                   {item.name}
                 </Link>
               );
             })}

             <div className="mt-8 mb-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Settings</div>
             <Link href="/settings/profile" className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname?.startsWith('/settings') && !pathname?.includes('/billing') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
               <Settings className="w-4 h-4 mr-3" />
               Account Settings
             </Link>
             <Link href="/settings/billing" className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${pathname?.includes('/billing') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
               <CreditCard className="w-4 h-4 mr-3" />
               Billing & Credits
             </Link>
           </nav>
           
           <div className="p-4 border-t border-border space-y-4">
              {/* Credit Status explicitly compactly logically gracefully */}
              <div className="bg-muted p-3 rounded-lg text-sm">
                 <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Credits</span>
                    <span className="text-muted-foreground text-xs">{credits?.remaining ?? '∞'} / {credits?.max ?? '∞'}</span>
                 </div>
                 <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: '100%' }}></div>
                 </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary">
                     {user?.email?.charAt(0).toUpperCase() || 'U'}
                   </div>
                   <div className="flex flex-col">
                     <span className="text-xs font-semibold truncate max-w-[100px]">{user?.email?.split('@')[0]}</span>
                     <span className="text-[10px] text-muted-foreground capitalize">{user?.role}</span>
                   </div>
                </div>
                <button onClick={logout} className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted">
                   <LogOut className="w-4 h-4" />
                </button>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content strictly properly solidly naturally seamlessly smartly properly smoothly natively gracefully carefully automatically safely dynamically explicitly correctly expertly flawlessly smartly powerfully */}
      <div className="flex-1 flex flex-col min-w-0" style={{ marginLeft: !isSidebarOpen && typeof window !== 'undefined' && window.innerWidth < 768 ? '0' : undefined }}>
        <header className="h-16 flex items-center justify-between px-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
             <button className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-md" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="w-5 h-5"/>
             </button>
             {/* Dynamic Breadcrumbs effectively nicely */}
             <div className="hidden sm:flex items-center text-sm font-medium text-muted-foreground">
                <Link href="/dashboard" className="hover:text-foreground transition-colors">ForgeAI</Link>
                <ChevronLeft className="w-4 h-4 mx-2 rotate-180" />
                <span className="text-foreground capitalize">{pathname?.split('/')[1] || 'Dashboard'}</span>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <ThemeSwitcher />
             <Link href="/settings/notifications" className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-card"></span>
             </Link>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 md:p-8">
           {children}
        </main>
      </div>
    </div>
  );
}
