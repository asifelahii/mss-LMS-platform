# sprint-07-real-supabase-project-setup.md

## Goal

Connect MSS to a real Supabase project and verify database, auth, storage, catalog, and enrollment flows.

## Sprint 7A Plan

- [ ] Create real Supabase project
- [ ] Collect safe frontend credentials
- [ ] Link local repo to remote Supabase project
- [ ] Push migrations to remote database
- [ ] Create required storage buckets
- [ ] Configure email/password auth
- [ ] Add local-only Angular environment credentials
- [ ] Test real signup/login
- [ ] Test profile creation/loading
- [ ] Test real catalog loading
- [ ] Test real enrollment/payment request creation

## Important Safety Rules

Never commit:

- Supabase service role key
- Database password
- Access token
- Production secrets
- Any `.env` file with real secrets

Frontend can use:

- Supabase project URL
- Supabase anon/public key

Backend/admin-only work must use:

- Service role key only in secure server-side code, never Angular

## Required Buckets

- course-thumbnails: public
- lesson-materials: private
- payment-proofs: private
- profile-avatars: private

## Required Migrations

- supabase/migrations/20260718204500_core_schema_and_rls.sql
- supabase/migrations/20260718211500_access_policies_and_seed_data.sql
- supabase/migrations/20260718213000_storage_policies.sql

## Sprint 7B Completed

- [x] Logged in to Supabase CLI
- [x] Confirmed remote Supabase project
- [x] Linked local repo to remote Supabase project
- [x] Verified dry-run migration plan
- [x] Pushed all 3 migrations to remote Supabase database
- [x] Confirmed remote database push finished successfully

## Sprint 7B Notes

Remote project:

- Project name: mss-portal
- Project ref: zmmuenbfzgyxuvlhtpyg
- Region: Southeast Asia (Singapore)

Pushed migrations:

- 20260718204500_core_schema_and_rls.sql
- 20260718211500_access_policies_and_seed_data.sql
- 20260718213000_storage_policies.sql

The CLI showed a Docker-related cache warning after the push. This did not block the remote migration push because the command finished successfully.

## Sprint 7C Completed

- [x] Created course-thumbnails bucket as public
- [x] Created lesson-materials bucket as private
- [x] Created payment-proofs bucket as private
- [x] Created profile-avatars bucket as private
- [x] Confirmed storage policies are visible on created buckets

## Sprint 7C Notes

Storage bucket setup now matches the planned MSS storage architecture.

Bucket visibility:

- course-thumbnails: public
- lesson-materials: private
- payment-proofs: private
- profile-avatars: private

## Sprint 7D Completed

- [x] Verified 12 MSS public tables exist
- [x] Verified 4 seeded courses exist
- [x] Verified 4 seeded course packages exist
- [x] Verified 4 storage buckets exist
- [x] Verified RLS is enabled on all MSS public tables
- [x] Verified bucket visibility settings

## Sprint 7D Notes

Backend database verification passed.

Verification summary:

- MSS public table count: 12
- Seeded course count: 4
- Seeded package count: 4
- Storage bucket count: 4
- All MSS public tables have RLS: true

Bucket visibility:

- course-thumbnails: public
- lesson-materials: private
- payment-proofs: private
- profile-avatars: private

## Sprint 7E Completed

- [x] Added local-only Angular environment support
- [x] Confirmed environment.local.ts is ignored by Git
- [x] Added real Supabase project URL and anon key locally
- [x] Fixed Supabase URL format by removing /rest/v1
- [x] Confirmed real homepage/catalog data loads from Supabase
- [x] Confirmed real course catalog loads from Supabase
- [x] Confirmed real packages load from Supabase
- [x] Confirmed enrollment dropdown loads Supabase courses/packages
- [x] Confirmed demo fallback notice disappears after real config

## Sprint 7E Notes

Real Supabase frontend connection is now working.

The first issue was using the REST endpoint URL:

- Incorrect: https://zmmuenbfzgyxuvlhtpyg.supabase.co/rest/v1/
- Correct: https://zmmuenbfzgyxuvlhtpyg.supabase.co

After fixing the URL and restarting the Angular dev server, MSS public catalog, packages, and enrollment options loaded successfully from the remote Supabase project.
