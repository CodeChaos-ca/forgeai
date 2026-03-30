export const queryKeys = {
  user: ['user'] as const,
  workspaces: {
    all: ['workspaces'] as const,
    detail: (id: string) => ['workspaces', id] as const,
  },
  projects: {
    all: (workspaceId?: string) => ['projects', { workspaceId }] as const,
    detail: (id: string) => ['projects', id] as const,
    files: (projectId: string) => ['projects', projectId, 'files'] as const,
  },
  deployments: {
    list: (projectId: string) => ['deployments', projectId] as const,
  },
  billing: {
    status: ['billing', 'status'] as const,
    invoices: ['billing', 'invoices'] as const,
  },
  notifications: ['notifications'] as const,
} as const;
