-- Workspace table RLS aligned with operations access helpers

alter table public.student_board_columns enable row level security;
alter table public.student_tasks enable row level security;
alter table public.student_alerts enable row level security;
alter table public.student_document_requirements enable row level security;
alter table public.student_documents enable row level security;
alter table public.workspace_comments enable row level security;
alter table public.review_queue_items enable row level security;
alter table public.counselor_notes enable row level security;

drop policy if exists student_board_columns_access on public.student_board_columns;
create policy student_board_columns_access on public.student_board_columns
  for all to authenticated
  using (
    student_id = auth.uid()
    or public.staff_can_view_student(student_id)
  )
  with check (
    student_id = auth.uid()
    or public.staff_can_manage_student(student_id)
  );

drop policy if exists student_tasks_access on public.student_tasks;
create policy student_tasks_access on public.student_tasks
  for all to authenticated
  using (
    student_id = auth.uid()
    or public.staff_can_view_student(student_id)
  )
  with check (
    student_id = auth.uid()
    or public.staff_can_manage_student(student_id)
  );

drop policy if exists student_alerts_access on public.student_alerts;
create policy student_alerts_access on public.student_alerts
  for all to authenticated
  using (
    student_id = auth.uid()
    or public.staff_can_view_student(student_id)
  )
  with check (
    student_id = auth.uid()
    or public.staff_can_manage_student(student_id)
  );

drop policy if exists student_document_requirements_access on public.student_document_requirements;
create policy student_document_requirements_access on public.student_document_requirements
  for all to authenticated
  using (
    student_id = auth.uid()
    or public.staff_can_view_student(student_id)
  )
  with check (
    student_id = auth.uid()
    or public.staff_can_manage_student(student_id)
  );

drop policy if exists student_documents_access on public.student_documents;
create policy student_documents_access on public.student_documents
  for all to authenticated
  using (
    student_id = auth.uid()
    or public.staff_can_view_student(student_id)
  )
  with check (
    student_id = auth.uid()
    or public.staff_can_manage_student(student_id)
  );

drop policy if exists workspace_comments_access on public.workspace_comments;
create policy workspace_comments_access on public.workspace_comments
  for all to authenticated
  using (
    student_id = auth.uid()
    or public.staff_can_view_student(student_id)
  )
  with check (
    student_id = auth.uid()
    or public.staff_can_manage_student(student_id)
  );

drop policy if exists review_queue_items_access on public.review_queue_items;
create policy review_queue_items_access on public.review_queue_items
  for all to authenticated
  using (
    student_id = auth.uid()
    or public.staff_can_view_student(student_id)
  )
  with check (
    student_id = auth.uid()
    or public.staff_can_manage_student(student_id)
  );

drop policy if exists counselor_notes_access on public.counselor_notes;
create policy counselor_notes_access on public.counselor_notes
  for all to authenticated
  using (
    student_id = auth.uid()
    or public.staff_can_view_student(student_id)
  )
  with check (
    student_id = auth.uid()
    or public.staff_can_manage_student(student_id)
  );
