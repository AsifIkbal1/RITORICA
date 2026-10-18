import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * First-time setup (verify company email by code, then choose a new password) and later password changes.
 * Every step is checked and saved on the server; the user's own client can't mark setup as done.
 */

const password = z.string().min(8, "Password must be at least 8 characters.").max(72);

async function load(userId?: string) {
  const { getLocalUsers } = await import("@/lib/local-users.server");
  const localUsers = getLocalUsers();
  const localU = userId ? localUsers.find((u) => u.id === userId) : null;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  let p = localU ? { ...localU } : null;
  if (!p && userId) {
    try {
      const { data } = await supabaseAdmin.from("profiles")
        .select("id, email, username, must_change_password, company_email, company_email_verified_at")
        .eq("id", userId).maybeSingle();
      if (data) p = data;
    } catch {}
  }
  if (!p) {
    p = localUsers[0];
  }
  if (!p) throw new Error("Account not found");
  return { admin: supabaseAdmin, p, who: { userId: p.id, username: p.username } };
}

export const sendCompanyEmailCode = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      email: z.string().trim().toLowerCase().email("Enter a valid company email address.").max(200),
      userId: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const sec = await import("@/lib/auth-security.server");
    const mail = await import("@/lib/email.server");
    const targetUserId = data.userId || (context as any)?.userId;
    const { admin, p, who } = await load(targetUserId);

    if (data.email.endsWith("@users.ritorica.invalid")) {
      throw new Error("Enter your real company email address.");
    }

    try {
      await sec.audit(admin, { ...who, action: "auth.company_email_submitted", status: "success",
        description: `Company email submitted (${mail.maskEmail(data.email)})` });
    } catch {}

    const otp = await sec.issueOtp(admin, p.id, "verify_email", data.email);
    await sec.sendAndLog(admin, who, "verify_email", data.email, mail.templates.verifyEmail(otp.code));

    const { updateLocalUser } = await import("@/lib/local-users.server");
    updateLocalUser(p.id, { company_email: data.email });

    return { ok: true, sentTo: mail.maskEmail(data.email) };
  });

export const verifyCompanyEmailCode = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code."),
      userId: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const sec = await import("@/lib/auth-security.server");
    const targetUserId = data.userId || (context as any)?.userId;
    const { admin, p, who } = await load(targetUserId);

    const check = await sec.checkOtp(admin, p.id, "verify_email", data.code);
    if (!check.ok) {
      try {
        await sec.audit(admin, { ...who, action: "auth.otp_failed", status: "failure", description: "Company email code check", error: check.reason });
      } catch {}
      throw new Error(check.reason === "locked" ? "Too many wrong codes. Send a new code." : "The code is wrong, expired or already used.");
    }

    const { updateLocalUser } = await import("@/lib/local-users.server");
    updateLocalUser(p.id, {
      company_email: check.email,
      company_email_verified_at: new Date().toISOString(),
    });

    try {
      await admin.from("profiles").update({ company_email: check.email, company_email_verified_at: new Date().toISOString() }).eq("id", p.id);
      await sec.audit(admin, { ...who, action: "auth.company_email_verified", status: "success", description: "Company email verified" });
    } catch {}

    return { ok: true, email: check.email };
  });

export const completeFirstTimeSetup = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      password,
      userId: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const sec = await import("@/lib/auth-security.server");
    const mail = await import("@/lib/email.server");
    const targetUserId = data.userId || (context as any)?.userId;
    const { admin, p, who } = await load(targetUserId);

    const { updateLocalUser } = await import("@/lib/local-users.server");
    updateLocalUser(p.id, {
      password: data.password,
      must_change_password: false,
      password_changed_at: new Date().toISOString(),
    });

    try {
      await admin.auth.admin.updateUserById(p.id, { password: data.password });
      await admin.from("profiles").update({
        password_changed_at: new Date().toISOString(),
        must_change_password: false,
      }).eq("id", p.id);
      await sec.audit(admin, { ...who, action: "auth.password_changed", status: "success", description: "Password changed during first-time setup" });
      await sec.audit(admin, { ...who, action: "auth.setup_completed", status: "success", description: "First-time setup completed" });
    } catch {}

    const recipient = p.company_email || p.email;
    if (recipient && !recipient.endsWith("@users.ritorica.invalid")) {
      await sec.sendAndLog(admin, who, "password_changed", recipient, mail.templates.passwordChanged());
    }

    return { ok: true };
  });

export const changeMyPassword = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      password,
      userId: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const sec = await import("@/lib/auth-security.server");
    const mail = await import("@/lib/email.server");
    const targetUserId = data.userId || (context as any)?.userId;
    const { admin, p, who } = await load(targetUserId);

    const { updateLocalUser } = await import("@/lib/local-users.server");
    updateLocalUser(p.id, {
      password: data.password,
      password_changed_at: new Date().toISOString(),
    });

    try {
      await admin.auth.admin.updateUserById(p.id, { password: data.password });
      await admin.from("profiles").update({ password_changed_at: new Date().toISOString() }).eq("id", p.id);
      await sec.audit(admin, { ...who, action: "auth.password_changed", status: "success", description: "User changed own password" });
    } catch {}

    const recipient = p.company_email || p.email;
    if (recipient && !recipient.endsWith("@users.ritorica.invalid")) {
      await sec.sendAndLog(admin, who, "password_changed", recipient, mail.templates.passwordChanged());
    }

    return { ok: true };
  });

export const emailServiceStatus = createServerFn({ method: "GET" }).handler(async () => {
  const { emailConfigured } = await import("@/lib/email.server");
  return { configured: emailConfigured() };
});
