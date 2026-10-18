import { createFileRoute } from "@tanstack/react-router";
import { Boxes, Layers, Shuffle, Route as RouteIcon, BarChart3, Gauge, Link2 } from "lucide-react";
import { useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { PageHero, Section, StatementCard, CTASection } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/platform")({
  head: () => seo("CPaaS Platform", "How the Ritorica CPaaS platform unifies messaging APIs, routing, provider abstraction and delivery reporting for business systems.", "/platform"),
  component: PlatformPage,
});

const blocks = [
  { icon: Boxes, title: { en: "Unified communication APIs", bn: "একীভূত যোগাযোগ API" }, text: { en: "One set of operations to send, check status and manage contacts, whichever channel you use.", bn: "যে চ্যানেলই ব্যবহার করুন, পাঠানো, স্ট্যাটাস দেখা ও কনট্যাক্ট ব্যবস্থাপনার জন্য একই অপারেশন।" } },
  { icon: Layers, title: { en: "Multi-channel messaging", bn: "মাল্টি-চ্যানেল মেসেজিং" }, text: { en: "SMS, messengers, email, push and voice behind one account.", bn: "একটি অ্যাকাউন্টের পেছনে এসএমএস, মেসেঞ্জার, ইমেইল, পুশ ও ভয়েস।" } },
  { icon: Shuffle, title: { en: "Provider abstraction", bn: "প্রোভাইডার অ্যাবস্ট্র্যাকশন" }, text: { en: "Your systems talk to Ritorica, not to every operator and messenger separately.", bn: "আপনার সিস্টেম প্রতিটি অপারেটর ও মেসেঞ্জারের সাথে আলাদা নয়, শুধু Ritorica-র সাথে কথা বলে।" } },
  { icon: RouteIcon, title: { en: "Message routing", bn: "মেসেজ রাউটিং" }, text: { en: "Messages are routed by destination, message type and your fallback rules.", bn: "গন্তব্য, মেসেজের ধরন ও আপনার ফলব্যাক নিয়ম অনুযায়ী মেসেজ রাউট হয়।" } },
  { icon: BarChart3, title: { en: "Delivery status & reporting", bn: "ডেলিভারি স্ট্যাটাস ও রিপোর্টিং" }, text: { en: "Final and transitional statuses for each message, by API query or callback.", bn: "API কোয়েরি বা কলব্যাকে প্রতিটি মেসেজের চূড়ান্ত ও অন্তর্বর্তী স্ট্যাটাস।" } },
  { icon: Gauge, title: { en: "Scalability concepts", bn: "স্কেলেবিলিটির ধারণা" }, text: { en: "Bulk sending, scheduling and send-rate control for large campaigns.", bn: "বড় ক্যাম্পেইনের জন্য বাল্ক পাঠানো, শিডিউলিং ও পাঠানোর গতি নিয়ন্ত্রণ।" } },
  { icon: Link2, title: { en: "Business system integration", bn: "ব্যবসায়িক সিস্টেম ইন্টিগ্রেশন" }, text: { en: "Connect websites, apps, CRM, ERP and core platforms over HTTP API or SMPP.", bn: "HTTP API বা SMPP দিয়ে ওয়েবসাইট, অ্যাপ, CRM, ERP ও মূল প্ল্যাটফর্ম যুক্ত করুন।" } },
];

function PlatformPage() {
  const t = useT();
  return (
    <>
      <PageHero
        crumbs={[{ label: t(ui.nav.platform) }]}
        title={t({ en: "The Ritorica CPaaS Platform", bn: "Ritorica সিপাস প্ল্যাটফর্ম" })}
        text={t({ en: "Add messaging to your own applications through APIs, while Ritorica handles channels, routing and delivery reporting.", bn: "API-র মাধ্যমে নিজের অ্যাপ্লিকেশনে মেসেজিং যুক্ত করুন, আর চ্যানেল, রাউটিং ও ডেলিভারি রিপোর্টিং সামলাবে Ritorica।" })}
      />
      <StatementCard
        title={t({ en: "What is CPaaS?", bn: "সিপাস কী?" })}
        lead={t({ en: "Communications Platform as a Service", bn: "কমিউনিকেশনস প্ল্যাটফর্ম অ্যাজ আ সার্ভিস" })}
        text={t({ en: "Instead of building and maintaining connections to each telecom operator and messaging app, a business connects once to a CPaaS provider. The provider exposes simple APIs, and the business decides what to send, to whom and when.", bn: "প্রতিটি টেলিকম অপারেটর ও মেসেজিং অ্যাপের সাথে সংযোগ তৈরি ও রক্ষণাবেক্ষণের বদলে ব্যবসা একবার একটি সিপাস প্রোভাইডারের সাথে যুক্ত হয়। প্রোভাইডার সহজ API দেয়, আর ব্যবসা ঠিক করে কী, কাকে ও কখন পাঠাবে।" })}
      />
      <Section title={t({ en: "Platform building blocks", bn: "প্ল্যাটফর্মের মূল উপাদান" })}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {blocks.map((b) => (
            <div key={b.title.en} className="surface-card p-6">
              <b.icon className="size-8 text-primary" />
              <h3 className="mt-4 font-semibold">{t(b.title)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(b.text)}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section title={t({ en: "High-level architecture", bn: "উচ্চ-স্তরের আর্কিটেকচার" })}>
        <figure className="surface-card p-6 sm:p-10">
          <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1.3fr_auto_1fr]">
            <ArchCol title={t({ en: "Business systems", bn: "ব্যবসায়িক সিস্টেম" })} items={["Web / Mobile app", "CRM / ERP", "Core banking", "E-commerce"]} />
            <Arrow />
            <div className="feature-tile flex flex-col justify-center p-6 text-center">
              <p className="text-lg font-bold">Ritorica</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                {[{ en: "HTTP API / SMPP", bn: "HTTP API / SMPP" }, { en: "Authentication", bn: "প্রমাণীকরণ" }, { en: "Routing & fallback", bn: "রাউটিং ও ফলব্যাক" }, { en: "Status & reports", bn: "স্ট্যাটাস ও রিপোর্ট" }].map((x) => (
                  <span key={x.en} className="rounded-lg bg-card/15 px-2 py-2">{t(x)}</span>
                ))}
              </div>
            </div>
            <Arrow />
            <ArchCol title={t({ en: "Channels", bn: "চ্যানেল" })} items={["SMS", "WhatsApp · Viber · Telegram", "Email · Push", "Voice"]} />
          </div>
          <figcaption className="mt-6 text-xs text-muted-foreground">
            {t({ en: "Conceptual architecture for illustration. It does not describe specific production infrastructure, and channel availability is confirmed per account.", bn: "উদাহরণের জন্য ধারণাগত আর্কিটেকচার। এটি নির্দিষ্ট প্রোডাকশন অবকাঠামো বর্ণনা করে না, এবং চ্যানেলের প্রাপ্যতা প্রতিটি অ্যাকাউন্টে নিশ্চিত করা হয়।" })}
          </figcaption>
        </figure>
      </Section>
      <CTASection />
    </>
  );
}

function ArchCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-muted p-5">
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((i) => <li key={i} className="rounded-lg bg-card px-3 py-2">{i}</li>)}
      </ul>
    </div>
  );
}
function Arrow() {
  return <div aria-hidden className="flex items-center justify-center text-2xl text-primary"><span className="rotate-90 lg:rotate-0">→</span></div>;
}
