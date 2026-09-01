-- CMS content modules + typed page revisions (purpleguide / pgs-v3 parity)
create table if not exists public.cms_editors (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.cms_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  page_type text not null,
  status text not null default 'draft' check (status in ('draft','published','unpublished')),
  published_revision_id uuid,
  seo_title text,
  seo_description text,
  open_graph jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_page_revisions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.cms_pages (id) on delete cascade,
  schema_version integer not null default 1 check (schema_version > 0),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  revision_note text,
  seo_title text,
  seo_description text,
  open_graph jsonb not null default '{}'::jsonb
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'cms_pages_published_revision_fk'
  ) then
    alter table public.cms_pages
      add constraint cms_pages_published_revision_fk
      foreign key (published_revision_id) references public.cms_page_revisions (id);
  end if;
end $$;

create table if not exists public.page_content (
  id bigint generated always as identity primary key,
  slug text not null unique,
  content jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  updated_by uuid references auth.users (id),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id bigint generated always as identity primary key,
  question text not null,
  answer text not null default '',
  category text not null default 'general',
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id bigint generated always as identity primary key,
  name text not null,
  quote text not null,
  role_label text not null default '',
  image_asset_id uuid references public.media_assets (id) on delete set null,
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_people (
  id bigint generated always as identity primary key,
  person_type text not null check (person_type in ('founder','advisory')),
  name text not null,
  title text not null default '',
  biography text not null default '',
  image_asset_id uuid references public.media_assets (id) on delete set null,
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_wall_items (
  id bigint generated always as identity primary key,
  title text not null,
  body text not null default '',
  image_asset_id uuid references public.media_assets (id) on delete set null,
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.highlights (
  id bigint generated always as identity primary key,
  title text not null,
  body text not null default '',
  image_asset_id uuid references public.media_assets (id) on delete set null,
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.key_dates (
  id bigint generated always as identity primary key,
  title text not null,
  occurs_on date,
  description text not null default '',
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.urgent_deadlines (
  id bigint generated always as identity primary key,
  title text not null,
  due_at timestamptz,
  description text not null default '',
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.study_abroad_facts (
  id bigint generated always as identity primary key,
  title text not null,
  body text not null default '',
  published boolean not null default false,
  display_order integer not null default 0
);

create table if not exists public.pgs_stats (
  id bigint generated always as identity primary key,
  label text not null,
  value_text text not null,
  published boolean not null default false,
  display_order integer not null default 0
);

create table if not exists public.site_notices (
  id bigint generated always as identity primary key,
  notice_type text not null default 'marquee' check (notice_type in ('marquee','banner','maintenance')),
  text text not null,
  link_url text,
  active boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  document_type text not null unique check (document_type in ('privacy','terms','refund')),
  title text not null,
  body text not null default '',
  status text not null default 'draft' check (status in ('draft','published','unpublished')),
  version integer not null default 1,
  published_at timestamptz,
  updated_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_social_links (
  id bigint generated always as identity primary key,
  platform text not null unique,
  url text not null,
  published boolean not null default false,
  display_order integer not null default 0
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  description text not null default '',
  updated_by uuid references auth.users (id),
  updated_at timestamptz not null default now()
);

create table if not exists public.premium_content_settings (
  key text primary key check (key in ('video','meetup')),
  title text not null default '',
  body text not null default '',
  media_asset_id uuid references public.media_assets (id) on delete set null,
  link_url text,
  published boolean not null default false,
  updated_by uuid references auth.users (id),
  updated_at timestamptz not null default now()
);

create table if not exists public.article_categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  published boolean not null default false,
  display_order integer not null default 0
);

create table if not exists public.articles (
  id bigint generated always as identity primary key,
  category_id bigint references public.article_categories (id) on delete set null,
  title text not null,
  slug text not null unique,
  summary text not null default '',
  body text not null default '',
  layout_key text not null default 'standard' check (layout_key in ('standard','feature','guide')),
  image_asset_id uuid references public.media_assets (id) on delete set null,
  featured boolean not null default false,
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
