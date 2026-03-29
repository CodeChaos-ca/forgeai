export * from './session-analyzer';
export * from './prompt-suggester';
export * from './proactive-assistant';
export * from './onboarding-optimizer';

import { SessionAnalyzer } from './session-analyzer';
import { PromptSuggester } from './prompt-suggester';
import { ProactiveAssistant } from './proactive-assistant';
import { OnboardingOptimizer } from './onboarding-optimizer';

export const sessionTracker = new SessionAnalyzer();
export const promptHelper = new PromptSuggester();
export const activeHelper = new ProactiveAssistant();
export const funnelOptimizer = new OnboardingOptimizer();
