# MSS Supabase Project Setup Guide

## Goal

This guide explains how to connect the MSS Angular app to a real Supabase project and prepare the backend for development, testing, and deployment.

## 1. Create Supabase Project

Create a new Supabase project from the Supabase dashboard.

Recommended project name:

```text
mss-platform
```

Recommended database region:

```text
Closest stable region to Bangladesh or target students
```

## 2. Copy Project Credentials

From Supabase Dashboard:

```text
Project Settings -> API
```

Copy:

```text
Project URL
anon public key
```

Do not commit real keys into Git.

## 3. Create Local Environment File

Create this file locally:

```text
apps/web/src/environments/environment.local.ts
```

Expected shape:

```ts
export const environment = {
  production: false,
  supabase: {
    url: 'YOUR_SUPABASE_PROJECT_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
  },
  auth: {
    enableRouteGuards: false,
  },
};
```

For now, the committed `environment.ts` and `environment.prod.ts` should stay safe. Real secrets must not be committed.

## 4. Apply Database Migrations

Current migration files:

```text
supabase/migrations/20260718204500_core_schema_and_rls.sql
supabase/migrations/20260718211500_access_policies_and_seed_data.sql
supabase/migrations/20260718213000_storage_policies.sql
```

If Docker is installed and Supabase local development is running, migrations can be tested locally first.

If using remote Supabase directly, apply the SQL carefully through Supabase SQL Editor or Supabase CLI after reviewing the migration files.

## 5. Create Storage Buckets

Create these buckets manually from Supabase Dashboard Storage section:

```text
course-thumbnails
lesson-materials
payment-proofs
profile-avatars
```

Bucket visibility:

```text
course-thumbnails: public
lesson-materials: private
payment-proofs: private
profile-avatars: private
```

Detailed bucket rules are documented in:

```text
docs/supabase/storage-buckets.md
```

## 6. Auth Setup

Initial auth method:

```text
Email/password authentication
```

Required app roles:

```text
super_admin
admin
teacher
student
support
```

The `profiles` table is linked to `auth.users`.

## 7. First Admin Creation Plan

For the first real deployment, create the first admin carefully:

1. Register the first user through Supabase Auth.
2. Insert or update their row in `public.profiles`.
3. Set role to `super_admin`.
4. Set status to `active`.

Example SQL shape:

```sql
update public.profiles
set role = 'super_admin',
    status = 'active'
where email = 'YOUR_ADMIN_EMAIL';
```

## 8. Verification Checklist

After applying migrations, verify these tables exist:

```text
profiles
courses
course_packages
course_package_items
batches
chapters
lessons
lesson_materials
enrollments
payment_requests
support_tickets
audit_logs
```

Verify seed data:

```sql
select slug, title, status
from public.courses
order by created_at desc;

select slug, title, status
from public.course_packages
order by created_at desc;
```

Verify RLS is enabled:

```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
```

## 9. Current Frontend Status

The public pages still use mock arrays.

Prepared services:

```text
CatalogDataService
EnrollmentDataService
```

These services will be connected after Supabase credentials and migrations are verified.

## 10. Do Not Commit

Never commit:

```text
Real Supabase URL for private projects
Real anon/service keys
.env files with secrets
Supabase service role key
Production database passwords
```

## 11. Next Development Step

After Supabase credentials and migrations are verified, the next frontend tasks are:

```text
1. Connect login/register to Supabase Auth
2. Create profile after signup
3. Load user role from profiles table
4. Enable route guards in development
5. Switch public catalog from mock arrays to CatalogDataService
6. Connect /enroll page to EnrollmentDataService
```

## 12. Production Safety Notes

Before production deployment:

```text
1. Review all RLS policies again
2. Confirm no service role key is exposed in frontend
3. Confirm paid lesson materials are private
4. Confirm payment proof files are private
5. Confirm only staff can approve payments
6. Confirm students cannot modify their approved enrollments
7. Confirm audit logs are visible only to admins
```

## 13. Local Development Reminder

Do not run local Supabase commands unless Docker is installed and running.

Useful future commands:

```powershell
npx supabase status
npx supabase start
npx supabase db reset
```

Use these only after Docker is ready.
