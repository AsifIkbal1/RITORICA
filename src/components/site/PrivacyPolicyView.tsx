import { useT } from "@/i18n/language";
import { site } from "@/config/site";
import { privacyIntro, privacyLead, privacySections, privacyUpdated, type PrivacyBlock } from "@/content/privacy";
import { Breadcrumbs } from "./blocks";

/** Privacy Policy layout modelled on ritorica.com: dark hero, "On this page" index, numbered sections. */
export function PrivacyPolicyView() {
  const t = useT();
  const title = t({ en: "Privacy Policy", bn: "গোপনীয়তা নীতি" });
  return (
    <>
      <section className="dev-dark bg-navy-deep text-navy-foreground">
        <div className="container-site py-14 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="inline-block rounded-md bg-navy px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
              {t({ en: "Last updated", bn: "সর্বশেষ হালনাগাদ" })}: {t(privacyUpdated)}
            </p>
            <h1 className="mt-5 text-4xl font-bold sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-2xl leading-relaxed text-navy-muted">{t(privacyIntro)}</p>
          </div>
        </div>
      </section>

      <section className="container-site pt-10">
        <article className="surface-card mx-auto max-w-3xl p-6 sm:p-12">
          <Breadcrumbs items={[{ label: title }]} />
          <p className="leading-relaxed text-foreground/85">{t(privacyLead)}</p>

          <nav aria-label={t({ en: "On this page", bn: "এই পেজে" })} className="mt-8 rounded-xl border border-border bg-background p-6 sm:p-8">
            <h2 className="text-lg font-bold uppercase tracking-wide text-muted-foreground">{t({ en: "On this page", bn: "এই পেজে" })}</h2>
            <ol className="mt-4 grid gap-x-8 gap-y-2 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-6">
              {privacySections.map((s, i) => (
                <li key={s.id}>
                  {i + 1}.{" "}
                  <a href={`#${s.id}`} className="text-primary hover:underline">{t(s.h)}</a>
                </li>
              ))}
            </ol>
          </nav>

          {privacySections.map((s, i) => (
            <section key={s.id} id={s.id} className="mt-10 scroll-mt-24">
              <h2 className="text-xl font-bold text-foreground">
                {i + 1}. {t(s.h)}
              </h2>
              <div className="mt-3 space-y-4 leading-relaxed text-foreground/85">
                {s.blocks.map((b, j) => <Block key={j} block={b} />)}
              </div>
            </section>
          ))}
        </article>
      </section>
    </>
  );
}

function Block({ block }: { block: PrivacyBlock }) {
  const t = useT();
  switch (block.type) {
    case "p":
      return (
        <p>
          {block.b && <strong className="font-semibold text-foreground">{t(block.b)} </strong>}
          {t(block.text)}
        </p>
      );
    case "h3":
      return <h3 className="pt-2 font-semibold text-foreground">{t(block.text)}</h3>;
    case "list":
      return (
        <ul className="list-disc space-y-2 pl-6">
          {block.items.map((it, i) => (
            <li key={i}>
              {it.b && <strong className="font-semibold text-foreground">{t(it.b)} — </strong>}
              {t(it.text)}
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-[15px]">
            <thead className="bg-background">
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} scope="col" className="px-4 py-3 text-sm font-semibold text-foreground">{t(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map(([a, b], i) => (
                <tr key={i} className="border-t border-border align-top">
                  <th scope="row" className="w-[34%] px-4 py-3 font-semibold text-foreground">{t(a)}</th>
                  <td className="px-4 py-3">{t(b)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "offices":
      return (
        <ul className="space-y-2 pl-6">
          {site.offices.map((o) => (
            <li key={o.country.en}>
              <strong className="font-semibold text-foreground">{t(o.country)}</strong> — {t(o.address)}
            </li>
          ))}
        </ul>
      );
  }
}
