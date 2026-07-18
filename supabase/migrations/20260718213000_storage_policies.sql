-- MSS Sprint 3C
-- Supabase Storage policy foundation
--
-- Important:
-- Bucket creation should be done through Supabase Dashboard, API, or client tooling.
-- This migration only defines storage.objects RLS policies.
--
-- Required buckets:
-- 1. course-thumbnails  public
-- 2. lesson-materials   private
-- 3. payment-proofs     private
-- 4. profile-avatars    private

drop policy if exists "course thumbnails staff insert"
on storage.objects;

create policy "course thumbnails staff insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'course-thumbnails'
  and public.is_staff()
);

drop policy if exists "course thumbnails staff update"
on storage.objects;

create policy "course thumbnails staff update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'course-thumbnails'
  and public.is_staff()
)
with check (
  bucket_id = 'course-thumbnails'
  and public.is_staff()
);

drop policy if exists "course thumbnails staff delete"
on storage.objects;

create policy "course thumbnails staff delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'course-thumbnails'
  and public.is_staff()
);

drop policy if exists "lesson materials staff insert"
on storage.objects;

create policy "lesson materials staff insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'lesson-materials'
  and public.is_staff()
);

drop policy if exists "lesson materials staff update"
on storage.objects;

create policy "lesson materials staff update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'lesson-materials'
  and public.is_staff()
)
with check (
  bucket_id = 'lesson-materials'
  and public.is_staff()
);

drop policy if exists "lesson materials staff delete"
on storage.objects;

create policy "lesson materials staff delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'lesson-materials'
  and public.is_staff()
);

drop policy if exists "lesson materials staff read"
on storage.objects;

create policy "lesson materials staff read"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'lesson-materials'
  and public.is_staff()
);

drop policy if exists "payment proofs student insert own folder"
on storage.objects;

create policy "payment proofs student insert own folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'payment-proofs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "payment proofs student read own folder or staff"
on storage.objects;

create policy "payment proofs student read own folder or staff"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'payment-proofs'
  and (
    public.is_staff()
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);

drop policy if exists "payment proofs student update own folder"
on storage.objects;

create policy "payment proofs student update own folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'payment-proofs'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'payment-proofs'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "payment proofs staff delete"
on storage.objects;

create policy "payment proofs staff delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'payment-proofs'
  and public.is_staff()
);

drop policy if exists "profile avatars user insert own folder"
on storage.objects;

create policy "profile avatars user insert own folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "profile avatars user read own folder or staff"
on storage.objects;

create policy "profile avatars user read own folder or staff"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'profile-avatars'
  and (
    public.is_staff()
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);

drop policy if exists "profile avatars user update own folder"
on storage.objects;

create policy "profile avatars user update own folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "profile avatars user delete own folder"
on storage.objects;

create policy "profile avatars user delete own folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
