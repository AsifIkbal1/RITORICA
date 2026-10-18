import { z } from "zod";

/** Validation rules shared by the Contact and Request Demo forms. Error values are message keys. */
export const inquirySchema = z
  .object({
    kind: z.enum(["contact", "demo"]),
    full_name: z.string().trim().min(2, "name").max(120, "tooLong"),
    email: z.string().trim().email("email").max(255, "tooLong"),
    company: z.string().trim().min(1, "company").max(160, "tooLong"),
    phone: z.string().trim().max(40, "tooLong").optional().default(""),
    job_title: z.string().trim().max(120, "tooLong").optional().default(""),
    country: z.string().trim().min(2, "country").max(80, "tooLong"),
    volume: z.string().trim().max(60, "tooLong").optional().default(""),
    services: z.array(z.string().max(60)).max(20),
    integration: z.string().trim().max(2000, "tooLong").optional().default(""),
    message: z.string().trim().max(4000, "tooLong").optional().default(""),
    consent: z.literal(true, { errorMap: () => ({ message: "consent" }) }),
  })
  .superRefine((v, ctx) => {
    if (v.services.length === 0) {
      ctx.addIssue({ code: "custom", path: ["services"], message: v.kind === "demo" ? "services" : "service" });
    }
    if (v.kind === "contact" && v.message.length < 10) {
      ctx.addIssue({ code: "custom", path: ["message"], message: "message" });
    }
  });

export type InquiryInput = z.input<typeof inquirySchema>;
export type InquiryErrors = Partial<Record<keyof InquiryInput, string>>;

export function validateInquiry(input: InquiryInput) {
  const r = inquirySchema.safeParse(input);
  if (r.success) return { ok: true as const, data: r.data };
  const errors: InquiryErrors = {};
  for (const issue of r.error.issues) {
    const k = issue.path[0] as keyof InquiryInput;
    if (!errors[k]) errors[k] = issue.message;
  }
  return { ok: false as const, errors };
}
