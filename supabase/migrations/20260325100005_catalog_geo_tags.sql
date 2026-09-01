-- Expand catalog: geo, universities, tags/filters, drafts; enrich courses/programs
alter table public.courses
  add column if not exists university_id bigint,
  add column if not exists legacy_id bigint;

alter table public.programs
  add column if not exists university_id bigint,
  add column if not exists legacy_id bigint;

create table if not exists public.countries (
  id bigint generated always as identity primary key,
  legacy_id bigint unique,
  name text not null,
  slug text not null unique,
  iso_code text,
  dial_code text,
  published boolean not null default false,
  display_order integer not null default 0
);

create table if not exists public.universities (
  id bigint generated always as identity primary key,
  legacy_id bigint unique,
  country_id bigint references public.countries (id) on delete set null,
  name text not null,
  slug text not null unique,
  summary text not null default '',
  location text not null default '',
  image_asset_id uuid references public.media_assets (id) on delete set null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger universities_set_updated_at
before update on public.universities
for each row execute function public.set_updated_at();

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'courses_university_id_fkey'
  ) then
    alter table public.courses
      add constraint courses_university_id_fkey
      foreign key (university_id) references public.universities (id) on delete set null;
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'programs_university_id_fkey'
  ) then
    alter table public.programs
      add constraint programs_university_id_fkey
      foreign key (university_id) references public.universities (id) on delete set null;
  end if;
end $$;

create unique index if not exists courses_legacy_id_uidx on public.courses (legacy_id) where legacy_id is not null;
create unique index if not exists programs_legacy_id_uidx on public.programs (legacy_id) where legacy_id is not null;

create table if not exists public.catalog_tags (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  tag_type text not null default 'general',
  published boolean not null default false
);

create table if not exists public.program_tags (
  program_id bigint not null references public.programs (id) on delete cascade,
  tag_id bigint not null references public.catalog_tags (id) on delete cascade,
  primary key (program_id, tag_id)
);

create table if not exists public.course_tags (
  course_id bigint not null references public.courses (id) on delete cascade,
  tag_id bigint not null references public.catalog_tags (id) on delete cascade,
  primary key (course_id, tag_id)
);

create table if not exists public.event_tags (
  event_id bigint not null references public.events (id) on delete cascade,
  tag_id bigint not null references public.catalog_tags (id) on delete cascade,
  primary key (event_id, tag_id)
);

create table if not exists public.university_tags (
  university_id bigint not null references public.universities (id) on delete cascade,
  tag_id bigint not null references public.catalog_tags (id) on delete cascade,
  primary key (university_id, tag_id)
);

create table if not exists public.catalog_filter_facets (
  id bigint generated always as identity primary key,
  key text not null unique,
  label text not null,
  published boolean not null default false,
  display_order integer not null default 0
);

create table if not exists public.catalog_filter_options (
  id bigint generated always as identity primary key,
  facet_id bigint not null references public.catalog_filter_facets (id) on delete cascade,
  label text not null,
  value text not null,
  published boolean not null default false,
  display_order integer not null default 0,
  unique (facet_id, value)
);

create table if not exists public.program_filter_options (
  program_id bigint not null references public.programs (id) on delete cascade,
  option_id bigint not null references public.catalog_filter_options (id) on delete cascade,
  primary key (program_id, option_id)
);

create table if not exists public.course_filter_options (
  course_id bigint not null references public.courses (id) on delete cascade,
  option_id bigint not null references public.catalog_filter_options (id) on delete cascade,
  primary key (course_id, option_id)
);

create table if not exists public.event_filter_options (
  event_id bigint not null references public.events (id) on delete cascade,
  option_id bigint not null references public.catalog_filter_options (id) on delete cascade,
  primary key (event_id, option_id)
);

create table if not exists public.university_filter_options (
  university_id bigint not null references public.universities (id) on delete cascade,
  option_id bigint not null references public.catalog_filter_options (id) on delete cascade,
  primary key (university_id, option_id)
);

create table if not exists public.catalog_draft_revisions (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('events','courses','programs','universities')),
  entity_id bigint not null check (entity_id > 0),
  values jsonb not null check (jsonb_typeof(values) = 'object'),
  tag_ids bigint[] not null default '{}',
  revision_note text check (revision_note is null or char_length(revision_note) <= 500),
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now()
);

create table if not exists public.university_meeting_slots (
  id bigint generated always as identity primary key,
  label text not null check (char_length(label) between 1 and 160),
  starts_at timestamptz,
  course_id bigint references public.courses (id) on delete set null,
  booking_url text,
  published boolean not null default false,
  display_order integer not null default 0
);
