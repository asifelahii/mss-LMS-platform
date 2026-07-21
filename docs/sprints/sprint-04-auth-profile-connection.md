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

## Sprint 4C Completed

- [x] Added role redirect utility
- [x] Improved auth guard with current profile loading
- [x] Improved guest guard with role redirect
- [x] Improved role guard with Supabase profile fallback
- [x] Added app startup profile bootstrap
- [x] Added dashboard user identity display
- [x] Added dashboard logout button
- [x] Added dashboard logout error/loading state
- [x] Added dashboard logout styles

## Sprint 4C Notes

Route guards still respect the environment flag. In development, guards can remain disabled while UI work continues. In production, guards will load the current Supabase profile and protect dashboards by role.

The app root now tries to load the current Supabase profile at startup. If Supabase is not configured yet, the error is safely ignored for local UI development.

## Sprint 4D Completed

- [x] Added role redirect utility tests
- [x] Updated login page to use shared role redirect utility
- [x] Improved dashboard navigation links by current role
- [x] Kept fallback dashboard links for local development without active profile

## Sprint 4D Notes

The login page no longer owns redirect logic. Redirect behavior now lives in the shared auth utility and is covered by unit tests.

Dashboard navigation now avoids showing all role dashboards once a real user profile is loaded.
