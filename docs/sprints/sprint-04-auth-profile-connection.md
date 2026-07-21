# sprint-04-auth-profile-connection.md

## Goal

Connect MSS authentication to Supabase Auth and the `profiles` table while keeping role-based routing safe and testable.

## Sprint 4A Completed

- [x] Refreshed AuthStateService
- [x] Added SupabaseAuthService
- [x] Added register with profile creation workflow
- [x] Added login with password workflow
- [x] Added current profile loading workflow
- [x] Added logout workflow
- [x] Added profile row mapper
- [x] Exported SupabaseAuthService from auth library
- [x] Added SupabaseAuthService unit tests

## Notes

The login and register UI are not connected yet. Sprint 4A only adds the tested service foundation.

The service creates a row in `profiles` after Supabase Auth signup. In a real Supabase project, this depends on the email confirmation/session behavior and RLS. If email confirmation is enabled, a database trigger or Edge Function may be needed later for profile creation.
