import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Code2, Network, ShieldCheck, Activity, Route as RouteIcon, Webhook } from "lucide-react";
import heroImage from "@/assets/brand/hero-image.webp";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { industries } from "@/content/industries";
import { PageHero, StatementCard, Section, ServiceGrid, NumberedTiles, CTASection } from "@/components/site/blocks";
import { WorkflowDiagram } from "@/components/site/WorkflowDiagram";
import { PricingSection } from "@/components/site/PricingSection";
import { SignalOverlay } from "@/components/site/SignalOverlay";
import { OtpJourney } from "@/components/site/OtpJourney";
import { otpJourney } from "@/content/otp-journey";
import { OtpDemo } from "@/components/site/OtpDemo";
import { ApiConnection } from "@/components/site/ApiConnection";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    seo(
      "Ritorica — Reliable Business Messaging at Scale",
      "Ritorica is a CPaaS platform for SMS, OTP, WhatsApp, Viber, Telegram, email, push and voice messaging, with APIs for enterprise integration.",
      "/",
    ),
  component: Home,
});

const why = [
  { title: { en: "Unified communication hub", bn: "একীভূত যোগাযোগ কেন্দ্র" }, text: { en: "Manage messaging across all channels from a single, streamlined platform.", bn: "একটি সহজ প্ল্যাটফর্ম থেকে সব চ্যানেলের মেসেজিং পরিচালনা করুন।" } },
  { title: { en: "Personalised customer experience", bn: "ব্যক্তিগতকৃত গ্রাহক অভিজ্ঞতা" }, text: { en: "Send tailored messages in the language and channel each customer prefers.", bn: "প্রতিটি গ্রাহকের পছন্দের ভাষা ও চ্যানেলে মানানসই মেসেজ পাঠান।" } },
  { title: { en: "Real-time delivery insight", bn: "রিয়েল-টাইম ডেলিভারি তথ্য" }, text: { en: "Track the status of every message and receive updates on your own server.", bn: "প্রতিটি মেসেজের স্ট্যাটাস ট্র্যাক করুন এবং নিজের সার্ভারে আপডেট পান।" } },
  { title: { en: "Broad integration", bn: "বিস্তৃত ইন্টিগ্রেশন" }, text: { en: "Connect through HTTP API or SMPP to your apps, CRM and core systems.", bn: "HTTP API বা SMPP দিয়ে আপনার অ্যাপ, CRM ও মূল সিস্টেমে যুক্ত হন।" } },
  { title: { en: "Reporting and analytics", bn: "রিপোর্টিং ও অ্যানালিটিক্স" }, text: { en: "Use delivery reports to measure campaigns and improve your service.", bn: "ক্যাম্পেইন মাপতে ও সেবা উন্নত করতে ডেলিভারি রিপোর্ট ব্যবহার করুন।" } },
];

const capabilities = [
  { icon: Network, title: { en: "Unified messaging API", bn: "একীভূত মেসেজিং API" }, text: { en: "One integration to reach customers on several channels.", bn: "একটি ইন্টিগ্রেশনে একাধিক চ্যানেলে গ্রাহকের কাছে পৌঁছান।" } },
  { icon: RouteIcon, title: { en: "Smart routing & fallback", bn: "স্মার্ট রাউটিং ও ফলব্যাক" }, text: { en: "Choose the channel order and switch automatically when a message is not delivered.", bn: "চ্যানেলের ক্রম ঠিক করুন, মেসেজ না পৌঁছালে স্বয়ংক্রিয়ভাবে বদলান।" } },
  { icon: Activity, title: { en: "Delivery status", bn: "ডেলিভারি স্ট্যাটাস" }, text: { en: "Delivered, expired, rejected — know what happened to each message.", bn: "পৌঁছেছে, মেয়াদোত্তীর্ণ, প্রত্যাখ্যাত — প্রতিটি মেসেজের অবস্থা জানুন।" } },
  { icon: Webhook, title: { en: "Webhooks & callbacks", bn: "ওয়েবহুক ও কলব্যাক" }, text: { en: "Receive status changes automatically on your callback URL.", bn: "আপনার কলব্যাক URL-এ স্ট্যাটাস পরিবর্তন স্বয়ংক্রিয়ভাবে পান।" } },
];

function Home() {
  const t = useT();
  return (
    <>
      <PageHero
        title={t({ en: "Communicate Effortlessly with Ritorica.", bn: "Ritorica-র সাথে সহজে যোগাযোগ করুন।" })}
        subtitle={t({ en: "Reliable Business Messaging at Scale", bn: "বড় পরিসরে নির্ভরযোগ্য ব্যবসায়িক মেসেজিং" })}
        text={t({
          en: "Bring SMS, OTP, messengers, email, push and voice together in one communications platform. Integrate through our APIs, reach customers on the channel they use and track every message.",
          bn: "এসএমএস, ওটিপি, মেসেঞ্জার, ইমেইল, পুশ ও ভয়েস একটি যোগাযোগ প্ল্যাটফর্মে একত্র করুন। আমাদের API দিয়ে যুক্ত হন, গ্রাহক যে চ্যানেল ব্যবহার করেন সেখানে পৌঁছান এবং প্রতিটি মেসেজ ট্র্যাক করুন।",
        })}
        visual={
          <div className="hero-float absolute inset-0">
            <img src={heroImage} alt={t({ en: "Messaging channels connected on one platform", bn: "এক প্ল্যাটফর্মে যুক্ত মেসেজিং চ্যানেল" })} className="h-full w-full object-cover" width={640} height={500} />
            <SignalOverlay />
          </div>
        }
      />

      <Section title={t(otpJourney.title)} intro={t(otpJourney.intro)} className="pt-14">
        <OtpJourney />
        <OtpDemo />
      </Section>

      <StatementCard
        title={t({ en: "What is Ritorica CPaaS?", bn: "Ritorica সিপাস কী?" })}
        lead={t({ en: "Business messaging infrastructure for every customer touchpoint", bn: "প্রতিটি গ্রাহক যোগাযোগের জন্য ব্যবসায়িক মেসেজিং অবকাঠামো" })}
        text={t({
          en: "Communications Platform as a Service (CPaaS) lets your business add messaging to its own applications without building connections to each operator or messenger. Ritorica provides the channels, the routing and the reporting — your systems simply call the API.",
          bn: "কমিউনিকেশনস প্ল্যাটফর্ম অ্যাজ আ সার্ভিস (সিপাস) আপনার ব্যবসাকে প্রতিটি অপারেটর বা মেসেঞ্জারের সাথে আলাদা সংযোগ না বানিয়েই নিজস্ব অ্যাপ্লিকেশনে মেসেজিং যুক্ত করতে দেয়। Ritorica চ্যানেল, রাউটিং ও রিপোর্টিং দেয় — আপনার সিস্টেম শুধু API কল করে।",
        })}
      />

      <PricingSection />

      <Section title={t({ en: "Solutions for your Business", bn: "আপনার ব্যবসার জন্য সমাধান" })}>
        <ServiceGrid slugs={["sms", "viber", "whatsapp", "telegram", "push-notifications", "voice", "otp-verification", "cascaded-messaging"]} />
        <div className="mt-8">
          <Button asChild variant="brandOutline" size="lg"><Link to="/services">{t(ui.nav.allServices)} <ArrowRight /></Link></Button>
        </div>
      </Section>

      <Section title={t({ en: "Why Choose Ritorica?", bn: "কেন Ritorica বেছে নেবেন?" })}>
        <NumberedTiles items={why} />
      </Section>

      <Section
        title={t({ en: "How business messaging works", bn: "ব্যবসায়িক মেসেজিং কীভাবে কাজ করে" })}
        intro={t({ en: "Your system sends one request. Ritorica selects the channel, delivers the message and reports the result back.", bn: "আপনার সিস্টেম একটি রিকোয়েস্ট পাঠায়। Ritorica চ্যানেল বেছে নেয়, মেসেজ পৌঁছে দেয় এবং ফলাফল ফেরত জানায়।" })}
      >
        <WorkflowDiagram />
      </Section>

      <Section title={t({ en: "Platform capabilities", bn: "প্ল্যাটফর্মের সক্ষমতা" })}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c) => (
            <div key={c.title.en} className="surface-card p-6">
              <c.icon className="size-8 text-primary" />
              <h3 className="mt-4 font-semibold">{t(c.title)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(c.text)}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-10 rounded-2xl bg-navy-deep p-8 text-navy-foreground sm:p-12 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-primary/25 px-3 py-1 text-xs font-bold tracking-widest text-navy-foreground">{t({ en: "DEVELOPERS", bn: "ডেভেলপার" })}</span>
            <h2 className="mt-4 text-3xl font-bold">{t({ en: "Integrate in hours, not weeks", bn: "সপ্তাহ নয়, কয়েক ঘণ্টায় ইন্টিগ্রেট করুন" })}</h2>
            <p className="mt-4 text-navy-muted">
              {t({ en: "A simple HTTP(S) API for sending, status checks, balance and contact lists, plus SMPP for high-volume senders and delivery callbacks to your server.", bn: "পাঠানো, স্ট্যাটাস যাচাই, ব্যালেন্স ও কনট্যাক্ট লিস্টের জন্য সহজ HTTP(S) API, বেশি পরিমাণে পাঠানোর জন্য SMPP, এবং আপনার সার্ভারে ডেলিভারি কলব্যাক।" })}
            </p>
            <Button asChild variant="brand" size="lg" className="mt-8"><Link to="/developers"><Code2 /> {t(ui.cta.docs)}</Link></Button>
          </div>
          <pre className="code-panel overflow-x-auto p-6" aria-label={t(ui.draft.illustrative)}>
{`POST /multi.php HTTP/1.0
Host: http.ritorica.com
Content-Type: application/x-www-form-urlencoded

login=mylogin&password=mypassword
&phones=8801XXXXXXXXX
&originator=Ritorica
&message=Your+OTP+is+481923
&want_sms_ids=1`}
          </pre>
          <ApiConnection />
        </div>
      </Section>

      <Section title={t({ en: "Industry solutions", bn: "শিল্পখাতভিত্তিক সমাধান" })}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((i) => (
            <Link key={i.slug} to="/industries/$slug" params={{ slug: i.slug }} className="surface-card group p-6 hover:shadow-[var(--shadow-lift)]">
              <i.icon className="size-8 text-primary" />
              <h3 className="mt-4 font-semibold group-hover:text-primary">{t(i.name)}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t(i.short)}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <div className="surface-card p-8 sm:p-12">
          <div className="max-w-3xl">
            <ShieldCheck className="size-10 text-primary" />
            <h2 className="heading-brand mt-4 text-3xl">{t({ en: "Security and reliability by design", bn: "নকশাতেই নিরাপত্তা ও নির্ভরযোগ্যতা" })}</h2>
            <p className="mt-4 text-muted-foreground">{t({ en: "Authenticated access, message status tracking, provider redundancy and operational monitoring are the principles behind our platform.", bn: "প্রমাণীকৃত অ্যাক্সেস, মেসেজ স্ট্যাটাস ট্র্যাকিং, প্রোভাইডার রিডানডেন্সি ও অপারেশনাল মনিটরিং আমাদের প্ল্যাটফর্মের মূলনীতি।" })}</p>
            <Button asChild variant="brandOutline" size="lg" className="mt-6"><Link to="/security">{t(ui.cta.learnMore)}</Link></Button>
          </div>
        </div>
      </Section>

      <CTASection />
    </>
  );
}
