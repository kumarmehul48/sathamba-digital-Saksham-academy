-- ============================================================
-- SATHAMBA DIGITAL SAKSHAM ACADEMY (SDSA) - Database Schema
-- PostgreSQL / Supabase | Run in Supabase SQL Editor, then seed.sql
-- ============================================================

-- EXTENSIONS
create extension if not exists "pgcrypto";

-- ENUMS
create type user_role as enum ('student','trainer','admin','super_admin');
create type admission_status as enum ('pending','under_review','approved','rejected','enrolled');
create type batch_status as enum ('upcoming','active','completed','cancelled');
create type attendance_status as enum ('present','absent','late');
create type assessment_type as enum ('pre','weekly','mid_course','practical','final','capstone');
create type approval_status as enum ('pending','approved','rejected');
create type record_status as enum ('active','inactive');
create type portfolio_status as enum ('in_progress','submitted','completed');
create type certificate_status as enum ('draft','issued','revoked');
create type ticket_status as enum ('open','in_progress','resolved','closed');

-- UPDATED_AT TRIGGER
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;

-- ============================ PROFILES ======================
-- Extends Supabase auth.users with role and basic info
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'student',
  mobile text,
  email text,
  avatar_url text,
  status record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_profiles_updated before update on public.profiles
for each row execute function public.set_updated_at();

-- ============================ COURSES / CURRICULUM ==========
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text not null,
  tagline text,
  description text,
  duration_weeks int not null default 26,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_courses_updated before update on public.courses
for each row execute function public.set_updated_at();

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  module_number int not null,
  title text not null,
  weeks_start int not null,
  weeks_end int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, module_number)
);
create trigger trg_modules_updated before update on public.modules
for each row execute function public.set_updated_at();

create table public.weeks (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  week_number int not null,
  title text not null,
  topics jsonb not null default '[]',          -- string[]
  objectives jsonb not null default '[]',      -- string[]
  activities jsonb not null default '[]',      -- practical activities
  applications jsonb not null default '[]',   -- real-world applications
  illustration_url text,                      -- placeholder asset
  video_url text,                             -- placeholder asset
  resources jsonb not null default '[]',      -- downloadable resources
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, week_number)
);
create index idx_weeks_course on public.weeks(course_id);
create trigger trg_weeks_updated before update on public.weeks
for each row execute function public.set_updated_at();

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.weeks(id) on delete cascade,
  position int not null default 0,
  title text not null,
  -- structured workbook fields (to be filled later; structure ready)
  what_is text, why_important text, simple_explanation text,
  real_life_analogy text, step_by_step jsonb default '[]',
  practical_example text, student_activity text,
  ai_illustration text, video_url text,
  practice_task text, self_check jsonb default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_topics_week on public.topics(week_id);
create trigger trg_topics_updated before update on public.topics
for each row execute function public.set_updated_at();

-- ============================ WORKBOOKS =====================
create table public.workbooks (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.weeks(id) on delete cascade,
  title text not null,
  explanation text,
  topics jsonb not null default '[]',
  examples jsonb not null default '[]',
  images jsonb not null default '[]',
  practice jsonb not null default '[]',
  self_check jsonb not null default '[]',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_workbooks_updated before update on public.workbooks
for each row execute function public.set_updated_at();

create table public.workbook_versions (
  id uuid primary key default gen_random_uuid(),
  workbook_id uuid not null references public.workbooks(id) on delete cascade,
  version text not null,                        -- v1.0, v1.1, v2.0
  content jsonb not null default '{}',        -- snapshot of workbook content
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (workbook_id, version)
);

-- ============================ PEOPLE ========================
create table public.trainers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  skills jsonb not null default '[]',
  status record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_trainers_updated before update on public.trainers
for each row execute function public.set_updated_at();

create table public.batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  course_id uuid not null references public.courses(id),
  trainer_id uuid references public.trainers(id),
  start_date date not null,
  end_date date,
  schedule text,                               -- e.g. "Mon-Sat 7-9 AM"
  classroom text,
  status batch_status not null default 'upcoming',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_batches_course on public.batches(course_id);
create trigger trg_batches_updated before update on public.batches
for each row execute function public.set_updated_at();

create table public.students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  student_id text unique not null,             -- SDSA-2026-001
  course_id uuid references public.courses(id),
  batch_id uuid references public.batches(id),
  admission_date date not null default current_date,
  guardian_name text,
  address text,
  current_week int not null default 1,
  status record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_students_batch on public.students(batch_id);
create trigger trg_students_updated before update on public.students
for each row execute function public.set_updated_at();

-- ============================ ADMISSIONS / ENQUIRIES =========
create table public.admissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile text not null,
  email text,
  location text,
  course_id uuid references public.courses(id),
  course_interest text,
  status admission_status not null default 'pending',
  notes text,
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_admissions_updated before update on public.admissions
for each row execute function public.set_updated_at();

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile text not null,
  email text,
  location text,
  course_interest text,
  message text,
  status text not null default 'new',          -- new/contacted/follow_up/closed
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_enquiries_updated before update on public.enquiries
for each row execute function public.set_updated_at();

-- ============================ ASSIGNMENTS ===================
create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.weeks(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  max_score int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_assignments_week on public.assignments(week_id);
create trigger trg_assignments_updated before update on public.assignments
for each row execute function public.set_updated_at();

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  content text,
  file_url text,                               -- Supabase Storage path
  status text not null default 'submitted',    -- submitted/graded/returned
  score int,
  feedback text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assignment_id, student_id)
);
create index idx_submissions_student on public.submissions(student_id);
create trigger trg_submissions_updated before update on public.submissions
for each row execute function public.set_updated_at();

-- ============================ ATTENDANCE =====================
create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  date date not null,
  status attendance_status not null default 'present',
  marked_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (batch_id, student_id, date)
);
create index idx_attendance_student_date on public.attendance(student_id, date);

-- ============================ ASSESSMENTS ====================
create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.batches(id),
  week_id uuid references public.weeks(id),
  type assessment_type not null default 'weekly',
  title text not null,
  held_on date,
  max_score int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_assessments_updated before update on public.assessments
for each row execute function public.set_updated_at();

create table public.results (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  score int not null default 0,
  percentage numeric(5,2) not null default 0,
  passed boolean not null default false,
  feedback text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assessment_id, student_id)
);
create index idx_results_student on public.results(student_id);
create trigger trg_results_updated before update on public.results
for each row execute function public.set_updated_at();

-- ============================ PORTFOLIO =====================
create table public.portfolios (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references public.students(id) on delete cascade,
  status portfolio_status not null default 'in_progress',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_portfolios_updated before update on public.portfolios
for each row execute function public.set_updated_at();

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  name text not null,
  description text,
  skills jsonb not null default '[]',
  files jsonb not null default '[]',           -- storage paths
  images jsonb not null default '[]',
  links jsonb not null default '[]',
  trainer_feedback text,
  approval approval_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_projects_portfolio on public.projects(portfolio_id);
create trigger trg_projects_updated before update on public.projects
for each row execute function public.set_updated_at();

-- ============================ CERTIFICATES ==================
create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_number text unique not null,     -- SDSA-CERT-2026-0001
  student_id uuid not null references public.students(id),
  course_id uuid not null references public.courses(id),
  batch_id uuid references public.batches(id),
  issue_date date not null default current_date,
  status certificate_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_certificates_student on public.certificates(student_id);
create trigger trg_certificates_updated before update on public.certificates
for each row execute function public.set_updated_at();

-- ============================ CONTENT =======================
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text not null default 'students',  -- all/students/trainers
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_announcements_updated before update on public.announcements
for each row execute function public.set_updated_at();

create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'Classroom', -- Classroom/Student Activities/Projects/Events/Workshops/Academy Activities
  title text not null,
  image_url text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.website_content (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,                    -- home.hero / about.vision / faq.list / contact.info ...
  content jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
create trigger trg_content_updated before update on public.website_content
for each row execute function public.set_updated_at();

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject text not null,
  category text,
  description text,
  attachment_url text,
  status ticket_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_tickets_updated before update on public.support_tickets
for each row execute function public.set_updated_at();

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id),
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);
create index idx_audit_entity on public.audit_logs(entity, entity_id);

-- ============================ STORAGE BUCKETS ===============
insert into storage.buckets (id, name, public) values ('submissions','submissions', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('portfolio','portfolio', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('gallery','gallery', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('public-assets','public-assets', true) on conflict do nothing;

-- ============================ ROW LEVEL SECURITY ============
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.weeks enable row level security;
alter table public.topics enable row level security;
alter table public.workbooks enable row level security;
alter table public.workbook_versions enable row level security;
alter table public.trainers enable row level security;
alter table public.batches enable row level security;
alter table public.students enable row level security;
alter table public.admissions enable row level security;
alter table public.enquiries enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.attendance enable row level security;
alter table public.assessments enable row level security;
alter table public.results enable row level security;
alter table public.portfolios enable row level security;
alter table public.projects enable row level security;
alter table public.certificates enable row level security;
alter table public.announcements enable row level security;
alter table public.gallery enable row level security;
alter table public.website_content enable row level security;
alter table public.support_tickets enable row level security;
alter table public.audit_logs enable row level security;

-- Helper: current user role
create or replace function public.my_role() returns user_role
language sql stable security definer as
$$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.is_staff() returns boolean
language sql stable security definer as
$$ select coalesce(public.my_role() in ('admin','super_admin'), false) $$;

create or replace function public.is_staff_or_trainer() returns boolean
language sql stable security definer as
$$ select coalesce(public.my_role() in ('admin','super_admin','trainer'), false) $$;

create or replace function public.my_student_id() returns uuid
language sql stable security definer as
$$ select id from public.students where profile_id = auth.uid() $$;

-- ---- PUBLIC (anon) read: published curriculum & site content ----
create policy "public read courses" on public.courses for select using (is_active);
create policy "public read modules" on public.modules for select using (true);
create policy "public read weeks" on public.weeks for select using (is_published);
create policy "public read announcements" on public.announcements for select using (is_published);
create policy "public read gallery" on public.gallery for select using (is_published);
create policy "public read content" on public.website_content for select using (true);
-- Certificate public verification: only minimal fields via view
create view public.certificate_verification as
  select c.certificate_number, c.issue_date, c.status, p.full_name as student_name,
         co.title as course_title
  from public.certificates c
  join public.students s on s.id = c.student_id
  join public.profiles p on p.id = s.profile_id
  join public.courses co on co.id = c.course_id
  where c.status = 'issued';
grant select on public.certificate_verification to anon, authenticated;

-- ---- PROFILES ----
create policy "read own profile" on public.profiles for select using (id = auth.uid() or public.is_staff_or_trainer());
create policy "update own profile" on public.profiles for update using (id = auth.uid() or public.is_staff());

-- ---- STUDENTS: self read; staff read all; staff write ----
create policy "students select" on public.students for select
  using (profile_id = auth.uid() or public.is_staff_or_trainer());
create policy "students insert" on public.students for insert with check (public.is_staff());
create policy "students update" on public.students for update using (public.is_staff());

-- ---- ATTENDANCE / RESULTS / SUBMISSIONS: student sees own rows ----
create policy "attendance select own" on public.attendance for select
  using (student_id = public.my_student_id() or public.is_staff_or_trainer());
create policy "attendance write" on public.attendance for all
  using (public.is_staff_or_trainer()) with check (public.is_staff_or_trainer());

create policy "results select own" on public.results for select
  using (student_id = public.my_student_id() and is_published or public.is_staff_or_trainer());
create policy "results write" on public.results for all
  using (public.is_staff_or_trainer()) with check (public.is_staff_or_trainer());

create policy "submissions select own" on public.submissions for select
  using (student_id = public.my_student_id() or public.is_staff_or_trainer());
create policy "submissions insert own" on public.submissions for insert
  with check (student_id = public.my_student_id());
create policy "submissions update" on public.submissions for update
  using (public.is_staff_or_trainer());

-- ---- WORKBOOKS / TOPICS: students read published, staff all ----
create policy "workbooks select" on public.workbooks for select
  using (is_published and auth.role() = 'authenticated' or public.is_staff_or_trainer());
create policy "workbooks write" on public.workbooks for all
  using (public.is_staff_or_trainer()) with check (public.is_staff_or_trainer());
create policy "topics select" on public.topics for select using (true);
create policy "topics write" on public.topics for all
  using (public.is_staff_or_trainer()) with check (public.is_staff_or_trainer());
create policy "workbook_versions select" on public.workbook_versions for select
  using (public.is_staff_or_trainer());
create policy "workbook_versions write" on public.workbook_versions for all
  using (public.is_staff_or_trainer()) with check (public.is_staff_or_trainer());

-- ---- ASSIGNMENTS / ASSESSMENTS ----
create policy "assignments select" on public.assignments for select using (true);
create policy "assignments write" on public.assignments for all
  using (public.is_staff_or_trainer()) with check (public.is_staff_or_trainer());
create policy "assessments select" on public.assessments for select
  using (auth.role() = 'authenticated' or public.is_staff_or_trainer());
create policy "assessments write" on public.assessments for all
  using (public.is_staff_or_trainer()) with check (public.is_staff_or_trainer());

-- ---- PORTFOLIO / PROJECTS ----
create policy "portfolios select own" on public.portfolios for select
  using (student_id = public.my_student_id() or public.is_staff_or_trainer());
create policy "portfolios write" on public.portfolios for all
  using (public.is_staff_or_trainer()) with check (public.is_staff_or_trainer());
create policy "projects select" on public.projects for select
  using (public.is_staff_or_trainer() or exists (
    select 1 from public.portfolios pp
    where pp.id = portfolio_id and pp.student_id = public.my_student_id()));
create policy "projects insert own" on public.projects for insert
  with check (exists (
    select 1 from public.portfolios pp
    where pp.id = portfolio_id and pp.student_id = public.my_student_id()));
create policy "projects update" on public.projects for update using (public.is_staff_or_trainer());

-- ---- CERTIFICATES: student sees own, staff all ----
create policy "certificates select" on public.certificates for select
  using (student_id = public.my_student_id() or public.is_staff_or_trainer());
create policy "certificates write" on public.certificates for all
  using (public.is_staff()) with check (public.is_staff());

-- ---- ADMISSIONS / ENQUIRIES: anon can apply, staff manage ----
create policy "admissions insert anon" on public.admissions for insert to anon, authenticated with check (true);
create policy "admissions read staff" on public.admissions for select using (public.is_staff());
create policy "admissions update staff" on public.admissions for update using (public.is_staff());
create policy "enquiries insert anon" on public.enquiries for insert to anon, authenticated with check (true);
create policy "enquiries read staff" on public.enquiries for select using (public.is_staff());
create policy "enquiries update staff" on public.enquiries for update using (public.is_staff());

-- ---- BATCHES / TRAINERS: authenticated read, staff write ----
create policy "batches select" on public.batches for select
  using (auth.role() = 'authenticated' or public.is_staff_or_trainer());
create policy "batches write" on public.batches for all
  using (public.is_staff()) with check (public.is_staff());
create policy "trainers select" on public.trainers for select
  using (auth.role() = 'authenticated');
create policy "trainers write" on public.trainers for all
  using (public.is_staff()) with check (public.is_staff());

-- ---- CONTENT MANAGEMENT ----
create policy "content write staff" on public.website_content for all
  using (public.is_staff()) with check (public.is_staff());
create policy "announcements write staff" on public.announcements for all
  using (public.is_staff()) with check (public.is_staff());
create policy "gallery write staff" on public.gallery for all
  using (public.is_staff()) with check (public.is_staff());

-- ---- SUPPORT TICKETS ----
create policy "tickets select own" on public.support_tickets for select
  using (student_id = public.my_student_id() or public.is_staff_or_trainer());
create policy "tickets insert own" on public.support_tickets for insert
  with check (student_id = public.my_student_id());
create policy "tickets update" on public.support_tickets for update using (public.is_staff_or_trainer());

-- ---- AUDIT LOGS: staff read only, no direct writes from client ----
create policy "audit read staff" on public.audit_logs for select using (public.is_staff());

-- ============================ AUTO PROFILE CREATION =========
-- When a new auth user signs up, create their profile automatically
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'full_name', 'New User'),
          new.email,
          coalesce((new.raw_user_meta_data->>'role')::user_role, 'student'));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- ============================ STORAGE POLICIES ===============
-- submissions: student writes own folder, staff reads all
create policy "submissions student upload" on storage.objects for insert to authenticated
with check (bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "submissions staff read" on storage.objects for select to authenticated
using (bucket_id = 'submissions' and public.is_staff_or_trainer());
create policy "portfolio student upload" on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "portfolio read" on storage.objects for select to authenticated
using (bucket_id = 'portfolio' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff_or_trainer()));
create policy "gallery staff manage" on storage.objects for all to authenticated
using (bucket_id = 'gallery' and public.is_staff()) with check (bucket_id = 'gallery' and public.is_staff());
