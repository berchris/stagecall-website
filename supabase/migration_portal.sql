-- ============================================================
-- StageCall Portal Migration
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Add address fields to organisations
alter table organisations
  add column if not exists address     text,
  add column if not exists city        text,
  add column if not exists postal_code text,
  add column if not exists country     text,
  add column if not exists phone       text,
  add column if not exists website     text,
  add column if not exists email       text;

-- 2. Add is_staff flag to profiles (never affects app role logic)
alter table profiles
  add column if not exists is_staff boolean not null default false;

-- 3. Helper: returns true if current user is StageCall staff
--    Security definer avoids RLS recursion on profiles table
create or replace function auth_is_staff()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select coalesce(
    (select is_staff from profiles where id = auth.uid()),
    false
  )
$$;

-- 4. RLS: staff can read ALL organisations
create policy "org read staff" on organisations
  for select using (auth_is_staff());

-- 5. RLS: org_admin can update their own org
create policy "org update own admin" on organisations
  for update using (
    id = auth_org_id()
    and auth_role() = 'org_admin'
  );

-- 6. RLS: staff can update any org
create policy "org update staff" on organisations
  for update using (auth_is_staff());

-- 7. RLS: staff can insert orgs (used by website staff portal)
create policy "org insert staff" on organisations
  for insert with check (auth_is_staff());

-- 8. RLS: staff can read ALL profiles (needed for staff management page)
create policy "profile read staff" on profiles
  for select using (auth_is_staff());

-- 9. RLS: staff can update is_staff on any profile
create policy "profile update staff" on profiles
  for update using (auth_is_staff());
