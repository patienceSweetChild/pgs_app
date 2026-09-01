-- Storage buckets for avatars, CMS/catalog media, and private student documents

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'avatars',
    'avatars',
    true,
    5242880, -- 5 MB
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'media',
    'media',
    true,
    20971520, -- 20 MB
    array[
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'application/pdf'
    ]
  ),
  (
    'student-documents',
    'student-documents',
    false,
    52428800, -- 50 MB (matches student_documents.byte_size check)
    array[
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  )
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- avatars: public read; users manage files under their own folder
-- path convention: {user_id}/avatar.ext
-- ---------------------------------------------------------------------------
drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

-- ---------------------------------------------------------------------------
-- media: public read; staff with content/catalog perms can write
-- path convention: free-form under staff uploads (e.g. courses/, events/)
-- ---------------------------------------------------------------------------
drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'media');

drop policy if exists "media_staff_insert" on storage.objects;
create policy "media_staff_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'media'
    and (
      public.staff_has_permission('content.manage')
      or public.staff_has_permission('catalog.manage')
      or public.is_active_staff()
    )
  );

drop policy if exists "media_staff_update" on storage.objects;
create policy "media_staff_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'media'
    and (
      public.staff_has_permission('content.manage')
      or public.staff_has_permission('catalog.manage')
      or public.is_active_staff()
    )
  )
  with check (
    bucket_id = 'media'
    and (
      public.staff_has_permission('content.manage')
      or public.staff_has_permission('catalog.manage')
      or public.is_active_staff()
    )
  );

drop policy if exists "media_staff_delete" on storage.objects;
create policy "media_staff_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'media'
    and (
      public.staff_has_permission('content.manage')
      or public.staff_has_permission('catalog.manage')
      or public.is_active_staff()
    )
  );

-- ---------------------------------------------------------------------------
-- student-documents: private; student owns folder, staff can manage
-- path convention: {student_id}/{requirement_or_session}/{filename}
-- ---------------------------------------------------------------------------
drop policy if exists "student_docs_select" on storage.objects;
create policy "student_docs_select"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'student-documents'
    and (
      (storage.foldername(name))[1] = (select auth.uid()::text)
      or public.staff_has_permission('students.read')
      or public.staff_has_permission('students.manage')
      or public.staff_has_permission('premium.manage')
      or public.staff_has_permission('documents.manage')
    )
  );

drop policy if exists "student_docs_insert" on storage.objects;
create policy "student_docs_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'student-documents'
    and (
      (storage.foldername(name))[1] = (select auth.uid()::text)
      or public.staff_has_permission('students.manage')
      or public.staff_has_permission('premium.manage')
      or public.staff_has_permission('documents.manage')
    )
  );

drop policy if exists "student_docs_update" on storage.objects;
create policy "student_docs_update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'student-documents'
    and (
      (storage.foldername(name))[1] = (select auth.uid()::text)
      or public.staff_has_permission('students.manage')
      or public.staff_has_permission('premium.manage')
      or public.staff_has_permission('documents.manage')
    )
  )
  with check (
    bucket_id = 'student-documents'
    and (
      (storage.foldername(name))[1] = (select auth.uid()::text)
      or public.staff_has_permission('students.manage')
      or public.staff_has_permission('premium.manage')
      or public.staff_has_permission('documents.manage')
    )
  );

drop policy if exists "student_docs_delete" on storage.objects;
create policy "student_docs_delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'student-documents'
    and (
      (storage.foldername(name))[1] = (select auth.uid()::text)
      or public.staff_has_permission('students.manage')
      or public.staff_has_permission('premium.manage')
      or public.staff_has_permission('documents.manage')
    )
  );
