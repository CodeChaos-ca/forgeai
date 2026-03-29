-- Migration: 0001_initial
-- Description: Creates core schemas, table definitions, foreign keys, triggers, and indexes.

CREATE SCHEMA IF NOT EXISTS billing;
CREATE SCHEMA IF NOT EXISTS ai;
CREATE SCHEMA IF NOT EXISTS analytics;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified TIMESTAMP WITH TIME ZONE,
  password VARCHAR(255),
  image TEXT,
  role VARCHAR(50) DEFAULT 'user',
  has_onboarded BOOLEAN DEFAULT FALSE,
  default_workspace_id UUID,
  plan VARCHAR(20) DEFAULT 'free',
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);

CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS sessions_token_idx ON public.sessions(session_token);

CREATE TABLE IF NOT EXISTS public.oauth_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type VARCHAR(50),
  scope VARCHAR(255),
  id_token TEXT,
  session_state VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT oauth_accounts_provider_provider_account_id_unique UNIQUE (provider, provider_account_id)
);
CREATE INDEX IF NOT EXISTS oauth_accounts_user_id_idx ON public.oauth_accounts(user_id);

CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  icon VARCHAR(50) DEFAULT '📁',
  is_personal BOOLEAN DEFAULT FALSE,
  sso_domain VARCHAR(255) UNIQUE,
  sso_enforced BOOLEAN DEFAULT FALSE,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS workspaces_slug_idx ON public.workspaces(slug);

DO $$ BEGIN
 ALTER TABLE public.users ADD CONSTRAINT users_default_workspace_id_fk FOREIGN KEY (default_workspace_id) REFERENCES public.workspaces(id) ON DELETE SET NULL;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member',
  status VARCHAR(20) DEFAULT 'active',
  invited_by UUID REFERENCES public.users(id),
  invited_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT workspace_members_workspace_id_user_id_unique UNIQUE (workspace_id, user_id)
);
CREATE INDEX IF NOT EXISTS workspace_members_workspace_id_idx ON public.workspace_members(workspace_id);

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT '📦',
  status VARCHAR(20) DEFAULT 'active',
  visibility VARCHAR(20) DEFAULT 'private',
  custom_domain VARCHAR(255) UNIQUE,
  subdomain VARCHAR(100) UNIQUE NOT NULL,
  environment_variables JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  tech_stack JSONB DEFAULT '{"frontend":"react","css":"tailwind","components":"shadcn"}'::jsonb,
  seo_config JSONB DEFAULT '{}'::jsonb,
  current_version INTEGER DEFAULT 0,
  total_deployments INTEGER DEFAULT 0,
  deployed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT projects_workspace_id_slug_unique UNIQUE (workspace_id, slug)
);
CREATE INDEX IF NOT EXISTS projects_workspace_id_idx ON public.projects(workspace_id);

CREATE TABLE IF NOT EXISTS ai.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id),
  mode VARCHAR(20) DEFAULT 'build',
  title VARCHAR(500),
  message_count INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  total_credits_used INTEGER DEFAULT 0,
  primary_model_used VARCHAR(50),
  is_archived BOOLEAN DEFAULT FALSE,
  satisfaction_rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai.conversations(id) ON DELETE CASCADE,
  role VARCHAR(20),
  content TEXT NOT NULL,
  model_used VARCHAR(50),
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  latency_ms INTEGER,
  credits_charged INTEGER DEFAULT 0,
  file_changes JSONB,
  impact_analysis JSONB,
  was_applied BOOLEAN DEFAULT FALSE,
  was_rolled_back BOOLEAN DEFAULT FALSE,
  feedback VARCHAR(10),
  feedback_comment TEXT,
  error JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  snapshot_data JSONB NOT NULL,
  file_changes JSONB NOT NULL,
  database_schema_snapshot JSONB,
  change_source VARCHAR(20),
  change_description TEXT NOT NULL,
  ai_conversation_id UUID REFERENCES ai.conversations(id),
  created_by UUID REFERENCES public.users(id),
  is_deployed BOOLEAN DEFAULT FALSE,
  test_results_summary JSONB,
  confidence_score DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT project_versions_project_id_version_number_unique UNIQUE (project_id, version_number)
);

CREATE TABLE IF NOT EXISTS public.project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_extension VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  content_hash VARCHAR(64) NOT NULL,
  size_bytes INTEGER NOT NULL,
  language VARCHAR(30),
  is_directory BOOLEAN DEFAULT FALSE,
  is_generated BOOLEAN DEFAULT TRUE,
  is_protected BOOLEAN DEFAULT FALSE,
  last_modified_by VARCHAR(20),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT project_files_project_id_file_path_unique UNIQUE (project_id, file_path)
);

CREATE TABLE IF NOT EXISTS public.data_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  table_name VARCHAR(255) NOT NULL,
  description TEXT,
  fields JSONB NOT NULL,
  relationships JSONB DEFAULT '[]'::jsonb,
  indexes_config JSONB DEFAULT '[]'::jsonb,
  validations JSONB DEFAULT '[]'::jsonb,
  permissions JSONB DEFAULT '{}'::jsonb,
  enable_soft_delete BOOLEAN DEFAULT TRUE,
  enable_timestamps BOOLEAN DEFAULT TRUE,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT data_models_project_id_table_name_unique UNIQUE (project_id, table_name)
);

CREATE TABLE IF NOT EXISTS public.deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  version_id UUID REFERENCES public.project_versions(id),
  environment VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'queued',
  url TEXT,
  build_logs TEXT,
  build_duration_ms INTEGER,
  deploy_duration_ms INTEGER,
  bundle_size_bytes INTEGER,
  lighthouse_scores JSONB,
  deployed_by UUID REFERENCES public.users(id),
  error_message TEXT,
  health_check_status VARCHAR(20) DEFAULT 'pending',
  rollback_from_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS ai.self_heal_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  deployment_id UUID REFERENCES public.deployments(id),
  error_type VARCHAR(100) NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  error_frequency INTEGER DEFAULT 1,
  root_cause_analysis JSONB,
  proposed_fix JSONB,
  fix_applied BOOLEAN DEFAULT FALSE,
  fix_verified BOOLEAN DEFAULT FALSE,
  user_notified BOOLEAN DEFAULT FALSE,
  user_approved BOOLEAN,
  resolution_time_ms INTEGER,
  status VARCHAR(20) DEFAULT 'detected',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS ai.learning_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_type VARCHAR(50),
  pattern_signature VARCHAR(255) UNIQUE NOT NULL,
  pattern_data JSONB NOT NULL,
  example_instances JSONB DEFAULT '[]'::jsonb,
  frequency INTEGER DEFAULT 1,
  confidence DECIMAL(5,4) DEFAULT 0,
  action_taken VARCHAR(50),
  action_result JSONB,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(30) NOT NULL,
  trigger_config JSONB NOT NULL,
  steps JSONB DEFAULT '[]'::jsonb NOT NULL,
  error_handling JSONB DEFAULT '{"retries": 3, "backoff": "exponential", "onFailure": "stop"}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  last_run_at TIMESTAMP WITH TIME ZONE,
  last_run_status VARCHAR(20),
  run_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  status VARCHAR(20),
  trigger_data JSONB,
  step_results JSONB DEFAULT '[]'::jsonb,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  duration_ms INTEGER,
  credits_consumed INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  preview_url TEXT,
  thumbnail_url TEXT NOT NULL,
  screenshots JSONB DEFAULT '[]'::jsonb,
  file_tree JSONB NOT NULL,
  database_schema JSONB,
  features JSONB DEFAULT '[]'::jsonb,
  is_official BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES public.users(id),
  price_cents INTEGER DEFAULT 0,
  install_count INTEGER DEFAULT 0,
  rating_avg DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.test_suites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20),
  test_code TEXT NOT NULL,
  test_file_path TEXT NOT NULL,
  is_auto_generated BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  last_run_status VARCHAR(20),
  last_run_at TIMESTAMP WITH TIME ZONE,
  last_run_duration_ms INTEGER,
  pass_count INTEGER DEFAULT 0,
  fail_count INTEGER DEFAULT 0,
  coverage_percent DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  icon VARCHAR(50),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES public.workspaces(id),
  stripe_customer_id VARCHAR(255) NOT NULL,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  plan VARCHAR(20) NOT NULL,
  status VARCHAR(20),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing.credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES public.workspaces(id),
  type VARCHAR(30),
  total_amount INTEGER NOT NULL,
  remaining INTEGER NOT NULL,
  source VARCHAR(30),
  price_paid_cents INTEGER DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_expired BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_id UUID REFERENCES billing.credits(id),
  user_id UUID REFERENCES public.users(id),
  project_id UUID REFERENCES public.projects(id),
  conversation_id UUID REFERENCES ai.conversations(id),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  transaction_type VARCHAR(30),
  description TEXT NOT NULL,
  is_regression_refund BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  stripe_invoice_id VARCHAR(255) UNIQUE NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'usd',
  status VARCHAR(20),
  description TEXT,
  invoice_pdf_url TEXT,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  session_id VARCHAR(100) NOT NULL,
  visitor_id VARCHAR(100) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  event_name VARCHAR(255),
  page_path TEXT,
  page_title VARCHAR(500),
  referrer TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  device_type VARCHAR(20),
  browser VARCHAR(50),
  os VARCHAR(50),
  country VARCHAR(2),
  city VARCHAR(255),
  screen_width INTEGER,
  custom_properties JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workspaces_updated_at ON public.workspaces;
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON public.workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workspace_members_updated_at ON public.workspace_members;
CREATE TRIGGER update_workspace_members_updated_at BEFORE UPDATE ON public.workspace_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_project_files_updated_at ON public.project_files;
CREATE TRIGGER update_project_files_updated_at BEFORE UPDATE ON public.project_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_data_models_updated_at ON public.data_models;
CREATE TRIGGER update_data_models_updated_at BEFORE UPDATE ON public.data_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workflows_updated_at ON public.workflows;
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON public.workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_templates_updated_at ON public.templates;
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_test_suites_updated_at ON public.test_suites;
CREATE TRIGGER update_test_suites_updated_at BEFORE UPDATE ON public.test_suites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_conversations_updated_at ON ai.conversations;
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai.conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_learning_patterns_updated_at ON ai.learning_patterns;
CREATE TRIGGER update_ai_learning_patterns_updated_at BEFORE UPDATE ON ai.learning_patterns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_billing_subscriptions_updated_at ON billing.subscriptions;
CREATE TRIGGER update_billing_subscriptions_updated_at BEFORE UPDATE ON billing.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
