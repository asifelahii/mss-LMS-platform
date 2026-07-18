-- MSS Sprint 3B
-- Access policy tightening and public catalog seed data

create table if not exists public.course_package_items (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.course_packages(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  position integer not null default 1,
  created_at timestamptz not null default now(),
  constraint course_package_items_position_positive check (position > 0),
  constraint course_package_items_unique unique (package_id, course_id)
);

alter table public.course_package_items enable row level security;

create index if not exists course_package_items_package_id_idx
on public.course_package_items(package_id);

create index if not exists course_package_items_course_id_idx
on public.course_package_items(course_id);

drop policy if exists "course package items select published or staff"
on public.course_package_items;

create policy "course package items select published or staff"
on public.course_package_items
for select
using (
  public.is_staff()
  or exists (
    select 1
    from public.course_packages package
    where package.id = course_package_items.package_id
      and package.status = 'published'
  )
);

drop policy if exists "course package items manage staff"
on public.course_package_items;

create policy "course package items manage staff"
on public.course_package_items
for all
using (public.is_staff())
with check (public.is_staff());

create unique index if not exists enrollments_unique_student_course_idx
on public.enrollments(student_id, course_id)
where course_id is not null;

create unique index if not exists enrollments_unique_student_package_idx
on public.enrollments(student_id, package_id)
where package_id is not null;

create or replace function public.has_active_course_access(target_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    exists (
      select 1
      from public.enrollments enrollment
      where enrollment.student_id = auth.uid()
        and enrollment.status = 'active'
        and (enrollment.expires_at is null or enrollment.expires_at > now())
        and (
          enrollment.course_id = target_course_id
          or exists (
            select 1
            from public.course_package_items package_item
            where package_item.package_id = enrollment.package_id
              and package_item.course_id = target_course_id
          )
        )
    ),
    false
  );
$$;

drop policy if exists "chapters select public preview or staff"
on public.chapters;

create policy "chapters select published enrolled or staff"
on public.chapters
for select
using (
  public.is_staff()
  or status = 'published'
  or public.has_active_course_access(course_id)
);

drop policy if exists "lessons select preview published or staff"
on public.lessons;

create policy "lessons select preview enrolled or staff"
on public.lessons
for select
using (
  public.is_staff()
  or (
    status = 'published'
    and (
      is_preview = true
      or public.has_active_course_access(course_id)
    )
  )
);

drop policy if exists "lesson materials select preview public or staff"
on public.lesson_materials;

create policy "lesson materials select enrolled or staff"
on public.lesson_materials
for select
using (
  public.is_staff()
  or (
    status = 'published'
    and public.has_active_course_access(course_id)
  )
);

insert into public.courses (
  slug,
  title,
  subtitle,
  description,
  academic_level,
  subject,
  mode,
  level,
  access_type,
  price_amount,
  discounted_price_amount,
  currency,
  total_lessons,
  total_quizzes,
  duration_label,
  tags,
  is_featured,
  status
)
values
  (
    'calculus-1-complete-course',
    'Calculus 1 Complete Course',
    'Limits, differentiation, applications, and exam-focused problem solving.',
    'A structured Calculus 1 course for honours-level learners with lessons, notes, quizzes, and exam-oriented practice.',
    'Honours 1st Year',
    'Mathematics',
    'recorded',
    'beginner',
    'paid',
    1500,
    1200,
    'BDT',
    42,
    12,
    '10 weeks',
    array['NU Focused', 'PDF Notes', 'Quizzes'],
    true,
    'published'
  ),
  (
    'linear-algebra-foundation',
    'Linear Algebra Foundation',
    'Matrices, determinants, vector spaces, eigenvalues, and common exam patterns.',
    'A focused Linear Algebra course covering matrices, determinants, vector spaces, eigenvalues, and exam practice.',
    'Honours 1st Year',
    'Mathematics',
    'hybrid',
    'intermediate',
    'paid',
    1800,
    1400,
    'BDT',
    36,
    10,
    '8 weeks',
    array['Live Support', 'Model Tests', 'Assignments'],
    true,
    'published'
  ),
  (
    'physics-mechanics-basic-to-exam',
    'Physics Mechanics: Basic to Exam',
    'Motion, force, work, energy, rotation, and structured numerical practice.',
    'A beginner-friendly Physics Mechanics course with concept explanation, formulas, and numerical problem solving.',
    'Honours 1st Year',
    'Physics',
    'recorded',
    'beginner',
    'paid',
    1300,
    null,
    'BDT',
    30,
    8,
    '6 weeks',
    array['Numerical Practice', 'Formula Sheet', 'Revision'],
    false,
    'published'
  ),
  (
    'free-math-demo-class',
    'Free Math Demo Class',
    'A short sample class to understand MSS teaching style and course structure.',
    'A free sample course for students who want to preview MSS before enrollment.',
    'Open Demo',
    'Mathematics',
    'recorded',
    'beginner',
    'free',
    0,
    null,
    'BDT',
    3,
    1,
    '1 day',
    array['Free', 'Sample', 'Beginner'],
    false,
    'published'
  )
on conflict (slug) do update
set
  title = excluded.title,
  subtitle = excluded.subtitle,
  description = excluded.description,
  academic_level = excluded.academic_level,
  subject = excluded.subject,
  mode = excluded.mode,
  level = excluded.level,
  access_type = excluded.access_type,
  price_amount = excluded.price_amount,
  discounted_price_amount = excluded.discounted_price_amount,
  currency = excluded.currency,
  total_lessons = excluded.total_lessons,
  total_quizzes = excluded.total_quizzes,
  duration_label = excluded.duration_label,
  tags = excluded.tags,
  is_featured = excluded.is_featured,
  status = excluded.status,
  updated_at = now();

insert into public.course_packages (
  slug,
  title,
  subtitle,
  type,
  price_amount,
  discounted_price_amount,
  currency,
  duration_label,
  recommended_for,
  features,
  is_popular,
  status
)
values
  (
    'single-subject-course',
    'Single Subject Course',
    'Enroll in one focused subject with structured lessons, notes, and quizzes.',
    'single_subject',
    1500,
    1200,
    'BDT',
    '6-10 weeks',
    'Students who want to focus on one difficult subject.',
    array[
      'Subject-wise recorded lessons',
      'Chapter-based PDF notes',
      'Quiz and model test support',
      'Teacher-guided learning path',
      'Manual payment approval'
    ],
    false,
    'published'
  ),
  (
    'full-year-package',
    'Full Year Package',
    'A complete academic year package for students who want full coverage.',
    'full_year',
    6000,
    4999,
    'BDT',
    'Full academic year',
    'Students preparing seriously for full-year academic performance.',
    array[
      'Multiple subjects included',
      'Batch-wise lesson release',
      'Revision classes and tests',
      'Priority support',
      'Better value than single courses'
    ],
    true,
    'published'
  ),
  (
    'exam-revision-batch',
    'Exam Revision Batch',
    'Short, exam-focused preparation for important chapters and common questions.',
    'revision_batch',
    1000,
    799,
    'BDT',
    '2-4 weeks',
    'Students close to exam who need fast revision and practice.',
    array[
      'Important chapter revision',
      'Previous-question discussion',
      'Formula and shortcut sheets',
      'Model test practice',
      'Doubt-solving support'
    ],
    false,
    'published'
  ),
  (
    'free-demo-access',
    'Free Demo Access',
    'Try selected lessons and understand the MSS teaching style before enrolling.',
    'free_demo',
    0,
    null,
    'BDT',
    'Limited access',
    'New students who want to test the platform first.',
    array[
      'Sample recorded lessons',
      'Limited PDF resources',
      'Demo quiz access',
      'No payment required',
      'Upgrade anytime'
    ],
    false,
    'published'
  )
on conflict (slug) do update
set
  title = excluded.title,
  subtitle = excluded.subtitle,
  type = excluded.type,
  price_amount = excluded.price_amount,
  discounted_price_amount = excluded.discounted_price_amount,
  currency = excluded.currency,
  duration_label = excluded.duration_label,
  recommended_for = excluded.recommended_for,
  features = excluded.features,
  is_popular = excluded.is_popular,
  status = excluded.status,
  updated_at = now();

insert into public.course_package_items (
  package_id,
  course_id,
  position
)
select
  package.id,
  course.id,
  package_map.position
from (
  values
    ('single-subject-course', 'calculus-1-complete-course', 1),
    ('full-year-package', 'calculus-1-complete-course', 1),
    ('full-year-package', 'linear-algebra-foundation', 2),
    ('full-year-package', 'physics-mechanics-basic-to-exam', 3),
    ('exam-revision-batch', 'calculus-1-complete-course', 1),
    ('exam-revision-batch', 'linear-algebra-foundation', 2),
    ('free-demo-access', 'free-math-demo-class', 1)
) as package_map(package_slug, course_slug, position)
join public.course_packages package
  on package.slug = package_map.package_slug
join public.courses course
  on course.slug = package_map.course_slug
on conflict (package_id, course_id) do update
set position = excluded.position;
