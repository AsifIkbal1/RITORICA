import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const usernameSchema = z.string().trim().min(3).max(40).regex(/^[a-zA-Z0-9._-]+$/, "Username can use letters, numbers, dot, dash and underscore");

const input = z.object({
  username: usernameSchema,
  phone: z.string().trim().max(30).optional(),
  password: z.string().min(8).max(72),
  role: z.enum(["super_admin", "admin", "agent", "customer"]),
  company_name: z.string().trim().max(150).optional(),
  avatar_url: z.string().optional(),
  company_email: z.string().optional(),
  email: z.string().optional(),
  department_id: z.string().nullable().optional(),
});

/** List all accounts for admin management (passwords safely omitted) */
export const listAdminUsersAccount = createServerFn({ method: "GET" })
  .handler(async () => {
    const { getLocalUsersSafe } = await import("@/lib/local-users.server");
    return getLocalUsersSafe();
  });

/** Creates a user account with an admin-chosen username + password. */
export const createUserAccount = createServerFn({ method: "POST" })
  .validator((d: unknown) => input.parse(d))
  .handler(async ({ data }) => {
    const uname = data.username.toLowerCase();
    const { createLocalUser } = await import("@/lib/local-users.server");

    // Create in persistent local repository
    const localUser = createLocalUser({
      username: uname,
      password: data.password,
      phone: data.phone,
      role: data.role,
      company_name: data.company_name,
      avatar_url: data.avatar_url,
      department_id: data.department_id || null,
      company_email: data.company_email || data.email || null,
      email: data.email || `${uname}@users.ritorica.invalid`,
    });

    // Best-effort remote Supabase sync if service credentials exist
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const email = data.email || `${uname}@users.ritorica.invalid`;
      const { data: created } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: data.password,
        email_confirm: true,
        user_metadata: { full_name: uname, phone: data.phone, username: uname },
      });
      if (created?.user) {
        await supabaseAdmin.from("profiles").update({
          username: uname,
          must_change_password: true,
          ...(data.company_name ? { company_name: data.company_name } : {}),
          ...(data.avatar_url ? { avatar_url: data.avatar_url } : {}),
          ...(data.department_id ? { department_id: data.department_id } : {}),
          ...(data.company_email || data.email ? { company_email: data.company_email || data.email } : {}),
        }).eq("id", created.user.id);
        if (data.role !== "customer") {
          await supabaseAdmin.from("user_roles").insert({ user_id: created.user.id, role: data.role });
        }
      }
    } catch {}

    return { id: localUser.id };
  });

/** Admin sets a new username and/or password for a user. */
export const updateUserCredentials = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      user_id: z.string().uuid(),
      username: usernameSchema.optional(),
      password: z.string().min(8).max(72).optional(),
      full_name: z.string().optional(),
      phone: z.string().nullable().optional(),
      avatar_url: z.string().nullable().optional(),
      is_active: z.boolean().optional(),
      department_id: z.string().nullable().optional(),
      company_email: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { updateLocalUser } = await import("@/lib/local-users.server");
    updateLocalUser(data.user_id, {
      ...(data.username ? { username: data.username.toLowerCase() } : {}),
      ...(data.full_name ? { full_name: data.full_name } : {}),
      ...(data.password ? { password: data.password } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.avatar_url !== undefined ? { avatar_url: data.avatar_url } : {}),
      ...(data.is_active !== undefined ? { is_active: data.is_active } : {}),
      ...(data.department_id !== undefined ? { department_id: data.department_id } : {}),
      ...(data.company_email !== undefined ? { company_email: data.company_email } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
    });

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const profileUpdates: Record<string, any> = {};
      if (data.username) profileUpdates.username = data.username.toLowerCase();
      if (data.full_name) profileUpdates.full_name = data.full_name;
      if (data.phone !== undefined) profileUpdates.phone = data.phone;
      if (data.avatar_url !== undefined) profileUpdates.avatar_url = data.avatar_url;
      if (data.is_active !== undefined) profileUpdates.is_active = data.is_active;
      if (data.department_id !== undefined) profileUpdates.department_id = data.department_id;
      if (data.company_email !== undefined) profileUpdates.company_email = data.company_email;

      if (Object.keys(profileUpdates).length > 0) {
        await supabaseAdmin.from("profiles").update(profileUpdates).eq("id", data.user_id);
      }
      if (data.password) {
        await supabaseAdmin.auth.admin.updateUserById(data.user_id, { password: data.password });
      }
    } catch {}

    return { ok: true };
  });

/** Permanently deletes a user account. */
export const deleteUserAccount = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ user_id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { deleteLocalUser } = await import("@/lib/local-users.server");
    deleteLocalUser(data.user_id);

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.auth.admin.deleteUser(data.user_id);
      await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user_id);
      await supabaseAdmin.from("profiles").delete().eq("id", data.user_id);
    } catch {}

    return { ok: true };
  });
