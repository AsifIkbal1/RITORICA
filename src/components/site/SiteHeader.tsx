import { PricingLink, scrollIfHere } from "@/components/site/PricingLink";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import logo from "@/assets/brand/ritorica-logo.svg";
import { Button } from "@/components/ui/button";
import { useLang, useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { navGroups, navLinks, navTrailingGroups } from "@/content/navigation";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  const t = useT();
  return (
    <div role="group" aria-label={t(ui.nav.language)} className={cn("flex items-center rounded-lg bg-muted p-1 text-sm", className)}>
      {(["en", "bn"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          lang={l}
          className={cn(
            "rounded-md px-2.5 py-1 font-medium transition-colors",
            lang === l ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {l === "en" ? "EN" : "বাংলা"}
        </button>
      ))}
    </div>
  );
}

function Dropdown({ label, children, wide, alignRight }: { label: string; children: React.ReactNode; wide?: boolean | undefined; alignRight?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "nav-link flex items-center gap-0.5 whitespace-nowrap rounded-md px-1.5 py-2 text-sm text-foreground hover:text-primary xl:px-2.5 xl:text-[15px]",
          open && "bg-primary-soft text-primary",
        )}
      >
        {label}
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180 text-primary")} />
      </button>
      {open && (
        <div className={cn("absolute top-full z-50 pt-2", alignRight ? "right-0" : "left-0")} onClick={() => setOpen(false)}>
          <div className={cn("surface-card fade-up p-2", wide ? "grid w-[780px] grid-cols-2 gap-x-2" : "w-max max-w-[460px]")}>{children}</div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ to, params, hash, href, title, sub }: { to: string; params?: Record<string, string> | undefined; hash?: string | undefined; href?: string | undefined; title: string; sub?: string | undefined }) {
  const body = (
    <span className="text-[15px] leading-snug">
      <span className="font-medium text-foreground">{title}</span>
      {sub && <span className="ml-1.5 text-sm text-muted-foreground">{sub}</span>}
    </span>
  );
  const cls = "block rounded-lg px-3 py-2.5 hover:bg-primary-soft";
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{body}</a>;
  return (
    <Link to={to} params={params as never} {...(hash ? { hash, onClick: (e: React.MouseEvent) => scrollIfHere(e, to, hash) } : {})} className={cls}>
      {body}
    </Link>
  );
}

export function SiteHeader() {
  const t = useT();
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
  }, [mobile]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur transition-[background-color,box-shadow,border-color] duration-300",
        scrolled ? "border-border/60 bg-card/85 shadow-[var(--shadow-card)] backdrop-blur-md" : "border-border bg-card/95",
      )}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-card focus:p-2">
        {t(ui.nav.skip)}
      </a>
      <div className="container-site flex h-[72px] items-center gap-3">
        <Link to="/" aria-label="Ritorica home" className="shrink-0">
          <img src={logo} alt="Ritorica" width={120} height={36} className="h-8 w-auto lg:h-7 xl:h-9" />
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-center justify-center lg:flex xl:gap-1">
          {navGroups.map((g) => (
            <Dropdown key={g.id} label={t(g.label)} wide={g.wide}>
              {g.items.map((it) => (
                <MenuItem key={it.title.en} to={it.to} params={it.params} hash={it.hash} href={it.href} title={t(it.title)} sub={t(it.sub)} />
              ))}
            </Dropdown>
          ))}
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              // Pricing also sits under Resources; the top-level shortcut only fits from 1280px up.
              className={cn("nav-link whitespace-nowrap rounded-md px-1.5 py-2 text-sm hover:text-primary xl:px-2.5 xl:text-[15px]", l.to === "/pricing" && "hidden xl:block")}
              activeProps={{ className: "text-primary" }}
            >
              {t(l.label)}
            </Link>
          ))}
          {navTrailingGroups.map((g, i) => (
            <Dropdown key={g.id} label={t(g.label)} wide={g.wide} alignRight={i === navTrailingGroups.length - 1}>
              {g.items.map((it) => (
                <MenuItem key={it.title.en} to={it.to} params={it.params} hash={it.hash} href={it.href} title={t(it.title)} sub={t(it.sub)} />
              ))}
            </Dropdown>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 xl:gap-3">
          <LanguageSwitcher className="hidden sm:flex" />
          <Button asChild variant="brand" className="hidden h-10 px-4 sm:inline-flex lg:px-3 xl:px-6">
            <PricingLink>{t(ui.cta.demo)}</PricingLink>
          </Button>
          <button
            type="button"
            className="rounded-md p-2 lg:hidden"
            aria-label={t(mobile ? ui.nav.closeMenu : ui.nav.menu)}
            aria-expanded={mobile}
            aria-controls="mobile-nav"
            onClick={() => setMobile((m) => !m)}
          >
            {mobile ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {mobile && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-border bg-card lg:hidden"
          onClick={(e) => (e.target as HTMLElement).closest("a") && setMobile(false)}
        >
          <div className="container-site space-y-6 py-6">
            <LanguageSwitcher className="w-fit sm:hidden" />
            {[...navGroups, ...navTrailingGroups].map((g) => (
              <div key={g.id}>
                <p className="eyebrow mb-2">{t(g.label)}</p>
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {g.items.map((it) => (
                    <MenuItem key={it.title.en} to={it.to} params={it.params} hash={it.hash} href={it.href} title={t(it.title)} sub={t(it.sub)} />
                  ))}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-1">
              <MenuItem to="/" title={t(ui.nav.home)} />
              {navLinks.map((l) => (
                <MenuItem key={l.to} to={l.to} title={t(l.label)} />
              ))}
            </div>
            <Button asChild variant="brand" size="lg" className="w-full">
              <PricingLink>{t(ui.cta.demo)}</PricingLink>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
