import { z } from 'zod';

const brainConfigSchema = z.object({
  evolution_schedules: z.object({
    nightly: z.string().default("0 3 * * *"),
    weekly: z.string().default("0 2 * * 0"),
    monthly: z.string().default("0 2 1 * *"),
    security: z.string().default("0 5 * * *")
  }),
  health_check_interval_ms: z.number().default(30000),
  quota_check_interval_ms: z.number().default(300000),
  error_rate_check_interval_ms: z.number().default(60000),
  supabase_keepalive_days: z.number().default(6),
  
  ai_routing_weights: z.object({
    code_generation: z.record(z.number()).default({ gemini: 0.5, groq: 0.3, localai: 0.2 }),
    complex_reasoning: z.record(z.number()).default({ gemini: 0.6, groq: 0.1, localai: 0.3 }),
    quick_edit: z.record(z.number()).default({ groq: 0.6, localai: 0.3, gemini: 0.1 }),
    embedding: z.record(z.number()).default({ gemini: 0.5, huggingface: 0.3, localai: 0.2 }),
    analysis_judging: z.record(z.number()).default({ localai: 0.7, groq: 0.3 })
  }),

  quality_thresholds: z.object({
    minimum_acceptable: z.number().default(60),
    good: z.number().default(75),
    excellent: z.number().default(85),
    max_regeneration_attempts: z.number().default(3)
  }),

  skill_thresholds: z.object({
    min_match_confidence: z.number().default(0.5),
    auto_deprecate_success_rate: z.number().default(0.2),
    auto_deprecate_min_uses: z.number().default(100),
    composition_min_episodes: z.number().default(10),
    composition_quality_delta: z.number().default(5)
  }),

  prompt_evolution: z.object({
    min_uses_for_ab_test: z.number().default(20),
    min_quality_delta: z.number().default(5),
    max_active_per_task: z.number().default(5),
    mutations_per_tournament: z.number().default(2)
  }),

  learning_queue_max_daily: z.number().default(5),

  modules_enabled: z.object({
    nightly: z.boolean().default(true),
    weekly: z.boolean().default(true),
    monthly: z.boolean().default(true),
    security: z.boolean().default(true),
    health_monitoring: z.boolean().default(true),
    quota_tracking: z.boolean().default(true),
    error_monitoring: z.boolean().default(true),
    deployment_watching: z.boolean().default(true),
    supabase_keepalive: z.boolean().default(true),
    dependency_updates: z.boolean().default(true),
    model_benchmarking: z.boolean().default(true),
    free_tier_scouting: z.boolean().default(true),
    skill_acquisition: z.boolean().default(true),
    prompt_evolution: z.boolean().default(true),
    ux_optimization: z.boolean().default(true),
    mcp_scanning: z.boolean().default(true),
    a2a_scanning: z.boolean().default(true)
  })
});

export type BrainConfig = z.infer<typeof brainConfigSchema>;

export function loadBrainConfig(): BrainConfig {
  const overrides = {
    // Read structured env vars here if mapping requires
  };
  
  return brainConfigSchema.parse(overrides);
}
