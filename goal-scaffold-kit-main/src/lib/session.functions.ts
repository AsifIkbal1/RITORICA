import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Keeps only the caller's current session alive: every other session of the
 * same user is signed out, so one username/password can be used in one place
 * at a time. Called right after sign-in with the current access token.
 */
export const enforceSingleSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ access_token: z.string().min(20).max(4096) }).parse(d))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // "others" revokes every session except the one owning this token.
    await supabaseAdmin.auth.admin.signOut(data.access_token, "others");
    await supabaseAdmin.from("profiles").update({ active_session_id: null }).eq("id", userId);
    return { ok: true };
  });
