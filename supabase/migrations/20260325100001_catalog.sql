-- Catalog: courses, events, programs with lifecycle phases
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  path text not null,
  alt_text text not null default '',
  mime_type text not null default '',
  byte_size bigint not null default 0,
  width integer,
  height integer,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create table public.course_categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  published boolean not null default false,
  display_order integer not null default 0
);

create table public.event_categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  published boolean not null default false
);

create table public.courses (
  id bigint generated always as identity primary key,
  category_id bigint references public.course_categories (id) on delete set null,
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null default '',
  image_asset_id uuid references public.media_assets (id) on delete set null,
  brochure_asset_id uuid references public.media_assets (id) on delete set null,
  published boolean not null default false,
  featured boolean not null default false,
  lifecycle_phase text not null default 'live'
    check (lifecycle_phase in ('live','ended','archived')),
  starts_on date,
  ends_on date,
  duration text not null default '',
  mode text not null default '',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger courses_set_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

create table public.events (
  id bigint generated always as identity primary key,
  category_id bigint references public.event_categories (id) on delete set null,
  title text not null,
  slug text not null unique,
  summary text not null default '',
  description text not null default '',
  starts_at timestamptz,
  ends_at timestamptz,
  booking_url text,
  image_asset_id uuid references public.media_assets (id) on delete set null,
  published boolean not null default false,
  lifecycle_phase text not null default 'live'
    check (lifecycle_phase in ('live','ended','archived')),
  host text not null default '',
  top_label text not null default '',
  badge text not null default '',
  location_note text not null default '',
  mode text not null default '',
  who_is_it_for text not null default '',
  session_topics text not null default '',
  what_we_cover text not null default '',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create table public.event_facilitators (
  id bigint generated always as identity primary key,
  event_id bigint not null references public.events (id) on delete cascade,
  name text not null,
  role text not null default '',
  biography text not null default '',
  image_asset_id uuid references public.media_assets (id) on delete set null,
  display_order integer not null default 0
);

create table public.programs (
  id bigint generated always as identity primary key,
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null default '',
  brochure_asset_id uuid references public.media_assets (id) on delete set null,
  image_asset_id uuid references public.media_assets (id) on delete set null,
  published boolean not null default false,
  featured boolean not null default false,
  lifecycle_phase text not null default 'live'
    check (lifecycle_phase in ('live','ended','archived')),
  display_order integer not null default 0,
  top_label text not null default '',
  badge_text text not null default '',
  learn_more_url text,
  close_date_text text not null default '',
  who_is_it_for text not null default '',
  session_topics text not null default '',
  highlight_1 text not null default '',
  highlight_2 text not null default '',
  highlight_3 text not null default '',
  highlight_4 text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger programs_set_updated_at
before update on public.programs
for each row execute function public.set_updated_at();

create table public.saved_courses (
  student_id uuid not null references public.profiles (id) on delete cascade,
  course_id bigint not null references public.courses (id) on delete cascade,
  saved_at timestamptz not null default now(),
  primary key (student_id, course_id)
);

create table public.saved_programs (
  student_id uuid not null references public.profiles (id) on delete cascade,
  program_id bigint not null references public.programs (id) on delete cascade,
  saved_at timestamptz not null default now(),
  primary key (student_id, program_id)
);

create index courses_public_idx on public.courses (published, lifecycle_phase, display_order)
  where published and lifecycle_phase = 'live';
create index events_public_idx on public.events (published, lifecycle_phase, display_order)
  where published and lifecycle_phase = 'live';
create index programs_public_idx on public.programs (published, lifecycle_phase, display_order)
  where published and lifecycle_phase = 'live';
