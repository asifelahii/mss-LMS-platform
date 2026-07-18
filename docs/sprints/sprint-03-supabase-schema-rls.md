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
