# sprint-05-public-catalog-supabase-connection.md

## Goal

Connect MSS public catalog pages to the Supabase-backed catalog data service while keeping local development safe when Supabase credentials are not configured.

## Sprint 5A Completed

- [x] Updated CatalogDataService to use Supabase client lazily
- [x] Added CatalogDataService configuration check
- [x] Kept public course loading database-backed
- [x] Kept public package loading database-backed
- [x] Added readable data loading errors
- [x] Updated CatalogDataService unit tests

## Sprint 5A Notes

The data service no longer touches the Supabase client during dependency injection. This prevents local UI development from crashing when Supabase URL and anon key are still empty.

The public pages are not connected yet. Sprint 5B will connect `/courses`, `/courses/:slug`, and `/packages` to this service with mock fallback.

## Sprint 5B Completed

- [x] Connected `/courses` page to CatalogDataService
- [x] Connected `/courses/:slug` page to CatalogDataService
- [x] Connected `/packages` page to CatalogDataService
- [x] Added mock fallback when Supabase is not configured
- [x] Added mock fallback when catalog loading fails
- [x] Added loading states for courses, course detail, and packages
- [x] Added empty state for package list
- [x] Preserved existing mock data for local UI development

## Sprint 5B Notes

Public catalog pages now prefer Supabase data when credentials are configured. Without credentials, the app continues to show the existing demo catalog and package data.

This keeps the project portfolio-safe before the real Supabase project is connected.

## Sprint 5C Completed

- [x] Connected homepage featured courses to CatalogDataService
- [x] Added Supabase-first featured course loading
- [x] Added demo fallback when Supabase is not configured
- [x] Added demo fallback when featured course loading fails
- [x] Added loading and empty states for homepage featured courses
- [x] Preserved existing homepage layout and course cards

## Sprint 5C Notes

The homepage now uses the same catalog data service as `/courses`, `/courses/:slug`, and `/packages`.

The app still remains safe for local UI development without real Supabase credentials.

## Sprint 5 Final Status

Sprint 5 connects the MSS public catalog experience to the Supabase-backed catalog data service while preserving safe local mock fallback.

## Completed Summary

- [x] Made CatalogDataService safe for unconfigured Supabase development
- [x] Added CatalogDataService configuration check
- [x] Connected `/courses` to CatalogDataService
- [x] Connected `/courses/:slug` to CatalogDataService
- [x] Connected `/packages` to CatalogDataService
- [x] Connected homepage featured courses to CatalogDataService
- [x] Added loading states
- [x] Added empty states
- [x] Added readable error fallback messages
- [x] Preserved mock fallback data for local UI development
- [x] Verified production build after public catalog connection

## Acceptance Criteria

- [x] Public catalog pages prefer Supabase data when configured
- [x] Public catalog pages do not crash without Supabase credentials
- [x] Demo catalog remains available during local development
- [x] Course detail page supports Supabase lookup by slug
- [x] Package page supports Supabase package loading
- [x] Homepage featured courses load from same catalog service
- [x] Production build stays under current bundle budget

## Remaining Real-Backend Work

These require a real Supabase project:

- Apply database migrations
- Seed real catalog data
- Add Supabase URL and anon key
- Verify `/courses` loads from database
- Verify `/courses/:slug` loads from database
- Verify `/packages` loads from database
- Replace demo notice once real backend is active
