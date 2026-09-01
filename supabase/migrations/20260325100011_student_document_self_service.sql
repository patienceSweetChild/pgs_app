-- Allow students to manage their own document requirements & files

drop policy if exists "doc_req_student_insert" on public.student_document_requirements;
create policy "doc_req_student_insert"
  on public.student_document_requirements for insert
  to authenticated
  with check (student_id = (select auth.uid()));

drop policy if exists "doc_req_student_update" on public.student_document_requirements;
create policy "doc_req_student_update"
  on public.student_document_requirements for update
  to authenticated
  using (student_id = (select auth.uid()))
  with check (student_id = (select auth.uid()));

drop policy if exists "student_docs_own_update" on public.student_documents;
create policy "student_docs_own_update"
  on public.student_documents for update
  to authenticated
  using (student_id = (select auth.uid()))
  with check (student_id = (select auth.uid()));

-- Seed standard checklist rows for a student (idempotent)
create or replace function public.ensure_default_document_requirements(
  uid uuid default auth.uid()
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  doc_types text[] := array[
    'Passport Front',
    'Passport Back',
    'CV',
    'LoR',
    'UG Marksheet - 1',
    'UG Provisional Certificate',
    'UG Degree Certificate',
    'SOP',
    '12th Marksheet',
    '10th Marksheet',
    'PG Marksheet - 1',
    'PG Consolidated Marksheet',
    'PG Provisional Certificate',
    'PG Degree Certificate',
    'pre-journey checklist'
  ];
  i integer;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;
  if uid <> auth.uid() and not public.staff_has_permission('documents.manage') then
    raise exception 'Forbidden';
  end if;

  for i in 1 .. array_length(doc_types, 1) loop
    insert into public.student_document_requirements (
      student_id, document_type, requirement_kind, status, sort_order
    )
    select uid, doc_types[i], 'required', 'missing', i
    where not exists (
      select 1
      from public.student_document_requirements r
      where r.student_id = uid
        and r.document_type = doc_types[i]
    );
  end loop;
end;
$$;

revoke all on function public.ensure_default_document_requirements(uuid) from public;
grant execute on function public.ensure_default_document_requirements(uuid) to authenticated;
