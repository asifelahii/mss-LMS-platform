# MSS Supabase Storage Buckets

## Goal

Define the required Supabase Storage buckets for MSS course thumbnails, lesson materials, payment proofs, and profile avatars.

Bucket creation should be done through the Supabase Dashboard, API, or supported client tooling. The SQL migration in Sprint 3C only creates RLS policies on `storage.objects`.

## Required Buckets

### 1. course-thumbnails

Purpose:

- Public course card thumbnails
- Course detail hero images
- Package/course promotional images

Settings:

- Bucket name: `course-thumbnails`
- Public: yes
- Suggested max file size: 2 MB
- Suggested MIME types:
  - image/png
  - image/jpeg
  - image/webp

Access:

- Public can read files by URL.
- Staff can upload, update, and delete.
- Students should not upload here.

---

### 2. lesson-materials

Purpose:

- Paid course PDFs
- Class notes
- Worksheets
- Downloadable resources
- Protected academic materials

Settings:

- Bucket name: `lesson-materials`
- Public: no
- Suggested max file size: 25 MB
- Suggested MIME types:
  - application/pdf
  - image/png
  - image/jpeg
  - application/vnd.openxmlformats-officedocument.wordprocessingml.document
  - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

Access:

- Staff can upload, update, delete, and read.
- Students should only access materials through enrollment-aware application logic or signed URLs.
- Public access is not allowed.

---

### 3. payment-proofs

Purpose:

- bKash/Nagad/Rocket payment screenshots
- Manual payment verification proof

Settings:

- Bucket name: `payment-proofs`
- Public: no
- Suggested max file size: 5 MB
- Suggested MIME types:
  - image/png
  - image/jpeg
  - image/webp
  - application/pdf

Folder convention:

```text
payment-proofs/{student_user_id}/{file_name}
```

Access:

- Students can upload into their own user-id folder.
- Students can read their own uploaded proof.
- Staff can read all payment proofs.
- Staff can delete invalid or duplicate proof files when needed.

---

### 4. profile-avatars

Purpose:

- Student profile image
- Teacher profile image
- Admin/support profile image

Settings:

- Bucket name: `profile-avatars`
- Public: no for now
- Suggested max file size: 2 MB
- Suggested MIME types:
  - image/png
  - image/jpeg
  - image/webp

Folder convention:

```text
profile-avatars/{user_id}/{file_name}
```

Access:

- Users can upload, read, update, and delete files inside their own folder.
- Staff can read avatar files for support/admin review.
- Public avatar display can be reconsidered later.

## Sprint 3C Notes

Storage policies are intentionally conservative.

The first production version should avoid exposing paid learning materials directly. Lesson files should be accessed through controlled application logic, signed URLs, and enrollment checks.
