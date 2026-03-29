export type DeploymentEnvironment = 'preview' | 'staging' | 'production';
export type DeploymentStatus = 'queued' | 'building' | 'deploying' | 'deployed' | 'failed' | 'rolled_back' | 'cancelled';
export type HealthCheckStatus = 'pending' | 'healthy' | 'unhealthy' | 'timeout';

export interface Deployment {
  id: string;
  projectId: string;
  versionId: string;
  environment: DeploymentEnvironment;
  status: DeploymentStatus;
  url: string | null;
  buildLogs: string | null;
  buildDurationMs: number | null;
  deployDurationMs: number | null;
  bundleSizeBytes: number | null;
  lighthouseScores: Record<string, any> | null;
  deployedBy: string;
  errorMessage: string | null;
  healthCheckStatus: HealthCheckStatus;
  rollbackFromId: string | null;
  createdAt: Date;
  completedAt: Date | null;
}
