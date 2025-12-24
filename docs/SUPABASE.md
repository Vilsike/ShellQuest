# Supabase Setup

ShellQuest can use Supabase to store player profiles and cloud saves. The app works with anonymous key access for a simple MVP but you should add Row Level Security (RLS) before production use.

## Required extensions

Enable the `pgcrypto` extension so `gen_random_uuid()` is available:

```sql
create extension if not exists pgcrypto;
```

## Schema

Run the SQL below in the Supabase SQL editor. It creates the lightweight profile and save tables used by the terminal commands:

```sql
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists saves (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null default now(),
  unique (profile_id)
);
```

Usernames are stored in lowercase to guarantee case-insensitive uniqueness.

## Row Level Security guidance

For an MVP you can leave RLS disabled and use only the Supabase anon key. This keeps setup simple but means anyone with the anon key could read or modify saves. When you are ready to harden access, enable RLS on both tables and scope policies to authenticated users or service roles.

## Environment configuration

The client reads Supabase settings from either `src/config.js` (browser globals) or environment variables. Provide the following values:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Example `.env` entry (for `npm run dev`):

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

When serving the static `index.html`, copy `src/config.example.js` to `src/config.js` and fill in your project values so the window globals are available.
