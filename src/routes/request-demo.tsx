import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { Breadcrumbs } from "@/components/site/blocks";
import { LeadForm } from "@/components/site/LeadForm";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/request-demo")({
  head: () => seo("Request a Demo", "Request a Ritorica demo or quote for SMS, OTP, WhatsApp, Viber, Telegram, email, push or voice messaging.", "/request-demo"),
  component: DemoPage,
});

function DemoPage() {
  const t = useT();
  return (
    <section className="container-site pt-8">
      <div className="surface-card mx-auto max-w-3xl p-8 sm:p-12">
        <Breadcrumbs items={[{ label: t(ui.cta.demo) }]} />
        <p className="eyebrow">{t({ en: "Request demo", bn: "ডেমো অনুরোধ" })}</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{t({ en: "Get started with Ritorica", bn: "Ritorica-র সাথে শুরু করুন" })}</h1>
        <p className="mb-8 mt-3 text-muted-foreground">
          {t({ en: "Fill in your details and our team will reach out to plan a demo and quotation for you.", bn: "আপনার তথ্য দিন, আমাদের টিম আপনার জন্য ডেমো ও কোটেশন পরিকল্পনা করতে যোগাযোগ করবে।" })}
        </p>
        <LeadForm kind="demo" />
      </div>
    </section>
  );
}
