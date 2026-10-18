import { PricingLink } from "@/components/site/PricingLink";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Check } from "lucide-react";
import type { PointerEvent, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useT, type L } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { services, type Service } from "@/content/services";
import { ServiceIconView } from "./ServiceIconView";
import { NetworkBackground } from "./NetworkBackground";

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = useT();
  return (
    <nav aria-label={t(ui.nav.breadcrumb)} className="mb-5 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        <li><Link to="/" className="hover:text-primary">{t(ui.nav.home)}</Link></li>
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight className="size-3.5" aria-hidden />
            {c.to ? <Link to={c.to} className="hover:text-primary">{c.label}</Link> : <span aria-current="page" className="text-foreground">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Ritorica-style hero: white rounded panel, brand-blue headline, optional visual on the right. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  subtitle,
  text,
  visual,
  actions = true,
}: {
  crumbs?: Crumb[];
  eyebrow?: string;
  title: string;
  subtitle?: string;
  text: string;
  visual?: ReactNode;
  actions?: boolean | ReactNode;
}) {
  const t = useT();
  return (
    <section className="container-site pt-8">
      <div className="surface-card relative isolate grid overflow-hidden lg:grid-cols-2">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="parallax absolute inset-0" style={{ ["--plx" as string]: "28px" }}>
            <div className="hero-glow -left-24 -top-24 size-[28rem]" />
          </div>
          <NetworkBackground className="[mask-image:linear-gradient(to_right,black_55%,transparent)]" />
        </div>
        <div className="p-8 sm:p-12 lg:p-14">
          {crumbs && <div className="fade-up"><Breadcrumbs items={crumbs} /></div>}
          {eyebrow && <p className="eyebrow fade-up mb-3">{eyebrow}</p>}
          <h1 className="heading-brand fade-up anim-d1 text-3xl leading-tight sm:text-4xl lg:text-[2.6rem]">{title}</h1>
          {subtitle && <p className="fade-up anim-d2 mt-3 text-2xl font-bold leading-snug text-foreground sm:text-3xl">{subtitle}</p>}
          <p className="fade-up anim-d3 mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{text}</p>
          {actions === true ? (
            <div className="fade-up anim-d4 mt-8 flex flex-wrap gap-3">
              <Button asChild variant="brand" size="lg"><PricingLink>{t(ui.cta.demo)}</PricingLink></Button>
              <Button asChild variant="brandOutline" size="lg"><Link to="/solutions">{t(ui.cta.explore)}</Link></Button>
            </div>
          ) : actions ? (
            <div className="fade-up anim-d4 mt-8">{actions}</div>
          ) : null}
        </div>
        {visual && <div className="fade-up anim-d2 relative min-h-64 overflow-hidden bg-primary-soft">{visual}</div>}
      </div>
    </section>
  );
}

export function Section({ id, title, intro, children, className = "" }: { id?: string; title?: string; intro?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`container-site pt-20 ${className}`}>
      {title && <h2 className="heading-brand text-3xl sm:text-4xl">{title}</h2>}
      {intro && <p className="mt-4 max-w-3xl text-muted-foreground">{intro}</p>}
      <div className={title || intro ? "mt-10" : ""}>{children}</div>
    </section>
  );
}

/** Split statement card ("What is …?") used on Ritorica pages. */
export function StatementCard({ title, lead, text }: { title: string; lead: string; text: string }) {
  return (
    <section className="container-site pt-12">
      <div className="surface-card grid gap-6 p-8 sm:p-12 md:grid-cols-[1fr_auto_1.4fr] md:items-center md:gap-10">
        <h2 className="heading-brand text-2xl sm:text-3xl">{title}</h2>
        <div className="hidden h-20 w-px bg-border md:block" />
        <div>
          <p className="text-sm font-medium text-foreground">{lead}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
        </div>
      </div>
    </section>
  );
}

/** Mouse-only 3D tilt + cursor glow for service cards; touch and reduced-motion visitors get none. */
function tiltCard(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--rx", `${((0.5 - y) * 7).toFixed(2)}deg`);
  el.style.setProperty("--ry", `${((x - 0.5) * 9).toFixed(2)}deg`);
  el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
  el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
}
function resetTilt(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  el.style.removeProperty("--rx");
  el.style.removeProperty("--ry");
}

export function ServiceCard({ service }: { service: Service }) {
  const t = useT();
  return (
    <article className="service-card surface-card flex flex-col p-6 [perspective:600px]" onPointerMove={tiltCard} onPointerLeave={resetTilt}>
      <div className="service-card-icon w-fit">
        <ServiceIconView icon={service.icon} />
      </div>
      <h3 className="mt-5 text-lg font-semibold">{t(service.name)}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{t(service.short)}</p>
      <p className="mt-4 text-xs font-semibold">{t({ en: "Best for", bn: "যার জন্য উপযোগী" })}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {t(service.useCases).slice(0, 2).map((u) => (
          <span key={u} className="rounded-full bg-primary-soft px-2.5 py-1 text-xs text-accent-foreground">{u}</span>
        ))}
      </div>
      <Button asChild variant="brand" className="mt-6 h-11 w-full">
        <Link to="/services/$slug" params={{ slug: service.slug }}>{t(ui.cta.learnMore)}</Link>
      </Button>
    </article>
  );
}

export function ServiceGrid({ slugs }: { slugs?: string[] }) {
  const list = slugs ? services.filter((s) => slugs.includes(s.slug)) : services;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {list.map((s) => <ServiceCard key={s.slug} service={s} />)}
    </div>
  );
}

/** Numbered blue tiles ("Why choose Ritorica?") */
export function NumberedTiles({ items }: { items: { title: L; text: L }[] }) {
  const t = useT();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((it, i) => (
        <div key={i} className="feature-tile card-lift min-h-64 p-6">
          <h3 className="text-lg font-semibold leading-snug">{t(it.title)}</h3>
          <p className="mt-3 text-sm leading-relaxed opacity-85">{t(it.text)}</p>
          <span className="feature-tile-number" aria-hidden>{i + 1}</span>
        </div>
      ))}
    </div>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((x) => (
        <li key={x} className="flex gap-3 text-[15px]">
          <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-3" /></span>
          {x}
        </li>
      ))}
    </ul>
  );
}

export function CTASection() {
  const t = useT();
  return (
    <section className="container-site pt-20">
      <div className="feature-tile flex flex-col items-start gap-6 p-10 sm:p-14 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold sm:text-3xl">{t(ui.cta.finalTitle)}</h2>
          <p className="mt-3 opacity-85">{t(ui.cta.finalText)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="onDark" size="lg"><PricingLink>{t(ui.cta.demo)}</PricingLink></Button>
          <Button asChild variant="onDark" size="lg"><Link to="/contact">{t(ui.cta.contact)}</Link></Button>
        </div>
      </div>
    </section>
  );
}
