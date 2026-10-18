import { describe, expect, it } from "vitest";
import { privacySections } from "@/content/privacy";
import { site } from "@/config/site";

const text = JSON.stringify(privacySections);

describe("Privacy Policy", () => {
  it("has the 11 sections of the ritorica.com policy, in order", () => {
    expect(privacySections.map((s) => s.h.en)).toEqual([
      "Who we are", "What we collect", "Why we use it", "Who we share it with", "International transfers",
      "How long we keep it", "Your rights", "Security", "Children", "Changes to this policy", "How to contact us",
    ]);
  });
  it("uses the site contact email, not the ritorica.eu address", () => {
    expect(text).toContain(site.email);
    expect(text).not.toContain("ritorica.eu");
  });
  it("names only the Bangladesh office (no Cyprus / UAE)", () => {
    expect(text).not.toMatch(/Cyprus|Nicosia|Dubai|Emirates/);
  });
  it("enquiries are kept up to 24 months; rights requests answered within 30 days", () => {
    expect(text).toContain("Up to 24 months");
    expect(text).toContain("within 30 days");
  });
  it("every section has Bangla text", () => {
    for (const s of privacySections) expect(s.h.bn.length).toBeGreaterThan(1);
  });
});
