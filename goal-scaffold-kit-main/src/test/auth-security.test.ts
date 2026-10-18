import { describe, it, expect } from "vitest";
import { OTP_TTL_MS, OTP_MAX_ATTEMPTS, OTP_COOLDOWN_MS, hashCode, randomCode } from "@/lib/auth-security.server";
import { maskEmail, templates } from "@/lib/email.server";

describe("one-time codes", () => {
  it("reset codes expire after 2 minutes", () => expect(OTP_TTL_MS.reset_password).toBe(2 * 60_000));
  it("allows at most 5 wrong attempts", () => expect(OTP_MAX_ATTEMPTS).toBe(5));
  it("waits a minute between code requests", () => expect(OTP_COOLDOWN_MS).toBe(60_000));
  it("codes are 6 digits", () => {
    for (let i = 0; i < 50; i++) expect(randomCode()).toMatch(/^\d{6}$/);
  });
  it("hash depends on salt and never equals the code", async () => {
    const a = await hashCode("s1", "123456");
    expect(a).not.toContain("123456");
    expect(a).not.toBe(await hashCode("s2", "123456"));
  });
});

describe("security emails", () => {
  it("login and password emails never include a code or password", () => {
    expect(templates.login("now").subject).toBe("New Login to Your Ritorica Account");
    expect(templates.passwordChanged().subject).toBe("Your Ritorica Password Has Been Changed");
  });
  it("masks addresses in logs", () => expect(maskEmail("jane.doe@acme.com")).toBe("ja***@acme.com"));
});

import { signInLink } from "@/lib/signin-domain";
describe("new-user sign-in link", () => {
  it("admins get the admin sign-in page", () => {
    expect(signInLink("admin", "https://app.example.com")).toBe("https://app.example.com/admin-login");
  });
  it("customers and agents get the user sign-in page", () => {
    expect(signInLink("customer", "https://app.example.com")).toBe("https://app.example.com/login");
  });
  it("preview addresses fall back to the live app", () => {
    expect(signInLink("agent", "https://id-preview--abc.lovable.app")).toBe("https://goal-scaffold-kit.lovable.app/login");
  });
});
