-- Enable case-insensitive text for usernames
create extension if not exists citext;

-- Profiles table with unique usernames
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username citext unique not null,
  created_at timestamptz default timezone('utc', now())
);

-- Progress table holds the canonical save blob
create table if not exists public.progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  save jsonb not null,
  updated_at timestamptz not null default timezone('utc', now())
);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.progress enable row level security;

-- Users can view and update their own profile
create policy "Users can read their profile" on public.profiles
  for select using (auth.uid() = user_id);
create policy "Users can upsert their profile" on public.profiles
  for insert with check (auth.uid() = user_id);
create policy "Users can update their profile" on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Users can read and write only their progress
create policy "Users can read their progress" on public.progress
  for select using (auth.uid() = user_id);
create policy "Users can upsert their progress" on public.progress
  for insert with check (auth.uid() = user_id);
create policy "Users can update their progress" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
