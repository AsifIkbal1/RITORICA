import { createFileRoute, notFound } from "@tanstack/react-router";
import { useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { getIndustry } from "@/content/industries";
import { PageHero, Section, ServiceGrid, CheckList, CTASection } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/industries/$slug")({
  loader: ({ params }) => {
    const i = getIndustry(params.slug);
    if (!i) throw notFound();
    return { slug: i.slug };
  },
  head: ({ params }) => {
    const i = getIndustry(params.slug);
    return i ? seo(`Messaging for ${i.name.en}`, i.intro.en.slice(0, 155), `/industries/${i.slug}`) : {};
  },
  component: IndustryPage,
});

function IndustryPage() {
  const { slug } = Route.useLoaderData();
  const i = getIndustry(slug)!;
  const t = useT();
  return (
    <>
      <PageHero
        crumbs={[{ label: t(ui.nav.industries), to: "/industries" }, { label: t(i.name) }]}
        title={t(i.name)}
        text={t(i.intro)}
        visual={
          <div className="flex h-full items-center justify-center p-10">
            <div className="feature-tile flex size-48 items-center justify-center rounded-3xl">
              <i.icon className="size-20" />
            </div>
          </div>
        }
      />
      <Section title={t({ en: "Messaging use cases", bn: "মেসেজিংয়ের ব্যবহার" })}>
        <div className="surface-card p-8"><CheckList items={t(i.useCases)} /></div>
      </Section>
      <Section title={t(ui.service.channels)}>
        <ServiceGrid slugs={i.channels} />
      </Section>
      <CTASection />
    </>
  );
}
