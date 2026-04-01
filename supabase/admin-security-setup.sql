-- Admin security setup
-- Run this in Supabase SQL Editor

create table if not exists public.admin_allowed_emails (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_active boolean not null default true,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_allowed_emails_gmail_chk check (
    email ~* '^[A-Za-z0-9._%+-]+@(gmail\.com|googlemail\.com)$'
  )
);

create or replace function public.set_admin_allowed_emails_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_admin_allowed_emails_updated_at on public.admin_allowed_emails;

create trigger trg_admin_allowed_emails_updated_at
before update on public.admin_allowed_emails
for each row
execute function public.set_admin_allowed_emails_updated_at();

alter table public.admin_allowed_emails enable row level security;

-- Read allowlist: admin users only
create policy if not exists "admin_allowed_emails_select_admin_only"
on public.admin_allowed_emails
for select
to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role = 'admin'
  )
);

-- Insert allowlist: admin users only
create policy if not exists "admin_allowed_emails_insert_admin_only"
on public.admin_allowed_emails
for insert
to authenticated
with check (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role = 'admin'
  )
  and created_by = auth.uid()
);

-- Update allowlist: admin users only
create policy if not exists "admin_allowed_emails_update_admin_only"
on public.admin_allowed_emails
for update
to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role = 'admin'
  )
);

-- Delete allowlist: admin users only
create policy if not exists "admin_allowed_emails_delete_admin_only"
on public.admin_allowed_emails
for delete
to authenticated
using (
  exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role = 'admin'
  )
);

-- Ensure at least one known admin profile has admin role.
-- Update this email to your real owner/admin account before running.
update public.user_profiles
set role = 'admin'
where email = 'circuitcraftersiot@gmail.com';

update public.user_profiles
set role = 'admin'
where email = 'shudiptosid@gmail.com';

-- Seed allowlist with your owner account.
insert into public.admin_allowed_emails (email, created_by)
select 'circuitcraftersiot@gmail.com', up.id
from public.user_profiles up
where up.email = 'circuitcraftersiot@gmail.com'
on conflict (email) do nothing;

insert into public.admin_allowed_emails (email, created_by, is_active)
select 'shudiptosid@gmail.com', up.id, true
from public.user_profiles up
where up.email = 'shudiptosid@gmail.com'
on conflict (email) do update
set is_active = true;
