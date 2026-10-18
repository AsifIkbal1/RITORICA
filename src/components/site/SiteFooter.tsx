import { PricingLink } from "@/components/site/PricingLink";
import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import logo from "@/assets/brand/ritorica-logo.svg";
import { useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { site } from "@/config/site";
import { navGroups, navLinks, navTrailingGroups } from "@/content/navigation";

export function SiteFooter() {
  const t = useT();
  const social = Object.entries(site.social).filter(([, url]) => url);
  return (
    <footer className="mt-24 border-t border-border bg-background">
      <div className="container-site py-14">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <img src={logo} alt="Ritorica" width={120} height={36} className="h-9 w-auto" />
            <p className="mt-1 text-sm text-muted-foreground">{t({ en: "Information Technology", bn: "তথ্যপ্রযুক্তি" })}</p>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-muted-foreground">
              {t({ en: "Official communication channels for all business needs. Trusted by leading enterprises worldwide.", bn: "সব ধরনের ব্যবসায়িক প্রয়োজনের জন্য অফিসিয়াল যোগাযোগ চ্যানেল। বিশ্বজুড়ে শীর্ষ প্রতিষ্ঠানগুলোর আস্থাভাজন।" })}
            </p>
            {social.length > 0 && (
              <ul className="mt-4 flex gap-3 text-sm">
                {social.map(([k, url]) => (
                  <li key={k}><a href={url} className="capitalize text-primary hover:underline" rel="noopener noreferrer" target="_blank">{k}</a></li>
                ))}
              </ul>
            )}
          </div>
          <ContactCard icon={<Mail className="size-6" />} label={t({ en: "Email", bn: "ইমেইল" })}>
            <a href={`mailto:${site.email}`} className="hover:text-primary">{site.email}</a>
          </ContactCard>
          <ContactCard icon={<Phone className="size-6" />} label={t({ en: "Number", bn: "নম্বর" })}>
            <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="hover:text-primary">{site.phone}</a>
          </ContactCard>
        </div>

        <div className="mt-12 grid gap-8 border-t border-border pt-10 sm:grid-cols-3 lg:grid-cols-4">
          {[...navGroups, ...navTrailingGroups].map((g) => (
            <FooterCol key={g.id} title={t(g.label)}>
              {g.items.map((it) => (
                <li key={it.title.en}>
                  {it.href ? (
                    <a href={it.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{t(it.title)}</a>
                  ) : (
                    <Link to={it.to} params={it.params as never} {...(it.hash ? { hash: it.hash } : {})} className="hover:text-primary">{t(it.title)}</Link>
                  )}
                </li>
              ))}
            </FooterCol>
          ))}
          <FooterCol title={t({ en: "Quick links", bn: "দ্রুত লিংক" })}>
            {navLinks.map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:text-primary">{t(l.label)}</Link></li>
            ))}
            <li><PricingLink className="hover:text-primary">{t(ui.cta.demo)}</PricingLink></li>
          </FooterCol>
        </div>

        <div className="mt-12 border-t border-border pt-10">
          <h2 className="text-sm font-semibold text-foreground">{t({ en: "Address", bn: "ঠিকানা" })}</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-3">
            {site.offices.map((o) => (
              <li key={o.country.en}>
                <p className="text-sm font-semibold text-primary">{t(o.country)}</p>
                <p className="mt-1 text-[15px] text-muted-foreground">{t(o.address)}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-site flex flex-wrap gap-x-4 gap-y-2 py-5 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} {site.name}. {t(ui.footer.rights)}</span>
          <Link to="/privacy" className="text-primary hover:underline">{t(ui.footer.privacy)}</Link>
          <Link to="/terms" className="text-primary hover:underline">{t(ui.footer.terms)}</Link>
        </div>
      </div>
    </footer>
  );
}

function ContactCard({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="surface-card p-6">
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">{icon}</span>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{children}</p>
    </div>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold text-foreground">{title}</h2>
      <ul className="space-y-2.5 text-sm text-muted-foreground">{children}</ul>
    </div>
  );
}
