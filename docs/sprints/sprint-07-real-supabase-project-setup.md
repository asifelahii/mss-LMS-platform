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
