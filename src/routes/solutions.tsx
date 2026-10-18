import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ShieldCheck, Megaphone, MessagesSquare } from "lucide-react";
import { useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { industries } from "@/content/industries";
import { PageHero, Section, StatementCard, CTASection } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/solutions")({
  head: () => seo("Solutions", "How businesses use Ritorica messaging for notifications, verification, marketing and customer support across industries.", "/solutions"),
  component: SolutionsPage,
});

const pillars = [
  { icon: Bell, slug: "transactional-sms", title: { en: "Notifications", bn: "নোটিফিকেশন" }, text: { en: "Confirm payments, orders, bookings and account changes the moment they happen.", bn: "পেমেন্ট, অর্ডার, বুকিং ও অ্যাকাউন্ট পরিবর্তন ঘটার সাথে সাথে নিশ্চিত করুন।" } },
  { icon: ShieldCheck, slug: "otp-verification", title: { en: "Verification", bn: "ভেরিফিকেশন" }, text: { en: "Protect sign-ups, logins and transactions with one-time passwords on several channels.", bn: "একাধিক চ্যানেলে ওয়ান-টাইম পাসওয়ার্ড দিয়ে সাইন-আপ, লগইন ও লেনদেন সুরক্ষিত করুন।" } },
  { icon: Megaphone, slug: "bulk-sms", title: { en: "Engagement & marketing", bn: "সম্পৃক্ততা ও মার্কেটিং" }, text: { en: "Reach large audiences with offers, announcements and reminders.", bn: "অফার, ঘোষণা ও রিমাইন্ডার দিয়ে বড় অডিয়েন্সের কাছে পৌঁছান।" } },
  { icon: MessagesSquare, slug: "omnichannel", title: { en: "Customer support", bn: "গ্রাহক সাপোর্ট" }, text: { en: "Handle conversations from every channel in one shared inbox.", bn: "একটি যৌথ ইনবক্সে সব চ্যানেলের কথোপকথন পরিচালনা করুন।" } },
];

function SolutionsPage() {
  const t = useT();
  return (
    <>
      <PageHero
        crumbs={[{ label: t(ui.nav.solutions) }]}
        title={t({ en: "Solutions for your Business", bn: "আপনার ব্যবসার জন্য সমাধান" })}
        text={t({ en: "Messaging infrastructure for customer communication, notifications, verification and engagement — adapted to the way your sector works.", bn: "গ্রাহক যোগাযোগ, নোটিফিকেশন, ভেরিফিকেশন ও সম্পৃক্ততার জন্য মেসেজিং অবকাঠামো — আপনার খাতের কাজের ধরন অনুযায়ী।" })}
        actions={false}
      />
      <StatementCard
        title={t({ en: "One platform, four jobs", bn: "এক প্ল্যাটফর্ম, চারটি কাজ" })}
        lead={t({ en: "From a single integration", bn: "একটি ইন্টিগ্রেশন থেকেই" })}
        text={t({ en: "Most businesses need to notify, verify, promote and support. Ritorica covers all four with the same API, the same reporting and the same team.", bn: "বেশিরভাগ ব্যবসার জানানো, যাচাই, প্রচার ও সাপোর্ট — এই চারটি দরকার। Ritorica একই API, একই রিপোর্টিং ও একই টিম দিয়ে চারটিই সামলায়।" })}
      />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <Link key={p.slug} to="/services/$slug" params={{ slug: p.slug }} className="surface-card group p-6 hover:shadow-[var(--shadow-lift)]">
              <p.icon className="size-9 text-primary" />
              <h2 className="mt-4 text-lg font-semibold group-hover:text-primary">{t(p.title)}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t(p.text)}</p>
            </Link>
          ))}
        </div>
      </Section>
      <Section title={t({ en: "Industry-specific solutions", bn: "শিল্পখাতভিত্তিক সমাধান" })}>
        <div className="grid gap-5 md:grid-cols-2">
          {industries.map((i) => (
            <Link key={i.slug} to="/industries/$slug" params={{ slug: i.slug }} className="surface-card group flex gap-5 p-6 hover:shadow-[var(--shadow-lift)]">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><i.icon className="size-6" /></span>
              <div className="min-w-0">
                <h3 className="font-semibold group-hover:text-primary">{t(i.name)}</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {t(i.useCases).slice(0, 3).map((u) => <li key={u}>• {u}</li>)}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </Section>
      <CTASection />
    </>
  );
}
