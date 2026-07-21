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
