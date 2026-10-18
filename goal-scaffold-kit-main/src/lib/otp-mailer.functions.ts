import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import nodemailer from "nodemailer";

export const sendAdminEmailOtp = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({
      email: z.string().trim().email(),
      code: z.string().regex(/^\d{6}$/),
    }).parse(d)
  )
  .handler(async ({ data }) => {
    const user = process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_PASS;

    if (user && pass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user, pass },
        });

        await transporter.sendMail({
          from: `"Ritorica Support" <${user}>`,
          to: data.email,
          subject: "Your 6-Digit Admin Verification Code - Ritorica",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #1e3a8a; margin-top: 0; font-size: 20px;">Ritorica Admin 2FA Verification</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.5;">You requested an administrator login code for Ritorica Support Desk.</p>
              <div style="background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 8px; padding: 18px; text-align: center; margin: 24px 0;">
                <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #1d4ed8; font-family: monospace;">${data.code}</span>
              </div>
              <p style="color: #64748b; font-size: 13px;">This code is valid for <strong>30 seconds</strong>. Do not share this code with anyone.</p>
              <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
              <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">Ritorica CPaaS & Support Desk System</p>
            </div>
          `,
          text: `Your Ritorica Admin verification code is: ${data.code}. Valid for 30 seconds.`,
        });

        console.log(`[EMAIL DISPATCH] Real email sent to ${data.email} with code ${data.code}`);
        return { ok: true, delivered: true };
      } catch (err) {
        console.error("[EMAIL DISPATCH ERROR]", err);
        return { ok: false, error: (err as Error).message };
      }
    } else {
      console.log(`\n======================================================`);
      console.log(`📧 [ADMIN OTP SENT TO EMAIL: ${data.email}]`);
      console.log(`6-Digit Verification Code: ${data.code}`);
      console.log(`(Configure SMTP_USER & SMTP_PASS in .env to send via Gmail SMTP)`);
      console.log(`======================================================\n`);
      return { ok: true, delivered: false, simulated: true };
    }
  });
