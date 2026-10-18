import { AlertTriangle } from "lucide-react";
import { useT, type L } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { Breadcrumbs } from "./blocks";

export function LegalPage({
  title,
  subtitle,
  updated,
  sections,
  draft = true,
}: {
  title: L;
  subtitle?: L;
  updated: string | L;
  sections: { h: L; p: L }[];
  /** Shows the "draft for legal review" notice. Turn off once the client has supplied the final text. */
  draft?: boolean;
}) {
  const t = useT();
  return (
    <section className="container-site pt-8">
      <article className="surface-card mx-auto max-w-3xl p-8 sm:p-12">
        <Breadcrumbs items={[{ label: t(title) }]} />
        <h1 className="heading-brand text-3xl sm:text-4xl">{t(title)}</h1>
        {subtitle && <p className="mt-2 font-medium text-foreground">{t(subtitle)}</p>}
        <p className="mt-2 text-sm text-muted-foreground">
          {t({ en: "Last updated", bn: "সর্বশেষ হালনাগাদ" })}: {typeof updated === "string" ? updated : t(updated)}
        </p>
        {draft && (
          <div role="note" className="mt-6 flex gap-3 rounded-[10px] border border-price/40 bg-price/10 p-4 text-sm">
            <AlertTriangle className="size-5 shrink-0 text-price" />
            {t(ui.draft.legal)}
          </div>
        )}
        {sections.map((s, i) => (
          <section key={i} className="mt-8">
            <h2 className="text-lg font-semibold">
              {i + 1}. {t(s.h)}
            </h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{t(s.p)}</p>
          </section>
        ))}
      </article>
    </section>
  );
}
