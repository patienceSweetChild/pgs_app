-- Premium workspace depth: docs, kanban, comments, alerts, entitlement events
alter table public.premium_workspace_profiles
  add column if not exists onboarding_checklist jsonb not null default '[]'::jsonb,
  add column if not exists feedback_session_items jsonb not null default '[]'::jsonb,
  add column if not exists documents_tracker jsonb not null default '{}'::jsonb,
  add column if not exists currently_working_on jsonb not null default '[]'::jsonb,
  add column if not exists future_tasks jsonb not null default '[]'::jsonb;

create table if not exists public.premium_entitlement_events (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles (id) on delete set null,
  resulting_status text not null check (resulting_status in ('active','revoked','expired')),
  source text not null check (source in ('purchase','payment','admin_grant','admin_revoke','admin_reactivate','system_expiry')),
  actor_id uuid references auth.users (id),
  provider text,
  provider_reference text,
  reason text,
  occurred_at timestamptz not null default now(),
  entitlement_id uuid references public.premium_entitlements (id) on delete set null,
  plan_code text references public.premium_plans (code),
  duration_months integer,
  approved_at timestamptz,
  starts_at timestamptz,
  ends_at timestamptz,
  previous_status text check (previous_status is null or previous_status in ('active','revoked','expired'))
);

create table if not exists public.student_university_selections (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  university_id bigint not null references public.universities (id) on delete cascade,
  stage text not null default 'selected' check (stage in (
    'selected','shortlisted','application_started','applied','offer_received','finalized','declined'
  )),
  sort_order integer not null default 0,
  created_by uuid not null references auth.users (id),
  updated_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_document_requirements (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  document_type text not null,
  requirement_kind text not null default 'required' check (requirement_kind in ('required','additional','requested')),
  status text not null default 'missing' check (status in (
    'missing','uploaded','in_review','approved','rejected','in_draft','waived'
  )),
  instructions text not null default '',
  sort_order integer not null default 0,
  requested_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_documents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  requirement_id uuid not null references public.student_document_requirements (id) on delete cascade,
  storage_path text not null unique,
  original_filename text not null,
  mime_type text not null,
  byte_size bigint not null check (byte_size between 1 and 52428800),
  sha256 text not null,
  version integer not null default 1,
  qc_status text not null default 'pending' check (qc_status in ('pending','in_review','in_draft','approved','rejected')),
  scan_status text not null default 'pending' check (scan_status in ('pending','clean','blocked','failed')),
  uploaded_by uuid not null references auth.users (id),
  reviewed_by uuid references auth.users (id),
  review_note text,
  uploaded_at timestamptz not null default now(),
  reviewed_at timestamptz,
  superseded_at timestamptz,
  deletion_requested_at timestamptz,
  deletion_requested_by uuid references auth.users (id),
  archived_at timestamptz,
  purge_after timestamptz,
  purged_at timestamptz,
  storage_purged_at timestamptz,
  scan_detail_code text,
  scanned_at timestamptz
);

create table if not exists public.document_upload_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  requirement_id uuid not null references public.student_document_requirements (id) on delete cascade,
  storage_path text not null unique,
  original_filename text not null,
  mime_type text not null,
  declared_byte_size bigint not null check (declared_byte_size between 1 and 52428800),
  expires_at timestamptz not null,
  finalized_document_id uuid references public.student_documents (id) on delete set null,
  canceled_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.document_shares (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.student_documents (id) on delete cascade,
  recipient_user_id uuid not null references auth.users (id) on delete cascade,
  shared_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (document_id, recipient_user_id)
);

create table if not exists public.workspace_comments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  parent_id uuid references public.workspace_comments (id) on delete cascade,
  author_id uuid not null references auth.users (id),
  body text not null,
  visibility text not null default 'student_visible' check (visibility in ('student_visible','staff_only')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.review_queue_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  details text not null default '',
  status text not null default 'queued' check (status in ('queued','in_review','changes_requested','completed')),
  student_visible boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid not null references auth.users (id),
  updated_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.counselor_notes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  author_id uuid not null references auth.users (id),
  body text not null,
  visibility text not null default 'staff_only' check (visibility in ('staff_only','student_visible')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_alerts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  alert_text text not null,
  severity text not null default 'important' check (severity in ('info','important','urgent')),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_by uuid not null references auth.users (id),
  updated_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_board_columns (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  key text not null,
  title text not null,
  sort_order integer not null default 0,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, key)
);

create table if not exists public.student_tasks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  column_id uuid not null references public.student_board_columns (id) on delete cascade,
  title text not null,
  details text not null default '',
  sort_order integer not null default 0,
  assigned_to uuid references auth.users (id),
  due_at timestamptz,
  created_by uuid not null references auth.users (id),
  updated_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.premium_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users (id),
  student_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  old_values jsonb not null default '{}'::jsonb,
  new_values jsonb not null default '{}'::jsonb,
  reason text,
  created_at timestamptz not null default now()
);
