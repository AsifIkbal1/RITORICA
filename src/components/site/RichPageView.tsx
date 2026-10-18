import { PricingLink } from "@/components/site/PricingLink";
import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import heroImage from "@/assets/brand/hero-image.webp";
import smsIcon from "@/assets/brand/sms-icon.webp";
import viberIcon from "@/assets/brand/viber-icon.webp";
import whatsappIcon from "@/assets/brand/whatsapp-icon.webp";
import telegramIcon from "@/assets/brand/telegram-icon.webp";
import pushIcon from "@/assets/brand/in-app-push-notifications-icon.webp";
import voiceIcon from "@/assets/brand/voice-code-icon.webp";
import { Button } from "@/components/ui/button";
import { useT, type L } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { PageHero, Section } from "@/components/site/blocks";
import { groupLabel, type RichPage } from "@/content/pages";
import { DeveloperPageView } from "@/components/site/DeveloperPageView";
import type { Cell, PageSection } from "@/content/pages/types";

const heroIcons: Record<string, string> = {
  "products/sms-mailing": smsIcon,
  "products/push-platform": pushIcon,
  "products/verify-otp": voiceIcon,
  "channels/sms": smsIcon,
  "channels/whatsapp-business": whatsappIcon,
  "channels/app-push": pushIcon,
  "channels/telegram-gateway": telegramIcon,
  "channels/viber-business": viberIcon,
  "channels/viber-bots": viberIcon,
};

/** Approved company facts only (see project memory) — never the figures from individual source pages. */
const trustStats: { value: L; label: L }[] = [
  { value: { en: "20+ Years", bn: "২০+ বছর" }, label: { en: "of expertise in enterprise communications", bn: "এন্টারপ্রাইজ যোগাযোগে অভিজ্ঞতা" } },
  { value: { en: "12 Billion+", bn: "১২ বিলিয়ন+" }, label: { en: "messages delivered in 2025", bn: "২০২৫ সালে পৌঁছানো মেসেজ" } },
  { value: { en: "500+", bn: "৫০০+" }, label: { en: "direct connections to mobile operators", bn: "মোবাইল অপারেটরের সাথে সরাসরি সংযোগ" } },
  { value: { en: "99.99%", bn: "৯৯.৯৯%" }, label: { en: "uptime via redundant infrastructure", bn: "রিডান্ড্যান্ট অবকাঠামোয় আপটাইম" } },
];

function useCell() {
  const t = useT();
  return (c: Cell) => (typeof c === "string" ? c : t(c));
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((x) => (
        <li key={x} className="flex gap-2.5 text-sm">
          <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-2.5" /></span>
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionBody({ s }: { s: PageSection }) {
  const t = useT();
  const cell = useCell();
  switch (s.kind) {
    case "features":
      if (s.style === "tiles")
        return (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.items.map((it, i) => (
              <div key={i} className="feature-tile min-h-48 p-6">
                {it.tag && <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-80">{t(it.tag)}</p>}
                <h3 className="text-lg font-semibold leading-snug">{t(it.title)}</h3>
                {it.text && <p className="mt-3 text-sm leading-relaxed opacity-85">{t(it.text)}</p>}
                {it.points && <ul className="mt-3 list-disc space-y-1 pl-5 text-sm opacity-90">{t(it.points).map((p) => <li key={p}>{p}</li>)}</ul>}
                <span className="feature-tile-number" aria-hidden>{i + 1}</span>
              </div>
            ))}
          </div>
        );
      return (
        <div className={`grid gap-5 sm:grid-cols-2 ${s.items.length % 3 === 0 || s.items.length > 4 ? "lg:grid-cols-3" : ""}`}>
          {s.items.map((it, i) => (
            <article key={i} className="surface-card p-6">
              {it.tag && <p className="eyebrow mb-2">{t(it.tag)}</p>}
              <h3 className="text-lg font-semibold">{t(it.title)}</h3>
              {it.text && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(it.text)}</p>}
              {it.points && <Bullets items={t(it.points)} />}
            </article>
          ))}
        </div>
      );
    case "list":
      return (
        <div className="surface-card p-8">
          <ul className="grid gap-3 sm:grid-cols-2">
            {t(s.items).map((x) => (
              <li key={x} className="flex gap-3 text-[15px]">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-3" /></span>
                {x}
              </li>
            ))}
          </ul>
        </div>
      );
    case "steps":
      return (
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {s.items.map((it, i) => (
            <li key={i} className="surface-card relative p-6">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
              <h3 className="mt-4 font-semibold leading-snug">{t(it.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(it.text)}</p>
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="surface-card overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-primary-soft text-foreground">
              <tr>{s.head.map((h, i) => <th key={i} scope="col" className="px-4 py-3 font-semibold">{cell(h)}</th>)}</tr>
            </thead>
            <tbody>
              {s.rows.map((r, i) => (
                <tr key={i} className="border-t border-border align-top">
                  {r.map((c, j) => <td key={j} className={`px-4 py-3 ${j === 0 ? "font-medium" : "text-muted-foreground"}`}>{cell(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "code":
      return (
        <div className="space-y-5">
          {s.blocks.map((b, i) => (
            <figure key={i} className="overflow-hidden rounded-2xl border border-border">
              <figcaption className="bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground">{t(b.label)}</figcaption>
              <pre className="overflow-x-auto bg-foreground p-4 text-[13px] leading-relaxed text-background"><code>{b.code}</code></pre>
            </figure>
          ))}
        </div>
      );
    case "text":
      return (
        <div className="surface-card space-y-4 p-8 text-[15px] leading-relaxed text-muted-foreground">
          {s.paragraphs.map((p, i) => <p key={i}>{t(p)}</p>)}
        </div>
      );
    case "stats":
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {s.items.map((it, i) => (
            <div key={i} className="surface-card p-6">
              <p className="heading-brand text-3xl">{t(it.value)}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t(it.label)}</p>
            </div>
          ))}
        </div>
      );
    case "articles":
      return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {s.items.map((it, i) => (
            <article key={i} className="surface-card flex flex-col p-6">
              {it.tag && <span className="w-fit rounded-full bg-primary-soft px-2.5 py-1 text-xs font-medium text-accent-foreground">{t(it.tag)}</span>}
              <h3 className="mt-4 text-lg font-semibold leading-snug">{t(it.title)}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{t(it.text)}</p>
              {it.meta && <p className="mt-4 text-xs font-medium text-muted-foreground">{t(it.meta)}</p>}
            </article>
          ))}
        </div>
      );
    case "faq":
      return (
        <div className="space-y-3">
          {s.items.map((it, i) => (
            <details key={i} className="surface-card group p-5">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">{t(it.q)}</summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(it.a)}</p>
            </details>
          ))}
        </div>
      );
  }
}

export function RichPageView({ page }: { page: RichPage }) {
  const t = useT();
  if (page.dev) return <DeveloperPageView page={page} dev={page.dev} />;
  const icon = heroIcons[`${page.group}/${page.slug}`];
  const toc = page.group === "developers" ? page.sections.filter((s) => s.id) : [];
  return (
    <>
      <PageHero
        crumbs={[{ label: t(groupLabel[page.group]) }, { label: t(page.name) }]}
        {...(page.eyebrow ? { eyebrow: t(page.eyebrow) } : {})}
        title={t(page.title)}
        text={t(page.intro)}
        actions={
          <>
            <Button asChild variant="brand" size="lg"><PricingLink>{t(ui.cta.demo)}</PricingLink></Button>
            {page.highlight && <p className="mt-5 text-sm font-medium text-muted-foreground">{t(page.highlight)}</p>}
          </>
        }
        visual={
          icon ? (
            <div className="flex h-full items-center justify-center p-10">
              <div className="surface-card flex size-48 items-center justify-center rounded-3xl"><img src={icon} alt="" className="size-28 object-contain" /></div>
            </div>
          ) : (
            <img src={heroImage} alt="" className="absolute inset-0 size-full object-cover" />
          )
        }
      />

      {toc.length > 0 && (
        <nav aria-label={t({ en: "On this page", bn: "এই পেজে" })} className="container-site pt-8">
          <div className="surface-card flex flex-wrap items-center gap-2 p-4">
            <span className="mr-2 text-sm font-semibold">{t({ en: "On this page", bn: "এই পেজে" })}:</span>
            {toc.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="rounded-full bg-primary-soft px-3 py-1 text-sm text-accent-foreground hover:text-primary">{t(s.title)}</a>
            ))}
          </div>
        </nav>
      )}

      {page.sections.map((s, i) => (
        <Section key={i} {...(s.id ? { id: s.id } : {})} title={t(s.title)} {...("intro" in s && s.intro ? { intro: t(s.intro) } : {})} className="scroll-mt-24">
          <SectionBody s={s} />
        </Section>
      ))}

      {page.trust !== false && (
        <Section
          title={t({ en: "Why Businesses Trust Ritorica", bn: "ব্যবসাগুলো কেন Ritorica-কে বিশ্বাস করে" })}
          intro={t({
            en: "Ritorica is a leading international provider of business communication solutions, trusted by enterprises and organizations worldwide. We are an official GSMA member and Meta Business Partner.",
            bn: "Ritorica ব্যবসায়িক যোগাযোগ সমাধানের একটি শীর্ষস্থানীয় আন্তর্জাতিক প্রতিষ্ঠান, বিশ্বজুড়ে এন্টারপ্রাইজ ও প্রতিষ্ঠানের আস্থাভাজন। আমরা GSMA-র অফিসিয়াল সদস্য ও Meta Business Partner।",
          })}
        >
          <SectionBody s={{ kind: "stats", title: { en: "", bn: "" }, items: trustStats }} />
        </Section>
      )}

      <section className="container-site pt-20">
        <div className="feature-tile flex flex-col items-start gap-6 p-10 sm:p-14 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl">{t(page.cta?.title ?? ui.cta.finalTitle)}</h2>
            <p className="mt-3 opacity-85">{t(page.cta?.text ?? ui.cta.finalText)}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="onDark" size="lg"><PricingLink>{t(ui.cta.demo)}</PricingLink></Button>
            <Button asChild variant="onDark" size="lg"><Link to="/contact">{t(ui.cta.contact)}</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
