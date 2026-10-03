create extension if not exists "pgcrypto";

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  city text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists customers_email_unique on public.customers (lower(email));
create index if not exists customers_city_idx on public.customers (lower(city));
create index if not exists customers_created_at_idx on public.customers (created_at desc);

alter table public.customers enable row level security;

-- Only logged-in users can read or change customers.
create policy "Authenticated CRUD" on public.customers
  for all to authenticated using (true) with check (true);
