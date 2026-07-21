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
