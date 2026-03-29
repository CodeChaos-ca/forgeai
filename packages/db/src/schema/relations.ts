import { relations } from 'drizzle-orm';
import { users } from './users';
import { sessions } from './sessions';
import { oauthAccounts } from './oauth-accounts';
import { workspaces } from './workspaces';
import { workspaceMembers } from './workspace-members';
import { projects } from './projects';
import { projectVersions } from './project-versions';
import { projectFiles } from './project-files';
import { dataModels } from './data-models';
import { deployments } from './deployments';
import { workflows } from './workflows';
import { workflowRuns } from './workflow-runs';
import { templates } from './templates';
import { testSuites } from './test-suites';
import { notifications } from './notifications';
import { subscriptions } from './subscriptions';
import { credits } from './credits';
import { creditTransactions } from './credit-transactions';
import { invoices } from './invoices';
import { analyticsEvents } from './analytics-events';

// ai
import { aiConversations } from './ai-conversations';
import { aiMessages } from './ai-messages';
import { selfHealEvents } from './self-heal-events';
import { learningPatterns } from './learning-patterns';

// cognitive
import { memoryEpisodes } from './cognitive/memory-episodes';
import { skills } from './cognitive/skills';
import { skillVersions } from './cognitive/skill-versions';
import { knowledgeBase } from './cognitive/knowledge-base';
import { promptStrategies } from './cognitive/prompt-strategies';
import { qualityBenchmarks } from './cognitive/quality-benchmarks';
import { benchmarkRuns } from './cognitive/benchmark-runs';
import { learningQueue } from './cognitive/learning-queue';

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  oauthAccounts: many(oauthAccounts),
  workspaces: many(workspaces),
  workspaceMembers: many(workspaceMembers),
  projects: many(projects),
  deployments: many(deployments),
  subscriptions: many(subscriptions),
  credits: many(credits),
  creditTransactions: many(creditTransactions),
  invoices: many(invoices),
  aiConversations: many(aiConversations),
  notifications: many(notifications),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  workspace: one(workspaces, { fields: [projects.workspaceId], references: [workspaces.id] }),
  versions: many(projectVersions),
  files: many(projectFiles),
  dataModels: many(dataModels),
  deployments: many(deployments),
  workflows: many(workflows),
  testSuites: many(testSuites),
  aiConversations: many(aiConversations),
  selfHealEvents: many(selfHealEvents),
}));

export const deploymentsRelations = relations(deployments, ({ one }) => ({
  project: one(projects, { fields: [deployments.projectId], references: [projects.id] }),
  version: one(projectVersions, { fields: [deployments.versionId], references: [projectVersions.id] }),
}));

export const aiConversationsRelations = relations(aiConversations, ({ one, many }) => ({
  project: one(projects, { fields: [aiConversations.projectId], references: [projects.id] }),
  user: one(users, { fields: [aiConversations.userId], references: [users.id] }),
  messages: many(aiMessages),
}));

export const promptStrategiesRelations = relations(promptStrategies, ({ one, many }) => ({
  parent: one(promptStrategies, { fields: [promptStrategies.parentId], references: [promptStrategies.id] }),
  children: many(promptStrategies, { relationName: 'parentChildren' }),
}));

export const benchmarkRunsRelations = relations(benchmarkRuns, ({ one }) => ({
  benchmark: one(qualityBenchmarks, { fields: [benchmarkRuns.benchmarkId], references: [qualityBenchmarks.id] }),
  promptStrategy: one(promptStrategies, { fields: [benchmarkRuns.promptStrategyId], references: [promptStrategies.id] })
}));

export const knowledgeBaseRelations = relations(knowledgeBase, ({ one }) => ({
  supersededByRef: one(knowledgeBase, { fields: [knowledgeBase.supersededBy], references: [knowledgeBase.id] })
}));

export const learningQueueRelations = relations(learningQueue, ({ one }) => ({
  sourceEpisode: one(memoryEpisodes, { fields: [learningQueue.sourceEpisodeId], references: [memoryEpisodes.id] }),
  skillCreated: one(skills, { fields: [learningQueue.skillCreatedId], references: [skills.id] })
}));
