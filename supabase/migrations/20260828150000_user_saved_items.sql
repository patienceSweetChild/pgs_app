-- User saved catalog items (courses + events)
create table if not exists public.user_saved_items (
  user_id uuid not null references auth.users (id) on delete cascade,
  entity_type text not null check (entity_type in ('course', 'event')),
  entity_id bigint not null,
  created_at timestamptz not null default now(),
  primary key (user_id, entity_type, entity_id)
);

create index if not exists user_saved_items_user_id_idx
  on public.user_saved_items (user_id, created_at desc);

alter table public.user_saved_items enable row level security;

create policy "Users read own saved items"
  on public.user_saved_items
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users insert own saved items"
  on public.user_saved_items
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users delete own saved items"
  on public.user_saved_items
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, delete on public.user_saved_items to authenticated;
