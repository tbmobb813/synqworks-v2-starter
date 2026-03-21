-- ============================================
-- SynqWorks v2 Schema
-- Run this in your Supabase SQL editor
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- USERS
-- Supabase Auth handles the auth.users table.
-- This extends it with app-specific profile data.
-- ============================================
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null,
  full_name   text,
  role        text not null default 'user', -- 'user' | 'admin'
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================
-- SKILLS
-- The taxonomy. Every module, scenario, and
-- progress record links back to a skill.
-- ============================================
create table public.skills (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,           -- e.g. "Conflict Resolution"
  category    text not null,           -- e.g. "People Operations"
  description text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ============================================
-- TRAINING MODULES
-- Each module targets one skill at a specific
-- difficulty. Content lives in config jsonb.
-- ============================================
create table public.training_modules (
  id            uuid primary key default uuid_generate_v4(),
  skill_id      uuid not null references public.skills(id) on delete cascade,
  title         text not null,
  description   text,
  difficulty    int not null check (difficulty between 1 and 5),
  estimated_mins int not null default 5,
  xp_reward     int not null default 100,
  config        jsonb not null default '{}', -- branching logic, drill content
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ============================================
-- SIMULATION SCENARIOS
-- Full scenario configs. The simulation player
-- reads from config jsonb to render each node.
-- ============================================
create table public.simulation_scenarios (
  id            uuid primary key default uuid_generate_v4(),
  skill_id      uuid not null references public.skills(id) on delete cascade,
  title         text not null,
  description   text,
  environment   text not null default 'conversation', -- 'conversation' | 'inbox' | 'meeting'
  difficulty    int not null check (difficulty between 1 and 5),
  config        jsonb not null default '{}', -- nodes, options, impact values
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ============================================
-- ASSESSMENT QUESTIONS
-- The 12-question diagnostic. Each question
-- maps to a skill and carries per-option scores.
-- ============================================
create table public.assessment_questions (
  id            uuid primary key default uuid_generate_v4(),
  skill_id      uuid not null references public.skills(id) on delete cascade,
  question_text text not null,
  context       text,                  -- optional scenario setup paragraph
  options       jsonb not null,        -- [{label, score, explanation}]
  sort_order    int not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ============================================
-- USER PROGRESS
-- One row per user per skill. competency_score
-- updates after every module or simulation.
-- ============================================
create table public.user_progress (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  skill_id          uuid not null references public.skills(id) on delete cascade,
  competency_score  numeric(5,2) not null default 0 check (competency_score between 0 and 100),
  sessions_count    int not null default 0,
  last_activity_at  timestamptz not null default now(),
  unique (user_id, skill_id)
);

-- ============================================
-- ASSESSMENT RESULTS
-- Stores each completed diagnostic session.
-- scores jsonb maps skill_id -> raw score.
-- ============================================
create table public.assessment_results (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  scores      jsonb not null,  -- { "skill_id": score, ... }
  completed_at timestamptz not null default now()
);

-- ============================================
-- MODULE COMPLETIONS
-- Tracks which modules a user has finished
-- so the engine never repeats completed work.
-- ============================================
create table public.module_completions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  module_id     uuid not null references public.training_modules(id) on delete cascade,
  score         numeric(5,2),          -- performance score 0-100
  time_spent_s  int,                   -- seconds spent
  completed_at  timestamptz not null default now(),
  unique (user_id, module_id)
);

-- ============================================
-- SIMULATION RESULTS
-- Full after-action data. metrics jsonb stores
-- trust/compliance/budget final values.
-- ============================================
create table public.simulation_results (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  scenario_id     uuid not null references public.simulation_scenarios(id) on delete cascade,
  metrics         jsonb not null,       -- { trust: 72, compliance: 45, budget: 88 }
  choices_log     jsonb not null,       -- ordered array of choices made
  outcome_label   text,                 -- e.g. "Systemic Risk Averted"
  xp_earned       int not null default 0,
  completed_at    timestamptz not null default now()
);

-- ============================================
-- ROW LEVEL SECURITY
-- Users can only read/write their own data.
-- ============================================
alter table public.profiles             enable row level security;
alter table public.user_progress        enable row level security;
alter table public.assessment_results   enable row level security;
alter table public.module_completions   enable row level security;
alter table public.simulation_results   enable row level security;

-- Profiles: users own their row
create policy "users_own_profile" on public.profiles
  for all using (auth.uid() = id);

-- Progress: users own their rows
create policy "users_own_progress" on public.user_progress
  for all using (auth.uid() = user_id);

-- Assessment results: users own their rows
create policy "users_own_assessments" on public.assessment_results
  for all using (auth.uid() = user_id);

-- Module completions: users own their rows
create policy "users_own_completions" on public.module_completions
  for all using (auth.uid() = user_id);

-- Simulation results: users own their rows
create policy "users_own_sim_results" on public.simulation_results
  for all using (auth.uid() = user_id);

-- Content tables are publicly readable (no auth needed to view modules/questions)
create policy "content_public_read" on public.skills
  for select using (true);
create policy "content_public_read_modules" on public.training_modules
  for select using (is_active = true);
create policy "content_public_read_scenarios" on public.simulation_scenarios
  for select using (is_active = true);
create policy "content_public_read_questions" on public.assessment_questions
  for select using (is_active = true);

-- ============================================
-- INDEXES
-- Keep queries fast as data grows.
-- ============================================
create index on public.user_progress (user_id);
create index on public.user_progress (skill_id);
create index on public.module_completions (user_id);
create index on public.assessment_results (user_id);
create index on public.simulation_results (user_id);
create index on public.training_modules (skill_id, difficulty);