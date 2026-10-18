import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { industries } from "@/content/industries";
import { PageHero, Section, CTASection } from "@/components/site/blocks";
import { Button } from "@/components/ui/button";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/industries/")({
  head: () => seo("Industries", "Messaging use cases for banking, fintech, e-commerce, healthcare, education, travel, logistics and enterprise services.", "/industries"),
  component: IndustriesPage,
});

function IndustriesPage() {
  const t = useT();
  return (
    <>
      <PageHero
        crumbs={[{ label: t(ui.nav.industries) }]}
        title={t({ en: "Messaging for every industry", bn: "প্রতিটি শিল্পখাতের জন্য মেসেজিং" })}
        text={t({ en: "Each sector communicates differently. See how organisations use alerts, verification and conversations to serve their customers.", bn: "প্রতিটি খাত ভিন্নভাবে যোগাযোগ করে। দেখুন প্রতিষ্ঠানগুলো কীভাবে অ্যালার্ট, ভেরিফিকেশন ও কথোপকথন দিয়ে গ্রাহকদের সেবা দেয়।" })}
      />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {industries.map((i) => (
            <article key={i.slug} className="surface-card flex flex-col p-7">
              <i.icon className="size-9 text-primary" />
              <h2 className="mt-4 text-xl font-semibold">{t(i.name)}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t(i.intro)}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {t(i.useCases).map((u) => <li key={u} className="rounded-full bg-primary-soft px-2.5 py-1 text-xs text-accent-foreground">{u}</li>)}
              </ul>
              <Button asChild variant="brandOutline" className="mt-6 h-10 w-fit">
                <Link to="/industries/$slug" params={{ slug: i.slug }}>{t(ui.cta.learnMore)}</Link>
              </Button>
            </article>
          ))}
        </div>
      </Section>
      <CTASection />
    </>
  );
}
