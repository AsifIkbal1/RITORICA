import { describe, expect, it } from "vitest";
import { terms, termsCompany } from "@/content/terms";
import { buildAssistantInstructions } from "@/lib/assistant/knowledge";

const term = (title: string) => terms.find((t) => t.h.en === title)?.p.en ?? "";

describe("Terms & Conditions (client-supplied)", () => {
  it("has all 15 clauses in order", () => {
    expect(terms).toHaveLength(15);
    expect(terms[0]?.h.en).toBe("Minimum Monthly Traffic");
    expect(terms[14]?.h.en).toBe("Commercial Agreement");
  });
  it("minimum monthly traffic is 20,000 messages", () => {
    expect(term("Minimum Monthly Traffic")).toContain("20,000 messages");
  });
  it("services are prepaid", () => {
    expect(term("Payment Terms")).toContain("prepaid");
  });
  it("offer is valid for 30 days", () => {
    expect(term("Offer Validity")).toContain("30 days");
  });
  it("VAT is 15% on top of quoted prices", () => {
    expect(term("VAT and Additional Charges")).toContain("15% VAT");
  });
  it("payments go to the Bangladesh legal entity", () => {
    expect(termsCompany).toBe("Ritorica Information Technology Bangladesh Limited");
    expect(term("Payment Method")).toContain(termsCompany);
  });
  it("every clause has Bangla text", () => {
    for (const t of terms) expect(t.p.bn.length).toBeGreaterThan(10);
  });
});

describe("Website assistant instructions", () => {
  const text = buildAssistantInstructions("en");
  it("uses the published SMS prices", () => {
    expect(text).toContain("Masking SMS: from BDT 0.48");
    expect(text).toContain("Non-masking SMS: from BDT 0.25");
    expect(text).toContain("OTP SMS: from BDT 0.35");
    expect(text).toContain("Location-based SMS: from BDT 0.26");
  });
  it("knows the terms and the official contacts", () => {
    expect(text).toContain("20,000 messages");
    expect(text).toContain("info@ritorica.com.bd");
    expect(text).toContain("+880 (180) 599-1950");
  });
  it("falls back to Bangla when the site is in Bangla", () => {
    expect(buildAssistantInstructions("bn")).toContain("Bangla (Bengali script)");
  });
});

describe("Assistant name", () => {
  it("is called Asif, not Moustafa", async () => {
    const { ui } = await import("@/i18n/ui");
    expect(ui.chat.name.en).toBe("Asif — Ritorica Assistant");
    expect(ui.chat.welcome.bn).toContain("আমি Asif");
    expect(buildAssistantInstructions("en")).toContain("You are Asif");
    expect(buildAssistantInstructions("en")).not.toContain("Moustafa");
  });
});
