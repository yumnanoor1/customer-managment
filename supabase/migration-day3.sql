-- Run this ONLY if you already created the table on Day 2.
-- (If it fails on the unique index, delete duplicate-email rows first.)
drop policy if exists "Allow anon CRUD on customers" on public.customers;
create policy "Authenticated CRUD" on public.customers
  for all to authenticated using (true) with check (true);
create unique index if not exists customers_email_unique on public.customers (lower(email));
create index if not exists customers_city_idx on public.customers (lower(city));
create index if not exists customers_created_at_idx on public.customers (created_at desc);
