import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const updateInput = z.object({
  userId: z.string(),
  full_name: z.string().optional(),
  phone: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  company_name: z.string().nullable().optional(),
  company_website: z.string().nullable().optional(),
});

export const updateMyProfileFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => updateInput.parse(d))
  .handler(async ({ data }) => {
    try {
      const { updateLocalUser } = await import("./local-users.server");
      updateLocalUser(data.userId, {
        ...(data.full_name ? { full_name: data.full_name } : {}),
        phone: data.phone,
        avatar_url: data.avatar_url,
        company_name: data.company_name,
      });
    } catch {}

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin
        .from("profiles")
        .update({
          ...(data.full_name ? { full_name: data.full_name } : {}),
          phone: data.phone || null,
          avatar_url: data.avatar_url || null,
          company_name: data.company_name || null,
          company_website: data.company_website || null,
        })
        .eq("id", data.userId);
    } catch {}

    try {
      const { recordActivityLog } = await import("./activity-logs.server");
      recordActivityLog({
        user_id: data.userId,
        user_name: data.full_name,
        action: "profile.updated",
        entity_type: "user",
        entity_id: data.userId,
        description: `Profile information and avatar updated`,
      });
    } catch {}

    return { ok: true, avatar_url: data.avatar_url };
  });
