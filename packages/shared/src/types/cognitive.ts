export type EpisodeType = 'code_generation' | 'bug_fix' | 'optimization' | 'architecture' | 'deployment' | 'workflow' | 'data_model' | 'ui_design' | 'integration' | 'testing' | 'infrastructure' | 'security';
export type EpisodeOutcome = 'success' | 'partial' | 'failure' | 'unknown';
export type EpisodeFeedback = 'positive' | 'negative' | 'none';

export interface MemoryEpisode {
  id: string;
  projectId: string | null;
  userId: string | null;
  episodeType: EpisodeType | null;
  userPrompt: string;
  contextSummary: string;
  approachTaken: string;
  codeGenerated: Record<string, any> | null;
  modelsUsed: Record<string, any> | null;
  skillsUsed: string[];
  outcome: EpisodeOutcome | null;
  userFeedback: EpisodeFeedback;
  qualityScore: number | null;
  wasRolledBack: boolean;
  errorEncountered: string | null;
  lessonsExtracted: Record<string, any>[];
  embedding?: any;
  tags: string[];
  createdAt: Date;
}

export type SkillCategory = 'frontend' | 'backend' | 'database' | 'auth' | 'payment' | 'ai_integration' | 'deployment' | 'testing' | 'performance' | 'security' | 'accessibility' | 'seo' | 'animation' | 'realtime' | 'file_handling' | 'email' | 'workflow' | 'data_visualization' | 'mobile' | 'i18n' | 'agentic';
export type SkillDifficulty = 'trivial' | 'simple' | 'moderate' | 'complex' | 'expert';
export type SkillSource = 'built_in' | 'learned_from_usage' | 'learned_from_docs' | 'learned_from_community' | 'auto_discovered' | 'mcp_integration' | 'a2a_integration';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory | null;
  description: string;
  difficultyLevel: SkillDifficulty | null;
  promptStrategy: string;
  codePatterns: Record<string, any>;
  dependencies: string[];
  requiredPackages: Record<string, any>[];
  exampleInput: string | null;
  exampleOutput: Record<string, any> | null;
  antiPatterns: Record<string, any>[];
  commonMistakes: Record<string, any>[];
  timesUsed: number;
  successCount: number;
  failureCount: number;
  avgQualityScore: number;
  lastImprovedAt: Date | null;
  version: number;
  source: SkillSource | null;
  isActive: boolean;
  embedding?: any;
  createdAt: Date;
  updatedAt: Date;
}

export type SkillChangeSource = 'feedback_loop' | 'pattern_mining' | 'doc_learning' | 'manual' | 'a_b_test_winner' | 'mcp_update' | 'a2a_learning';

export interface SkillVersion {
  id: string;
  skillId: string;
  version: number;
  promptStrategy: string;
  codePatterns: Record<string, any>;
  antiPatterns: Record<string, any>[];
  changeReason: string;
  changeSource: SkillChangeSource | null;
  qualityScoreBefore: number | null;
  qualityScoreAfter: number | null;
  createdAt: Date;
}

export type KnowledgeSourceType = 'official_docs' | 'github_readme' | 'stackoverflow' | 'blog_post' | 'user_feedback' | 'error_resolution' | 'best_practice' | 'deprecation_notice' | 'security_advisory' | 'performance_tip' | 'generated_lesson' | 'mcp_server_docs' | 'a2a_agent_docs' | 'agentic_pattern';

export interface KnowledgeEntry {
  id: string;
  sourceType: KnowledgeSourceType | null;
  sourceUrl: string | null;
  title: string;
  content: string;
  contentSummary: string;
  technology: string | null;
  versionRange: string | null;
  relevanceScore: number;
  timesRetrieved: number;
  timesHelpful: number;
  isOutdated: boolean;
  outdatedReason: string | null;
  supersededBy: string | null;
  embedding?: any;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type PromptTaskType = 'code_generation' | 'bug_fixing' | 'optimization' | 'architecture_planning' | 'test_generation' | 'code_review' | 'explanation' | 'refactoring' | 'ui_design' | 'data_modeling';

export interface PromptStrategy {
  id: string;
  name: string;
  taskType: PromptTaskType | null;
  systemPrompt: string;
  variables: Record<string, any>[];
  strategyNotes: string | null;
  generation: number;
  parentId: string | null;
  mutationDescription: string | null;
  timesUsed: number;
  totalQualityScore: number;
  avgQualityScore: number;
  positiveFeedbackCount: number;
  negativeFeedbackCount: number;
  rollbackCount: number;
  isActive: boolean;
  isChampion: boolean;
  tournamentWins: number;
  tournamentLosses: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QualityBenchmark {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  inputPrompt: string;
  expectedFeatures: Record<string, any>;
  rubric: Record<string, any>;
  maxScore: number;
  isActive: boolean;
  createdAt: Date;
}

export interface BenchmarkRun {
  id: string;
  benchmarkId: string;
  promptStrategyId: string;
  modelUsed: string;
  skillsUsed: string[];
  score: number;
  maxScore: number;
  scoreBreakdown: Record<string, any> | null;
  latencyMs: number | null;
  tokensUsed: number | null;
  createdAt: Date;
}

export type LearningQueueSource = 'user_request' | 'error_pattern' | 'new_technology' | 'competitor_feature' | 'community_trend' | 'benchmark_failure' | 'dependency_update' | 'mcp_discovery' | 'a2a_discovery' | 'agentic_pattern';
export type LearningStatus = 'queued' | 'researching' | 'learning' | 'testing' | 'complete' | 'failed' | 'deferred';

export interface LearningQueueItem {
  id: string;
  topic: string;
  category: string;
  priority: number;
  reason: string;
  detectedFrom: LearningQueueSource | null;
  sourceEpisodeId: string | null;
  learningStatus: LearningStatus;
  researchResults: Record<string, any> | null;
  skillCreatedId: string | null;
  knowledgeCreatedIds: string[] | null;
  attemptedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
}
