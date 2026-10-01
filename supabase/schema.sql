create extension if not exists "pgcrypto";

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  city text not null,
  created_at timestamptz not null default now()
);

alter table public.customers enable row level security;

-- Open policy so the anon key can do CRUD (fine for a demo/assignment).
-- For production, restrict this to authenticated users.
create policy "Allow anon CRUD on customers" on public.customers
  for all using (true) with check (true);
