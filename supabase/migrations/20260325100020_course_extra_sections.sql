-- Extra Programsfull sections (awarding body → FAQ)
alter table public.courses
  add column if not exists awarding_body_intro text not null default '',
  add column if not exists awarding_body_facts text not null default '',
  add column if not exists awarding_body_rankings text not null default '',
  add column if not exists awarding_body_image_asset_id uuid references public.media_assets (id) on delete set null,
  add column if not exists apply_intro text not null default '',
  add column if not exists eligibility text not null default '',
  add column if not exists certificate_heading text not null default '',
  add column if not exists certificate_why text not null default '',
  add column if not exists gallery_title text not null default '',
  add column if not exists gallery_blurb text not null default '',
  add column if not exists gallery_location text not null default '',
  add column if not exists gallery_body text not null default '',
  add column if not exists fee_amount text not null default '',
  add column if not exists fee_subtitle text not null default '',
  add column if not exists fee_badge text not null default '',
  add column if not exists fee_note text not null default '',
  add column if not exists fee_includes text not null default '',
  add column if not exists other_expense_label text not null default '',
  add column if not exists other_expense_amount text not null default '',
  add column if not exists payment_methods text not null default '',
  add column if not exists learners_intro text not null default '',
  add column if not exists faq_items text not null default '';

-- Per-course learner testimonials (card grid on Programsfull)
create table if not exists public.course_testimonials (
  id bigint generated always as identity primary key,
  course_id bigint not null references public.courses (id) on delete cascade,
  name text not null,
  quote text not null default '',
  role text not null default '',
  location text not null default '',
  image_asset_id uuid references public.media_assets (id) on delete set null,
  display_order integer not null default 0
);

alter table public.course_testimonials enable row level security;

create policy course_testimonials_public_select on public.course_testimonials
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_id
        and (
          (c.published = true and c.lifecycle_phase = 'live')
          or public.staff_has_permission('catalog.manage')
        )
    )
  );

create policy course_testimonials_staff_write on public.course_testimonials
  for all to authenticated
  using (public.staff_has_permission('catalog.manage'))
  with check (public.staff_has_permission('catalog.manage'));
