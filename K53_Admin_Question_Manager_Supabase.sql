create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Admins can confirm own access" on public.admin_users;
create policy "Admins can confirm own access" on public.admin_users
for select to authenticated using (auth.uid() = user_id);

insert into public.admin_users (user_id)
select id from auth.users where lower(email) = lower('elroypienaar25@gmail.com')
on conflict (user_id) do nothing;

alter table public.k53_questions enable row level security;

drop policy if exists "Admins can read every question" on public.k53_questions;
create policy "Admins can read every question" on public.k53_questions
for select to authenticated using (
  exists (select 1 from public.admin_users a where a.user_id = auth.uid())
);

drop policy if exists "Admins can add questions" on public.k53_questions;
create policy "Admins can add questions" on public.k53_questions
for insert to authenticated with check (
  exists (select 1 from public.admin_users a where a.user_id = auth.uid())
);

drop policy if exists "Admins can update questions" on public.k53_questions;
create policy "Admins can update questions" on public.k53_questions
for update to authenticated using (
  exists (select 1 from public.admin_users a where a.user_id = auth.uid())
) with check (
  exists (select 1 from public.admin_users a where a.user_id = auth.uid())
);

drop policy if exists "Admins can delete questions" on public.k53_questions;
create policy "Admins can delete questions" on public.k53_questions
for delete to authenticated using (
  exists (select 1 from public.admin_users a where a.user_id = auth.uid())
);
