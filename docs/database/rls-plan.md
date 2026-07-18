# MSS RLS Plan

## Principle

Security must be enforced at the database level, not only in Angular routes.

## Basic Rules

- Students can read only their own profile, enrollments, payments, support tickets, devices, and progress.
- Teachers can manage only assigned courses.
- Admins can manage payments, enrollments, students, teachers, support tickets, and reports.
- Super Admin can manage platform settings and roles.
- Public users can read only published public course data.
- Paid materials must be private and served through signed URLs.

## Later

Write actual Supabase RLS policies after schema finalization.
