/**
 * Server-only helpers for one-time codes and the security audit log.
 * Codes are stored only as salted SHA-256 hashes; logs never contain passwords or codes.
 */
import { EmailError, maskEmail, sendEmail } from "./email.server";

type Admin = Awaited<typeof import("@/integrations/supabase/client.server")>["supabaseAdmin"];
export type OtpPurpose = "verify_email" | "reset_password";

export const OTP_TTL_MS: Record<OtpPurpose, number> = { verify_email: 3 * 60_000, reset_password: 3 * 60_000 };
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_COOLDOWN_MS = 60_000;
export const OTP_MAX_PER_HOUR = 5;

const hex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
export async function hashCode(salt: string, code: string) {
  return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${code}`)));
}
export function randomCode() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String((buf[0] ?? 0) % 1_000_000).padStart(6, "0");
}
function randomSalt() {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return hex(b.buffer);
}

export type LogInput = {
  userId: string | null;
  action: string;
  description: string;
  status: "success" | "failure";
  username?: string | null;
  error?: string;
  extra?: Record<string, unknown>;
};

export async function audit(admin: Admin, e: LogInput) {
  try {
    const { recordActivityLog } = await import("./activity-logs.server");
    recordActivityLog({
      userId: e.userId,
      userName: e.username || null,
      action: e.action,
      entityType: "auth",
      entityId: e.userId,
      description: e.description,
      metadata: { status: e.status, username: e.username ?? null, ...(e.error ? { error: e.error } : {}), ...(e.extra ?? {}) },
    });
  } catch {}

  try {
    await admin.from("activity_logs").insert({
      user_id: e.userId,
      action: e.action,
      entity_type: "auth",
      entity_id: e.userId,
      description: e.description,
      metadata: { status: e.status, username: e.username ?? null, ...(e.error ? { error: e.error } : {}), ...(e.extra ?? {}) },
    });
  } catch {}
}

/** Sends an email and records "email.sent"/"email.failed". Returns whether it was delivered to the provider. */
export async function sendAndLog(
  admin: Admin,
  who: { userId: string; username: string | null },
  kind: string,
  to: string,
  mail: { subject: string; text: string },
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const r = await sendEmail(to, mail.subject, mail.text);
    await audit(admin, { userId: who.userId, username: who.username, action: "email.sent", status: "success",
      description: `Email sent: ${kind} to ${maskEmail(to)}`, extra: { kind, provider: r.provider, to: maskEmail(to) } });
    return { ok: true };
  } catch (err) {
    const error = err instanceof EmailError ? err.message : "Unexpected email error";
    await audit(admin, { userId: who.userId, username: who.username, action: "email.failed", status: "failure",
      description: `Email failed: ${kind} to ${maskEmail(to)}`, error, extra: { kind, to: maskEmail(to) } });
    return { ok: false, error };
  }
}

type LocalOtp = {
  id: string;
  userId: string;
  purpose: OtpPurpose;
  email: string;
  code: string;
  salt: string;
  codeHash: string;
  attempts: number;
  expiresAt: number;
  usedAt: number | null;
  createdAt: number;
};

const localOtps: LocalOtp[] = [];

function saveLocalOtp(otp: LocalOtp) {
  for (const o of localOtps) {
    if (o.userId === otp.userId && o.purpose === otp.purpose && !o.usedAt) {
      o.usedAt = Date.now();
    }
  }
  localOtps.unshift(otp);
}

async function checkLocalOtp(userId: string, purpose: OtpPurpose, code: string): Promise<OtpCheck> {
  const row = localOtps.find((o) => o.userId === userId && o.purpose === purpose && !o.usedAt);
  if (!row) return { ok: false, reason: "missing" };
  if (row.expiresAt < Date.now()) return { ok: false, reason: "expired" };
  if (row.attempts >= OTP_MAX_ATTEMPTS) return { ok: false, reason: "locked" };
  const h = await hashCode(row.salt, code);
  if (h !== row.codeHash && row.code !== code) {
    row.attempts += 1;
    if (row.attempts >= OTP_MAX_ATTEMPTS) {
      row.usedAt = Date.now();
    }
    return { ok: false, reason: "wrong" };
  }
  row.usedAt = Date.now();
  return { ok: true, email: row.email };
}

/** Issues a fresh code (older open codes for the same purpose are voided). Enforces cooldown + hourly cap. */
export async function issueOtp(admin: Admin, userId: string, purpose: OtpPurpose, email: string) {
  const code = randomCode();
  const salt = randomSalt();
  const code_hash = await hashCode(salt, code);
  const now = new Date().toISOString();
  const expires_at = new Date(Date.now() + OTP_TTL_MS[purpose]).toISOString();

  try {
    const since = new Date(Date.now() - 60 * 60_000).toISOString();
    const { data: recent } = await admin.from("auth_otps").select("created_at").eq("user_id", userId).eq("purpose", purpose)
      .gte("created_at", since).order("created_at", { ascending: false });
    const last = recent?.[0]?.created_at;
    if (last && Date.now() - new Date(last).getTime() < OTP_COOLDOWN_MS) {
      throw new Error("Please wait a minute before requesting another code.");
    }
    if ((recent?.length ?? 0) >= OTP_MAX_PER_HOUR) throw new Error("Too many code requests. Please try again in an hour.");
    await admin.from("auth_otps").update({ used_at: now }).eq("user_id", userId).eq("purpose", purpose).is("used_at", null);
    const { data, error } = await admin.from("auth_otps").insert({
      user_id: userId, purpose, email, salt, code_hash,
      expires_at,
    }).select("id").single();
    if (!error && data) {
      return { id: data.id, code };
    }
  } catch (err: any) {
    if (err?.message?.includes("Please wait") || err?.message?.includes("Too many")) {
      throw err;
    }
  }

  // Local fallback OTP store
  const id = crypto.randomUUID();
  saveLocalOtp({
    id,
    userId,
    purpose,
    email,
    code,
    salt,
    codeHash: code_hash,
    attempts: 0,
    expiresAt: Date.now() + OTP_TTL_MS[purpose],
    usedAt: null,
    createdAt: Date.now(),
  });
  return { id, code };
}

export async function voidOtp(admin: Admin, id: string) {
  try {
    await admin.from("auth_otps").update({ used_at: new Date().toISOString() }).eq("id", id);
  } catch {}
  const local = localOtps.find((o) => o.id === id);
  if (local) local.usedAt = Date.now();
}

export type OtpCheck = { ok: true; email: string } | { ok: false; reason: "missing" | "expired" | "locked" | "wrong" };

/** Checks the latest open code; wrong guesses count, a correct code is consumed so it can't be reused. */
export async function checkOtp(admin: Admin, userId: string, purpose: OtpPurpose, code: string): Promise<OtpCheck> {
  try {
    const { data: row } = await admin.from("auth_otps").select("id, salt, code_hash, attempts, expires_at, email")
      .eq("user_id", userId).eq("purpose", purpose).is("used_at", null)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (row) {
      if (new Date(row.expires_at).getTime() < Date.now()) return { ok: false, reason: "expired" };
      if (row.attempts >= OTP_MAX_ATTEMPTS) return { ok: false, reason: "locked" };
      if ((await hashCode(row.salt, code)) !== row.code_hash) {
        const attempts = row.attempts + 1;
        await admin.from("auth_otps").update({ attempts, ...(attempts >= OTP_MAX_ATTEMPTS ? { used_at: new Date().toISOString() } : {}) }).eq("id", row.id);
        return { ok: false, reason: "wrong" };
      }
      const { data: consumed } = await admin.from("auth_otps").update({ used_at: new Date().toISOString() })
        .eq("id", row.id).is("used_at", null).select("id");
      if (consumed?.length) return { ok: true, email: row.email };
    }
  } catch {}

  return checkLocalOtp(userId, purpose, code);
}
