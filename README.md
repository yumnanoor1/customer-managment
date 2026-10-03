# Mini Customer Management App

A clean, responsive customer dashboard with full CRUD backed by Supabase.

## Technologies Used
- Next.js (App Router)
- TypeScript
- Supabase (PostgreSQL)
- React
- Tailwind CSS
- Lucide React

## Features
- Add Customer
- View Customers (table on desktop, cards on mobile)
- Edit Customer
- Delete Customer (with confirmation dialog)
- Search Customers (name, phone, email, city)
- Form Validation with inline messages
- Responsive UI
- Loading, empty and error states, plus success notifications

## Database Structure
Table `customers` (see `supabase/schema.sql`):

| Field | Type | Notes |
|---|---|---|
| id | uuid | Primary key, auto-generated |
| name | text | Required |
| phone | text | Required |
| email | text | Required |
| city | text | Required |
| created_at | timestamptz | Defaults to `now()` |

## Setup
1. Clone the repository.
2. Install dependencies: `npm install`
3. Create a free project at [supabase.com](https://supabase.com).
4. Open **SQL Editor** in Supabase and run the contents of `supabase/schema.sql`.
5. Copy `.env.example` to `.env.local` and fill in your project values (Project Settings → API).
6. Start the dev server: `npm run dev` and open http://localhost:3000

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Run Locally
```
npm install
npm run dev
```

## Problems Faced
- Row Level Security blocks all requests by default, so a policy was required before CRUD worked.
- Making one table layout work on both desktop and mobile (solved with a table plus a card list).
- Keeping validation rules (phone, email, name) strict enough to be useful without rejecting real input.
- Sharing one stateful component between the Dashboard and Customers pages.

## What I Learned
- **CRUD operations:** insert, select, update and delete with the Supabase client.
- **Supabase integration:** environment variables, a reusable client, and RLS policies.
- **Form validation:** a pure validation function with inline error messages.
- **React state management:** `useState`, `useMemo` and `useCallback` for lists, search, modals and toasts.
- **Next.js:** App Router pages, layouts and client components.
- **Responsive UI:** Tailwind breakpoints and a consistent colour palette.

## Day 3 Improvements
- **Auth:** Supabase email/password login (`/login`), route guard, logout. RLS now allows only logged-in users.
- **Pagination + city filter + debounced search**, all done in the database query.
- **Customer details page:** `/customers/[id]`.
- **Better validation:** shared `lib/validation.ts`, input normalisation, duplicate-email detection (unique index).
- **Data layer:** `lib/customers.ts` holds every query; components never call Supabase directly.

### Project layout
```
app/            pages (dashboard, customers, customers/[id], login)
components/     reusable UI (Table, Form, Pagination, StatsCards, AuthGuard...)
lib/            supabase client, data layer (customers.ts), validation
supabase/       schema.sql (fresh setup), migration-day3.sql (upgrade from Day 2)
```

### Upgrading from Day 2
Run `supabase/migration-day3.sql` in the Supabase SQL Editor. In Supabase → Authentication → Providers, keep Email enabled. For quick testing you can turn off "Confirm email".
