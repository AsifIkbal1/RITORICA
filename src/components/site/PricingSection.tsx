import { Link } from "@tanstack/react-router";
import {
  ArrowDownUp, BarChart3, CalendarClock, CheckCircle2, CircleDollarSign, FileSpreadsheet, Languages, Lock, MapPin, MessageSquareText,
  Route as RouteIcon, ShieldCheck, Upload, Webhook, BellRing, Info, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang, useT } from "@/i18n/language";
import { pricePlans, formatBdt, smsFeatures, btrcNotice, type SmsFeatureIcon } from "@/content/pricing";
import { Rich } from "@/components/site/DeveloperPageView";

const planIcons: Record<string, LucideIcon> = { masking: MessageSquareText, "non-masking": ArrowDownUp, otp: Lock, location: MapPin };
const featureIcons: Record<SmsFeatureIcon, LucideIcon> = {
  api: Webhook, reports: BarChart3, unicode: Languages, recharge: CircleDollarSign, schedule: CalendarClock, excel: FileSpreadsheet,
  masking: ShieldCheck, balance: BellRing, language: Languages, routing: RouteIcon, location: MapPin, upload: Upload,
};

/** Four SMS price cards (BDT starting prices). */
export function PriceCards() {
  const t = useT();
  const { lang } = useLang();
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {pricePlans.map((p) => {
        const Icon = planIcons[p.id] ?? MessageSquareText;
        return (
          <article key={p.id} className="surface-card flex flex-col p-6 text-center">
            <Icon className="mx-auto size-12 text-price" aria-hidden />
            <h3 className="mt-4 text-lg font-bold uppercase tracking-wide">{t(p.name)}</h3>
            <p className="mt-4 flex flex-wrap items-baseline justify-center gap-x-2 text-price">
              <span className="text-sm">{t({ en: "from", bn: "শুরু" })}</span>
              <span className="text-4xl font-bold xl:text-5xl">{formatBdt(p.fromBdt, lang)}</span>
              <span className="text-sm">{t({ en: "per SMS", bn: "প্রতি এসএমএস" })}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-2.5 text-left text-[15px]">
              {p.features.map((f) => (
                <li key={f.en} className="flex gap-2.5"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-price" />{t(f)}</li>
              ))}
            </ul>
            <Button asChild variant="price" size="lg" className="mt-8 w-full whitespace-normal">
              <Link to="/request-demo">{t(p.cta)}</Link>
            </Button>
          </article>
        );
      })}
    </div>
  );
}

/** Price cards + SMS platform features + BTRC notice (the restored pricing section). */
export function PricingSection({ showTitle = true }: { showTitle?: boolean }) {
  const t = useT();
  return (
    <section id="pricing" className="container-site scroll-mt-24 pt-20">
      {showTitle && (
        <h2 className="heading-brand text-center text-3xl sm:text-4xl">
          {t({ en: "Flexible SMS Pricing — Choose the Right Service for Your Business", bn: "নমনীয় এসএমএস মূল্য — আপনার ব্যবসার জন্য সঠিক সেবা বেছে নিন" })}
        </h2>
      )}
      <div className={showTitle ? "mt-10" : ""}>
        <PriceCards />
      </div>

      <h2 className="heading-brand mt-20 text-center text-3xl sm:text-4xl">
        {t({ en: "Powerful Bulk SMS API & SMS Marketing Platform in Bangladesh", bn: "বাংলাদেশে শক্তিশালী বাল্ক এসএমএস API ও এসএমএস মার্কেটিং প্ল্যাটফর্ম" })}
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-center text-muted-foreground">
        {t({
          en: "Integrate bulk SMS, OTP verification, and masking SMS with Ritorica. Designed for high delivery, secure communication, and seamless API integration in Bangladesh.",
          bn: "Ritorica-র সাথে বাল্ক এসএমএস, OTP যাচাই ও মাস্কিং এসএমএস যুক্ত করুন। বাংলাদেশে দ্রুত ডেলিভারি, নিরাপদ যোগাযোগ ও সহজ API ইন্টিগ্রেশনের জন্য তৈরি।",
        })}
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {smsFeatures.map((f) => {
          const Icon = featureIcons[f.icon];
          return (
            <article key={f.title.en} className="surface-card flex gap-4 p-6">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"><Icon className="size-6" aria-hidden /></span>
              <div>
                <h3 className="font-semibold leading-snug">{t(f.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground"><Rich text={t(f.text)} /></p>
              </div>
            </article>
          );
        })}
      </div>

      <aside className="mt-10 flex gap-4 rounded-2xl border border-primary/25 bg-primary-soft p-6" aria-label={t(btrcNotice.title)}>
        <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="font-semibold text-primary">{t(btrcNotice.title)}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(btrcNotice.text)}</p>
        </div>
      </aside>
    </section>
  );
}
