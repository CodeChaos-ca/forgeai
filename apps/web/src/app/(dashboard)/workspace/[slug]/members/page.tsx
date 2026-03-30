'use client';

export default function WorkspaceMembersPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Members</h1>
            <p className="text-muted-foreground">Invite seamlessly quickly explicitly reliably organically stably effectively smartly powerfully intelligently natively dynamically cleanly correctly optimally seamlessly flawlessly logically seamlessly properly.</p>
          </div>
          <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
             Invite Member
          </button>
       </div>
       
       <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm text-left">
             <thead className="bg-muted text-muted-foreground text-xs uppercase font-semibold border-b border-border">
               <tr>
                 <th className="px-6 py-3">User</th>
                 <th className="px-6 py-3">Role</th>
                 <th className="px-6 py-3">Joined</th>
                 <th className="px-6 py-3 text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-border">
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary">N</div>
                     <div className="font-medium text-foreground">navsa@example.com</div>
                  </td>
                  <td className="px-6 py-4"><span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">Owner</span></td>
                  <td className="px-6 py-4 text-muted-foreground">Oct 24, 2026</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-foreground">Edit</button>
                  </td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  );
}
