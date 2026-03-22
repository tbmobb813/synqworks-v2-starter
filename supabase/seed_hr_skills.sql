-- HR Skills Seed Data
-- Source: DOL, EEOC, SHRM, public university HR manuals

insert into public.skills (id, name, category, description, sort_order, created_at) values
  ('00000000-0000-0000-0000-000000000001', 'Workplace Safety', 'Compliance', 'Understanding OSHA and workplace safety requirements.', 1, now()),
  ('00000000-0000-0000-0000-000000000002', 'Diversity & Inclusion', 'People Operations', 'Promoting DEI and preventing discrimination.', 2, now()),
  ('00000000-0000-0000-0000-000000000003', 'FMLA Compliance', 'Compliance', 'Managing leave under the Family and Medical Leave Act.', 3, now()),
  ('00000000-0000-0000-0000-000000000004', 'Harassment Prevention', 'Compliance', 'Recognizing and preventing workplace harassment.', 4, now()),
  ('00000000-0000-0000-0000-000000000005', 'Recruitment & Selection', 'Talent Management', 'Best practices for legal and effective hiring.', 5, now()),
  ('00000000-0000-0000-0000-000000000006', 'Performance Management', 'Talent Management', 'Conducting reviews and managing employee performance.', 6, now()),
  ('00000000-0000-0000-0000-000000000007', 'Payroll & Compensation', 'Operations', 'Ensuring accurate payroll and fair compensation.', 7, now()),
  ('00000000-0000-0000-0000-000000000008', 'Employee Relations', 'People Operations', 'Handling grievances, disputes, and investigations.', 8, now()),
  ('00000000-0000-0000-0000-000000000009', 'Onboarding & Orientation', 'Talent Management', 'Welcoming and training new employees.', 9, now()),
  ('00000000-0000-0000-0000-000000000010', 'Policy Development', 'Compliance', 'Creating and updating HR policies and handbooks.', 10, now());
