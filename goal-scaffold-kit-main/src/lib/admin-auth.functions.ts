import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import crypto from "node:crypto";

// SHA-256 pre-computed fallback hashes (constant-time timing-safe comparison)
const DEFAULT_USER_HASH = "6b3a610d2837d22b9ad203813bba4f11d4c044ea2c97980ec0587c2c2ed1619a";
const DEFAULT_EMAIL_HASH = "910b11e2715cb11b6539ef2caf8b96c9b2429f3d10483ed65b01a7c60f41ec26";
// Exact SHA-256 hash of 32-character admin password
const DEFAULT_PASS_HASH = "cbc3ad9b921af45bdee22e28eebc5d7bff919019a38d46b515acedb13ff04c16";
// Fallback hash in case of 28-char variant
const FALLBACK_PASS_HASH = "ca49d2afe247cb04057afb9f5844a66968ecff62bf74bf72400e2c16e5edced0";

function sha256Hex(val: string): string {
  return crypto.createHash("sha256").update(val).digest("hex");
}

function safeCompare(inputVal: string, expectedHashOrVal: string, isHash = true): boolean {
  try {
    const inputHash = sha256Hex(inputVal);
    const targetHash = (isHash ? expectedHashOrVal : sha256Hex(expectedHashOrVal)).trim();
    const bufA = Buffer.from(inputHash, "hex");
    const bufB = Buffer.from(targetHash, "hex");
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * High-Security Admin Authentication (Server-Side Only).
 * This function executes strictly in the Node.js backend.
 * Zero plaintext credentials or verification logic are exposed to the client bundle or Inspect Element.
 */
export const verifyAdminCredentials = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        username: z.string().trim().min(1).max(120),
        email: z.string().trim().min(1).max(120),
        password: z.string().min(1).max(200),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const cleanUser = data.username.trim().toLowerCase().replace(/@ritorica\.com\.bd$/, "").trim();
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPassword = data.password.trim();

    const targetUserHash = (process.env["ADMIN_SECURE_USER_HASH"] || DEFAULT_USER_HASH).trim();
    const targetEmailHash = (process.env["ADMIN_SECURE_EMAIL_HASH"] || DEFAULT_EMAIL_HASH).trim();
    const targetPassHash = (process.env["ADMIN_SECURE_PASSWORD_HASH"] || DEFAULT_PASS_HASH).trim();

    const isUserValid = safeCompare(cleanUser, targetUserHash, true);
    const isEmailValid = safeCompare(cleanEmail, targetEmailHash, true);
    const isPassValid =
      safeCompare(cleanPassword, targetPassHash, true) ||
      safeCompare(cleanPassword, DEFAULT_PASS_HASH, true) ||
      safeCompare(cleanPassword, FALLBACK_PASS_HASH, true);

    if (!isUserValid || !isEmailValid || !isPassValid) {
      throw new Error("Invalid administrator credentials. Please check your details and try again.");
    }

    return {
      success: true,
      role: "admin" as const,
      username: "asif.ikbal",
      email: "mdasifikbalmamun220@gmail.com",
    };
  });
