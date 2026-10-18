import { createFileRoute, notFound } from "@tanstack/react-router";
import { AlertTriangle, Plug } from "lucide-react";
import { useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { getService } from "@/content/services";
import { PageHero, Section, ServiceGrid, CheckList, CTASection } from "@/components/site/blocks";
import { ServiceIconView } from "@/components/site/ServiceIconView";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { slug: service.slug };
  },
  head: ({ params }) => {
    const s = getService(params.slug);
    return s ? seo(s.name.en, s.short.en, `/services/${s.slug}`) : {};
  },
  component: ServicePage,
});

function ServicePage() {
  const { slug } = Route.useLoaderData();
  const s = getService(slug)!;
  const t = useT();
  return (
    <>
      <PageHero
        crumbs={[{ label: t(ui.nav.services), to: "/services" }, { label: t(s.name) }]}
        title={t(s.name)}
        text={t(s.intro)}
        visual={
          <div className="flex h-full items-center justify-center p-10">
            <div className="surface-card flex size-48 items-center justify-center rounded-3xl">
              <ServiceIconView icon={s.icon} size="lg" />
            </div>
          </div>
        }
      />
      <Section>
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="surface-card p-7">
            <AlertTriangle className="size-7 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{t(ui.service.problems)}</h2>
            <ul className="mt-4 space-y-2.5 text-[15px] text-muted-foreground">
              {t(s.problems).map((p) => <li key={p} className="flex gap-2"><span className="text-primary">•</span>{p}</li>)}
            </ul>
          </div>
          <div className="surface-card p-7 lg:col-span-2">
            <h2 className="text-lg font-semibold">{t(ui.service.capabilities)}</h2>
            <div className="mt-5"><CheckList items={t(s.capabilities)} /></div>
          </div>
        </div>
      </Section>
      <Section title={t(ui.service.useCases)}>
        <div className="grid gap-4 md:grid-cols-3">
          {t(s.useCases).map((u, i) => (
            <div key={u} className="feature-tile min-h-36 p-6">
              <p className="text-lg font-semibold">{u}</p>
              <span className="feature-tile-number" aria-hidden>{i + 1}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <div className="surface-card flex flex-col gap-4 p-8 sm:flex-row sm:items-start">
          <Plug className="size-9 shrink-0 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">{t(ui.service.integration)}</h2>
            <p className="mt-2 text-muted-foreground">{t(s.integration)}</p>
            <p className="mt-3 text-sm text-muted-foreground">{t(ui.service.availability)}</p>
          </div>
        </div>
      </Section>
      <Section title={t(ui.service.related)}>
        <ServiceGrid slugs={s.related} />
      </Section>
      <CTASection />
    </>
  );
}
