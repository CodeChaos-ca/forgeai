export type ProjectStatus = 'active' | 'archived' | 'deleted';
export type ProjectVisibility = 'private' | 'public' | 'unlisted';

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  customDomain: string | null;
  subdomain: string;
  environmentVariables: Record<string, any>;
  settings: Record<string, any>;
  techStack: Record<string, any>;
  seoConfig: Record<string, any>;
  currentVersion: number;
  totalDeployments: number;
  deployedAt: Date | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type VersionChangeSource = 'ai' | 'manual' | 'rollback' | 'import' | 'template';

export interface ProjectVersion {
  id: string;
  projectId: string;
  versionNumber: number;
  snapshotData: Record<string, any>;
  fileChanges: Record<string, any>;
  databaseSchemaSnapshot: Record<string, any> | null;
  changeSource: VersionChangeSource | null;
  changeDescription: string;
  aiConversationId: string | null;
  createdBy: string;
  isDeployed: boolean;
  testResultsSummary: Record<string, any> | null;
  confidenceScore: number | null;
  createdAt: Date;
}

export type FileModifier = 'ai' | 'user' | 'system';

export interface ProjectFile {
  id: string;
  projectId: string;
  filePath: string;
  fileName: string;
  fileExtension: string;
  content: string;
  contentHash: string;
  sizeBytes: number;
  language: string | null;
  isDirectory: boolean;
  isGenerated: boolean;
  isProtected: boolean;
  lastModifiedBy: FileModifier | null;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DataModel {
  id: string;
  projectId: string;
  name: string;
  tableName: string;
  description: string | null;
  fields: Record<string, any>;
  relationships: Record<string, any>[];
  indexesConfig: Record<string, any>[];
  validations: Record<string, any>[];
  permissions: Record<string, any>;
  enableSoftDelete: boolean;
  enableTimestamps: boolean;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}
