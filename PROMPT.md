{
  "meta": {
    "project_name": "ForgeAI Prometheus",
    "version": "6.0.0-ULTIMATE",
    "codename": "PROMETHEUS",
    "description": "A self-evolving, self-healing, self-learning AI-powered full-stack application builder that costs $0 to run forever. It generates production-grade apps from natural language, learns from every interaction, evolves its own prompts, discovers new skills, monitors its own infrastructure, updates its own dependencies, heals its own errors, communicates with other AI agents via MCP and A2A protocols, and gets measurably smarter every day it runs.",
    "usage": {
      "step_1": "Open your AI coding tool (Cursor IDE recommended)",
      "step_2": "For each PHASE, copy: hard_rules + that phase's context_to_include + that phase's prompt",
      "step_3": "Paste into AI. Let it generate all files.",
      "step_4": "Save files, verify with validation_checklist, commit to git",
      "step_5": "Move to next phase. Do NOT skip phases.",
      "step_6": "After all phases: deploy to Oracle Cloud free VM using the deployment guide at the end"
    }
  },

  "hard_rules": {
    "description": "INCLUDE THESE WITH EVERY SINGLE PHASE. These are absolute and override everything else.",
    "rules": [
      "RULE 1 — ZERO PLACEHOLDERS: You must NEVER write TODO, implement later, placeholder, skeleton, add logic here, rest of code, or ANY form of incomplete code. Every function body must contain complete, real, working logic.",
      "RULE 2 — ZERO TRUNCATION: You must NEVER truncate a file. Generate every file from first line to last line completely. Never say similar to above, continue the pattern, or and so on. If you hit output limits, say CONTINUES IN NEXT MESSAGE and continue in the next response.",
      "RULE 3 — FIVE STATES PER COMPONENT: Every React component must have: loading state (skeleton/spinner), empty state (no data message with CTA), error state (error message with retry button), success state (actual content), interactive states (hover/focus/active/disabled styles). No exceptions.",
      "RULE 4 — COMPLETE API ENDPOINTS: Every API endpoint must have: Zod input validation schema, authentication check middleware, authorization/role check, rate limiting, try-catch error handling with typed error responses, request logging via Pino, response formatted in standard envelope {success, data/error, meta}.",
      "RULE 5 — SAFE DATABASE QUERIES: Every database query must use: parameterized inputs only (never string concatenation), proper indexes defined in schema, error handling for connection failures, timeout configuration, cursor-based pagination for all list queries. Never SELECT *.",
      "RULE 6 — BULLETPROOF FORMS: Every form must have: client-side validation with inline error messages, server-side validation (never trust client), loading state on submit button (disabled + spinner), success feedback (toast notification), error feedback (toast + field-level errors), double-submission prevention.",
      "RULE 7 — COMPLETE PAGES: Every page must have: proper title and meta description, Open Graph tags (og:title, og:description, og:image), canonical URL, proper heading hierarchy (h1 then h2 then h3), breadcrumb navigation where appropriate, responsive layout (mobile 320px through desktop 1920px), keyboard navigation support, both dark and light mode.",
      "RULE 8 — VALID IMPORTS: Never import from a file that does not exist. Never use a package that is not in package.json. Every import path must be correct. Every dependency must be declared.",
      "RULE 9 — STRICT TYPES: No any type anywhere. No implicit any. Every function parameter, return type, variable, and prop must have an explicit TypeScript type. strict: true and noUncheckedIndexedAccess: true in all tsconfig files.",
      "RULE 10 — PRODUCTION SECURITY: Every endpoint must validate Content-Type. All cookies must be HTTP-only, Secure, SameSite=Lax. All passwords hashed with Argon2id. All secrets from environment variables, never hardcoded. All user input sanitized before rendering. All file uploads validated for type and size (max 10MB). CSRF protection on all mutations.",
      "RULE 11 — ZERO COST ENFORCEMENT: Never use a paid service without a free fallback. Every external service call goes through a service adapter that checks cost. The cost sentinel blocks any call that would incur charges. LocalAI self-hosted is the infinite free fallback for all AI calls.",
      "RULE 12 — UNIFIED INTELLIGENCE: The daemon and cognitive engine are ONE system. Every daemon action (dependency update, health check, security scan) flows through the cognitive pipeline and creates an episodic memory. Every cognitive decision (code generation, skill selection) considers infrastructure state. They are not separate modules bolted together — they are one living brain.",
      "RULE 13 — COMPLETE FILE OUTPUT: Format each generated file as: === FILE: full/path/to/file.ext === followed by complete file content followed by === END FILE ===. After generating all files for a phase, output a COMPLETENESS MANIFEST listing every file generated with its line count. Then output: ALL FILES COMPLETE — NO PLACEHOLDERS — NO TRUNCATION — READY FOR VALIDATION."
    ]
  },

  "technology_stack": {
    "monorepo": {
      "tool": "Turborepo 2.x with Bun 1.x as package manager",
      "structure": {
        "apps/web": "Next.js 15 (App Router) — main platform frontend, deployed to Vercel Free",
        "apps/api": "Hono 4.x — core REST API server, port 4000, deployed to Oracle Cloud VM",
        "apps/brain": "Hono 4.x — AI engine + cognitive engine + all daemon functions, port 4100, deployed to Oracle Cloud VM. This is THE brain — one service that does everything intelligent.",
        "apps/worker": "BullMQ — background job processor, deployed to Oracle Cloud VM",
        "apps/realtime": "Socket.io — WebSocket server for real-time features, port 4200, deployed to Oracle Cloud VM",
        "apps/docs": "Nextra 3.x — documentation website, deployed to Cloudflare Pages Free",
        "packages/ui": "Shared React component library built on shadcn/ui + Radix UI + Tailwind CSS 4",
        "packages/db": "Drizzle ORM schema, migrations, queries, seed data",
        "packages/auth": "Custom auth system (Lucia Auth patterns + Arctic OAuth + Argon2id + TOTP 2FA)",
        "packages/ai": "AI model clients, routing logic, prompt templates",
        "packages/cognitive": "Cognitive engine — memory, skills, reasoning, quality judging, reflection, prompt evolution",
        "packages/shared": "Shared TypeScript types, Zod schemas, constants, utility functions",
        "packages/email": "React Email templates + sending service",
        "packages/testing": "Vitest + Playwright shared utilities, factories, mocks",
        "packages/config": "Shared ESLint, TypeScript, Tailwind, Prettier configurations",
        "tooling/scripts": "Setup, deployment, backup, health check scripts"
      }
    },
    "frontend": {
      "framework": "Next.js 15 (App Router, Server Components, Server Actions)",
      "ui": "React 19, Tailwind CSS 4, shadcn/ui (all components), Radix UI primitives",
      "state": "Zustand 5 (global client state), TanStack Query 5 (all server state)",
      "forms": "React Hook Form 7 + @hookform/resolvers + Zod",
      "tables": "TanStack Table 8 with sorting, filtering, pagination, selection",
      "icons": "Lucide React",
      "charts": "Recharts 2",
      "editor": "Monaco Editor (@monaco-editor/react)",
      "dnd": "@dnd-kit/core + @dnd-kit/sortable",
      "animations": "Framer Motion 11",
      "dates": "date-fns 3",
      "rich_text": "Tiptap 2",
      "markdown": "react-markdown + remark-gfm + rehype-highlight",
      "virtual_lists": "@tanstack/react-virtual",
      "toasts": "sonner",
      "command_palette": "cmdk (via shadcn/ui Command)",
      "file_upload": "react-dropzone",
      "syntax_highlight": "Shiki",
      "realtime": "socket.io-client 4"
    },
    "backend": {
      "framework": "Hono 4.x",
      "orm": "Drizzle ORM (latest)",
      "database": "PostgreSQL 16 via Neon free tier (@neondatabase/serverless) with pgvector extension",
      "migrations": "drizzle-kit",
      "cache": "Self-hosted Redis 7 in Docker (primary, unlimited) + Upstash Redis free tier (fallback)",
      "queue": "BullMQ 5 with Redis backend",
      "storage": "Supabase Storage free (1GB primary) + Oracle Object Storage free (20GB overflow) + Cloudflare R2 free (10GB fallback)",
      "email": "Resend free (100/day primary) + Brevo free (300/day fallback) + Gmail SMTP (emergency fallback). Templates via React Email.",
      "payments": "Stripe (free to integrate, % per transaction only)",
      "search": "Meilisearch self-hosted in Docker (unlimited, free)",
      "websockets": "Socket.io 4",
      "auth": "Custom: Argon2id password hashing, JWT access tokens (15min) + HTTP-only refresh tokens (7/30 days), Arctic for OAuth (Google, GitHub, Microsoft), TOTP 2FA",
      "rate_limiting": "Custom Redis-based + @upstash/ratelimit fallback",
      "validation": "Zod 3 on every endpoint",
      "logging": "Pino structured JSON logging",
      "error_tracking": "GlitchTip self-hosted (open-source Sentry) or Sentry free tier (5K errors/month)"
    },
    "ai_ml": {
      "routing_priority": "Google Gemini Free tier (best quality free) → Groq Free tier (fastest free) → LocalAI self-hosted (unlimited, always available). NEVER route to paid APIs unless admin explicitly enables with budget cap.",
      "google_gemini": "Gemini 2.5 Flash: 500 req/day free. Gemini 2.5 Pro: 25 req/day free. With Google account auth: up to 1000 req/day. Used for: code generation, complex reasoning, vision (screenshot-to-code).",
      "groq": "Llama 3.3 70B, Mixtral, Gemma free tier with rate limits. Fastest inference. Used for: quick edits, real-time chat, classification.",
      "localai": "Self-hosted on Oracle VM, 8GB RAM allocation. Runs Phi-3-mini, CodeLlama-7B, Llama-3.2-3B, Mistral-7B via GGUF format. OpenAI-compatible API. No quota limits ever. Used for: fallback, analysis/judging tasks (save cloud quota), embeddings.",
      "huggingface": "Free Inference API for embeddings and smaller models.",
      "embeddings": "Google text-embedding-004 (free) → HuggingFace sentence-transformers (free) → LocalAI all-MiniLM-L6-v2 (self-hosted). All produce 1536-dim vectors stored in pgvector.",
      "vector_search": "pgvector extension in Neon PostgreSQL. IVFFlat indexes for similarity search. No separate vector database needed.",
      "streaming": "Server-Sent Events (SSE) via Hono streaming API.",
      "token_counting": "tiktoken (js-tiktoken) for accurate context budget management.",
      "code_analysis": "tree-sitter (web-tree-sitter) for AST parsing. TypeScript compiler API for type checking. ESLint API for code quality. Prettier API for formatting.",
      "protocols": {
        "mcp": "Model Context Protocol — ForgeAI is both an MCP client (consumes external MCP servers as tools) and an MCP server (other AI tools can use ForgeAI). Uses @modelcontextprotocol/typescript-sdk.",
        "a2a": "Agent2Agent Protocol — ForgeAI can discover and delegate tasks to other A2A agents, and accepts tasks from other agents. Publishes Agent Card at /.well-known/agent.json."
      }
    },
    "infrastructure": {
      "compute": "Oracle Cloud Always Free: 4 ARM Ampere A1 OCPUs, 24GB RAM, 200GB block storage, 10TB/month egress. Runs ALL backend services via Docker Compose.",
      "frontend_hosting": "Vercel Free: 100GB bandwidth/month, serverless functions, auto-deploy from Git.",
      "static_hosting": "Cloudflare Pages Free: unlimited bandwidth, 500 builds/month (for docs site).",
      "cdn_dns_ssl": "Cloudflare Free: DNS, CDN, SSL, DDoS protection, all unlimited.",
      "ci_cd": "GitHub Actions: 2000 min/month free (unlimited for public repos).",
      "docker_services_on_oracle_vm": {
        "forge-api": {"port": 4000, "memory": "512MB"},
        "forge-brain": {"port": 4100, "memory": "1GB", "note": "AI + cognitive + all daemon functions"},
        "forge-worker": {"memory": "256MB"},
        "forge-realtime": {"port": 4200, "memory": "256MB"},
        "redis": {"port": 6379, "memory": "512MB"},
        "meilisearch": {"port": 7700, "memory": "512MB"},
        "localai": {"port": 8080, "memory": "8GB", "note": "Self-hosted AI models"},
        "nginx": {"ports": "80,443", "memory": "64MB", "note": "Reverse proxy"},
        "total": "~11.1GB of 24GB (12.9GB headroom)"
      },
      "total_monthly_cost": "$0.00"
    }
  },

  "design_system": {
    "colors": {
      "primary": {"50": "#EEF2FF", "100": "#E0E7FF", "200": "#C7D2FE", "300": "#A5B4FC", "400": "#818CF8", "500": "#6366F1", "600": "#4F46E5", "700": "#4338CA", "800": "#3730A3", "900": "#312E81", "950": "#1E1B4B"},
      "secondary": {"50": "#FDF2F8", "500": "#EC4899", "900": "#831843"},
      "success": "#10B981", "warning": "#F59E0B", "error": "#EF4444", "info": "#3B82F6",
      "background": {"light": "#FFFFFF", "dark": "#0F172A"},
      "surface": {"light": "#F8FAFC", "dark": "#1E293B"},
      "border": {"light": "#E2E8F0", "dark": "#334155"}
    },
    "typography": "Inter (sans-serif) for UI, JetBrains Mono (monospace) for code",
    "border_radius": {"sm": "4px", "md": "8px", "lg": "12px", "xl": "16px", "full": "9999px"},
    "dark_mode": "next-themes. Every component MUST have both light and dark variants. Tailwind dark: modifier. Default to system preference.",
    "responsive": {"sm": "640px", "md": "768px", "lg": "1024px", "xl": "1280px", "2xl": "1536px"},
    "animations": "Framer Motion for page transitions, element entry, micro-interactions. Under 300ms. Respect prefers-reduced-motion."
  },

  "database_schema": {
    "note": "COMPLETE schema for the ForgeAI platform. All tables must be created as Drizzle ORM schemas with exact columns, types, constraints, and indexes specified here.",
    "extensions": ["pgvector (CREATE EXTENSION IF NOT EXISTS vector)"],
    "schemas": ["public", "billing", "ai", "cognitive", "analytics"],
    "tables": {

      "public.users": {
        "columns": {
          "id": "UUID PK DEFAULT gen_random_uuid()",
          "email": "VARCHAR(255) UNIQUE NOT NULL",
          "email_verified": "BOOLEAN DEFAULT FALSE",
          "password_hash": "VARCHAR(255) NULLABLE (null for OAuth-only)",
          "full_name": "VARCHAR(255) NOT NULL",
          "avatar_url": "TEXT NULLABLE",
          "locale": "VARCHAR(10) DEFAULT 'en'",
          "timezone": "VARCHAR(50) DEFAULT 'UTC'",
          "role": "VARCHAR(20) DEFAULT 'user' CHECK IN ('user','admin','super_admin')",
          "plan": "VARCHAR(20) DEFAULT 'free' CHECK IN ('free','starter','builder','pro','enterprise')",
          "onboarding_completed": "BOOLEAN DEFAULT FALSE",
          "two_factor_enabled": "BOOLEAN DEFAULT FALSE",
          "two_factor_secret": "VARCHAR(255) NULLABLE (encrypted)",
          "last_active_at": "TIMESTAMPTZ NULLABLE",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()",
          "updated_at": "TIMESTAMPTZ DEFAULT NOW()",
          "deleted_at": "TIMESTAMPTZ NULLABLE"
        },
        "indexes": ["UNIQUE(email)", "idx(plan)", "idx(created_at)", "PARTIAL idx(deleted_at) WHERE deleted_at IS NULL"]
      },

      "public.sessions": {
        "columns": {
          "id": "UUID PK",
          "user_id": "UUID FK users(id) CASCADE",
          "token_hash": "VARCHAR(255) UNIQUE NOT NULL",
          "refresh_token_hash": "VARCHAR(255) UNIQUE NOT NULL",
          "user_agent": "TEXT NULLABLE",
          "ip_address": "INET NULLABLE",
          "device_name": "VARCHAR(255) NULLABLE",
          "is_active": "BOOLEAN DEFAULT TRUE",
          "last_used_at": "TIMESTAMPTZ DEFAULT NOW()",
          "expires_at": "TIMESTAMPTZ NOT NULL",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()"
        },
        "indexes": ["idx(user_id)", "UNIQUE(token_hash)", "idx(expires_at)"]
      },

      "public.oauth_accounts": {
        "columns": {
          "id": "UUID PK",
          "user_id": "UUID FK users(id) CASCADE",
          "provider": "VARCHAR(50) NOT NULL",
          "provider_user_id": "VARCHAR(255) NOT NULL",
          "provider_email": "VARCHAR(255) NULLABLE",
          "access_token": "TEXT NULLABLE (encrypted)",
          "refresh_token": "TEXT NULLABLE (encrypted)",
          "token_expires_at": "TIMESTAMPTZ NULLABLE",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()"
        },
        "indexes": ["idx(user_id)", "UNIQUE(provider, provider_user_id)"]
      },

      "public.workspaces": {
        "columns": {
          "id": "UUID PK",
          "name": "VARCHAR(255) NOT NULL",
          "slug": "VARCHAR(255) UNIQUE NOT NULL",
          "logo_url": "TEXT NULLABLE",
          "owner_id": "UUID FK users(id) CASCADE",
          "plan": "VARCHAR(20) DEFAULT 'free'",
          "sso_enabled": "BOOLEAN DEFAULT FALSE",
          "sso_config": "JSONB NULLABLE",
          "settings": "JSONB DEFAULT '{}'",
          "max_projects": "INTEGER DEFAULT 3",
          "max_members": "INTEGER DEFAULT 1",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()",
          "updated_at": "TIMESTAMPTZ DEFAULT NOW()"
        },
        "indexes": ["UNIQUE(slug)", "idx(owner_id)"]
      },

      "public.workspace_members": {
        "columns": {
          "id": "UUID PK",
          "workspace_id": "UUID FK workspaces(id) CASCADE",
          "user_id": "UUID FK users(id) CASCADE",
          "role": "VARCHAR(20) DEFAULT 'member' CHECK IN ('owner','admin','editor','viewer')",
          "invited_email": "VARCHAR(255) NULLABLE",
          "invite_token": "VARCHAR(255) NULLABLE",
          "invite_status": "VARCHAR(20) DEFAULT 'accepted' CHECK IN ('pending','accepted','declined')",
          "invited_by": "UUID FK users(id) NULLABLE",
          "joined_at": "TIMESTAMPTZ DEFAULT NOW()"
        },
        "indexes": ["idx(workspace_id)", "idx(user_id)", "UNIQUE(workspace_id, user_id)"]
      },

      "public.projects": {
        "columns": {
          "id": "UUID PK",
          "workspace_id": "UUID FK workspaces(id) CASCADE",
          "name": "VARCHAR(255) NOT NULL",
          "slug": "VARCHAR(255) NOT NULL",
          "description": "TEXT NULLABLE",
          "icon": "VARCHAR(50) DEFAULT '📦'",
          "status": "VARCHAR(20) DEFAULT 'active' CHECK IN ('active','archived','deleted')",
          "visibility": "VARCHAR(20) DEFAULT 'private' CHECK IN ('private','public','unlisted')",
          "custom_domain": "VARCHAR(255) NULLABLE UNIQUE",
          "subdomain": "VARCHAR(100) UNIQUE NOT NULL",
          "environment_variables": "JSONB DEFAULT '{}' (encrypted at rest)",
          "settings": "JSONB DEFAULT '{}'",
          "tech_stack": "JSONB DEFAULT '{\"frontend\":\"react\",\"css\":\"tailwind\",\"components\":\"shadcn\"}'",
          "seo_config": "JSONB DEFAULT '{}'",
          "current_version": "INTEGER DEFAULT 0",
          "total_deployments": "INTEGER DEFAULT 0",
          "deployed_at": "TIMESTAMPTZ NULLABLE",
          "created_by": "UUID FK users(id)",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()",
          "updated_at": "TIMESTAMPTZ DEFAULT NOW()",
          "deleted_at": "TIMESTAMPTZ NULLABLE"
        },
        "indexes": ["idx(workspace_id)", "UNIQUE(workspace_id, slug)", "UNIQUE(subdomain)", "UNIQUE(custom_domain) WHERE NOT NULL", "idx(status)", "PARTIAL idx(deleted_at) WHERE NULL"]
      },

      "public.project_versions": {
        "columns": {
          "id": "UUID PK",
          "project_id": "UUID FK projects(id) CASCADE",
          "version_number": "INTEGER NOT NULL",
          "snapshot_data": "JSONB NOT NULL",
          "file_changes": "JSONB NOT NULL",
          "database_schema_snapshot": "JSONB NULLABLE",
          "change_source": "VARCHAR(20) CHECK IN ('ai','manual','rollback','import','template')",
          "change_description": "TEXT NOT NULL",
          "ai_conversation_id": "UUID FK ai.conversations(id) NULLABLE",
          "created_by": "UUID FK users(id)",
          "is_deployed": "BOOLEAN DEFAULT FALSE",
          "test_results_summary": "JSONB NULLABLE",
          "confidence_score": "DECIMAL(5,2) NULLABLE",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()"
        },
        "indexes": ["idx(project_id)", "UNIQUE(project_id, version_number)"]
      },

      "public.project_files": {
        "columns": {
          "id": "UUID PK",
          "project_id": "UUID FK projects(id) CASCADE",
          "file_path": "TEXT NOT NULL",
          "file_name": "VARCHAR(255) NOT NULL",
          "file_extension": "VARCHAR(20) NOT NULL",
          "content": "TEXT NOT NULL",
          "content_hash": "VARCHAR(64) NOT NULL (SHA-256)",
          "size_bytes": "INTEGER NOT NULL",
          "language": "VARCHAR(30) NULLABLE",
          "is_directory": "BOOLEAN DEFAULT FALSE",
          "is_generated": "BOOLEAN DEFAULT TRUE",
          "is_protected": "BOOLEAN DEFAULT FALSE",
          "last_modified_by": "VARCHAR(20) CHECK IN ('ai','user','system')",
          "metadata": "JSONB DEFAULT '{}'",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()",
          "updated_at": "TIMESTAMPTZ DEFAULT NOW()"
        },
        "indexes": ["idx(project_id)", "UNIQUE(project_id, file_path)", "idx(content_hash)"]
      },

      "public.data_models": {
        "columns": {
          "id": "UUID PK",
          "project_id": "UUID FK projects(id) CASCADE",
          "name": "VARCHAR(255) NOT NULL",
          "table_name": "VARCHAR(255) NOT NULL",
          "description": "TEXT NULLABLE",
          "fields": "JSONB NOT NULL",
          "relationships": "JSONB DEFAULT '[]'",
          "indexes_config": "JSONB DEFAULT '[]'",
          "validations": "JSONB DEFAULT '[]'",
          "permissions": "JSONB DEFAULT '{}'",
          "enable_soft_delete": "BOOLEAN DEFAULT TRUE",
          "enable_timestamps": "BOOLEAN DEFAULT TRUE",
          "is_system": "BOOLEAN DEFAULT FALSE",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()",
          "updated_at": "TIMESTAMPTZ DEFAULT NOW()"
        },
        "indexes": ["idx(project_id)", "UNIQUE(project_id, table_name)"]
      },

      "public.deployments": {
        "columns": {
          "id": "UUID PK",
          "project_id": "UUID FK projects(id) CASCADE",
          "version_id": "UUID FK project_versions(id)",
          "environment": "VARCHAR(20) NOT NULL CHECK IN ('preview','staging','production')",
          "status": "VARCHAR(20) DEFAULT 'queued' CHECK IN ('queued','building','deploying','deployed','failed','rolled_back','cancelled')",
          "url": "TEXT NULLABLE",
          "build_logs": "TEXT NULLABLE",
          "build_duration_ms": "INTEGER NULLABLE",
          "deploy_duration_ms": "INTEGER NULLABLE",
          "bundle_size_bytes": "INTEGER NULLABLE",
          "lighthouse_scores": "JSONB NULLABLE",
          "deployed_by": "UUID FK users(id)",
          "error_message": "TEXT NULLABLE",
          "health_check_status": "VARCHAR(20) DEFAULT 'pending' CHECK IN ('pending','healthy','unhealthy','timeout')",
          "rollback_from_id": "UUID FK deployments(id) NULLABLE",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()",
          "completed_at": "TIMESTAMPTZ NULLABLE"
        },
        "indexes": ["idx(project_id)", "idx(project_id, environment)", "idx(status)"]
      },

      "public.workflows": {
        "columns": {
          "id": "UUID PK",
          "project_id": "UUID FK projects(id) CASCADE",
          "name": "VARCHAR(255) NOT NULL",
          "description": "TEXT NULLABLE",
          "trigger_type": "VARCHAR(30) NOT NULL CHECK IN ('event','schedule','webhook','data_change','manual','api')",
          "trigger_config": "JSONB NOT NULL",
          "steps": "JSONB NOT NULL DEFAULT '[]'",
          "error_handling": "JSONB DEFAULT '{\"retries\":3,\"backoff\":\"exponential\",\"onFailure\":\"stop\"}'",
          "is_active": "BOOLEAN DEFAULT TRUE",
          "last_run_at": "TIMESTAMPTZ NULLABLE",
          "last_run_status": "VARCHAR(20) NULLABLE",
          "run_count": "INTEGER DEFAULT 0",
          "success_count": "INTEGER DEFAULT 0",
          "error_count": "INTEGER DEFAULT 0",
          "created_by": "UUID FK users(id)",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()",
          "updated_at": "TIMESTAMPTZ DEFAULT NOW()"
        }
      },

      "public.workflow_runs": {
        "columns": {
          "id": "UUID PK",
          "workflow_id": "UUID FK workflows(id) CASCADE",
          "status": "VARCHAR(20) CHECK IN ('queued','running','completed','failed','cancelled','timed_out')",
          "trigger_data": "JSONB NULLABLE",
          "step_results": "JSONB DEFAULT '[]'",
          "error_message": "TEXT NULLABLE",
          "retry_count": "INTEGER DEFAULT 0",
          "duration_ms": "INTEGER NULLABLE",
          "credits_consumed": "INTEGER DEFAULT 0",
          "started_at": "TIMESTAMPTZ DEFAULT NOW()",
          "completed_at": "TIMESTAMPTZ NULLABLE"
        }
      },

      "public.templates": {
        "columns": {
          "id": "UUID PK",
          "name": "VARCHAR(255) NOT NULL",
          "slug": "VARCHAR(255) UNIQUE NOT NULL",
          "description": "TEXT NOT NULL",
          "long_description": "TEXT NULLABLE (markdown)",
          "category": "VARCHAR(100) NOT NULL",
          "tags": "TEXT[] DEFAULT '{}'",
          "preview_url": "TEXT NULLABLE",
          "thumbnail_url": "TEXT NOT NULL",
          "screenshots": "JSONB DEFAULT '[]'",
          "file_tree": "JSONB NOT NULL",
          "database_schema": "JSONB NULLABLE",
          "features": "JSONB DEFAULT '[]'",
          "is_official": "BOOLEAN DEFAULT FALSE",
          "is_featured": "BOOLEAN DEFAULT FALSE",
          "author_id": "UUID FK users(id) NULLABLE",
          "price_cents": "INTEGER DEFAULT 0",
          "install_count": "INTEGER DEFAULT 0",
          "rating_avg": "DECIMAL(3,2) DEFAULT 0",
          "rating_count": "INTEGER DEFAULT 0",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()",
          "updated_at": "TIMESTAMPTZ DEFAULT NOW()"
        }
      },

      "public.test_suites": {
        "columns": {
          "id": "UUID PK",
          "project_id": "UUID FK projects(id) CASCADE",
          "name": "VARCHAR(255) NOT NULL",
          "description": "TEXT NULLABLE",
          "type": "VARCHAR(20) CHECK IN ('unit','integration','e2e','visual','performance','accessibility')",
          "test_code": "TEXT NOT NULL",
          "test_file_path": "TEXT NOT NULL",
          "is_auto_generated": "BOOLEAN DEFAULT TRUE",
          "is_active": "BOOLEAN DEFAULT TRUE",
          "last_run_status": "VARCHAR(20) NULLABLE CHECK IN ('passed','failed','skipped','error')",
          "last_run_at": "TIMESTAMPTZ NULLABLE",
          "last_run_duration_ms": "INTEGER NULLABLE",
          "pass_count": "INTEGER DEFAULT 0",
          "fail_count": "INTEGER DEFAULT 0",
          "coverage_percent": "DECIMAL(5,2) NULLABLE",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()",
          "updated_at": "TIMESTAMPTZ DEFAULT NOW()"
        }
      },

      "public.notifications": {
        "columns": {
          "id": "UUID PK",
          "user_id": "UUID FK users(id) CASCADE",
          "type": "VARCHAR(50) NOT NULL",
          "title": "VARCHAR(255) NOT NULL",
          "message": "TEXT NOT NULL",
          "link": "TEXT NULLABLE",
          "icon": "VARCHAR(50) NULLABLE",
          "is_read": "BOOLEAN DEFAULT FALSE",
          "read_at": "TIMESTAMPTZ NULLABLE",
          "metadata": "JSONB DEFAULT '{}'",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()"
        }
      },

      "ai.conversations": {
        "columns": {
          "id": "UUID PK",
          "project_id": "UUID FK public.projects(id) CASCADE",
          "user_id": "UUID FK public.users(id)",
          "mode": "VARCHAR(20) DEFAULT 'build' CHECK IN ('build','discuss','debug','optimize')",
          "title": "VARCHAR(500) NULLABLE",
          "message_count": "INTEGER DEFAULT 0",
          "total_tokens_used": "INTEGER DEFAULT 0",
          "total_credits_used": "INTEGER DEFAULT 0",
          "primary_model_used": "VARCHAR(50) NULLABLE",
          "is_archived": "BOOLEAN DEFAULT FALSE",
          "satisfaction_rating": "INTEGER NULLABLE CHECK BETWEEN 1 AND 5",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()",
          "updated_at": "TIMESTAMPTZ DEFAULT NOW()"
        }
      },

      "ai.messages": {
        "columns": {
          "id": "UUID PK",
          "conversation_id": "UUID FK ai.conversations(id) CASCADE",
          "role": "VARCHAR(20) CHECK IN ('user','assistant','system')",
          "content": "TEXT NOT NULL",
          "model_used": "VARCHAR(50) NULLABLE",
          "tokens_input": "INTEGER DEFAULT 0",
          "tokens_output": "INTEGER DEFAULT 0",
          "latency_ms": "INTEGER NULLABLE",
          "credits_charged": "INTEGER DEFAULT 0",
          "file_changes": "JSONB NULLABLE",
          "impact_analysis": "JSONB NULLABLE",
          "was_applied": "BOOLEAN DEFAULT FALSE",
          "was_rolled_back": "BOOLEAN DEFAULT FALSE",
          "feedback": "VARCHAR(10) NULLABLE CHECK IN ('positive','negative')",
          "feedback_comment": "TEXT NULLABLE",
          "error": "JSONB NULLABLE",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()"
        }
      },

      "ai.self_heal_events": {
        "columns": {
          "id": "UUID PK",
          "project_id": "UUID FK public.projects(id) CASCADE",
          "deployment_id": "UUID FK public.deployments(id) NULLABLE",
          "error_type": "VARCHAR(100) NOT NULL",
          "error_message": "TEXT NOT NULL",
          "error_stack": "TEXT NULLABLE",
          "error_frequency": "INTEGER DEFAULT 1",
          "root_cause_analysis": "JSONB NULLABLE",
          "proposed_fix": "JSONB NULLABLE",
          "fix_applied": "BOOLEAN DEFAULT FALSE",
          "fix_verified": "BOOLEAN DEFAULT FALSE",
          "user_notified": "BOOLEAN DEFAULT FALSE",
          "user_approved": "BOOLEAN NULLABLE",
          "resolution_time_ms": "INTEGER NULLABLE",
          "status": "VARCHAR(20) DEFAULT 'detected' CHECK IN ('detected','analyzing','fix_proposed','fix_applied','verified','failed','dismissed')",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()",
          "resolved_at": "TIMESTAMPTZ NULLABLE"
        }
      },

      "ai.learning_patterns": {
        "columns": {
          "id": "UUID PK",
          "pattern_type": "VARCHAR(50) CHECK IN ('prompt_pattern','error_pattern','feature_demand','code_optimization','template_candidate','integration_demand')",
          "pattern_signature": "VARCHAR(255) UNIQUE NOT NULL",
          "pattern_data": "JSONB NOT NULL",
          "example_instances": "JSONB DEFAULT '[]'",
          "frequency": "INTEGER DEFAULT 1",
          "confidence": "DECIMAL(5,4) DEFAULT 0",
          "action_taken": "VARCHAR(50) NULLABLE",
          "action_result": "JSONB NULLABLE",
          "is_resolved": "BOOLEAN DEFAULT FALSE",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()",
          "updated_at": "TIMESTAMPTZ DEFAULT NOW()"
        }
      },

      "cognitive.memory_episodes": {
        "columns": {
          "id": "UUID PK",
          "project_id": "UUID FK public.projects(id) SET NULL",
          "user_id": "UUID FK public.users(id) SET NULL",
          "episode_type": "VARCHAR(30) CHECK IN ('code_generation','bug_fix','optimization','architecture','deployment','workflow','data_model','ui_design','integration','testing','infrastructure','security')",
          "user_prompt": "TEXT NOT NULL",
          "context_summary": "TEXT NOT NULL",
          "approach_taken": "TEXT NOT NULL",
          "code_generated": "JSONB NULLABLE",
          "models_used": "JSONB NULLABLE",
          "skills_used": "UUID[] DEFAULT '{}'",
          "outcome": "VARCHAR(20) CHECK IN ('success','partial','failure','unknown')",
          "user_feedback": "VARCHAR(10) DEFAULT 'none' CHECK IN ('positive','negative','none')",
          "quality_score": "DECIMAL(5,2) NULLABLE",
          "was_rolled_back": "BOOLEAN DEFAULT FALSE",
          "error_encountered": "TEXT NULLABLE",
          "lessons_extracted": "JSONB DEFAULT '[]'",
          "embedding": "vector(1536)",
          "tags": "TEXT[] DEFAULT '{}'",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()"
        },
        "indexes": ["idx(episode_type)", "idx(outcome)", "idx(quality_score DESC)", "IVFFlat(embedding vector_cosine_ops) lists=100", "idx(created_at)"]
      },

      "cognitive.skills": {
        "columns": {
          "id": "UUID PK",
          "name": "VARCHAR(255) UNIQUE NOT NULL",
          "category": "VARCHAR(50) CHECK IN ('frontend','backend','database','auth','payment','ai_integration','deployment','testing','performance','security','accessibility','seo','animation','realtime','file_handling','email','workflow','data_visualization','mobile','i18n','agentic')",
          "description": "TEXT NOT NULL",
          "difficulty_level": "VARCHAR(20) CHECK IN ('trivial','simple','moderate','complex','expert')",
          "prompt_strategy": "TEXT NOT NULL",
          "code_patterns": "JSONB NOT NULL",
          "dependencies": "UUID[] DEFAULT '{}'",
          "required_packages": "JSONB DEFAULT '[]'",
          "example_input": "TEXT NULLABLE",
          "example_output": "JSONB NULLABLE",
          "anti_patterns": "JSONB DEFAULT '[]'",
          "common_mistakes": "JSONB DEFAULT '[]'",
          "times_used": "INTEGER DEFAULT 0",
          "success_count": "INTEGER DEFAULT 0",
          "failure_count": "INTEGER DEFAULT 0",
          "avg_quality_score": "DECIMAL(5,2) DEFAULT 0",
          "last_improved_at": "TIMESTAMPTZ NULLABLE",
          "version": "INTEGER DEFAULT 1",
          "source": "VARCHAR(30) CHECK IN ('built_in','learned_from_usage','learned_from_docs','learned_from_community','auto_discovered','mcp_integration','a2a_integration')",
          "is_active": "BOOLEAN DEFAULT TRUE",
          "embedding": "vector(1536)",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()",
          "updated_at": "TIMESTAMPTZ DEFAULT NOW()"
        },
        "indexes": ["idx(category)", "UNIQUE(name)", "idx(avg_quality_score DESC)", "idx(times_used DESC)", "IVFFlat(embedding vector_cosine_ops) lists=50"]
      },

      "cognitive.skill_versions": {
        "columns": {
          "id": "UUID PK",
          "skill_id": "UUID FK cognitive.skills(id) CASCADE",
          "version": "INTEGER NOT NULL",
          "prompt_strategy": "TEXT NOT NULL",
          "code_patterns": "JSONB NOT NULL",
          "anti_patterns": "JSONB DEFAULT '[]'",
          "change_reason": "TEXT NOT NULL",
          "change_source": "VARCHAR(30) CHECK IN ('feedback_loop','pattern_mining','doc_learning','manual','a_b_test_winner','mcp_update','a2a_learning')",
          "quality_score_before": "DECIMAL(5,2) NULLABLE",
          "quality_score_after": "DECIMAL(5,2) NULLABLE",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()"
        },
        "indexes": ["UNIQUE(skill_id, version)"]
      },

      "cognitive.knowledge_base": {
        "columns": {
          "id": "UUID PK",
          "source_type": "VARCHAR(30) CHECK IN ('official_docs','github_readme','stackoverflow','blog_post','user_feedback','error_resolution','best_practice','deprecation_notice','security_advisory','performance_tip','generated_lesson','mcp_server_docs','a2a_agent_docs','agentic_pattern')",
          "source_url": "TEXT NULLABLE",
          "title": "VARCHAR(500) NOT NULL",
          "content": "TEXT NOT NULL",
          "content_summary": "TEXT NOT NULL",
          "technology": "VARCHAR(100) NULLABLE",
          "version_range": "VARCHAR(50) NULLABLE",
          "relevance_score": "DECIMAL(5,2) DEFAULT 50",
          "times_retrieved": "INTEGER DEFAULT 0",
          "times_helpful": "INTEGER DEFAULT 0",
          "is_outdated": "BOOLEAN DEFAULT FALSE",
          "outdated_reason": "TEXT NULLABLE",
          "superseded_by": "UUID FK cognitive.knowledge_base(id) NULLABLE",
          "embedding": "vector(1536)",
          "tags": "TEXT[] DEFAULT '{}'",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()",
          "updated_at": "TIMESTAMPTZ DEFAULT NOW()"
        },
        "indexes": ["idx(source_type)", "idx(technology)", "idx(relevance_score DESC)", "IVFFlat(embedding vector_cosine_ops) lists=100"]
      },

      "cognitive.prompt_strategies": {
        "columns": {
          "id": "UUID PK",
          "name": "VARCHAR(255) NOT NULL",
          "task_type": "VARCHAR(30) CHECK IN ('code_generation','bug_fixing','optimization','architecture_planning','test_generation','code_review','explanation','refactoring','ui_design','data_modeling')",
          "system_prompt": "TEXT NOT NULL",
          "variables": "JSONB DEFAULT '[]'",
          "strategy_notes": "TEXT NULLABLE",
          "generation": "INTEGER DEFAULT 1",
          "parent_id": "UUID FK cognitive.prompt_strategies(id) NULLABLE",
          "mutation_description": "TEXT NULLABLE",
          "times_used": "INTEGER DEFAULT 0",
          "total_quality_score": "DECIMAL(10,2) DEFAULT 0",
          "avg_quality_score": "DECIMAL(5,2) DEFAULT 0",
          "positive_feedback_count": "INTEGER DEFAULT 0",
          "negative_feedback_count": "INTEGER DEFAULT 0",
          "rollback_count": "INTEGER DEFAULT 0",
          "is_active": "BOOLEAN DEFAULT TRUE",
          "is_champion": "BOOLEAN DEFAULT FALSE",
          "tournament_wins": "INTEGER DEFAULT 0",
          "tournament_losses": "INTEGER DEFAULT 0",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()",
          "updated_at": "TIMESTAMPTZ DEFAULT NOW()"
        },
        "indexes": ["idx(task_type)", "idx(task_type, is_champion) WHERE is_champion", "idx(avg_quality_score DESC)"]
      },

      "cognitive.quality_benchmarks": {
        "columns": {
          "id": "UUID PK",
          "name": "VARCHAR(255) NOT NULL",
          "category": "VARCHAR(50) NOT NULL",
          "difficulty": "VARCHAR(20) NOT NULL",
          "input_prompt": "TEXT NOT NULL",
          "expected_features": "JSONB NOT NULL",
          "rubric": "JSONB NOT NULL",
          "max_score": "INTEGER DEFAULT 100",
          "is_active": "BOOLEAN DEFAULT TRUE",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()"
        }
      },

      "cognitive.benchmark_runs": {
        "columns": {
          "id": "UUID PK",
          "benchmark_id": "UUID FK cognitive.quality_benchmarks(id)",
          "prompt_strategy_id": "UUID FK cognitive.prompt_strategies(id)",
          "model_used": "VARCHAR(50) NOT NULL",
          "skills_used": "UUID[]",
          "score": "INTEGER NOT NULL",
          "max_score": "INTEGER NOT NULL",
          "score_breakdown": "JSONB NULLABLE",
          "latency_ms": "INTEGER NULLABLE",
          "tokens_used": "INTEGER NULLABLE",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()"
        }
      },

      "cognitive.learning_queue": {
        "columns": {
          "id": "UUID PK",
          "topic": "VARCHAR(500) NOT NULL",
          "category": "VARCHAR(50) NOT NULL",
          "priority": "INTEGER DEFAULT 50 (1-100)",
          "reason": "TEXT NOT NULL",
          "detected_from": "VARCHAR(30) CHECK IN ('user_request','error_pattern','new_technology','competitor_feature','community_trend','benchmark_failure','dependency_update','mcp_discovery','a2a_discovery','agentic_pattern')",
          "source_episode_id": "UUID FK cognitive.memory_episodes(id) NULLABLE",
          "learning_status": "VARCHAR(20) DEFAULT 'queued' CHECK IN ('queued','researching','learning','testing','complete','failed','deferred')",
          "research_results": "JSONB NULLABLE",
          "skill_created_id": "UUID FK cognitive.skills(id) NULLABLE",
          "knowledge_created_ids": "UUID[] NULLABLE",
          "attempted_at": "TIMESTAMPTZ NULLABLE",
          "completed_at": "TIMESTAMPTZ NULLABLE",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()"
        },
        "indexes": ["idx(learning_status)", "idx(priority DESC) WHERE status='queued'"]
      },

      "billing.subscriptions": {
        "columns": {
          "id": "UUID PK",
          "user_id": "UUID FK public.users(id) CASCADE",
          "workspace_id": "UUID FK public.workspaces(id) NULLABLE",
          "stripe_customer_id": "VARCHAR(255) NOT NULL",
          "stripe_subscription_id": "VARCHAR(255) UNIQUE NULLABLE",
          "plan": "VARCHAR(20) NOT NULL",
          "status": "VARCHAR(20) CHECK IN ('active','past_due','canceled','trialing','incomplete','paused')",
          "current_period_start": "TIMESTAMPTZ NOT NULL",
          "current_period_end": "TIMESTAMPTZ NOT NULL",
          "cancel_at_period_end": "BOOLEAN DEFAULT FALSE",
          "canceled_at": "TIMESTAMPTZ NULLABLE",
          "trial_end": "TIMESTAMPTZ NULLABLE",
          "metadata": "JSONB DEFAULT '{}'",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()",
          "updated_at": "TIMESTAMPTZ DEFAULT NOW()"
        }
      },

      "billing.credits": {
        "columns": {
          "id": "UUID PK",
          "user_id": "UUID FK public.users(id) CASCADE",
          "workspace_id": "UUID FK public.workspaces(id) NULLABLE",
          "type": "VARCHAR(30) CHECK IN ('message','integration','compute','storage','export')",
          "total_amount": "INTEGER NOT NULL",
          "remaining": "INTEGER NOT NULL",
          "source": "VARCHAR(30) CHECK IN ('plan_allocation','purchased','bonus','rollover','refund','promotion')",
          "price_paid_cents": "INTEGER DEFAULT 0",
          "period_start": "TIMESTAMPTZ NOT NULL",
          "expires_at": "TIMESTAMPTZ NOT NULL",
          "is_expired": "BOOLEAN DEFAULT FALSE",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()"
        },
        "indexes": ["idx(user_id)", "idx(user_id, type)", "idx(user_id, is_expired, expires_at) WHERE NOT expired AND remaining > 0"]
      },

      "billing.credit_transactions": {
        "columns": {
          "id": "UUID PK",
          "credit_id": "UUID FK billing.credits(id)",
          "user_id": "UUID FK public.users(id)",
          "project_id": "UUID FK public.projects(id) NULLABLE",
          "conversation_id": "UUID FK ai.conversations(id) NULLABLE",
          "amount": "INTEGER NOT NULL (negative=consume, positive=refund)",
          "balance_after": "INTEGER NOT NULL",
          "transaction_type": "VARCHAR(30) CHECK IN ('consume','refund','expire','allocate','rollover')",
          "description": "TEXT NOT NULL",
          "is_regression_refund": "BOOLEAN DEFAULT FALSE",
          "metadata": "JSONB DEFAULT '{}'",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()"
        }
      },

      "billing.invoices": {
        "columns": {
          "id": "UUID PK",
          "user_id": "UUID FK public.users(id)",
          "stripe_invoice_id": "VARCHAR(255) UNIQUE NOT NULL",
          "amount_cents": "INTEGER NOT NULL",
          "currency": "VARCHAR(3) DEFAULT 'usd'",
          "status": "VARCHAR(20) CHECK IN ('draft','open','paid','void','uncollectible')",
          "description": "TEXT NULLABLE",
          "invoice_pdf_url": "TEXT NULLABLE",
          "period_start": "TIMESTAMPTZ NOT NULL",
          "period_end": "TIMESTAMPTZ NOT NULL",
          "paid_at": "TIMESTAMPTZ NULLABLE",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()"
        }
      },

      "analytics.events": {
        "columns": {
          "id": "UUID PK",
          "project_id": "UUID NOT NULL",
          "session_id": "VARCHAR(100) NOT NULL",
          "visitor_id": "VARCHAR(100) NOT NULL",
          "event_type": "VARCHAR(50) NOT NULL",
          "event_name": "VARCHAR(255) NULLABLE",
          "page_path": "TEXT NULLABLE",
          "page_title": "VARCHAR(500) NULLABLE",
          "referrer": "TEXT NULLABLE",
          "utm_source": "VARCHAR(255) NULLABLE",
          "utm_medium": "VARCHAR(255) NULLABLE",
          "utm_campaign": "VARCHAR(255) NULLABLE",
          "device_type": "VARCHAR(20) NULLABLE",
          "browser": "VARCHAR(50) NULLABLE",
          "os": "VARCHAR(50) NULLABLE",
          "country": "VARCHAR(2) NULLABLE",
          "city": "VARCHAR(255) NULLABLE",
          "screen_width": "INTEGER NULLABLE",
          "custom_properties": "JSONB DEFAULT '{}'",
          "created_at": "TIMESTAMPTZ DEFAULT NOW()"
        },
        "indexes": ["idx(project_id)", "idx(project_id, event_type)", "idx(session_id)", "idx(created_at)"],
        "partitioning": "RANGE on created_at (monthly)"
      }
    },

    "database_triggers": [
      "CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;",
      "Apply trigger to: users, workspaces, projects, data_models, workflows, templates, test_suites, ai.conversations, billing.subscriptions, cognitive.skills, cognitive.knowledge_base, cognitive.prompt_strategies"
    ]
  },

  "pricing": {
    "free": {"price": "$0", "messages_month": 50, "messages_day": 10, "apps": 3, "integration_credits": 10000, "features": "All core features, code view"},
    "starter": {"price": "$15/mo", "messages_month": 200, "apps": 10, "integration_credits": 50000, "features": "Code export, custom domain, GitHub sync"},
    "builder": {"price": "$35/mo", "messages_month": 500, "apps": "unlimited", "integration_credits": 200000, "features": "All features, priority AI"},
    "pro": {"price": "$75/mo", "messages_month": 1500, "apps": "unlimited", "integration_credits": 500000, "features": "Advanced analytics, SSO"},
    "enterprise": {"price": "Custom", "messages_month": "unlimited", "apps": "unlimited", "integration_credits": "unlimited", "features": "Dedicated infrastructure, SLA"},
    "credit_rules": {
      "rollover": "Unused credits roll over for 3 months then expire",
      "purchase": "Additional credit packs purchasable anytime (100 for $10, 300 for $25, 1000 for $70)",
      "regression_refund": "If AI breaks something it built, fixing it costs zero credits (auto-refunded)",
      "discuss_mode": "Discussion mode (planning, questions) costs zero credits",
      "unlimited_end_users": "All plans include unlimited end-users for deployed apps"
    }
  },

  "phases": {

    "PHASE_1": {
      "title": "Complete Project Scaffolding, Docker, Packages, Database Schema, Service Adapters, Brain Config, Seed Data",
      "context_to_include": "Include hard_rules + technology_stack + design_system + docker_architecture section + complete database_schema section",
      "estimated_files": 200,
      "prompt": "You are building ForgeAI Prometheus — a self-evolving AI-powered full-stack application builder. Generate the COMPLETE project foundation.\n\n## WHAT TO GENERATE:\n\n### ROOT FILES:\n1. package.json — Bun workspace root with scripts: dev, build, lint, typecheck, test, test:e2e, db:migrate, db:seed, db:studio, clean, format\n2. turbo.json — Pipeline config with caching for all scripts\n3. .gitignore — Comprehensive (node_modules, .env, dist, .next, .turbo, coverage)\n4. .env.example — ALL environment variables with comments (DATABASE_URL for Neon, SUPABASE_URL, GOOGLE_AI_API_KEY, GROQ_API_KEY, LOCALAI_URL=http://localai:8080, REDIS_URL=redis://redis:6379, MEILISEARCH_URL=http://meilisearch:7700, JWT_SECRET, JWT_REFRESH_SECRET, ENCRYPTION_KEY, COOKIE_SECRET, STRIPE keys, RESEND_API_KEY, OAuth keys, CLOUDFLARE keys, LOG_LEVEL, CORS_ORIGINS)\n5. .prettierrc — {semi:true, singleQuote:true, tabWidth:2, trailingComma:'all', printWidth:100}\n6. .eslintrc.js — Strict TypeScript rules\n7. tsconfig.json — Root config with path aliases\n8. docker-compose.yml — ALL services with memory limits: forge-api(4000,512MB), forge-brain(4100,1GB), forge-worker(256MB), forge-realtime(4200,256MB), redis(6379,512MB), meilisearch(7700,512MB), localai(8080,8GB), nginx(80/443,64MB). Include health checks, volumes, restart policies.\n9. docker-compose.dev.yml — Dev overrides with hot reload\n10. Dockerfile for each app (multi-stage: builder + runner)\n11. nginx.conf — Reverse proxy: /api/*→api:4000, /brain/*→brain:4100, /ws/*→realtime:4200, /search/*→meilisearch:7700. Include gzip, security headers, SSL via Cloudflare.\n12. .github/workflows/ci.yml — lint→typecheck→test→build on PR\n13. .github/workflows/deploy.yml — Deploy on merge to main\n14. README.md — Complete setup instructions, architecture overview\n\n### ALL PACKAGES (with complete package.json, tsconfig.json, src/index.ts barrel export):\n\n**packages/config/**:\n- TypeScript base configs (base, nextjs, library)\n- ESLint configs (base, nextjs, library)\n- Tailwind config with complete design system colors, fonts, spacing from design_system spec\n\n**packages/shared/**:\n- src/types/ — Complete TypeScript types for EVERY database table (User, Session, OAuthAccount, Workspace, WorkspaceMember, Project, ProjectVersion, ProjectFile, DataModel, Deployment, Workflow, WorkflowRun, Template, TestSuite, Notification, AiConversation, AiMessage, SelfHealEvent, LearningPattern, MemoryEpisode, Skill, SkillVersion, KnowledgeEntry, PromptStrategy, QualityBenchmark, BenchmarkRun, LearningQueueItem, Subscription, Credit, CreditTransaction, Invoice, AnalyticsEvent) + API envelope types (ApiResponse<T>, ApiError, PaginatedResponse<T>) + common types (SortDirection, DateRange, PaginationParams)\n- src/constants/ — plans.ts (all plan limits), credits.ts (costs per action, rollover rules), errors.ts (all error codes with HTTP status), roles.ts (permission matrices), limits.ts (system limits), locales.ts (supported languages), free-tier-limits.ts (ALL free tier limits: NEON_FREE_COMPUTE_HOURS=191.9, GEMINI_FREE_REQUESTS_DAY=1000, GROQ_FREE_RPM=30, RESEND_FREE_EMAILS_DAY=100, etc.)\n- src/schemas/ — Zod schemas for ALL API inputs: auth (login, register, reset-password, etc.), user, workspace, project, ai, deployment, workflow, billing, common (pagination, sort, filter)\n- src/utils/ — slug.ts, dates.ts, strings.ts, numbers.ts, crypto.ts (hash, token generation, encryption/decryption with AES-256-GCM), validation.ts, permissions.ts\n\n**packages/db/**:\n- drizzle.config.ts\n- src/client.ts — Neon serverless client with connection pooling and SSL\n- src/schema/ — Drizzle ORM schemas for EVERY table in database_schema. EXACT columns, types, constraints, indexes, relations. One file per table group + relations.ts + index.ts barrel.\n- src/migrations/0001_initial.sql — Creates public, billing, ai schemas and all their tables\n- src/migrations/0002_cognitive.sql — Creates cognitive schema, enables pgvector, creates all cognitive tables with vector columns and IVFFlat indexes\n- src/queries/ — Query functions for: users, sessions, workspaces, projects, project-files, deployments, workflows, templates, tests, notifications, ai-conversations, credits, analytics AND cognitive-memory (storeEpisode, searchSimilarEpisodes, updateEpisodeOutcome, getRecentEpisodes, consolidateEpisodes), cognitive-skills (createSkill, findMatchingSkills, updateSkillStats, createSkillVersion, getActiveSkills, deprecateSkill, getTopSkills), cognitive-knowledge (addKnowledge, searchKnowledge, markOutdated, updateRelevance), cognitive-prompts (getChampionPrompt, createPromptMutation, recordPromptUsage, runTournament, promoteChampion), cognitive-benchmarks (getAllBenchmarks, recordBenchmarkRun, getBenchmarkTrend), cognitive-learning-queue (addToQueue, getNextItems, updateStatus)\n- src/seed/ — Realistic seed data: 3 users, 2 workspaces, 5 projects with files, 10 templates, sample conversations, credit allocations PLUS 60 initial skills (50 standard + 10 agentic) with REAL prompt_strategy text and REAL code_patterns, 10 champion prompt_strategies, 20 quality_benchmarks with rubrics, 10 knowledge_base entries\n\n**packages/auth/**:\n- src/session.ts — Create, validate, refresh, revoke sessions with Redis caching\n- src/password.ts — Argon2id hashing with timing-safe verification\n- src/jwt.ts — JWT generation/verification (access + refresh tokens)\n- src/oauth/ — Google, GitHub, Microsoft OAuth using Arctic\n- src/magic-link.ts — Generation, sending, verification\n- src/two-factor.ts — TOTP 2FA: generateSecret, generateQRCode, verifyToken\n- src/middleware.ts — Hono middleware: requireAuth, optionalAuth, requireRole\n- src/csrf.ts — CSRF token generation and validation\n- src/rate-limit.ts — Redis-based rate limiting middleware\n- src/encryption.ts — AES-256-GCM encrypt/decrypt for sensitive data\n\n**packages/ai/**:\n- src/clients/gemini-free.ts — Google Gemini client with streaming and Redis quota tracking\n- src/clients/groq-free.ts — Groq client with streaming and quota tracking\n- src/clients/localai.ts — LocalAI OpenAI-compatible client (connects to http://localai:8080, NO quota limits)\n- src/clients/huggingface.ts — HuggingFace Inference API for embeddings\n- src/router.ts — IntelligentModelRouter: routes Gemini→Groq→LocalAI based on task type, remaining quota, historical quality. Includes cost sentinel that blocks paid calls.\n- src/streaming.ts — SSE streaming utilities\n- src/tokens.ts — Token counting with tiktoken and context window management\n- src/prompts/ — System prompt templates for: code-generation, test-generation, impact-analysis, self-healing, bug-fixing, code-review\n\n**packages/cognitive/**:\n- src/perception.ts — classifyIntent, matchSkills, assembleContext (token-budgeted: 40% files, 20% episodes, 20% knowledge, 10% skills, 10% history)\n- src/memory.ts — remember (store with embedding), recall (multi-memory vector search), forget (cleanup), consolidate (nightly pattern extraction), getShortTerm/setShortTerm (Redis)\n- src/skills.ts — findAndComposeSkills, recordSkillUsage, getSkillRecommendations\n- src/reasoning.ts — plan (full pipeline), generate (streaming with incremental validation), validateAndPolish (TypeScript compile→ESLint→auto-fix→format→quality score)\n- src/quality-judge.ts — scoreOutput on 7 criteria: completeness(20%), correctness(25%), code_quality(15%), security(15%), user_experience(10%), performance(10%), maintainability(5%)\n- src/output-generator.ts — formatCode, generateTests, generateSummary, packageResponse\n- src/reflection.ts — reflect (store episode→update skills→extract lessons→handle feedback→refund credits if AI mistake)\n- src/prompt-evolver.ts — generateMutation, runTournament (Welch's t-test), crossover, promoteChampion\n- src/embeddings.ts — generateEmbedding (Gemini→HuggingFace→LocalAI fallback), cosineSimilarity, batchEmbed\n\n**packages/email/**:\n- src/send.ts — Email sending with Resend→Brevo→Gmail SMTP fallback chain\n- src/templates/ — React Email templates: welcome, verify-email, magic-link, password-reset, new-device-login, workspace-invite, deployment-success, deployment-failed, credit-low, self-heal-notification. All with brand colors (#6366F1), responsive, i18n support.\n\n**packages/ui/**:\n- Complete shadcn/ui installation with ALL components configured\n- Custom components: AppShell, Sidebar, Header, CommandPalette, CreditBadge, ProjectCard, FileTree, CodeEditor (Monaco wrapper), AiChat, DeployButton, EmptyState, ErrorState, LoadingSkeleton, DataTable, StatsCard, ConfirmDialog, Logo, ThemeToggle, LocaleSelector, NotificationBell\n- src/lib/utils.ts — cn() utility\n\n**packages/testing/**:\n- Vitest + Playwright setup\n- Factories: user, workspace, project, conversation, credit\n- Mocks: ai-client, email, storage, stripe\n\n**apps/brain/**:\n- src/index.ts — Hono server + cron scheduler + all watcher initialization + graceful shutdown\n- src/adapters/ — Service adapter interfaces (IStorageAdapter, IEmailAdapter, IAIModelAdapter, IDatabaseAdapter, ICacheAdapter, ISearchAdapter) + implementations (Supabase/Oracle/R2 storage, Resend/Brevo/Gmail email, Gemini/Groq/LocalAI/HuggingFace AI, Neon/Supabase DB, Redis/Upstash cache, Meilisearch/Postgres search) + ServiceRegistry with health-check-driven auto-failover\n- src/capabilities/code-intelligence/ — ALL cognitive pipeline files (perception, memory, skills, reasoning, quality-judge, output-generator, reflection, prompt-evolver, model-router, index.ts with handleMessage)\n- src/capabilities/infrastructure/ — health-monitor (30s checks), quota-tracker (5min checks), auto-healer, cost-sentinel, backup-manager, log-manager, resource-optimizer\n- src/capabilities/evolution/ — scheduler (node-cron), nightly-consolidation (8 steps: episode clustering, skill extraction, quality recalc, knowledge freshness, prompt micro-evolution, gap detection, infra learning, intelligence score), weekly-deep-learning (8 steps: skill improvement with A/B test, A/B resolution with Welch's t-test, skill composition detection, knowledge acquisition from GitHub changelogs, benchmark run, prompt tournament, dependency updates, AI model benchmarking), monthly-intelligence-review (9 steps), realtime-watchers (supabase keepalive, quota watchdog, error rate monitor, deployment watcher), skill-acquisition (research→learn→test→register pipeline)\n- src/capabilities/security/ — vulnerability-scanner, secret-scanner, rate-limit-analyzer, jwt-rotator, ip-blocker, user-code-scanner\n- src/capabilities/ux-optimizer/ — session-analyzer, prompt-suggester, proactive-assistant, onboarding-optimizer\n- src/capabilities/agentic/ — mcp-client (consume external MCP servers as tools), mcp-server (expose ForgeAI as MCP server), a2a-client (discover/delegate to other agents), a2a-server (accept tasks from other agents), mcp-server-scanner (auto-discover new MCP servers weekly), agent-ecosystem-scanner (learn from LangGraph/CrewAI/AutoGen patterns monthly), multi-agent-reasoning (internal ArchitectAgent→CodeGenAgent→ReviewAgent→TestAgent for complex tasks)\n- src/config/brain-config.ts — All schedules, limits, thresholds, routing weights with Zod validation\n- src/routes/ — generate, discuss, debug, optimize, skills, intelligence, admin (all endpoints for dashboard)\n\n**apps/api/**:\n- src/index.ts — Hono app with all middleware\n- src/middleware/ — auth, rate-limit, request-id, logger, error-handler, cors, security-headers\n- src/routes/ — health, auth (register, login, logout, refresh, OAuth, magic-link, 2FA, password-reset, email-verify), users (profile, avatar, password, email, 2FA, sessions, credits, export-data, delete), workspaces (CRUD, members, settings, SSO), projects (CRUD, files, versions, settings, export), ai (proxy to brain service), deployments, workflows, tests, templates, billing (Stripe subscriptions, credits, invoices, webhooks), analytics, notifications, admin\n- src/services/ — stripe.ts, storage.ts, search.ts\n\n**apps/web/**:\n- next.config.ts, tailwind.config.ts, src/middleware.ts (auth + locale detection)\n- src/app/layout.tsx with providers (QueryClient, Theme, Auth, Toaster, Socket)\n- src/app/globals.css\n- Pages: (marketing)/page.tsx (hero, features, pricing, FAQ), (auth)/login, register, forgot-password, reset-password/[token], verify-email/[token], (dashboard)/dashboard, workspace/[slug], workspace/[slug]/settings, workspace/[slug]/members, project/[id], project/[id]/editor (THREE-PANEL: file tree + Monaco editor/preview + AI chat), project/[id]/data, project/[id]/deployments, project/[id]/workflows, project/[id]/tests, project/[id]/analytics, project/[id]/settings, settings/profile, settings/security, settings/billing, settings/notifications, templates, onboarding, admin/brain (full dashboard with: intelligence gauge, service health, quota meters, skill browser, knowledge browser, evolution timeline, benchmark chart, prompt tournaments, learning queue, cost tracker, manual triggers), not-found, error\n- src/lib/ — api-client.ts, query-keys.ts\n- src/hooks/ — useAuth, useProjects, useWorkspaces, useAiChat (with streaming), useCredits, useDeployments, useNotifications, useDebounce, useLocalStorage, useMediaQuery\n- src/providers/ — auth-provider (with silent token refresh), query-provider, theme-provider, socket-provider\n\n**apps/worker/**:\n- Queue definitions + processors: email, deployment, ai-processing, test-runner, analytics-aggregation, self-healing, credit-management, cleanup\n\n**apps/realtime/**:\n- Socket.io server with auth middleware\n- Namespaces: editor (collaboration), notifications, deployments, analytics\n\n**apps/docs/**:\n- Nextra setup with: getting-started, concepts (workspaces, projects, ai-modes), guides (first-app, data-models, authentication, deployment, workflows, export)\n\n**tooling/scripts/**:\n- setup-oracle-vm.sh (install Docker, add swap, configure firewall, clone repo, build, start)\n- full-deploy.sh (build, start, migrate, seed, configure DNS, deploy frontend, health check)\n- backup.sh, restore.sh, health-check.sh, reset-db.sh\n\nGenerate EVERY file completely. No placeholders. No truncation. This is the entire platform foundation.",

      "validation_checklist": [
        "bun install — zero errors",
        "docker-compose up -d — all 8 services running with health checks passing",
        "bun run db:migrate — all tables created in all 5 schemas",
        "bun run db:seed — realistic data inserted including 60 skills with real content",
        "bun run typecheck — zero TypeScript errors",
        "bun run lint — zero lint errors",
        "bun run build — all apps build successfully",
        "apps/web loads at localhost:3000",
        "apps/api health check returns healthy at localhost:4000/api/v1/health",
        "apps/brain health check returns healthy at localhost:4100/brain/health",
        "AI model router correctly routes Gemini→Groq→LocalAI",
        "Cost sentinel blocks any paid API call",
        "All service adapters have working primary + fallback",
        "Cron scheduler registers all evolution tasks",
        "All realtime watchers start (health monitor, quota tracker, error monitor)",
        "Cognitive pipeline handles a test prompt end-to-end",
        "Quality Judge scores test output on all 7 criteria",
        "Memory system stores and retrieves episodes via pgvector",
        "All email templates render correctly",
        "Admin brain dashboard loads with all panels"
      ]
    },

    "PHASE_2": {
      "title": "Integration Testing, E2E Testing, Polish, Production Hardening, and Audit",
      "context_to_include": "Include hard_rules + pricing section",
      "prompt": "ForgeAI PHASE_1 is complete. Now implement complete integration tests, E2E tests, production hardening, and final polish.\n\n## GENERATE:\n\n### 1. Integration Tests (apps/api/tests/):\n- auth.test.ts — Test ALL auth endpoints: register (success + duplicate email + weak password), login (success + wrong password + locked account + 2FA), OAuth (mock), magic-link, refresh, logout, password-reset, email-verify\n- users.test.ts — Test profile update, avatar upload, password change, 2FA enable/disable, sessions list/revoke, credits query, data export, account deletion\n- workspaces.test.ts — Test CRUD, member invite/remove/role-change, permission enforcement\n- projects.test.ts — Test CRUD, file operations, version history, rollback\n- ai.test.ts — Test chat endpoint (mocked AI), discuss mode (zero credits), impact analysis, apply/rollback changes\n- billing.test.ts — Test subscription create/upgrade/cancel, credit allocation/consumption/rollover/refund, Stripe webhook handling\n- All tests use test database, test factories, proper cleanup\n\n### 2. E2E Tests (apps/web/tests/):\n- auth.spec.ts — Register→verify email→login→dashboard flow\n- project.spec.ts — Create workspace→create project→open editor→send AI prompt→see response→apply changes→preview\n- deployment.spec.ts — Deploy project→see deployment status→visit deployed URL\n- billing.spec.ts — View plans→upgrade (mock Stripe)→see credits increase\n- admin.spec.ts — Login as admin→view brain dashboard→trigger manual evolution\n\n### 3. Production Hardening:\n- Security headers on ALL responses (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)\n- CORS configured per environment\n- All endpoints have rate limiting (auth: 10/min/IP, AI: 30/min/user, general: 60/min/user free, 120 starter, 300 builder, 600 pro)\n- All file uploads validate: type whitelist, max 10MB, content-type verification\n- Graceful shutdown on SIGTERM for all services\n- Database connection pool limits configured\n- Redis connection with retry and reconnection logic\n- Request timeout middleware (30s default, 120s for AI endpoints)\n\n### 4. Marketing Homepage Polish:\n- Animated hero with demo of building an app from prompt\n- Feature sections: AI Code Generation, Self-Learning, Zero Lock-In, Regression Prevention, Multi-Language Auth, Fair Pricing\n- How it works: 3 steps (Describe→Generate→Deploy)\n- Comparison table: ForgeAI vs Base44 vs Lovable vs Bolt (we win every category)\n- Pricing section from the pricing spec\n- FAQ section (10 questions)\n- Footer with links\n- Perfect Lighthouse scores: Performance 95+, Accessibility 100, SEO 100, Best Practices 100\n\n### 5. Deployment Scripts (final versions):\n- tooling/scripts/setup-oracle-vm.sh — Complete one-command server setup\n- tooling/scripts/full-deploy.sh — Complete deployment from zero to running\n- tooling/scripts/backup.sh — Automated PostgreSQL backup to Oracle Object Storage\n- tooling/scripts/health-check.sh — Check all services, alert if any down\n- tooling/scripts/rollback.sh — Rollback to previous deployment\n\n### 6. Documentation:\n- docs/DEPLOYMENT.md — Step-by-step production deployment\n- docs/ARCHITECTURE.md — System architecture with ASCII diagrams\n- docs/RUNBOOK.md — Operations runbook (common issues, debugging, scaling)\n\n### 7. Final Audit:\n- Verify every endpoint has: auth + validation + rate limiting + error handling\n- Verify zero paid service calls without fallback\n- Verify all pages responsive at 320px, 768px, 1024px, 1440px\n- Verify dark mode works on every page\n- Verify all forms have all 5 states\n- Verify WCAG AA accessibility on all pages\n- Verify all imports resolve and all types explicit\n\nGenerate ALL files. Output FINAL AUDIT REPORT at the end: total files, total lines, issues found and fixed, PRODUCTION READY verdict.",

      "validation_checklist": [
        "All integration tests pass",
        "All E2E tests pass in Playwright",
        "Lighthouse scores: Performance 90+, Accessibility 95+, SEO 95+",
        "All security headers present on all responses",
        "Rate limiting works correctly per plan",
        "Graceful shutdown works without dropping requests",
        "Marketing homepage loads in under 2 seconds",
        "All deployment scripts are executable and complete",
        "Documentation covers setup, architecture, and operations",
        "Final audit report shows PRODUCTION READY"
      ]
    }
  }
}