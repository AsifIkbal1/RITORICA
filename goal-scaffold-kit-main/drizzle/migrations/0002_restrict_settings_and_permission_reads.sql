-- Only admins need to read the permission catalogue and role mapping (super-admin pages);
-- has_permission / my_permissions are SECURITY DEFINER and unaffected.
drop policy if exists "read permissions" on public.permissions;
create policy "admins read permissions" on public.permissions
  for select to authenticated using (public.is_admin(auth.uid()));

drop policy if exists "read role perms" on public.role_permissions;
create policy "admins read role perms" on public.role_permissions
  for select to authenticated using (public.is_admin(auth.uid()));

-- System settings are only read on the Settings page (settings.manage); the existing
-- "manage settings" policy already covers SELECT for those users.
drop policy if exists "read settings" on public.settings;