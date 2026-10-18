import { describe, it, expect } from "vitest";
import { navGroups, navLinks, navTrailingGroups } from "@/content/navigation";
import { site } from "@/config/site";
import { services } from "@/content/services";
import { richPages } from "@/content/pages";
import { pricePlans } from "@/content/pricing";

const labels = [...navGroups.map((g) => g.label.en), ...navLinks.map((l) => l.label.en), ...navTrailingGroups.map((g) => g.label.en)];
const items = navGroups.flatMap((g) => g.items);

describe("main menu", () => {
  it("follows the ritorica.com menu order", () =>
    expect(labels).toEqual(["Products", "Channels", "Solutions", "Resources", "Pricing", "Help Desk", "Company"]));
  it("Help Desk and Company carry the requested sub-menus", () => {
    const sub = (id: string) => navTrailingGroups.find((g) => g.id === id)!.items.map((i) => i.title.en);
    expect(sub("help-desk")).toEqual(["Open Ticket", "FAQ", "Noticeboard", "Contact Us", "Get Proposal"]);
    expect(sub("company")).toEqual(["Why Ritorica", "About Us", "Privacy Policy", "Terms of Service", "Document Acceptance Policy"]);
  });
  it("shows only the Bangladesh office address", () => expect(site.offices.map((o) => o.country.en)).toEqual(["Bangladesh"]));
  it("has no Coverage item", () => expect(labels).not.toContain("Coverage"));
  it("menu has no Developers, Refund Policy or Case Studies (client request)", () => {
    const all = [...navGroups, ...navTrailingGroups].flatMap((g) => g.items.map((i) => i.title.en));
    expect(labels).not.toContain("Developers");
    expect(all).not.toContain("Refund Policy");
    expect(all).not.toContain("Case Studies");
  });
  it("every detail link points at an existing page", () => {
    for (const i of items.filter((x) => x.params)) {
      const slug = i.params!["slug"]!;
      const group = i.to.split("/")[1];
      const ok = group === "services" ? services.some((s) => s.slug === slug) : richPages.some((p) => p.group === group && p.slug === slug);
      expect(ok, `${i.to} ${slug}`).toBe(true);
    }
  });
  it("each requested menu item opens its own page", () => {
    const requested = [
      "products/sms-mailing", "products/push-platform", "products/chat-platform", "products/cascaded-messaging", "products/verify-otp",
      "channels/sms", "channels/whatsapp-business", "channels/app-push", "channels/telegram-gateway", "channels/viber-business", "channels/email-business", "channels/viber-bots",
      "solutions/industry-solutions", "solutions/use-cases",
      "resources/blog", "resources/guides",
    ];
    const linked = items.filter((i) => i.params).map((i) => `${i.to.split("/")[1]}/${i.params!["slug"]}`);
    for (const r of requested) expect(linked).toContain(r);
  });
});

describe("client requests (file-12)", () => {
  it("Get Proposal opens the price section", () => {
    const gp = navTrailingGroups.flatMap((g) => g.items).find((i) => i.title.en === "Get Proposal")!;
    expect([gp.to, gp.hash]).toEqual(["/pricing", "pricing"]);
  });
  it("Blogs opens the Ritorica LinkedIn page", () => {
    const blog = navGroups.find((g) => g.id === "resources")!.items.find((i) => i.title.en === "Blogs")!;
    expect(blog.href).toBe("https://www.linkedin.com/company/ritorica/home/");
  });
  it("non-masking card no longer lists its old first point", () => {
    const nm = pricePlans.find((p) => p.id === "non-masking")!;
    expect(nm.features.map((f) => f.en)).not.toContain("Dedicated sender ID for all");
    expect(nm.features[0]!.en).toBe("Single, bulk & group SMS facility");
  });
});

describe("detail pages", () => {
  it("every page has English and Bengali title and intro", () => {
    for (const p of richPages) {
      expect(p.title.en && p.title.bn, p.slug).toBeTruthy();
      expect(p.intro.en && p.intro.bn, p.slug).toBeTruthy();
    }
  });
  it("never repeats the unapproved 25-year / 15-billion figures", () => {
    const text = JSON.stringify(richPages);
    expect(text).not.toMatch(/25 Years|15 Billion/i);
  });
});
