import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { PricingSection } from "@/components/site/PricingSection";
import { Button } from "@/components/ui/button";
import { PageHero, CTASection } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () => seo("Pricing", "Ritorica SMS pricing in BDT: masking from ৳0.48, non-masking from ৳0.25, OTP from ৳0.35 and location-based SMS from ৳0.26 per SMS.", "/pricing"),
  component: PricingPage,
});

function PricingPage() {
  const t = useT();
  return (
    <>
      <PageHero
        crumbs={[{ label: t(ui.nav.pricing) }]}
        title={t({ en: "Simple, transparent SMS pricing", bn: "সহজ ও স্বচ্ছ এসএমএস মূল্য" })}
        text={t({ en: "Starting prices per SMS in Bangladeshi Taka. Final rates depend on channel, destination, monthly volume and integration needs — request a quote for your exact package.", bn: "বাংলাদেশি টাকায় প্রতি এসএমএসের শুরুর মূল্য। চূড়ান্ত মূল্য চ্যানেল, গন্তব্য, মাসিক পরিমাণ ও ইন্টিগ্রেশনের প্রয়োজনের উপর নির্ভর করে — আপনার প্যাকেজের জন্য কোটেশন চান।" })}
        actions={<Button asChild variant="brand" size="lg"><Link to="/request-demo">{t(ui.cta.quote)}</Link></Button>}
      />
      <PricingSection showTitle={false} />
      <section className="container-site pt-6">
        <p className="text-sm text-muted-foreground">
          {t({ en: "Prices are starting rates per SMS part and may change. VAT, sender ID registration and package terms are confirmed in your quotation. WhatsApp, Viber, email, push and voice are priced on request.", bn: "মূল্যগুলো প্রতি এসএমএস অংশের শুরুর হার এবং পরিবর্তন হতে পারে। ভ্যাট, সেন্ডার আইডি নিবন্ধন ও প্যাকেজের শর্ত কোটেশনে নিশ্চিত করা হয়। হোয়াটসঅ্যাপ, ভাইবার, ইমেইল, পুশ ও ভয়েসের মূল্য অনুরোধে জানানো হয়।" })}
        </p>
      </section>
      <CTASection />
    </>
  );
}
