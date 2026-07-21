# sprint-06-bundle-budget-and-enrollment-prep.md

## Goal

Reduce initial bundle pressure before adding more enrollment/payment features, then prepare the enrollment page for safe Supabase connection.

## Sprint 6A Completed

- [x] Removed root App dependency on SupabaseAuthService
- [x] Kept auth/profile loading inside auth pages, guards, and dashboard flow
- [x] Reduced risk of Supabase/auth code entering the initial bundle
- [x] Preserved local development behavior

## Sprint 6A Notes

Previously, the root App attempted to load the current profile on startup. That made auth useful globally, but it also risked pulling Supabase/auth code into the initial bundle.

The safer approach is now route-driven:

- Login page loads auth when needed
- Register page loads auth when needed
- Guards load current profile when guards are enabled
- Dashboard layout handles logout and current auth state display

This keeps public browsing lighter and prepares the app for future feature growth.

## Sprint 6B Completed

- [x] Added lightweight Supabase config token file
- [x] Updated SupabaseClientService to consume the lightweight config token
- [x] Exported Supabase config token from data-access library
- [x] Replaced static auth guard imports in app routes with lazy guard wrappers
- [x] Updated app config to import lightweight provider tokens directly
- [x] Reduced risk of auth/data-access/Supabase code entering the initial bundle

## Sprint 6B Notes

The route file no longer imports auth guards statically from the auth barrel. Guards are now loaded only when a guarded route is evaluated.

The app config now avoids importing provider tokens from library barrels. This is intentionally done to reduce initial bundle pressure while the app is still small and close to the default bundle budget.

## Sprint 6C Completed

- [x] Made EnrollmentDataService use Supabase client lazily
- [x] Added EnrollmentDataService configuration check
- [x] Connected enrollment page to CatalogDataService for course/package options
- [x] Connected enrollment page to EnrollmentDataService for real pending enrollment requests
- [x] Added logged-in profile requirement for real enrollment submission
- [x] Preserved demo-preview mode when Supabase is not configured
- [x] Added loading and submitting states
- [x] Added admin note generation from student form details
- [x] Preserved future payment proof upload placeholder

## Sprint 6C Notes

The enrollment page can now create real pending enrollment and payment request records when Supabase is configured and the user is logged in.

Without Supabase credentials, the page remains safe for portfolio/demo browsing and shows a local preview message instead of crashing.
