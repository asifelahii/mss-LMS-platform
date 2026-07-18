# sprint-03-supabase-schema-rls.md

## Goal

Create the Supabase database foundation for MSS with relational schema, enum types, indexes, triggers, and first-pass Row Level Security policies.

## Sprint 3A Completed

- [x] Added app role enum
- [x] Added profile status enum
- [x] Added publish status enum
- [x] Added course mode, level, and access type enums
- [x] Added package type enum
- [x] Added enrollment status enum
- [x] Added payment method and payment status enums
- [x] Added material and video provider enums
- [x] Added support ticket enums
- [x] Added profiles table
- [x] Added courses table
- [x] Added course packages table
- [x] Added batches table
- [x] Added chapters table
- [x] Added lessons table
- [x] Added lesson materials table
- [x] Added enrollments table
- [x] Added payment requests table
- [x] Added support tickets table
- [x] Added audit logs table
- [x] Added updated_at trigger function
- [x] Added updated_at triggers
- [x] Added common indexes
- [x] Added helper functions for role checks
- [x] Enabled RLS on core tables
- [x] Added first-pass RLS policies

## Notes

This migration creates the backend foundation only. Real Supabase connection, seed data, Storage buckets, Edge Functions, and production-safe policy tightening will be handled in later Sprint 3 steps.

Mock frontend data remains unchanged for now.

## Sprint 3B Completed

- [x] Added course package items table
- [x] Added package-to-course mapping support
- [x] Added active course access helper function
- [x] Added unique enrollment indexes
- [x] Tightened lesson material access policy
- [x] Allowed enrolled students to access protected lessons
- [x] Added published public seed courses
- [x] Added published public seed packages
- [x] Added package-to-course seed mappings
- [x] Updated package model with CoursePackageItem

## Sprint 3B Notes

The first schema draft allowed all published lesson materials to be publicly selectable. Sprint 3B tightens this by requiring either staff access or active enrollment-based course access.

Seed data mirrors the current mock frontend catalog so the UI can later be switched from static arrays to Supabase queries without changing the product content structure.

## Sprint 3C Completed

- [x] Added storage policy migration
- [x] Defined `course-thumbnails` storage policy foundation
- [x] Defined `lesson-materials` storage policy foundation
- [x] Defined `payment-proofs` storage policy foundation
- [x] Defined `profile-avatars` storage policy foundation
- [x] Added storage bucket setup documentation
- [x] Added shared storage bucket constants
- [x] Added shared user-folder path helper

## Sprint 3C Notes

Bucket creation itself should be done through Supabase Dashboard, API, or supported tooling. The project migration defines access policies on `storage.objects`.

`lesson-materials` remains private. Public course thumbnails are allowed through a public bucket, while paid materials and payment proofs stay protected.

## Sprint 3D Completed

- [x] Added database row TypeScript types
- [x] Added course row to catalog item mapper
- [x] Added package row to package item mapper
- [x] Added BDT price formatting helper
- [x] Added mapper unit tests
- [x] Exported database types and catalog mappers from data-access

## Sprint 3D Notes

The database uses snake_case columns, while Angular UI models use camelCase fields. Sprint 3D creates the first clean mapping layer so future Supabase queries can be connected without leaking database column names into UI components.

## Sprint 3E Completed

- [x] Added public catalog data service
- [x] Added published courses query
- [x] Added published course-by-slug query
- [x] Added published packages query
- [x] Added published package-by-slug query
- [x] Connected Supabase rows to existing catalog mappers
- [x] Added catalog data service unit tests
- [x] Exported catalog data service from data-access

## Sprint 3E Notes

The frontend still uses mock arrays for visible pages. This service prepares the database-backed transition without breaking the current UI. Once Supabase project credentials and local/remote migrations are verified, public pages can switch from mock data to `CatalogDataService`.

## Sprint 3F Completed

- [x] Added enrollment database row type
- [x] Added payment request database row type
- [x] Added payment method and payment status database types
- [x] Added enrollment/payment creation input DTO
- [x] Added enrollment/payment creation result DTO
- [x] Added EnrollmentDataService
- [x] Added create enrollment with payment request workflow
- [x] Added student enrollment listing query
- [x] Added student payment request listing query
- [x] Added enrollment data service unit tests
- [x] Exported enrollment data service from data-access

## Sprint 3F Notes

The enrollment workflow is prepared as a two-step database operation: first create a pending enrollment, then create a pending payment request linked to that enrollment. RLS will require the authenticated user to match the submitted student ID.

The current public `/enroll` page still submits locally. It will be connected to this service after auth and real Supabase project credentials are ready.
