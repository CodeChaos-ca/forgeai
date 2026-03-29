import { UserRole, UserPlan } from '../types/user';
import { WorkspaceRole } from '../types/workspace';
import { USER_ROLES, WORKSPACE_ROLES } from '../constants/roles';

export type Action = 
  | 'create_project'
  | 'delete_project'
  | 'manage_workspace'
  | 'manage_billing'
  | 'manage_members'
  | 'manage_integrations'
  | 'edit_code'
  | 'view_projects'
  | 'run_workflow'
  | 'deploy_project'
  | 'access_admin_panel'
  | 'manage_system_settings';

export interface ActionContext {
  userRole?: UserRole;
  workspaceRole?: WorkspaceRole;
  plan?: UserPlan;
  isResourceOwner?: boolean;
}

const WORKSPACE_PERMISSION_MATRIX: Record<WorkspaceRole, Action[]> = {
  owner: [
    'create_project', 'delete_project', 'manage_workspace', 
    'manage_billing', 'manage_members', 'manage_integrations', 
    'edit_code', 'view_projects', 'run_workflow', 'deploy_project'
  ],
  admin: [
    'create_project', 'manage_members', 'manage_integrations', 
    'edit_code', 'view_projects', 'run_workflow', 'deploy_project'
  ],
  editor: [
    'edit_code', 'view_projects', 'run_workflow'
  ],
  viewer: [
    'view_projects'
  ]
};

const SYSTEM_PERMISSION_MATRIX: Record<UserRole, Action[]> = {
  super_admin: [
    'access_admin_panel', 'manage_system_settings', 'create_project', 
    'delete_project', 'manage_workspace', 'manage_billing', 
    'manage_members', 'manage_integrations', 'edit_code', 
    'view_projects', 'run_workflow', 'deploy_project'
  ],
  admin: [
    'access_admin_panel', 'create_project', 'manage_integrations', 
    'view_projects', 'run_workflow'
  ],
  user: []
};

export function canUserDo(action: Action, context: ActionContext): boolean {
  if (context.userRole === USER_ROLES.SUPER_ADMIN) {
    return true;
  }

  if (context.userRole && SYSTEM_PERMISSION_MATRIX[context.userRole].includes(action)) {
    return true;
  }

  if (context.isResourceOwner) {
    return true;
  }

  if (context.workspaceRole && WORKSPACE_PERMISSION_MATRIX[context.workspaceRole].includes(action)) {
    return true;
  }

  return false;
}
