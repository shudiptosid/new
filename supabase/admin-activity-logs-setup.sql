-- Admin activity log setup
-- Run this script in Supabase SQL Editor.

create table if not exists public.admin_activity_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  table_name text not null,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  record_id text,
  actor_id uuid,
  actor_email text,
  details jsonb not null default '{}'::jsonb
);

create index if not exists idx_admin_activity_logs_created_at
  on public.admin_activity_logs (created_at desc);

create index if not exists idx_admin_activity_logs_table_action
  on public.admin_activity_logs (table_name, action);

alter table public.admin_activity_logs enable row level security;

drop policy if exists admin_activity_logs_select_admin_only on public.admin_activity_logs;
create policy admin_activity_logs_select_admin_only
on public.admin_activity_logs
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

create or replace function public.log_admin_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor_id uuid;
  v_actor_email text;
  v_record_id text;
  v_old jsonb;
  v_new jsonb;
  v_changes jsonb;
begin
  if tg_table_name = 'admin_activity_logs' then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  v_actor_id := auth.uid();
  v_actor_email := coalesce(auth.jwt()->>'email', null);

  if tg_op = 'INSERT' then
    v_new := to_jsonb(new);
    v_record_id := coalesce(v_new->>'id', v_new->>'product_id', v_new->>'slug');

    insert into public.admin_activity_logs (
      table_name,
      action,
      record_id,
      actor_id,
      actor_email,
      details
    ) values (
      tg_table_name,
      'INSERT',
      v_record_id,
      v_actor_id,
      v_actor_email,
      jsonb_build_object('new', v_new)
    );

    return new;
  end if;

  if tg_op = 'UPDATE' then
    v_old := to_jsonb(old);
    v_new := to_jsonb(new);

    if v_old = v_new then
      return new;
    end if;

    v_record_id := coalesce(v_new->>'id', v_old->>'id', v_new->>'product_id', v_old->>'product_id', v_new->>'slug', v_old->>'slug');

    select jsonb_object_agg(k, jsonb_build_object('old', v_old->k, 'new', v_new->k))
    into v_changes
    from (
      select key as k
      from jsonb_object_keys(v_old || v_new)
    ) keys
    where v_old->keys.k is distinct from v_new->keys.k;

    insert into public.admin_activity_logs (
      table_name,
      action,
      record_id,
      actor_id,
      actor_email,
      details
    ) values (
      tg_table_name,
      'UPDATE',
      v_record_id,
      v_actor_id,
      v_actor_email,
      jsonb_build_object(
        'changed_fields', coalesce(v_changes, '{}'::jsonb),
        'old', v_old,
        'new', v_new
      )
    );

    return new;
  end if;

  -- DELETE
  v_old := to_jsonb(old);
  v_record_id := coalesce(v_old->>'id', v_old->>'product_id', v_old->>'slug');

  insert into public.admin_activity_logs (
    table_name,
    action,
    record_id,
    actor_id,
    actor_email,
    details
  ) values (
    tg_table_name,
    'DELETE',
    v_record_id,
    v_actor_id,
    v_actor_email,
    jsonb_build_object('old', v_old)
  );

  return old;
end;
$$;

-- Attach triggers to major admin-managed tables if they exist.
do $$
declare
  t text;
  tables text[] := array[
    'blogs',
    'blog_comments',
    'component_prices',
    'price_history',
    'career_applications',
    'study_materials',
    'questions',
    'mcq_options',
    'short_answers',
    'admin_allowed_emails',
    'admin_replies',
    'consulting_requests',
    'prototyping_requests',
    'firmware_requests',
    'ondemand_requests'
  ];
begin
  foreach t in array tables
  loop
    if to_regclass('public.' || t) is not null then
      execute format('drop trigger if exists trg_log_admin_activity on public.%I', t);
      execute format(
        'create trigger trg_log_admin_activity after insert or update or delete on public.%I for each row execute function public.log_admin_activity()',
        t
      );
    end if;
  end loop;
end $$;
