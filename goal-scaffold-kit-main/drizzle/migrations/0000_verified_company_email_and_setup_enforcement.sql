-- Verified company email + password-change tracking on profiles
alter table public.profiles
  add column if not exists company_email text,
  add column if not exists company_email_verified_at timestamptz,
  add column if not exists password_changed_at timestamptz;

-- One-time codes (email verification + password reset). Only a hash is stored; server-only table.
create table public.auth_otps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  purpose text not null check (purpose in ('verify_email','reset_password')),
  email text not null,
  salt text not null,
  code_hash text not null,
  attempts integer not null default 0,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index auth_otps_user_purpose_idx on public.auth_otps (user_id, purpose, created_at desc);
grant all on public.auth_otps to service_role;
alter table public.auth_otps enable row level security;
-- No policies on purpose: only the server (service role) reads or writes codes.

comment on table public.password_reset_codes is 'DEPRECATED: replaced by auth_otps (hashed codes sent to the verified company email)';

-- Setup is complete once the user changed the admin password and verified a company email.
create or replace function public.setup_complete(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select not must_change_password from public.profiles where id = _user_id), false)
$$;

-- Users who have not finished first-time setup get no staff/admin powers anywhere.
create or replace function public.is_active_user(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_active and not must_change_password from public.profiles where id = _user_id), false)
$$;

-- Signed-in users can never change their own setup/verification fields; only the server can.
create or replace function public.guard_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null then
    new.must_change_password = old.must_change_password;
    new.company_email = old.company_email;
    new.company_email_verified_at = old.company_email_verified_at;
    new.password_changed_at = old.password_changed_at;
    if not public.has_permission(auth.uid(),'users.manage') then
      new.is_active = old.is_active; new.department_id = old.department_id; new.email = old.email; new.username = old.username;
    end if;
  end if;
  return new;
end $$;

-- Backend enforcement: until setup is complete, a signed-in user can only see their own profile and roles.
do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public'
    and tablename not in ('profiles','user_roles','permissions','role_permissions','auth_otps')
  loop
    execute format('create policy "require account setup" on public.%I as restrictive for all to authenticated using (public.setup_complete(auth.uid())) with check (public.setup_complete(auth.uid()))', t);
  end loop;
end $$;

create policy "require account setup" on public.profiles as restrictive for all to authenticated
  using (id = auth.uid() or public.setup_complete(auth.uid()))
  with check (id = auth.uid() or public.setup_complete(auth.uid()));
create policy "require account setup" on public.user_roles as restrictive for all to authenticated
  using (user_id = auth.uid() or public.setup_complete(auth.uid()))
  with check (user_id = auth.uid() or public.setup_complete(auth.uid()));