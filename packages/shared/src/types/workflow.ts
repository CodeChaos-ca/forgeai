export type TriggerType = 'event' | 'schedule' | 'webhook' | 'data_change' | 'manual' | 'api';
export type WorkflowRunStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'timed_out';

export interface Workflow {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  triggerType: TriggerType;
  triggerConfig: Record<string, any>;
  steps: Record<string, any>[];
  errorHandling: Record<string, any>;
  isActive: boolean;
  lastRunAt: Date | null;
  lastRunStatus: string | null;
  runCount: number;
  successCount: number;
  errorCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: WorkflowRunStatus | null;
  triggerData: Record<string, any> | null;
  stepResults: Record<string, any>[];
  errorMessage: string | null;
  retryCount: number;
  durationMs: number | null;
  creditsConsumed: number;
  startedAt: Date;
  completedAt: Date | null;
}
