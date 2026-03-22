-- ============================================
-- Seed: Certifications
-- Maps to skills from seed_hr_skills.sql
-- ============================================

-- HR Compliance Certified: requires Workplace Safety, FMLA Compliance, Harassment Prevention, Policy Development at 80+
insert into public.certifications (name, description, skill_ids, threshold, badge_color)
select
  'HR Compliance Certified',
  'Demonstrates proficiency across all core compliance domains including workplace safety, FMLA, harassment prevention, and policy development.',
  array_agg(id order by sort_order),
  80,
  'emerald'
from public.skills
where name in ('Workplace Safety', 'FMLA Compliance', 'Harassment Prevention', 'Policy Development');

-- People Operations Specialist: requires D&I, Employee Relations, Performance Management, Onboarding at 80+
insert into public.certifications (name, description, skill_ids, threshold, badge_color)
select
  'People Operations Specialist',
  'Certified in people-focused HR competencies including diversity, employee relations, performance management, and onboarding.',
  array_agg(id order by sort_order),
  80,
  'violet'
from public.skills
where name in ('Diversity & Inclusion', 'Employee Relations', 'Performance Management', 'Onboarding & Orientation');

-- Talent Acquisition Pro: requires Recruitment & Selection, Payroll & Compensation at 75+
insert into public.certifications (name, description, skill_ids, threshold, badge_color)
select
  'Talent Acquisition Pro',
  'Proficiency in recruitment processes and compensation strategy.',
  array_agg(id order by sort_order),
  75,
  'blue'
from public.skills
where name in ('Recruitment & Selection', 'Payroll & Compensation');

-- Mark existing training modules as mandatory with due dates
update public.training_modules
set is_mandatory = true,
    due_date = current_date + interval '30 days'
where title in ('OSHA Basics', 'Preventing Workplace Harassment');

update public.training_modules
set is_mandatory = true,
    due_date = current_date + interval '60 days'
where title in ('FMLA: Managing Leave Requests');
