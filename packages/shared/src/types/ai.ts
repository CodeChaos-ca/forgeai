export type ConversationMode = 'build' | 'discuss' | 'debug' | 'optimize';

export interface AiConversation {
  id: string;
  projectId: string;
  userId: string;
  mode: ConversationMode;
  title: string | null;
  messageCount: number;
  totalTokensUsed: number;
  totalCreditsUsed: number;
  primaryModelUsed: string | null;
  isArchived: boolean;
  satisfactionRating: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageRole = 'user' | 'assistant' | 'system';
export type FeedbackType = 'positive' | 'negative';

export interface AiMessage {
  id: string;
  conversationId: string;
  role: MessageRole | null;
  content: string;
  modelUsed: string | null;
  tokensInput: number;
  tokensOutput: number;
  latencyMs: number | null;
  creditsCharged: number;
  fileChanges: Record<string, any> | null;
  impactAnalysis: Record<string, any> | null;
  wasApplied: boolean;
  wasRolledBack: boolean;
  feedback: FeedbackType | null;
  feedbackComment: string | null;
  error: Record<string, any> | null;
  createdAt: Date;
}

export type SelfHealStatus = 'detected' | 'analyzing' | 'fix_proposed' | 'fix_applied' | 'verified' | 'failed' | 'dismissed';

export interface SelfHealEvent {
  id: string;
  projectId: string;
  deploymentId: string | null;
  errorType: string;
  errorMessage: string;
  errorStack: string | null;
  errorFrequency: number;
  rootCauseAnalysis: Record<string, any> | null;
  proposedFix: Record<string, any> | null;
  fixApplied: boolean;
  fixVerified: boolean;
  userNotified: boolean;
  userApproved: boolean | null;
  resolutionTimeMs: number | null;
  status: SelfHealStatus;
  createdAt: Date;
  resolvedAt: Date | null;
}

export type LearningPatternType = 'prompt_pattern' | 'error_pattern' | 'feature_demand' | 'code_optimization' | 'template_candidate' | 'integration_demand';

export interface LearningPattern {
  id: string;
  patternType: LearningPatternType | null;
  patternSignature: string;
  patternData: Record<string, any>;
  exampleInstances: Record<string, any>[];
  frequency: number;
  confidence: number;
  actionTaken: string | null;
  actionResult: Record<string, any> | null;
  isResolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
