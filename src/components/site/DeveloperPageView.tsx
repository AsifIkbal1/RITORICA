import { useState, type ReactNode } from "react";
import { NetworkBackground } from "@/components/site/NetworkBackground";
import { Link } from "@tanstack/react-router";
import {
  Activity, ArrowRight, Bell, CalendarDays, ChevronsLeftRight, Clock, FileText, Hexagon, Lock, Map, MessageCircle,
  MessageSquare, Phone, Repeat, RefreshCw, Send, Shield, ShoppingCart, Globe, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/language";
import { cn } from "@/lib/utils";
import type { RichPage } from "@/content/pages";
import type { BadgeIcon, Cell, DevLayout, DevSection, DotColor, Endpoint, GuideIcon, Level } from "@/content/pages/types";

const badgeIcons: Record<BadgeIcon, LucideIcon> = { code: ChevronsLeftRight, shield: Shield, lock: Lock, pulse: Activity, globe: Globe, clock: Clock, hexagon: Hexagon };
const guideIcons: Record<GuideIcon, LucideIcon> = {
  sms: MessageSquare, whatsapp: MessageCircle, phone: Phone, bell: Bell, send: Send, repeat: Repeat,
  lock: Lock, cart: ShoppingCart, calendar: CalendarDays, pulse: Activity, map: Map, refresh: RefreshCw,
};
const dot: Record<DotColor, string> = {
  primary: "bg-primary", warning: "bg-warning", success: "bg-success", violet: "bg-violet",
  destructive: "bg-destructive", sky: "bg-sky", pink: "bg-pink",
};
const tint: Record<DotColor, string> = {
  primary: "bg-primary/10 text-primary", warning: "bg-warning/10 text-warning", success: "bg-success/10 text-success",
  violet: "bg-violet/10 text-violet", destructive: "bg-destructive/10 text-destructive", sky: "bg-sky/10 text-sky", pink: "bg-pink/10 text-pink",
};
const levelStyle: Record<Level, string> = {
  beginner: "border-success/30 bg-success/10 text-success",
  intermediate: "border-warning/30 bg-warning/10 text-warning",
  advanced: "border-violet/30 bg-violet/10 text-violet",
};
const levelLabel: Record<Level, { en: string; bn: string }> = {
  beginner: { en: "Beginner", bn: "শিক্ষানবিস" },
  intermediate: { en: "Intermediate", bn: "মধ্যম" },
  advanced: { en: "Advanced", bn: "অ্যাডভান্সড" },
};

/** Renders `code` as inline code and **text** as bold. */
export function Rich({ text, dark }: { text: string; dark?: boolean }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("`") ? (
          <code key={i} className={cn("rounded px-1.5 py-0.5 font-mono text-[0.9em]", dark ? "bg-card/10 text-navy-foreground" : "bg-primary-soft text-primary")}>{p.slice(1, -1)}</code>
        ) : p.startsWith("**") ? (
          <strong key={i} className="font-semibold">{p.slice(2, -2)}</strong>
        ) : (
          p
        ),
      )}
    </>
  );
}

/** Light syntax colouring: comments and XML dimmed, key=value pairs highlighted. */
function CodeBlock({ code, className }: { code: string; className?: string }) {
  return (
    <pre className={cn("dev-code overflow-x-auto p-5", className)}>
      <code>
        {code.split("\n").map((line, i) => {
          const t = line.trim();
          const dim = t.startsWith("<") || t.startsWith("#") || t.startsWith("//");
          // Only colour form-body lines (no leading indent), so code indentation is preserved.
          const kv = line === t ? /^(&?)([a-z_]+)=(.*)$/.exec(t) : null;
          return (
            <span key={i} className="block min-h-[1.2em] whitespace-pre">
              {dim ? (
                <span className="text-navy-muted">{line}</span>
              ) : kv && !t.includes("&password") && !t.endsWith("{") ? (
                <>{kv[1]}{kv[2]}=<span className="text-code-ok">{kv[3]}</span></>
              ) : (
                line
              )}
            </span>
          );
        })}
      </code>
    </pre>
  );
}

function Heading({ s, dark }: { s: DevSection; dark: boolean }) {
  const t = useT();
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <span className={cn("inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider", dark ? "bg-primary/25 text-primary-glow" : "bg-primary-soft text-primary")}>{t(s.eyebrow)}</span>
      <h2 className={cn("mt-4 text-3xl font-bold sm:text-4xl", dark ? "text-navy-foreground" : "text-foreground")}>{t(s.title)}</h2>
      {s.intro && <p className={cn("mt-4 leading-relaxed", dark ? "text-navy-muted" : "text-muted-foreground")}><Rich text={t(s.intro)} dark={dark} /></p>}
    </div>
  );
}

function ReqBadge({ req }: { req: "required" | "required*" | "optional" }) {
  const t = useT();
  const label = req === "optional" ? t({ en: "optional", bn: "ঐচ্ছিক" }) : t({ en: "required", bn: "আবশ্যক" }) + (req === "required*" ? "*" : "");
  return <span className={cn("ml-1 text-xs", req === "optional" ? "text-navy-muted" : "text-code-req")}>{label}</span>;
}

function EndpointCard({ e }: { e: Endpoint }) {
  const t = useT();
  const cell = (c: Cell) => (typeof c === "string" ? c : t(c));
  return (
    <article className="dev-card-dark overflow-hidden">
      <header className="flex flex-wrap items-center gap-3 border-b border-card/10 px-6 py-4">
        <span className="rounded-md bg-success/20 px-3 py-1 text-xs font-bold tracking-wide text-code-ok">{e.method}</span>
        <code className="font-mono text-[15px] text-navy-foreground">{e.path}</code>
        <span className="ml-auto text-sm text-navy-muted">{t(e.summary)}</span>
      </header>
      <div className="grid gap-8 p-6 lg:grid-cols-2">
        <div className="min-w-0 space-y-8">
          {e.how && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-navy-muted">{t({ en: "How it works", bn: "কীভাবে কাজ করে" })}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-navy-foreground/90">{t(e.how)}</p>
            </div>
          )}
          {e.tables.map((tb, i) => (
            <div key={i} className="overflow-x-auto">
              <p className="text-xs font-bold uppercase tracking-wider text-navy-muted">{t(tb.title)}</p>
              <table className="mt-3 w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-card/10 text-xs uppercase tracking-wider text-navy-muted">
                    {tb.head.map((h, j) => <th key={j} scope="col" className="py-2 pr-4 font-semibold">{t(h)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {tb.rows.map((r) => (
                    <tr key={r.field} className="border-b border-card/5 align-top last:border-0">
                      <td className="whitespace-nowrap py-3 pr-4 font-mono text-[13px] text-code-key">{r.field}</td>
                      {r.type !== undefined && (
                        <td className="whitespace-nowrap py-3 pr-4 text-code-type">
                          {cell(r.type)}
                          {r.req && <ReqBadge req={r.req} />}
                        </td>
                      )}
                      <td className="py-3 text-navy-foreground/85">{t(r.text)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-navy-muted">{t(e.example.title)}</p>
          <CodeBlock code={e.example.code} className="mt-3" />
        </div>
      </div>
    </article>
  );
}

function CodeTabs({ tabs }: { tabs: { label: string; code: string }[] }) {
  const [active, setActive] = useState(0);
  const current = tabs[active] ?? tabs[0];
  return (
    <div className="mx-auto max-w-4xl">
      <div role="tablist" className="flex flex-wrap border-b border-card/10">
        {tabs.map((tb, i) => (
          <button
            key={tb.label}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn("-mb-px border-b-2 px-5 py-3 text-sm font-semibold transition-colors", i === active ? "border-primary-glow text-primary-glow" : "border-transparent text-navy-muted hover:text-navy-foreground")}
          >
            {tb.label}
          </button>
        ))}
      </div>
      {current && <CodeBlock code={current.code} className="rounded-t-none border border-t-0 border-card/10" />}
    </div>
  );
}

function Body({ s }: { s: DevSection }) {
  const t = useT();
  const cell = (c: Cell) => (typeof c === "string" ? c : t(c));
  switch (s.kind) {
    case "auth":
      return (
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="dev-card-dark flex flex-wrap items-center gap-4 px-6 py-5">
            <span className="text-sm font-bold uppercase tracking-wider text-primary-glow">{t(s.endpoint.label)}</span>
            <code className="break-all font-mono text-[15px] text-code-ok">{s.endpoint.url}</code>
            <span className="ml-auto rounded-full border border-primary-glow/40 bg-primary/20 px-3 py-1 text-xs font-semibold text-primary-glow">{s.endpoint.tag}</span>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {s.items.map((it) => (
              <article key={it.title.en} className="dev-card-dark flex min-w-0 flex-col p-6">
                <h3 className="font-semibold text-navy-foreground">{t(it.title)}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-muted">{t(it.text)}</p>
                <CodeBlock code={it.code} className="mt-5 px-4 py-3" />
              </article>
            ))}
          </div>
        </div>
      );
    case "endpoints":
      return <div className="mx-auto max-w-6xl space-y-6">{s.items.map((e) => <EndpointCard key={e.path} e={e} />)}</div>;
    case "limits":
      return (
        <div className="mx-auto max-w-6xl overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                {s.head.map((h, i) => <th key={i} scope="col" className="px-4 py-3 font-semibold">{t(h)}</th>)}
              </tr>
            </thead>
            <tbody>
              {s.rows.map((r) => (
                <tr key={r.op} className="border-b border-border">
                  <td className="px-4 py-4 font-mono text-[13px]">{r.op}</td>
                  <td className="px-4 py-4"><span className="whitespace-nowrap rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">{t(r.limit)}</span></td>
                  <td className="px-4 py-4 text-muted-foreground">{t(r.note)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "errors":
      return (
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {s.items.map((e) => (
            <article key={e.code} className="surface-card flex gap-4 p-5">
              <span className={cn("font-mono text-lg font-bold", Number(e.code) >= 500 ? "text-destructive" : "text-warning")}>{e.code}</span>
              <div>
                <h3 className="font-semibold leading-snug">{t(e.title)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground"><Rich text={t(e.text)} /></p>
              </div>
            </article>
          ))}
        </div>
      );
    case "languages":
      return (
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {s.items.map((l) => (
            <article key={l.lib} className="surface-card flex flex-col p-6">
              <h3 className="flex items-center gap-2.5 text-lg font-semibold"><span className={cn("size-3 rounded-full", dot[l.color])} aria-hidden />{cell(l.name)}</h3>
              <p className="mt-3 rounded-md border border-border bg-muted px-3 py-1 font-mono text-xs text-muted-foreground">{l.lib}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground"><Rich text={t(l.text)} /></p>
              <Link to={l.link.to} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                {t(l.link.label)} <ArrowRight className="size-3.5" />
              </Link>
            </article>
          ))}
        </div>
      );
    case "steps":
      return (
        <ol className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {s.items.map((it, i) => (
            <li key={i} className="dev-card-dark p-6">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{i + 1}</span>
              <h3 className="mt-5 font-semibold text-navy-foreground">{t(it.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-muted"><Rich text={t(it.text)} dark /></p>
            </li>
          ))}
        </ol>
      );
    case "codeTabs":
      return <CodeTabs tabs={s.tabs} />;
    case "guides":
      return (
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {s.items.map((g) => {
            const Icon = guideIcons[g.icon];
            return (
              <article key={g.title.en} className="surface-card flex flex-col p-7 transition-shadow hover:shadow-[var(--shadow-lift)]">
                <div className="flex items-start justify-between">
                  <span className={cn("flex size-12 items-center justify-center rounded-xl", tint[g.color])}><Icon className="size-5" /></span>
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-semibold", levelStyle[g.level])}>{t(levelLabel[g.level])}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{t(g.title)}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted-foreground"><Rich text={t(g.text)} /></p>
                <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" />{t(g.read)}</span>
                  <span className="inline-flex items-center gap-1.5"><ChevronsLeftRight className="size-3.5" />{g.tags}</span>
                </p>
              </article>
            );
          })}
        </div>
      );
  }
}

function Actions({ items }: { items: DevLayout["heroActions"] }) {
  const t = useT();
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-4">
      {items.map((a) => (
        <Button
          key={a.to}
          asChild
          size="lg"
          variant={a.solid ? "onDark" : "outline"}
          className={a.solid ? "font-semibold" : "rounded-[10px] border-card/30 bg-card/10 font-semibold text-navy-foreground hover:bg-card/20 hover:text-navy-foreground"}
        >
          <Link to={a.to}>{a.solid && a.to.includes("guides") && <FileText />}{t(a.label)}</Link>
        </Button>
      ))}
    </div>
  );
}

function Band({ dark, children, id }: { dark: boolean; children: ReactNode; id: string }) {
  return (
    <section id={id} className={cn("scroll-mt-20 py-20", dark ? "dev-dark" : "bg-background")}>
      <div className="container-site">{children}</div>
    </section>
  );
}

/** ritorica.com developer layout: gradient hero, badge strip, dark/light bands, gradient CTA. */
export function DeveloperPageView({ page, dev }: { page: RichPage; dev: DevLayout }) {
  const t = useT();
  return (
    <div className="-mb-px">
      <section className="dev-hero relative isolate overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="hero-glow left-1/2 top-1/3 size-[30rem] -translate-x-1/2" />
          <NetworkBackground variant="dark" />
        </div>
        <div className="container-site py-24 text-center sm:py-28">
          {page.eyebrow && <span className="fade-up inline-block rounded-full border border-card/25 bg-card/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">{t(page.eyebrow)}</span>}
          <h1 className="fade-up anim-d1 mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {t(page.title)}
            <span className="block text-primary-glow">{t(dev.titleAccent)}</span>
          </h1>
          <p className="fade-up anim-d2 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-navy-foreground/85">{t(page.intro)}</p>
          <div className="fade-up anim-d3"><Actions items={dev.heroActions} /></div>
        </div>
      </section>

      <div className="border-b border-border bg-card">
        <ul className="container-site grid grid-cols-2 gap-y-4 py-6 sm:grid-cols-3 lg:flex lg:justify-center lg:divide-x lg:divide-border">
          {dev.badges.map((b) => {
            const Icon = badgeIcons[b.icon];
            return (
              <li key={b.label.en} className="flex items-center justify-center gap-2 px-6 text-center text-sm font-semibold">
                <Icon className="size-4 shrink-0 text-primary" aria-hidden />
                {t(b.label)}
              </li>
            );
          })}
        </ul>
      </div>

      {dev.sections.map((s) => {
        const dark = s.tone === "dark";
        return (
          <Band key={s.id} id={s.id} dark={dark}>
            <Heading s={s} dark={dark} />
            <Body s={s} />
          </Band>
        );
      })}

      <section className="dev-hero relative isolate mt-0 overflow-hidden">
        <NetworkBackground variant="dark" className="-z-10" />
        <div className="container-site py-20 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{t(page.cta?.title ?? { en: "Ready to start?", bn: "শুরু করতে প্রস্তুত?" })}</h2>
          {page.cta && <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-navy-foreground/85">{t(page.cta.text)}</p>}
          <Actions items={dev.ctaActions} />
        </div>
      </section>
    </div>
  );
}
