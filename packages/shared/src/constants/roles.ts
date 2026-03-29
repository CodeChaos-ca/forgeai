import { UserRole } from '../types/user';
import { WorkspaceRole } from '../types/workspace';

export const USER_ROLES: Record<string, UserRole> = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
} as const;

export const WORKSPACE_ROLES: Record<string, WorkspaceRole> = {
  OWNER: 'owner',
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
} as const;

export const ROLE_PERMISSIONS = {
  [WORKSPACE_ROLES.OWNER]: ['manage_workspace', 'manage_billing', 'manage_members', 'manage_projects', 'edit_code', 'view_projects'],
  [WORKSPACE_ROLES.ADMIN]: ['manage_members', 'manage_projects', 'edit_code', 'view_projects'],
  [WORKSPACE_ROLES.EDITOR]: ['edit_code', 'view_projects'],
  [WORKSPACE_ROLES.VIEWER]: ['view_projects']
} as const;
