export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  ownerId: string;
  plan: string;
  ssoEnabled: boolean;
  ssoConfig: Record<string, any> | null;
  settings: Record<string, any>;
  maxProjects: number;
  maxMembers: number;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkspaceRole = 'owner' | 'admin' | 'editor' | 'viewer';
export type InviteStatus = 'pending' | 'accepted' | 'declined';

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  invitedEmail: string | null;
  inviteToken: string | null;
  inviteStatus: InviteStatus;
  invitedBy: string | null;
  joinedAt: Date;
}
