import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useLang, useT, type L } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { site } from "@/config/site";
import { pricePlans, formatBdt } from "@/content/pricing";
import { Button } from "@/components/ui/button";
import { PageHero, CTASection } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/help-desk/faq")({
  head: () => seo("FAQ", "Answers to common questions about Ritorica SMS pricing, masking and non-masking SMS, OTP, API integration and recharge.", "/help-desk/faq"),
  component: FaqPage,
});

/** Answers are built only from facts already published on this site (prices, API, features, BTRC notice). */
function FaqPage() {
  const t = useT();
  const { lang } = useLang();
  const price = (id: string) => formatBdt(pricePlans.find((p) => p.id === id)?.fromBdt ?? 0, lang);
  const faqs: { q: L; a: L }[] = [
    {
      q: { en: "How much does SMS cost?", bn: "এসএমএসের দাম কত?" },
      a: {
        en: `Starting prices per SMS: masking from ${price("masking")}, non-masking from ${price("non-masking")}, OTP from ${price("otp")} and location-based from ${price("location")}. Final rates depend on volume and package — request a quotation for exact pricing.`,
        bn: `প্রতি এসএমএসের শুরুর মূল্য: মাস্কিং ${price("masking")}, নন-মাস্কিং ${price("non-masking")}, ওটিপি ${price("otp")} এবং লোকেশন-ভিত্তিক ${price("location")} থেকে। চূড়ান্ত মূল্য পরিমাণ ও প্যাকেজের উপর নির্ভর করে — সঠিক মূল্যের জন্য কোটেশন চান।`,
      },
    },
    {
      q: { en: "What is the difference between masking and non-masking SMS?", bn: "মাস্কিং ও নন-মাস্কিং এসএমএসের পার্থক্য কী?" },
      a: { en: "Masking SMS shows your brand name as the sender. Non-masking SMS is sent from a number and suits standard messaging. Both can be used from a single account.", bn: "মাস্কিং এসএমএসে প্রেরক হিসেবে আপনার ব্র্যান্ডের নাম দেখায়। নন-মাস্কিং এসএমএস একটি নম্বর থেকে যায় এবং সাধারণ মেসেজিংয়ের জন্য উপযোগী। একটি অ্যাকাউন্ট থেকেই দুটো ব্যবহার করা যায়।" },
    },
    {
      q: { en: "Can I send promotional SMS in English?", bn: "প্রচারমূলক এসএমএস কি ইংরেজিতে পাঠানো যায়?" },
      a: { en: "No. As per the BTRC guideline (notice dated 03 January 2019), all promotional SMS must be in Bangla. Promotional SMS in English can lead to disconnection.", bn: "না। BTRC-র নির্দেশনা (০৩ জানুয়ারি ২০১৯ তারিখের নোটিশ) অনুযায়ী সব প্রচারমূলক এসএমএস বাংলায় হতে হবে। ইংরেজিতে প্রচারমূলক এসএমএস পাঠালে সংযোগ বিচ্ছিন্ন হতে পারে।" },
    },
    {
      q: { en: "How do I integrate the SMS API?", bn: "এসএমএস API কীভাবে যুক্ত করব?" },
      a: { en: `Send a form-encoded HTTP POST to ${site.apiHost}/multi.php with your login, password, phone numbers and message. Responses are XML. SMPP is also supported. See the API Documentation and Integration Guides for code samples.`, bn: `আপনার লগইন, পাসওয়ার্ড, ফোন নম্বর ও মেসেজ দিয়ে ${site.apiHost}/multi.php-এ ফর্ম-এনকোডেড HTTP POST পাঠান। রেসপন্স আসে XML-এ। SMPP-ও সমর্থিত। কোড উদাহরণের জন্য API ডকুমেন্টেশন ও ইন্টিগ্রেশন গাইড দেখুন।` },
    },
    {
      q: { en: "Can I send SMS in Bangla and long SMS?", bn: "বাংলায় ও লম্বা এসএমএস পাঠানো যায়?" },
      a: { en: "Yes. Unicode SMS is supported for Bangla, Arabic and other languages, and long messages are split automatically. The system detects the message language and applies the correct encoding.", bn: "হ্যাঁ। বাংলা, আরবি ও অন্যান্য ভাষার জন্য ইউনিকোড এসএমএস সমর্থিত, আর লম্বা মেসেজ স্বয়ংক্রিয়ভাবে ভাগ হয়। সিস্টেম মেসেজের ভাষা চিনে সঠিক এনকোডিং ব্যবহার করে।" },
    },
    {
      q: { en: "How can I recharge my SMS balance?", bn: "এসএমএস ব্যালান্স কীভাবে রিচার্জ করব?" },
      a: { en: "You can recharge anytime using bKash, Nagad or bank cards. You also receive low-balance SMS and email alerts so campaigns do not stop unexpectedly.", bn: "বিকাশ, নগদ বা ব্যাংক কার্ড দিয়ে যেকোনো সময় রিচার্জ করতে পারেন। ব্যালান্স কমে গেলে এসএমএস ও ইমেইল অ্যালার্ট পাবেন, তাই ক্যাম্পেইন হঠাৎ থেমে যায় না।" },
    },
    {
      q: { en: "Can I track whether my messages were delivered?", bn: "মেসেজ পৌঁছেছে কিনা কীভাবে জানব?" },
      a: { en: "Yes. Real-time delivery reports show sent, delivered, failed and pending messages, and status can also be returned to your server by callback.", bn: "হ্যাঁ। রিয়েল-টাইম ডেলিভারি রিপোর্টে পাঠানো, পৌঁছানো, ব্যর্থ ও অপেক্ষমাণ মেসেজ দেখা যায়, আর কলব্যাকে আপনার সার্ভারেও স্ট্যাটাস পাঠানো যায়।" },
    },
    {
      q: { en: "Can I send personalised SMS from an Excel file?", bn: "এক্সেল ফাইল থেকে আলাদা আলাদা এসএমএস পাঠানো যায়?" },
      a: { en: "Yes. Upload an Excel or CSV file to send bulk personalised SMS such as results, OTPs and alerts.", bn: "হ্যাঁ। এক্সেল বা CSV ফাইল আপলোড করে ফলাফল, ওটিপি ও অ্যালার্টের মতো ব্যক্তিগতকৃত বাল্ক এসএমএস পাঠাতে পারেন।" },
    },
  ];
  return (
    <>
      <PageHero
        crumbs={[{ label: t({ en: "Help Desk", bn: "হেল্প ডেস্ক" }) }, { label: "FAQ" }]}
        eyebrow={t({ en: "Help Desk", bn: "হেল্প ডেস্ক" })}
        title={t({ en: "Frequently asked questions", bn: "সাধারণ জিজ্ঞাসা" })}
        text={t({ en: "Quick answers about pricing, SMS types, integration and your account. Can't find what you need? Open a ticket or contact our team.", bn: "মূল্য, এসএমএসের ধরন, ইন্টিগ্রেশন ও অ্যাকাউন্ট নিয়ে দ্রুত উত্তর। যা খুঁজছেন পাননি? টিকিট খুলুন বা আমাদের টিমের সাথে যোগাযোগ করুন।" })}
        actions={
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="brand" size="lg"><Link to="/help-desk/open-ticket">{t({ en: "Open Ticket", bn: "টিকিট খুলুন" })}</Link></Button>
            <Button asChild variant="brandOutline" size="lg"><Link to="/contact">{t(ui.cta.contact)}</Link></Button>
          </div>
        }
      />
      <section className="container-site pt-12">
        <div className="mx-auto max-w-4xl space-y-3">
          {faqs.map((f) => (
            <details key={f.q.en} className="surface-card card-lift group p-0 open:border-primary/30">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 font-semibold [&::-webkit-details-marker]:hidden">
                {t(f.q)}
                <ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <p className="px-6 pb-6 text-[15px] leading-relaxed text-muted-foreground">{t(f.a)}</p>
            </details>
          ))}
        </div>
      </section>
      <CTASection />
    </>
  );
}
