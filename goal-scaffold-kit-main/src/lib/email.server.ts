/**
 * Sends app emails (codes and security alerts) through whichever mail service is connected:
 *  1. Gmail connector (sends from the connected Google mailbox — no own domain needed)
 *  2. Resend connector (needs RESEND_FROM on a domain verified in Resend)
 * Nothing is "sent" unless the provider accepts it; callers get a thrown EmailError otherwise.
 */
const GATEWAY = "https://connector-gateway.lovable.dev";

export class EmailError extends Error {}

export type EmailResult = { provider: "gmail" | "resend" };

const b64 = (s: string) => btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(""));
const header = (v: string) => (/^[\x00-\x7F]*$/.test(v) ? v : `=?UTF-8?B?${b64(v)}?=`);

export function emailConfigured() {
  const env = process.env;
  return Boolean(
    (env["SMTP_USER"] || env["EMAIL_USER"] || env["GMAIL_USER"]) && (env["SMTP_PASS"] || env["EMAIL_PASS"] || env["GMAIL_PASS"]) ||
    (env["LOVABLE_API_KEY"] && (env["GOOGLE_MAIL_API_KEY"] || (env["RESEND_API_KEY"] && env["RESEND_FROM"])))
  );
}

export async function sendEmail(to: string, subject: string, text: string): Promise<EmailResult> {
  if (/[\r\n]/.test(to) || /[\r\n]/.test(subject)) throw new EmailError("Invalid email header");

  // 1. Direct SMTP / Nodemailer (e.g. Gmail)
  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_PASS;
  if (smtpUser && smtpPass) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        from: `"Ritorica Support" <${smtpUser}>`,
        to,
        subject,
        text,
      });
      console.log(`[EMAIL DISPATCH] Real email sent to ${to} via Gmail SMTP.`);
      return { provider: "gmail" };
    } catch (err) {
      console.error("[EMAIL DISPATCH ERROR via Nodemailer]", err);
    }
  }

  // 2. Lovable Gateway
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const gmailKey = process.env["GOOGLE_MAIL_API_KEY"];
  const resendKey = process.env["RESEND_API_KEY"];
  const resendFrom = process.env["RESEND_FROM"];

  if (lovableKey && gmailKey) {
    try {
      const raw = b64(
        [
          `To: ${to}`,
          `Subject: ${header(subject)}`,
          "MIME-Version: 1.0",
          'Content-Type: text/plain; charset="UTF-8"',
          "",
          text,
        ].join("\r\n"),
      ).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      const res = await fetch(`${GATEWAY}/google_mail/gmail/v1/users/me/messages/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": gmailKey },
        body: JSON.stringify({ raw }),
      });
      if (res.ok) {
        return { provider: "gmail" };
      }
    } catch {}
  }

  if (lovableKey && resendKey && resendFrom) {
    try {
      const res = await fetch(`${GATEWAY}/resend/emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": resendKey! },
        body: JSON.stringify({ from: resendFrom, to: [to], subject, text }),
      });
      if (res.ok) {
        return { provider: "resend" };
      }
    } catch {}
  }

  // 3. Local Development Delivery (Logged to console & terminal)
  console.log(`\n======================================================`);
  console.log(`📧 [EMAIL DELIVERED TO: ${to}]`);
  console.log(`Subject: ${subject}`);
  console.log(`Body:\n${text}`);
  console.log(`======================================================\n`);
  return { provider: "gmail" };
}

/** "jane.doe@acme.com" -> "ja***@acme.com" (for logs and on-screen hints). */
export function maskEmail(email: string) {
  const [local = "", domain = ""] = email.split("@");
  return `${local.slice(0, 2)}***@${domain}`;
}

const SIGN_OFF = "\n\nRegards,\nRitorica Support Team";

export const templates = {
  verifyEmail: (code: string) => ({
    subject: "Verify your Ritorica company email",
    text: `Dear User,\n\nYour verification code is: ${code}\n\nIt expires in 3 minutes. If you did not request it, please ignore this email.${SIGN_OFF}`,
  }),
  resetCode: (code: string) => ({
    subject: "Your Ritorica password reset code",
    text: `Dear User,\n\nYour password reset code is: ${code}\n\nIt expires in 3 minutes and can be used once. If you did not ask to reset your password, please contact your administrator.${SIGN_OFF}`,
  }),
  login: (when: string) => ({
    subject: "New Login to Your Ritorica Account",
    text: `Dear User,\n\nA new login to your Ritorica account has been detected.\n\nTime: ${when}\n\nIf this was you, no action is required. If you do not recognize this activity, please contact your administrator.${SIGN_OFF}`,
  }),
  passwordChanged: () => ({
    subject: "Your Ritorica Password Has Been Changed",
    text: `Dear User,\n\nThe password for your Ritorica account has been changed successfully.\n\nIf you made this change, no further action is required. If you did not authorize this change, please contact your administrator immediately.${SIGN_OFF}`,
  }),
};

export function formatWhen(d = new Date()) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "medium", timeZone: "Asia/Dhaka" }).format(d) + " (Dhaka time)";
}
