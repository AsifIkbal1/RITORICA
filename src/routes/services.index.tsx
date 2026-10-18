import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { PageHero, Section, ServiceGrid, CTASection } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/services/")({
  head: () => seo("Messaging Services", "SMS, transactional and bulk SMS, OTP, WhatsApp, Viber, Telegram, email, push, voice, omnichannel and cascaded messaging from Ritorica.", "/services"),
  component: ServicesPage,
});

function ServicesPage() {
  const t = useT();
  return (
    <>
      <PageHero
        crumbs={[{ label: t(ui.nav.services) }]}
        title={t({ en: "Messaging Services", bn: "মেসেজিং সেবাসমূহ" })}
        text={t({ en: "Every channel your business needs to notify, verify and engage customers — available through one platform and one API.", bn: "গ্রাহককে জানাতে, যাচাই করতে ও সম্পৃক্ত করতে আপনার ব্যবসার প্রয়োজনীয় প্রতিটি চ্যানেল — এক প্ল্যাটফর্ম ও এক API-তে।" })}
      />
      <Section><ServiceGrid /></Section>
      <p className="container-site mt-6 text-sm text-muted-foreground">{t(ui.service.availability)}</p>
      <CTASection />
    </>
  );
}
