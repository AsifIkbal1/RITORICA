import { describe, it, expect } from "vitest";
import { pricePlans, formatBdt } from "@/content/pricing";
import { validateInquiry } from "@/lib/inquiry";

const base = { kind: "demo" as const, full_name: "Asif Ikbal", email: "a@b.com", company: "Acme", country: "Bangladesh", services: ["sms"], consent: true as const };

describe("pricing", () => {
  it("masking SMS starts at ৳0.48", () => expect(pricePlans.find((p) => p.id === "masking")!.fromBdt).toBe(0.48));
  it("non-masking SMS starts at ৳0.25", () => expect(pricePlans.find((p) => p.id === "non-masking")!.fromBdt).toBe(0.25));
  it("OTP SMS starts at ৳0.35", () => expect(pricePlans.find((p) => p.id === "otp")!.fromBdt).toBe(0.35));
  it("location SMS starts at ৳0.26", () => expect(pricePlans.find((p) => p.id === "location")!.fromBdt).toBe(0.26));
  it("formats Bangla digits", () => expect(formatBdt(0.48, "bn")).toBe("৳০.৪৮"));
});

describe("inquiry form", () => {
  it("accepts a valid demo request", () => expect(validateInquiry(base).ok).toBe(true));
  it("requires privacy consent", () => {
    const r = validateInquiry({ ...base, consent: false as unknown as true });
    expect(r.ok ? null : r.errors.consent).toBe("consent");
  });
  it("requires a valid email", () => {
    const r = validateInquiry({ ...base, email: "bad" });
    expect(r.ok ? null : r.errors.email).toBe("email");
  });
  it("demo needs at least one service", () => {
    const r = validateInquiry({ ...base, services: [] });
    expect(r.ok ? null : r.errors.services).toBe("services");
  });
  it("contact needs a message of 10+ characters", () => {
    const r = validateInquiry({ ...base, kind: "contact", message: "hi" });
    expect(r.ok ? null : r.errors.message).toBe("message");
  });
});
