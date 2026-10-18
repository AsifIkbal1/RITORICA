import { createFileRoute } from "@tanstack/react-router";
import { BellRing } from "lucide-react";
import { useT } from "@/i18n/language";
import { btrcNotice } from "@/content/pricing";
import { PageHero } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/help-desk/noticeboard")({
  head: () => seo("Noticeboard", "Regulatory and service notices for Ritorica SMS customers in Bangladesh, including BTRC guidelines.", "/help-desk/noticeboard"),
  component: NoticeboardPage,
});

/** Only real notices go here; the BTRC notice text is shared with the pricing section. */
function NoticeboardPage() {
  const t = useT();
  const notices = [{ date: { en: "03 January 2019", bn: "০৩ জানুয়ারি ২০১৯" }, tag: { en: "BTRC", bn: "BTRC" }, ...btrcNotice }];
  return (
    <>
      <PageHero
        crumbs={[{ label: t({ en: "Help Desk", bn: "হেল্প ডেস্ক" }) }, { label: t({ en: "Noticeboard", bn: "নোটিশবোর্ড" }) }]}
        eyebrow={t({ en: "Help Desk", bn: "হেল্প ডেস্ক" })}
        title={t({ en: "Noticeboard", bn: "নোটিশবোর্ড" })}
        text={t({ en: "Important regulatory and service notices for our SMS customers. Please read them before sending campaigns.", bn: "আমাদের এসএমএস গ্রাহকদের জন্য গুরুত্বপূর্ণ নিয়ন্ত্রক ও সেবা নোটিশ। ক্যাম্পেইন পাঠানোর আগে অনুগ্রহ করে পড়ে নিন।" })}
        actions={false}
      />
      <section className="container-site pt-12">
        <ul className="mx-auto max-w-4xl space-y-4">
          {notices.map((n) => (
            <li key={n.title.en}>
              <article className="surface-card flex gap-5 p-6 sm:p-8">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><BellRing className="size-6" aria-hidden /></span>
                <div>
                  <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">{t(n.tag)}</span>
                    {t(n.date)}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">{t(n.title)}</h2>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(n.text)}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
