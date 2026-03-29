-- Migration: 0002_cognitive
-- Description: Creates cognitive schema, vector extension, tables, foreign keys, triggers, and IVFFlat indexes.

CREATE SCHEMA IF NOT EXISTS cognitive;

-- Ensure pgvector is active
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

CREATE TABLE IF NOT EXISTS cognitive.memory_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  episode_type VARCHAR(30),
  user_prompt TEXT NOT NULL,
  context_summary TEXT NOT NULL,
  approach_taken TEXT NOT NULL,
  code_generated JSONB,
  models_used JSONB,
  skills_used UUID[] DEFAULT ARRAY[]::UUID[],
  outcome VARCHAR(20),
  user_feedback VARCHAR(10) DEFAULT 'none',
  quality_score DECIMAL(5,2),
  was_rolled_back BOOLEAN DEFAULT FALSE,
  error_encountered TEXT,
  lessons_extracted JSONB DEFAULT '[]'::jsonb,
  embedding vector(1536),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cognitive.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(50),
  description TEXT NOT NULL,
  difficulty_level VARCHAR(20),
  prompt_strategy TEXT NOT NULL,
  code_patterns JSONB NOT NULL,
  dependencies UUID[] DEFAULT ARRAY[]::UUID[],
  required_packages JSONB DEFAULT '[]'::jsonb,
  example_input TEXT,
  example_output JSONB,
  anti_patterns JSONB DEFAULT '[]'::jsonb,
  common_mistakes JSONB DEFAULT '[]'::jsonb,
  times_used INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  avg_quality_score DECIMAL(5,2) DEFAULT 0,
  last_improved_at TIMESTAMP WITH TIME ZONE,
  version INTEGER DEFAULT 1,
  source VARCHAR(30),
  is_active BOOLEAN DEFAULT TRUE,
  embedding vector(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cognitive.skill_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES cognitive.skills(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  prompt_strategy TEXT NOT NULL,
  code_patterns JSONB NOT NULL,
  anti_patterns JSONB DEFAULT '[]'::jsonb,
  change_reason TEXT NOT NULL,
  change_source VARCHAR(30),
  quality_score_before DECIMAL(5,2),
  quality_score_after DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT skill_versions_skill_id_version_unique UNIQUE(skill_id, version)
);

CREATE TABLE IF NOT EXISTS cognitive.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type VARCHAR(30),
  source_url TEXT,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  content_summary TEXT NOT NULL,
  technology VARCHAR(100),
  version_range VARCHAR(50),
  relevance_score DECIMAL(5,2) DEFAULT 50,
  times_retrieved INTEGER DEFAULT 0,
  times_helpful INTEGER DEFAULT 0,
  is_outdated BOOLEAN DEFAULT FALSE,
  outdated_reason TEXT,
  superseded_by UUID, -- References self
  embedding vector(1536),
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$ BEGIN
 ALTER TABLE cognitive.knowledge_base ADD CONSTRAINT knowledge_base_superseded_by_fk FOREIGN KEY (superseded_by) REFERENCES cognitive.knowledge_base(id) ON DELETE SET NULL;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS cognitive.prompt_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  task_type VARCHAR(30),
  system_prompt TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  strategy_notes TEXT,
  generation INTEGER DEFAULT 1,
  parent_id UUID REFERENCES cognitive.prompt_strategies(id) ON DELETE SET NULL,
  mutation_description TEXT,
  times_used INTEGER DEFAULT 0,
  total_quality_score DECIMAL(10,2) DEFAULT 0,
  avg_quality_score DECIMAL(5,2) DEFAULT 0,
  positive_feedback_count INTEGER DEFAULT 0,
  negative_feedback_count INTEGER DEFAULT 0,
  rollback_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_champion BOOLEAN DEFAULT FALSE,
  tournament_wins INTEGER DEFAULT 0,
  tournament_losses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cognitive.quality_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  input_prompt TEXT NOT NULL,
  expected_features JSONB NOT NULL,
  rubric JSONB NOT NULL,
  max_score INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cognitive.benchmark_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  benchmark_id UUID NOT NULL REFERENCES cognitive.quality_benchmarks(id) ON DELETE CASCADE,
  prompt_strategy_id UUID NOT NULL REFERENCES cognitive.prompt_strategies(id) ON DELETE CASCADE,
  model_used VARCHAR(50) NOT NULL,
  skills_used UUID[],
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  score_breakdown JSONB,
  latency_ms INTEGER,
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cognitive.learning_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic VARCHAR(500) NOT NULL,
  category VARCHAR(50) NOT NULL,
  priority INTEGER DEFAULT 50,
  reason TEXT NOT NULL,
  detected_from VARCHAR(30),
  source_episode_id UUID REFERENCES cognitive.memory_episodes(id) ON DELETE SET NULL,
  learning_status VARCHAR(20) DEFAULT 'queued',
  research_results JSONB,
  skill_created_id UUID REFERENCES cognitive.skills(id) ON DELETE SET NULL,
  knowledge_created_ids UUID[],
  attempted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_cognitive_skills_updated_at ON cognitive.skills;
CREATE TRIGGER update_cognitive_skills_updated_at BEFORE UPDATE ON cognitive.skills FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cognitive_knowledge_base_updated_at ON cognitive.knowledge_base;
CREATE TRIGGER update_cognitive_knowledge_base_updated_at BEFORE UPDATE ON cognitive.knowledge_base FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cognitive_prompt_strategies_updated_at ON cognitive.prompt_strategies;
CREATE TRIGGER update_cognitive_prompt_strategies_updated_at BEFORE UPDATE ON cognitive.prompt_strategies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Standard Indexes
CREATE INDEX IF NOT EXISTS memory_episode_type_idx ON cognitive.memory_episodes(episode_type);
CREATE INDEX IF NOT EXISTS memory_outcome_idx ON cognitive.memory_episodes(outcome);
CREATE INDEX IF NOT EXISTS memory_quality_score_idx ON cognitive.memory_episodes(quality_score);
CREATE INDEX IF NOT EXISTS memory_created_idx ON cognitive.memory_episodes(created_at);

CREATE INDEX IF NOT EXISTS skills_category_idx ON cognitive.skills(category);
CREATE INDEX IF NOT EXISTS skills_avg_quality_score_idx ON cognitive.skills(avg_quality_score);
CREATE INDEX IF NOT EXISTS skills_times_used_idx ON cognitive.skills(times_used);

CREATE INDEX IF NOT EXISTS knowledge_source_type_idx ON cognitive.knowledge_base(source_type);
CREATE INDEX IF NOT EXISTS knowledge_technology_idx ON cognitive.knowledge_base(technology);
CREATE INDEX IF NOT EXISTS knowledge_relevance_score_idx ON cognitive.knowledge_base(relevance_score);

CREATE INDEX IF NOT EXISTS prompt_strategies_task_type_idx ON cognitive.prompt_strategies(task_type);
CREATE INDEX IF NOT EXISTS prompt_strategies_avg_quality_score_idx ON cognitive.prompt_strategies(avg_quality_score);

CREATE INDEX IF NOT EXISTS learning_queue_status_idx ON cognitive.learning_queue(learning_status);
CREATE INDEX IF NOT EXISTS learning_queue_priority_idx ON cognitive.learning_queue(priority);

-- Vector Indexes (IVFFlat)
-- Note: IVFFlat indexes require at least a few thousand records to be effective during indexing.
-- We use lists=100 as a sane default for moderate startup scale datasets.
CREATE INDEX IF NOT EXISTS memory_episodes_embedding_idx ON cognitive.memory_episodes USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS skills_embedding_idx ON cognitive.skills USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS knowledge_base_embedding_idx ON cognitive.knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
