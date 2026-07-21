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
