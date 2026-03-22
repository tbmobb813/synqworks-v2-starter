-- ============================================
-- Dashboard v2 — Minor DB additions
-- Run after schema.sql + seed files
-- ============================================

-- ============================================
-- CERTIFICATIONS
-- Defines certification programs. Each cert
-- requires a set of skills at a threshold score.
-- ============================================
create table if not exists public.certifications (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,               -- e.g. "HR Compliance Certified"
  description   text,
  skill_ids     uuid[] not null,             -- skills required for this cert
  threshold     int not null default 80,     -- minimum score on ALL skills
  badge_color   text not null default 'emerald', -- for UI display
  created_at    timestamptz not null default now()
);

-- Public read for certifications
create policy "content_public_read_certs" on public.certifications
  for select using (true);

alter table public.certifications enable row level security;

-- ============================================
-- MANDATORY TRAINING ADDITIONS
-- Add is_mandatory and due_date to training_modules
-- ============================================
alter table public.training_modules
  add column if not exists is_mandatory boolean not null default false;

alter table public.training_modules
  add column if not exists due_date date;

-- ============================================
-- INDEXES
-- ============================================
create index if not exists idx_assessment_results_completed
  on public.assessment_results (user_id, completed_at);
