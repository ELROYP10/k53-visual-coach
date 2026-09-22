create table if not exists public.payment_events (
  payment_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'ZAR',
  plan text not null,
  paid_at timestamptz not null default now()
);

alter table public.payment_events enable row level security;

drop policy if exists "Admins can view payment events" on public.payment_events;
create policy "Admins can view payment events" on public.payment_events
for select to authenticated using (
  exists (select 1 from public.admin_users a where a.user_id = auth.uid())
);

create index if not exists payment_events_paid_at_idx on public.payment_events (paid_at desc);
