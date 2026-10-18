import { createFileRoute } from "@tanstack/react-router";
import { Lock, UserCheck, Activity, Copy, GitBranch, MonitorDot, ShieldCheck } from "lucide-react";
import { useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { PageHero, Section, CTASection } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/security")({
  head: () => seo("Security and Reliability", "The security and reliability principles behind Ritorica messaging: secure integrations, access control, status tracking, redundancy and monitoring.", "/security"),
  component: SecurityPage,
});

const items = [
  { icon: Lock, title: { en: "Secure integrations", bn: "নিরাপদ ইন্টিগ্রেশন" }, text: { en: "API access over HTTPS, with credentials kept on your servers rather than in browsers or apps.", bn: "HTTPS-এ API অ্যাক্সেস, যেখানে তথ্য ব্রাউজার বা অ্যাপে নয়, আপনার সার্ভারে রাখা হয়।" } },
  { icon: UserCheck, title: { en: "Access control", bn: "অ্যাক্সেস নিয়ন্ত্রণ" }, text: { en: "Each account authenticates its requests; sender IDs are registered and approved before use.", bn: "প্রতিটি অ্যাকাউন্ট নিজের রিকোয়েস্ট প্রমাণীকরণ করে; ব্যবহারের আগে সেন্ডার আইডি নিবন্ধন ও অনুমোদন করা হয়।" } },
  { icon: Activity, title: { en: "Message status tracking", bn: "মেসেজ স্ট্যাটাস ট্র্যাকিং" }, text: { en: "Every message has an ID and a status you can query or receive by callback.", bn: "প্রতিটি মেসেজের একটি আইডি ও স্ট্যাটাস থাকে যা কোয়েরি বা কলব্যাকে পাওয়া যায়।" } },
  { icon: Copy, title: { en: "Provider redundancy", bn: "প্রোভাইডার রিডানডেন্সি" }, text: { en: "The platform is designed to work with more than one delivery route where available.", bn: "যেখানে সম্ভব, একাধিক ডেলিভারি রুটের সাথে কাজ করার জন্য প্ল্যাটফর্মটি তৈরি।" } },
  { icon: GitBranch, title: { en: "Routing and failover", bn: "রাউটিং ও ফেইলওভার" }, text: { en: "Cascaded messaging lets you define a fallback channel when a message is not delivered.", bn: "মেসেজ না পৌঁছালে ক্যাসকেডেড মেসেজিংয়ে বিকল্প চ্যানেল নির্ধারণ করা যায়।" } },
  { icon: MonitorDot, title: { en: "Operational monitoring", bn: "অপারেশনাল মনিটরিং" }, text: { en: "Delivery rates and routes are monitored so issues can be identified and handled.", bn: "ডেলিভারির হার ও রুট পর্যবেক্ষণ করা হয় যাতে সমস্যা চিহ্নিত ও সমাধান করা যায়।" } },
  { icon: ShieldCheck, title: { en: "Data protection principles", bn: "ডেটা সুরক্ষার নীতি" }, text: { en: "Collect only what is needed, limit retention (status history is kept for a short period) and restrict access.", bn: "শুধু প্রয়োজনীয় তথ্য সংগ্রহ, সংরক্ষণ সীমিত রাখা (স্ট্যাটাস ইতিহাস অল্প সময় রাখা হয়) এবং অ্যাক্সেস সীমাবদ্ধ করা।" } },
];

function SecurityPage() {
  const t = useT();
  return (
    <>
      <PageHero
        crumbs={[{ label: t(ui.nav.security) }]}
        title={t({ en: "Security and Reliability", bn: "নিরাপত্তা ও নির্ভরযোগ্যতা" })}
        text={t({ en: "Business messaging carries codes, alerts and customer data. These are the principles we follow to keep it dependable.", bn: "ব্যবসায়িক মেসেজিংয়ে কোড, অ্যালার্ট ও গ্রাহকের তথ্য থাকে। এটিকে নির্ভরযোগ্য রাখতে আমরা যে নীতিগুলো অনুসরণ করি।" })}
      />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <div key={i.title.en} className="surface-card p-6">
              <i.icon className="size-8 text-primary" />
              <h2 className="mt-4 text-lg font-semibold">{t(i.title)}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t(i.text)}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          {t({ en: "This page describes principles and design goals. Specific certifications, uptime commitments and technical controls are agreed in your service contract.", bn: "এই পেজে নীতি ও নকশার লক্ষ্য বর্ণনা করা হয়েছে। নির্দিষ্ট সার্টিফিকেশন, আপটাইম প্রতিশ্রুতি ও কারিগরি নিয়ন্ত্রণ আপনার সেবা চুক্তিতে নির্ধারিত হয়।" })}
        </p>
      </Section>
      <CTASection />
    </>
  );
}
