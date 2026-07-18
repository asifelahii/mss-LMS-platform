-- MSS Sprint 3A
-- Core Supabase schema and RLS foundation

create extension if not exists pgcrypto with schema extensions;

do $$ begin
  create type public.app_role as enum ('super_admin', 'admin', 'teacher', 'student', 'support');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.profile_status as enum ('pending', 'active', 'blocked');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.publish_status as enum ('draft', 'review', 'published', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.course_mode as enum ('recorded', 'live', 'hybrid');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.course_level as enum ('beginner', 'intermediate', 'advanced');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.course_access_type as enum ('free', 'paid');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.package_type as enum ('single_subject', 'full_year', 'revision_batch', 'free_demo');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.enrollment_status as enum ('pending', 'active', 'expired', 'revoked', 'rejected');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_method as enum ('bkash', 'nagad', 'rocket', 'bank_transfer');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.material_type as enum ('pdf', 'image', 'doc', 'sheet', 'link', 'other');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.video_provider as enum ('youtube_unlisted', 'youtube_nocookie', 'cloudflare_stream', 'bunny_stream', 'external');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ticket_category as enum ('payment', 'course_access', 'technical', 'academic', 'other');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  role public.app_role not null default 'student',
  status public.profile_status not null default 'pending',
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text not null,
  description text,
  academic_level text not null,
  subject text not null,
  mode public.course_mode not null default 'recorded',
  level public.course_level not null default 'beginner',
  access_type public.course_access_type not null default 'paid',
  price_amount numeric(10, 2) not null default 0,
  discounted_price_amount numeric(10, 2),
  currency text not null default 'BDT',
  total_lessons integer not null default 0,
  total_quizzes integer not null default 0,
  duration_label text,
  thumbnail_path text,
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  status public.publish_status not null default 'draft',
  teacher_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint courses_price_non_negative check (price_amount >= 0),
  constraint courses_discount_non_negative check (discounted_price_amount is null or discounted_price_amount >= 0)
);

create table if not exists public.course_packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text not null,
  type public.package_type not null,
  price_amount numeric(10, 2) not null default 0,
  discounted_price_amount numeric(10, 2),
  currency text not null default 'BDT',
  duration_label text not null,
  recommended_for text not null,
  features text[] not null default '{}',
  is_popular boolean not null default false,
  status public.publish_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint course_packages_price_non_negative check (price_amount >= 0),
  constraint course_packages_discount_non_negative check (discounted_price_amount is null or discounted_price_amount >= 0)
);

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  enrollment_opens_at timestamptz,
  enrollment_closes_at timestamptz,
  capacity integer,
  status public.publish_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint batches_capacity_positive check (capacity is null or capacity > 0)
);

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  position integer not null default 1,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chapters_position_positive check (position > 0)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  chapter_id uuid references public.chapters(id) on delete set null,
  title text not null,
  description text,
  video_provider public.video_provider,
  video_ref text,
  duration_seconds integer,
  position integer not null default 1,
  is_preview boolean not null default false,
  release_at timestamptz,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lessons_duration_non_negative check (duration_seconds is null or duration_seconds >= 0),
  constraint lessons_position_positive check (position > 0)
);

create table if not exists public.lesson_materials (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  title text not null,
  material_type public.material_type not null default 'pdf',
  storage_path text,
  external_url text,
  is_downloadable boolean not null default true,
  position integer not null default 1,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lesson_materials_position_positive check (position > 0)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  package_id uuid references public.course_packages(id) on delete set null,
  batch_id uuid references public.batches(id) on delete set null,
  status public.enrollment_status not null default 'pending',
  starts_at timestamptz,
  expires_at timestamptz,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  rejected_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint enrollments_course_or_package_required check (course_id is not null or package_id is not null)
);

create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references public.enrollments(id) on delete set null,
  student_id uuid not null references public.profiles(id) on delete cascade,
  method public.payment_method not null,
  amount numeric(10, 2) not null,
  currency text not null default 'BDT',
  sender_number text not null,
  transaction_id text not null,
  proof_path text,
  note text,
  status public.payment_status not null default 'pending',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payment_requests_amount_positive check (amount >= 0)
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  category public.ticket_category not null default 'other',
  subject text not null,
  message text not null,
  status public.ticket_status not null default 'open',
  assigned_to uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_courses_updated_at on public.courses;
create trigger set_courses_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

drop trigger if exists set_course_packages_updated_at on public.course_packages;
create trigger set_course_packages_updated_at
before update on public.course_packages
for each row execute function public.set_updated_at();

drop trigger if exists set_batches_updated_at on public.batches;
create trigger set_batches_updated_at
before update on public.batches
for each row execute function public.set_updated_at();

drop trigger if exists set_chapters_updated_at on public.chapters;
create trigger set_chapters_updated_at
before update on public.chapters
for each row execute function public.set_updated_at();

drop trigger if exists set_lessons_updated_at on public.lessons;
create trigger set_lessons_updated_at
before update on public.lessons
for each row execute function public.set_updated_at();

drop trigger if exists set_lesson_materials_updated_at on public.lesson_materials;
create trigger set_lesson_materials_updated_at
before update on public.lesson_materials
for each row execute function public.set_updated_at();

drop trigger if exists set_enrollments_updated_at on public.enrollments;
create trigger set_enrollments_updated_at
before update on public.enrollments
for each row execute function public.set_updated_at();

drop trigger if exists set_payment_requests_updated_at on public.payment_requests;
create trigger set_payment_requests_updated_at
before update on public.payment_requests
for each row execute function public.set_updated_at();

drop trigger if exists set_support_tickets_updated_at on public.support_tickets;
create trigger set_support_tickets_updated_at
before update on public.support_tickets
for each row execute function public.set_updated_at();

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists courses_slug_idx on public.courses(slug);
create index if not exists courses_status_idx on public.courses(status);
create index if not exists courses_subject_idx on public.courses(subject);
create index if not exists course_packages_slug_idx on public.course_packages(slug);
create index if not exists batches_course_id_idx on public.batches(course_id);
create index if not exists chapters_course_id_position_idx on public.chapters(course_id, position);
create index if not exists lessons_course_id_position_idx on public.lessons(course_id, position);
create index if not exists lessons_chapter_id_idx on public.lessons(chapter_id);
create index if not exists lesson_materials_course_id_idx on public.lesson_materials(course_id);
create index if not exists enrollments_student_id_idx on public.enrollments(student_id);
create index if not exists enrollments_course_id_idx on public.enrollments(course_id);
create index if not exists payment_requests_student_id_idx on public.payment_requests(student_id);
create index if not exists payment_requests_status_idx on public.payment_requests(status);
create index if not exists support_tickets_student_id_idx on public.support_tickets(student_id);
create index if not exists audit_logs_actor_id_idx on public.audit_logs(actor_id);
create index if not exists audit_logs_entity_idx on public.audit_logs(entity_type, entity_id);

create or replace function public.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
  limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('super_admin', 'admin'), false);
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('super_admin', 'admin', 'teacher', 'support'), false);
$$;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.course_packages enable row level security;
alter table public.batches enable row level security;
alter table public.chapters enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_materials enable row level security;
alter table public.enrollments enable row level security;
alter table public.payment_requests enable row level security;
alter table public.support_tickets enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles select own or admin"
on public.profiles
for select
using (id = auth.uid() or public.is_admin());

create policy "profiles insert own"
on public.profiles
for insert
with check (id = auth.uid());

create policy "profiles update admin only"
on public.profiles
for update
using (public.is_admin())
with check (public.is_admin());

create policy "courses select published or staff"
on public.courses
for select
using (status = 'published' or public.is_staff());

create policy "courses manage staff"
on public.courses
for all
using (public.is_staff())
with check (public.is_staff());

create policy "course packages select published or staff"
on public.course_packages
for select
using (status = 'published' or public.is_staff());

create policy "course packages manage staff"
on public.course_packages
for all
using (public.is_staff())
with check (public.is_staff());

create policy "batches select published course users"
on public.batches
for select
using (public.is_staff());

create policy "batches manage staff"
on public.batches
for all
using (public.is_staff())
with check (public.is_staff());

create policy "chapters select public preview or staff"
on public.chapters
for select
using (status = 'published' or public.is_staff());

create policy "chapters manage staff"
on public.chapters
for all
using (public.is_staff())
with check (public.is_staff());

create policy "lessons select preview published or staff"
on public.lessons
for select
using ((status = 'published' and is_preview = true) or public.is_staff());

create policy "lessons manage staff"
on public.lessons
for all
using (public.is_staff())
with check (public.is_staff());

create policy "lesson materials select preview public or staff"
on public.lesson_materials
for select
using (status = 'published' or public.is_staff());

create policy "lesson materials manage staff"
on public.lesson_materials
for all
using (public.is_staff())
with check (public.is_staff());

create policy "enrollments select own or staff"
on public.enrollments
for select
using (student_id = auth.uid() or public.is_staff());

create policy "enrollments insert own"
on public.enrollments
for insert
with check (student_id = auth.uid());

create policy "enrollments update staff"
on public.enrollments
for update
using (public.is_staff())
with check (public.is_staff());

create policy "payment requests select own or staff"
on public.payment_requests
for select
using (student_id = auth.uid() or public.is_staff());

create policy "payment requests insert own"
on public.payment_requests
for insert
with check (student_id = auth.uid());

create policy "payment requests update staff"
on public.payment_requests
for update
using (public.is_staff())
with check (public.is_staff());

create policy "support tickets select own or staff"
on public.support_tickets
for select
using (student_id = auth.uid() or public.is_staff());

create policy "support tickets insert own"
on public.support_tickets
for insert
with check (student_id = auth.uid());

create policy "support tickets update own or staff"
on public.support_tickets
for update
using (student_id = auth.uid() or public.is_staff())
with check (student_id = auth.uid() or public.is_staff());

create policy "audit logs select admin only"
on public.audit_logs
for select
using (public.is_admin());

create policy "audit logs insert authenticated"
on public.audit_logs
for insert
with check (auth.uid() is not null);
