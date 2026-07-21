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
