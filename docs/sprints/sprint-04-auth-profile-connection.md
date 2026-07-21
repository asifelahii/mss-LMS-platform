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

## Sprint 4B Completed

- [x] Made SupabaseClientService safer for unconfigured local development
- [x] Updated SupabaseAuthService to access Supabase client lazily
- [x] Connected login page to SupabaseAuthService
- [x] Added role-based redirect after login
- [x] Connected register page to SupabaseAuthService
- [x] Added registration redirect to student dashboard
- [x] Added loading states and readable error messages for auth forms

## Sprint 4B Notes

Login and registration now call the real auth service. Without real Supabase URL and anon key, the forms will show a configuration error instead of crashing the app.

Real end-to-end auth testing still requires a Supabase project, migrations, storage buckets, and email/auth settings to be configured.
