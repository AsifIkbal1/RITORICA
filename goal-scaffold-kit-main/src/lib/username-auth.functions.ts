import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { DOMAIN_ERROR, parseSignInEmail, SIGNIN_SUFFIX } from "@/lib/signin-domain";

/**
 * Public (signed-out) auth helpers. Two sign-in pages:
 *  - user page: plain username (no domain); admins are refused there
 *  - admin page: <username>@ritorica.com.bd; only admins/super admins are accepted
 * Real account emails are never returned.
 */

const username = z.string().trim().min(2).max(80);
const GENERIC_LOGIN_ERROR = "Incorrect username or password.";

async function findUser(identifier: string) {
  const local = parseSignInEmail(identifier);
  if (!local) throw new Error(DOMAIN_ERROR);
  const { findLocalUserByUsername } = await import("@/lib/local-users.server");
  const localUser = findLocalUserByUsername(local);

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id, email, username, is_active, last_login_at, must_change_password, company_email, company_email_verified_at")
    .eq("username", local)
    .maybeSingle();
}

type LoginAttempt = { count: number; lockedUntil: number; firstFailedAt: number };
const loginAttempts = new Map<string, LoginAttempt>();

export const signInWithUsername = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ username, password: z.string().min(1).max(200), portal: z.enum(["user", "admin"]).default("user") }).parse(d),
  )
  .handler(async ({ data }) => {
    const sec = await import("@/lib/auth-security.server");
    const mail = await import("@/lib/email.server");
    const hasAt = data.username.includes("@");
    if (data.portal === "user" && hasAt) throw new Error("Enter only your username, without any @domain.");
    if (data.portal === "admin" && !hasAt) throw new Error(`Admins sign in with their full ${SIGNIN_SUFFIX} address.`);

    const local = parseSignInEmail(data.username);
    if (!local) throw new Error(DOMAIN_ERROR);

    // Rate-limit brute force attempts: max 5 failed attempts within 15 minutes
    const now = Date.now();
    const attemptKey = local.toLowerCase();
    const rec = loginAttempts.get(attemptKey);
    if (rec && rec.lockedUntil > now) {
      const remainingMin = Math.ceil((rec.lockedUntil - now) / 60000);
      throw new Error(`Account temporarily locked due to too many failed sign-in attempts. Please try again in ${remainingMin} minute(s).`);
    }

    // Check local accounts first
    const { findLocalUserByUsername, verifyPassword, updateLocalUser } = await import("@/lib/local-users.server");
    const localUser = findLocalUserByUsername(local);
    if (localUser && localUser.password) {
      if (!localUser.is_active) {
        throw new Error("This account is disabled. Please contact your administrator.");
      }

      const isValidPassword = verifyPassword(data.password, localUser.password, (upgraded) => {
        updateLocalUser(localUser.id, { password: upgraded });
      });

      if (!isValidPassword) {
        const curAttempts = (rec?.count || 0) + 1;
        const isLocked = curAttempts >= 5;
        loginAttempts.set(attemptKey, {
          count: curAttempts,
          lockedUntil: isLocked ? now + 15 * 60 * 1000 : 0,
          firstFailedAt: rec?.firstFailedAt || now,
        });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await sec.audit(supabaseAdmin, {
          userId: localUser.id,
          username: local,
          action: "auth.login_failed",
          status: "failure",
          description: "Failed sign-in attempt (incorrect password)",
          error: isLocked ? "Account locked after 5 failed attempts" : "Wrong password",
        });

        throw new Error(isLocked ? "Account temporarily locked due to 5 failed sign-in attempts. Please try again in 15 minutes." : GENERIC_LOGIN_ERROR);
      }

      // Check portal access
      const isAdmin = localUser.roles?.some((r) => r === "admin" || r === "super_admin");
      if (data.portal !== (isAdmin ? "admin" : "user")) {
        throw new Error(isAdmin ? "Administrators sign in on the admin sign-in page." : "Please use the user sign-in page.");
      }

      // Successful login - clear rate limit
      loginAttempts.delete(attemptKey);

      // Record audit log
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await sec.audit(supabaseAdmin, {
        userId: localUser.id,
        username: local,
        action: "auth.login_success",
        status: "success",
        description: `Signed in as ${localUser.username} (${localUser.roles?.[0] || "user"})`,
      });

      const role = localUser.roles?.[0] || "agent";
      updateLocalUser(localUser.id, { last_login_at: new Date().toISOString() });

      return {
        access_token: `dev-mock-${role}-token`,
        refresh_token: "dev-mock-refresh",
        user: {
          id: localUser.id,
          username: localUser.username,
          email: localUser.email,
          role,
          must_change_password: !!localUser.must_change_password,
          company_email: localUser.company_email || null,
          company_email_verified_at: localUser.company_email_verified_at || null,
        },
      };
    }

    const { supabaseAdmin, user } = await findUser(data.username);
    const fail = async (reason: string, userId: string | null) => {
      await sec.audit(supabaseAdmin, { userId, username: local, action: "auth.login_failed", status: "failure",
        description: "Failed sign-in", error: reason });
    };
    if (!user || !user.email) { await fail("Unknown username", null); throw new Error(GENERIC_LOGIN_ERROR); }
    if (!user.is_active) { await fail("Account disabled", user.id); throw new Error("This account is disabled. Please contact your administrator."); }

    const url = process.env["SUPABASE_URL"];
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    if (!url || !key) throw new Error("Sign-in is not available right now.");
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: res, error } = await client.auth.signInWithPassword({ email: user.email, password: data.password });
    if (error || !res.session) { await fail("Wrong password", user.id); throw new Error(GENERIC_LOGIN_ERROR); }
    // Right password, wrong page: revoke the session just created and point to the correct page.
    const { data: roleRows } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", user.id);
    const isAdmin = (roleRows ?? []).some((r) => r.role === "admin" || r.role === "super_admin");
    if (data.portal !== (isAdmin ? "admin" : "user")) {
      await supabaseAdmin.auth.admin.signOut(res.session.access_token, "local");
      await fail(isAdmin ? "Admin used the user sign-in page" : "Non-admin used the admin sign-in page", user.id);
      throw new Error(isAdmin ? "Administrators sign in on the admin sign-in page." : "Please use the user sign-in page.");
    }

    const who = { userId: user.id, username: user.username };
    await supabaseAdmin.from("profiles").update({ last_login_at: new Date().toISOString() }).eq("id", user.id);
    if (!user.last_login_at) {
      await sec.audit(supabaseAdmin, { ...who, action: "auth.first_login", status: "success", description: "First sign-in" });
    }
    await sec.audit(supabaseAdmin, { ...who, action: "auth.login_success", status: "success", description: "Signed in" });
    // One alert per successful sign-in request, only to a verified company email.
    if (user.company_email && user.company_email_verified_at) {
      await sec.sendAndLog(supabaseAdmin, who, "login_alert", user.company_email, mail.templates.login(mail.formatWhen()));
    }
    return { access_token: res.session.access_token, refresh_token: res.session.refresh_token };
  });

const RESET_ACCEPTED = "If this account has a verified company email, a 6-digit code has been sent to it.";

/** Emails a 6-digit code (2-minute validity) to the account's verified company email only. */
export const requestResetCode = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ username }).parse(d))
  .handler(async ({ data }) => {
    const sec = await import("@/lib/auth-security.server");
    const mail = await import("@/lib/email.server");
    const { supabaseAdmin, user, local } = await findUser(data.username);
    if (!user || !user.is_active || !user.company_email || !user.company_email_verified_at || user.must_change_password) {
      await sec.audit(supabaseAdmin, { userId: user?.id ?? null, username: local, action: "auth.reset_requested", status: "failure",
        description: "Password reset requested", error: !user ? "Unknown username" : "No verified company email" });
      return { ok: true, message: RESET_ACCEPTED };
    }
    const who = { userId: user.id, username: user.username };
    let otp: { id: string; code: string };
    try {
      otp = await sec.issueOtp(supabaseAdmin, user.id, "reset_password", user.company_email);
    } catch (err) {
      await sec.audit(supabaseAdmin, { ...who, action: "auth.reset_requested", status: "failure", description: "Password reset requested", error: (err as Error).message });
      throw err;
    }
    const sent = await sec.sendAndLog(supabaseAdmin, who, "reset_code", user.company_email, mail.templates.resetCode(otp.code));
    if (!sent.ok) {
      await sec.voidOtp(supabaseAdmin, otp.id);
      await sec.audit(supabaseAdmin, { ...who, action: "auth.reset_requested", status: "failure", description: "Password reset requested", error: sent.error });
      throw new Error("We couldn't send the code right now. Please contact your administrator.");
    }
    await sec.audit(supabaseAdmin, { ...who, action: "auth.reset_requested", status: "success", description: "Password reset code sent to company email" });
    return { ok: true, message: RESET_ACCEPTED };
  });

export const resetPasswordWithCode = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ username, code: z.string().trim().regex(/^\d{6}$/), password: z.string().min(8).max(72) }).parse(d),
  )
  .handler(async ({ data }) => {
    const sec = await import("@/lib/auth-security.server");
    const mail = await import("@/lib/email.server");
    const invalid = "The code is wrong, expired or already used. Request a new code.";
    const { supabaseAdmin, user, local } = await findUser(data.username);
    if (!user) {
      await sec.audit(supabaseAdmin, { userId: null, username: local, action: "auth.otp_failed", status: "failure", description: "Reset code check", error: "Unknown username" });
      throw new Error(invalid);
    }
    const who = { userId: user.id, username: user.username };
    const check = await sec.checkOtp(supabaseAdmin, user.id, "reset_password", data.code);
    if (!check.ok) {
      await sec.audit(supabaseAdmin, { ...who, action: "auth.otp_failed", status: "failure", description: "Reset code check", error: check.reason });
      throw new Error(check.reason === "locked" ? "Too many wrong codes. Request a new code." : invalid);
    }
    await sec.audit(supabaseAdmin, { ...who, action: "auth.otp_verified", status: "success", description: "Reset code accepted" });

    const { updateLocalUser } = await import("@/lib/local-users.server");
    updateLocalUser(user.id, {
      password: data.password,
      password_changed_at: new Date().toISOString(),
    });

    try {
      await supabaseAdmin.auth.admin.updateUserById(user.id, { password: data.password });
      await supabaseAdmin.from("profiles").update({ password_changed_at: new Date().toISOString() }).eq("id", user.id);
    } catch {}

    await sec.audit(supabaseAdmin, { ...who, action: "auth.password_changed", status: "success", description: "Password changed via Forgot Password" });
    if (user.company_email) {
      await sec.sendAndLog(supabaseAdmin, who, "password_changed", user.company_email, mail.templates.passwordChanged());
    }
    return { ok: true };
  });

/** True only on a brand-new database with no accounts yet (used to show the first-admin form). */
export const needsFirstAdmin = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count } = await supabaseAdmin.from("profiles").select("id", { count: "exact", head: true });
  return { needed: (count ?? 0) === 0 };
});

/** Creates the very first account as Super Admin. Refused as soon as any account exists. */
export const createFirstAdmin = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      username: z.string().trim().toLowerCase().min(3).max(40).regex(/^[a-z0-9._-]+$/, "Username can use letters, numbers, dot, dash and underscore"),
      full_name: z.string().trim().min(2).max(120),
      password: z.string().min(8).max(72),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const sec = await import("@/lib/auth-security.server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin.from("profiles").select("id", { count: "exact", head: true });
    if ((count ?? 0) > 0) throw new Error("An administrator already exists. Please sign in.");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: `${data.username}@users.ritorica.invalid`,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.full_name, username: data.username },
    });
    if (error || !created.user) throw new Error(/password/i.test(error?.message ?? "") ? "This password is too easy to guess." : "Could not create the account.");
    await sec.audit(supabaseAdmin, { userId: created.user.id, username: data.username, action: "user.created", status: "success", description: `First Super Admin ${data.username} created` });
    return { ok: true };
  });
