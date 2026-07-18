# MSS Database Schema Plan

## Core Tables

- profiles
- roles
- courses
- batches
- subjects
- chapters
- lessons
- lesson_materials
- video_assets
- enrollments
- payment_requests
- quizzes
- quiz_questions
- quiz_attempts
- device_registrations
- playback_sessions
- support_tickets
- notifications
- audit_logs

## Important Rule

Course access should be controlled through enrollments, not by storing subject IDs directly inside user profiles.

## Enrollment Fields

- id
- student_id
- course_id
- batch_id
- payment_request_id
- status
- starts_at
- expires_at
- approved_by
- created_at
- updated_at
