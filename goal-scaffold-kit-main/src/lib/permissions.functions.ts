import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getPermissionsCatalogue,
  getRolePermissions,
  toggleRolePermission,
  type PermissionItem,
} from "./permissions.server";

export const getPermissionsMatrixFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<{ perms: PermissionItem[]; set: string[] }> => {
    const perms = getPermissionsCatalogue();
    const rolePerms = getRolePermissions();
    const set = rolePerms.map((rp) => `${rp.role}:${rp.permission_key}`);
    return { perms, set };
  });

export const toggleRolePermissionFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      role: z.enum(["super_admin", "admin", "agent", "customer"]),
      key: z.string(),
      on: z.boolean(),
      actorId: z.string().optional(),
      actorName: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    toggleRolePermission(data.role, data.key, data.on, {
      id: data.actorId,
      name: data.actorName,
    });

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      if (data.on) {
        await supabaseAdmin.from("role_permissions").insert({ role: data.role as any, permission_key: data.key });
      } else {
        await supabaseAdmin.from("role_permissions").delete().eq("role", data.role as any).eq("permission_key", data.key);
      }
    } catch {}

    return { ok: true };
  });

export const getRolePermissionsListFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ roles: z.array(z.string()) }).parse(d))
  .handler(async ({ data }): Promise<string[]> => {
    const rolePerms = getRolePermissions();
    const keys = new Set<string>();
    for (const rp of rolePerms) {
      if (data.roles.includes(rp.role) || data.roles.includes("super_admin")) {
        keys.add(rp.permission_key);
      }
    }
    return Array.from(keys);
  });

export const getRolesOverviewFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const { getPermissionsCatalogue, getRolePermissions } = await import("./permissions.server");
    const { getLocalUsers } = await import("./local-users.server");

    const allPerms = getPermissionsCatalogue();
    const rolePerms = getRolePermissions();
    const localUsers = getLocalUsers();

    const memberSets: Record<string, Set<string>> = {
      super_admin: new Set(),
      admin: new Set(),
      agent: new Set(),
      customer: new Set(),
    };

    for (const u of localUsers) {
      if (!u.is_active) continue;
      for (const r of u.roles || []) {
        if (memberSets[r]) {
          memberSets[r].add(u.id);
        }
      }
    }

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const [sbUserRoles, sbProfiles] = await Promise.all([
        supabaseAdmin.from("user_roles").select("user_id, role"),
        supabaseAdmin.from("profiles").select("id, is_active"),
      ]);
      const activeIds = new Set((sbProfiles.data || []).filter((p: any) => p.is_active !== false).map((p: any) => p.id));
      for (const ur of sbUserRoles.data || []) {
        if (activeIds.has(ur.user_id) && memberSets[ur.role]) {
          memberSets[ur.role].add(ur.user_id);
        }
      }
    } catch {}

    const permSets: Record<string, Set<string>> = {
      super_admin: new Set(allPerms.map((p) => p.key)),
      admin: new Set(),
      agent: new Set(),
      customer: new Set(),
    };

    for (const rp of rolePerms) {
      if (permSets[rp.role]) {
        permSets[rp.role].add(rp.permission_key);
      }
    }

    // Super Admin has all permissions in the system
    for (const p of allPerms) {
      permSets.super_admin.add(p.key);
    }

    return [
      {
        value: "super_admin",
        label: "Super Admin",
        members: memberSets.super_admin.size,
        perms: permSets.super_admin.size,
      },
      {
        value: "admin",
        label: "Admin",
        members: memberSets.admin.size,
        perms: permSets.admin.size,
      },
      {
        value: "agent",
        label: "Support Agent",
        members: memberSets.agent.size,
        perms: permSets.agent.size,
      },
      {
        value: "customer",
        label: "Customer",
        members: memberSets.customer.size,
        perms: permSets.customer.size,
      },
    ];
  });

