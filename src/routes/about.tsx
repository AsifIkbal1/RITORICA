import { PricingLink } from "@/components/site/PricingLink";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Headset, Layers, MessageCircle, MessageSquare, Repeat, Webhook } from "lucide-react";
import { NetworkBackground } from "@/components/site/NetworkBackground";
import { ClientLogos } from "@/components/site/ClientLogos";
import heroImage from "@/assets/brand/hero-image.webp";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { PageHero } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    seo(
      "About Us",
      "About Ritorica: over 20 years of secure, reliable business communication — SMS, messengers, social media and push notifications.",
      "/about",
    ),
  component: AboutPage,
});

const stats = [
  { value: { en: ">150", bn: ">১৫০" }, text: { en: "Skilled professionals power our platforms", bn: "দক্ষ পেশাজীবী আমাদের প্ল্যাটফর্ম চালান" } },
  { value: { en: "24/7", bn: "২৪/৭" }, text: { en: "Support to clients", bn: "গ্রাহকদের জন্য সাপোর্ট" } },
  { value: { en: "Industries", bn: "শিল্পখাত" }, text: { en: "Banking, insurance, retail, transport, tourism, and entertainment.", bn: "ব্যাংকিং, বিমা, রিটেইল, পরিবহন, পর্যটন ও বিনোদন।" } },
];

const why = [
  { title: { en: "12+ Billion Messages in a Single Year", bn: "এক বছরে ১২+ বিলিয়ন মেসেজ" }, text: { en: "In 2025, we delivered over 12 billion messages using our proprietary platforms.", bn: "২০২৫ সালে আমরা নিজস্ব প্ল্যাটফর্মের মাধ্যমে ১২ বিলিয়নের বেশি মেসেজ পৌঁছে দিয়েছি।" } },
  { title: { en: "500+ Direct Connections to Mobile Operators", bn: "মোবাইল অপারেটরের সাথে ৫০০+ সরাসরি সংযোগ" }, text: { en: "With direct global integrations, your messages reach customers reliably in 207 countries.", bn: "সরাসরি বৈশ্বিক সংযোগের মাধ্যমে আপনার মেসেজ ২০৭টি দেশে নির্ভরযোগ্যভাবে গ্রাহকের কাছে পৌঁছায়।" } },
  { title: { en: "150+ In-House Experts", bn: "১৫০+ নিজস্ব বিশেষজ্ঞ" }, text: { en: "Our team understands messaging protocols like SMPP and SOAP, and specializes in building high-load, scalable systems.", bn: "আমাদের টিম SMPP ও SOAP-এর মতো মেসেজিং প্রোটোকল বোঝে এবং উচ্চ-লোড, স্কেলযোগ্য সিস্টেম তৈরিতে দক্ষ।" } },
  { title: { en: "99.99% Uptime Guarantee", bn: "৯৯.৯৯% আপটাইম গ্যারান্টি" }, text: { en: "Our infrastructure delivers consistent, high-speed communications, processing thousands of messages per second.", bn: "আমাদের অবকাঠামো প্রতি সেকেন্ডে হাজারো মেসেজ প্রসেস করে ধারাবাহিক ও দ্রুত যোগাযোগ নিশ্চিত করে।" } },
];

const solutions = [
  { icon: MessageSquare, title: { en: "SMS Messaging", bn: "এসএমএস মেসেজিং" }, text: { en: "Transactional, promotional, and bulk SMS services.", bn: "ট্রানজ্যাকশনাল, প্রচারমূলক ও বাল্ক এসএমএস সেবা।" } },
  { icon: Webhook, title: { en: "API Integration", bn: "API ইন্টিগ্রেশন" }, text: { en: "Flexible integration options that connect business applications with messaging infrastructure.", bn: "ব্যবসায়িক অ্যাপ্লিকেশনকে মেসেজিং অবকাঠামোর সাথে যুক্ত করার নমনীয় ইন্টিগ্রেশন ব্যবস্থা।" } },
  { icon: Layers, title: { en: "SmartConnect", bn: "SmartConnect" }, text: { en: "A multi-channel communication platform designed to help businesses manage customer interactions.", bn: "গ্রাহকের সাথে যোগাযোগ পরিচালনায় ব্যবসাকে সাহায্য করার জন্য তৈরি একটি মাল্টি-চ্যানেল যোগাযোগ প্ল্যাটফর্ম।" } },
  { icon: MessageCircle, title: { en: "WhatsApp Business Solutions", bn: "হোয়াটসঅ্যাপ বিজনেস সমাধান" }, text: { en: "Support for business messaging and customer engagement through the WhatsApp Business Platform.", bn: "WhatsApp Business Platform-এর মাধ্যমে ব্যবসায়িক মেসেজিং ও গ্রাহক সম্পৃক্ততায় সহায়তা।" } },
  { icon: BarChart3, title: { en: "Delivery Reporting", bn: "ডেলিভারি রিপোর্টিং" }, text: { en: "Message status tracking and delivery reports to improve communication visibility.", bn: "যোগাযোগ আরও স্পষ্টভাবে দেখতে মেসেজ স্ট্যাটাস ট্র্যাকিং ও ডেলিভারি রিপোর্ট।" } },
  { icon: Headset, title: { en: "Technical Support", bn: "টেকনিক্যাল সাপোর্ট" }, text: { en: "Assistance with integration, configuration, and messaging-related technical issues.", bn: "ইন্টিগ্রেশন, কনফিগারেশন ও মেসেজিং-সংক্রান্ত কারিগরি সমস্যায় সহায়তা।" } },
];

const sectors = [
  { en: "Banks", bn: "ব্যাংক" },
  { en: "Financial institutions", bn: "আর্থিক প্রতিষ্ঠান" },
  { en: "Mobile financial service providers", bn: "মোবাইল আর্থিক সেবাদাতা" },
  { en: "Insurance companies", bn: "বিমা কোম্পানি" },
  { en: "Healthcare organizations", bn: "স্বাস্থ্যসেবা প্রতিষ্ঠান" },
  { en: "E-commerce businesses", bn: "ই-কমার্স ব্যবসা" },
  { en: "Other enterprises", bn: "অন্যান্য প্রতিষ্ঠান" },
];

const pillars = [
  { en: "Dependable technology", bn: "নির্ভরযোগ্য প্রযুক্তি" },
  { en: "Scalable messaging infrastructure", bn: "স্কেলযোগ্য মেসেজিং অবকাঠামো" },
  { en: "Flexible integration", bn: "নমনীয় ইন্টিগ্রেশন" },
  { en: "Responsive technical support", bn: "দ্রুত টেকনিক্যাল সাপোর্ট" },
];

function AboutPage() {
  const t = useT();
  return (
    <>
      <PageHero
        title={t({ en: "About Ritorica", bn: "Ritorica সম্পর্কে" })}
        text={t({
          en: "At Ritorica, we help businesses create seamless conversations with their customers. For over 20 years, we've specialized in secure, reliable communication services — from SMS and messenger marketing to social media and push notifications.",
          bn: "Ritorica-তে আমরা ব্যবসাগুলোকে গ্রাহকদের সাথে নির্বিঘ্ন যোগাযোগ গড়তে সাহায্য করি। ২০ বছরেরও বেশি সময় ধরে আমরা নিরাপদ ও নির্ভরযোগ্য যোগাযোগ সেবায় বিশেষজ্ঞ — এসএমএস ও মেসেঞ্জার মার্কেটিং থেকে সোশ্যাল মিডিয়া ও পুশ নোটিফিকেশন পর্যন্ত।",
        })}
        actions={
          <>
            <Button asChild variant="brand" size="lg">
              <PricingLink>{t(ui.cta.demo)}</PricingLink>
            </Button>
            <p className="mt-10 text-sm text-muted-foreground">{t({ en: "We are official partners with:", bn: "আমরা যাদের অফিসিয়াল পার্টনার:" })}</p>
            <div className="mt-3 flex flex-wrap items-center gap-6">
              <span className="text-3xl font-bold tracking-tight text-foreground">GSMA</span>
              <span className="leading-none">
                <span className="block text-lg font-semibold text-foreground">∞ Meta</span>
                <span className="block text-[10px] text-muted-foreground">Business Partner</span>
              </span>
            </div>
          </>
        }
        visual={<img src={heroImage} alt="" className="absolute inset-0 size-full object-cover" />}
      />

      <section className="container-site pt-8">
        <div className="surface-card grid gap-8 p-8 sm:p-10 md:grid-cols-[auto_auto_1fr] md:gap-0">
          {stats.map((s, i) => (
            <div key={s.text.en} className={i > 0 ? "md:border-l md:border-border md:pl-10 md:ml-10" : ""}>
              <p className={i === 2 ? "heading-brand text-3xl" : "heading-brand text-5xl"}>{t(s.value)}</p>
              <p className="mt-2 max-w-xs text-[15px] text-muted-foreground">{t(s.text)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-site pt-8">
        <div className="surface-card grid gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
          <div>
            <p className="eyebrow">{t({ en: "About Us", bn: "আমাদের সম্পর্কে" })}</p>
            <h2 className="heading-brand mt-3 text-3xl leading-tight sm:text-4xl">{t({ en: "Connecting Businesses Through Smarter Communication", bn: "স্মার্ট যোগাযোগের মাধ্যমে ব্যবসাকে যুক্ত করছি" })}</h2>
          </div>
          <div className="space-y-4 text-[15px] leading-relaxed text-muted-foreground">
            <p>{t({ en: "Ritorica Information Technology Bangladesh Limited is a technology and communications solutions provider focused on helping businesses connect with their customers through reliable, scalable, and efficient messaging services.", bn: "Ritorica Information Technology Bangladesh Limited একটি প্রযুক্তি ও যোগাযোগ সমাধান প্রদানকারী প্রতিষ্ঠান। নির্ভরযোগ্য, স্কেলযোগ্য ও দক্ষ মেসেজিং সেবার মাধ্যমে ব্যবসাগুলোকে তাদের গ্রাহকের সাথে যুক্ত হতে সাহায্য করাই আমাদের লক্ষ্য।" })}</p>
            <p>{t({ en: "With expertise in A2P (Application-to-Person) messaging and communication technologies, we support businesses in delivering important messages such as OTPs, transaction alerts, account notifications, service updates, and customer communications.", bn: "A2P (Application-to-Person) মেসেজিং ও যোগাযোগ প্রযুক্তিতে দক্ষতা নিয়ে আমরা ব্যবসাগুলোকে গুরুত্বপূর্ণ মেসেজ পৌঁছে দিতে সহায়তা করি — যেমন OTP, লেনদেনের সতর্কবার্তা, অ্যাকাউন্ট নোটিফিকেশন, সেবার আপডেট ও গ্রাহক যোগাযোগ।" })}</p>
          </div>
        </div>
      </section>

      <section className="container-site pt-8">
        <div className="surface-card p-8 sm:p-12">
          <h2 className="heading-brand text-3xl sm:text-4xl">{t({ en: "Our Solutions", bn: "আমাদের সমাধান" })}</h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">{t({ en: "We provide communication solutions designed to meet diverse business needs, including:", bn: "বিভিন্ন ব্যবসায়িক প্রয়োজন মেটাতে আমরা যে যোগাযোগ সমাধান দিই, তার মধ্যে রয়েছে:" })}</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((x) => (
              <article key={x.title.en} className="card-lift rounded-xl border border-border bg-background p-7">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground"><x.icon className="size-6" aria-hidden /></span>
                <h3 className="mt-5 text-lg font-semibold">{t(x.title)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(x.text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-site pt-8">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="surface-card card-lift p-8">
            <h2 className="heading-brand text-2xl">{t({ en: "Who We Serve", bn: "আমরা যাদের সেবা দিই" })}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{t({ en: "Our solutions are designed for organizations that depend on timely and dependable communication, including:", bn: "আমাদের সমাধান সেই প্রতিষ্ঠানগুলোর জন্য, যারা সময়মতো ও নির্ভরযোগ্য যোগাযোগের উপর নির্ভর করে, যেমন:" })}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {sectors.map((x) => (
                <li key={x.en} className="rounded-full bg-primary-soft px-3 py-1.5 text-sm text-accent-foreground">{t(x)}</li>
              ))}
            </ul>
          </div>
          <div className="surface-card card-lift p-8">
            <h2 className="heading-brand text-2xl">{t({ en: "Our Approach", bn: "আমাদের পদ্ধতি" })}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{t({ en: "We believe effective communication is essential to building trust and delivering better customer experiences. Our approach focuses on:", bn: "আমরা বিশ্বাস করি, আস্থা তৈরি ও গ্রাহককে আরও ভালো অভিজ্ঞতা দিতে কার্যকর যোগাযোগ অপরিহার্য। আমাদের পদ্ধতির মূল বিষয়:" })}</p>
            <ul className="mt-5 space-y-2.5">
              {pillars.map((x) => (
                <li key={x.en} className="flex items-center gap-2.5 text-[15px]"><span className="size-2 shrink-0 rounded-full bg-primary" aria-hidden />{t(x)}</li>
              ))}
            </ul>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">{t({ en: "By helping businesses connect their systems with communication channels, we aim to simplify messaging operations and support their evolving business requirements.", bn: "ব্যবসার সিস্টেমকে যোগাযোগ চ্যানেলের সাথে যুক্ত করে আমরা মেসেজিং কার্যক্রম সহজ করতে এবং তাদের পরিবর্তনশীল ব্যবসায়িক চাহিদা পূরণে সহায়তা করতে চাই।" })}</p>
          </div>
          <div className="feature-tile card-lift p-8">
            <h2 className="text-2xl font-bold">{t({ en: "Our Commitment", bn: "আমাদের অঙ্গীকার" })}</h2>
            <p className="mt-4 text-[15px] leading-relaxed opacity-90">{t({ en: "At Ritorica, we are committed to helping businesses communicate more effectively through technology-driven solutions. We continue to focus on service reliability, operational efficiency, and customer-focused support to meet the changing needs of modern digital communication.", bn: "Ritorica-তে আমরা প্রযুক্তিনির্ভর সমাধানের মাধ্যমে ব্যবসাগুলোকে আরও কার্যকরভাবে যোগাযোগ করতে সাহায্য করার জন্য অঙ্গীকারবদ্ধ। আধুনিক ডিজিটাল যোগাযোগের পরিবর্তনশীল চাহিদা মেটাতে আমরা সেবার নির্ভরযোগ্যতা, কার্যক্ষমতা ও গ্রাহককেন্দ্রিক সহায়তায় মনোযোগ দিয়ে যাচ্ছি।" })}</p>
            <p className="mt-6 border-l-2 border-primary-foreground/50 pl-4 font-semibold">{t({ en: "Ritorica — Enabling reliable business communication through technology.", bn: "Ritorica — প্রযুক্তির মাধ্যমে নির্ভরযোগ্য ব্যবসায়িক যোগাযোগ।" })}</p>
          </div>
        </div>
      </section>

      <section id="why-ritorica" className="container-site scroll-mt-24 pt-8">
        <div className="surface-card p-8 sm:p-12">
          <h2 className="heading-brand text-3xl sm:text-4xl">{t({ en: "Why Ritorica?", bn: "কেন Ritorica?" })}</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {why.map((w) => (
              <div key={w.title.en} className="card-lift rounded-xl border border-border bg-background p-7">
                <h3 className="text-xl font-semibold leading-snug text-primary">{t(w.title)}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{t(w.text)}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-background p-7">
              <h3 className="text-lg font-semibold">{t({ en: "Global Client Base", bn: "বৈশ্বিক গ্রাহকভিত্তি" })}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                {t({ en: "From leading banks to major online retailers and international brands, 100,000+ clients trust Ritorica to power their customer communications.", bn: "শীর্ষ ব্যাংক থেকে বড় অনলাইন রিটেইলার ও আন্তর্জাতিক ব্র্যান্ড — ১,০০,০০০+ গ্রাহক তাদের গ্রাহক যোগাযোগের জন্য Ritorica-র উপর ভরসা করেন।" })}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-7">
              <h3 className="text-lg font-semibold">{t({ en: "Enterprise-Grade Security", bn: "এন্টারপ্রাইজ-মানের নিরাপত্তা" })}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                {t({ en: "We operate as a licensed personal data operator, ensuring your data remains secure and compliant.", bn: "আমরা লাইসেন্সপ্রাপ্ত ব্যক্তিগত তথ্য অপারেটর হিসেবে কাজ করি, তাই আপনার তথ্য নিরাপদ ও নিয়মসম্মত থাকে।" })}
              </p>
            </div>
            <div className="feature-tile p-7">
              <h3 className="text-lg font-semibold">{t({ en: "Smart, Multi-Channel Platforms", bn: "স্মার্ট, মাল্টি-চ্যানেল প্ল্যাটফর্ম" })}</h3>
              <p className="mt-4 text-[15px] leading-relaxed opacity-90">{t({ en: "Ritorica's platforms support flexible, omnichannel messaging:", bn: "Ritorica-র প্ল্যাটফর্ম নমনীয়, অমনিচ্যানেল মেসেজিং সমর্থন করে:" })}</p>
              {[
                { icon: MessageSquare, title: { en: "Ritorica Platform", bn: "Ritorica প্ল্যাটফর্ম" }, text: { en: "SMS marketing and secure messaging at scale.", bn: "বড় পরিসরে এসএমএস মার্কেটিং ও নিরাপদ মেসেজিং।" } },
                { icon: Repeat, title: { en: "Smart Delivery", bn: "স্মার্ট ডেলিভারি" }, text: { en: "Multi-channel messaging with automated channel queuing.", bn: "স্বয়ংক্রিয় চ্যানেল সারিসহ মাল্টি-চ্যানেল মেসেজিং।" } },
              ].map((p) => (
                <div key={p.title.en} className="mt-4 flex gap-4 rounded-lg border border-primary-foreground/25 bg-primary-foreground/10 p-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/20">
                    <p.icon className="size-5" />
                  </span>
                  <span>
                    <span className="block font-semibold">{t(p.title)}</span>
                    <span className="block text-sm opacity-90">{t(p.text)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ClientLogos />

      <section className="container-site pt-8">
        <div className="cta-dark relative isolate overflow-hidden px-6 py-16 text-center sm:py-20">
          <NetworkBackground variant="dark" className="-z-10" />
          <h2 className="text-3xl font-bold sm:text-5xl">{t({ en: "Ready to Begin?", bn: "শুরু করতে প্রস্তুত?" })}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed opacity-85">
            {t({ en: "Unlock seamless conversations across every channel. Click below to see Ritorica in action and discover how it can transform your communication.", bn: "প্রতিটি চ্যানেলে নির্বিঘ্ন যোগাযোগ শুরু করুন। নিচে ক্লিক করে Ritorica-কে কাজে দেখুন এবং জানুন এটি কীভাবে আপনার যোগাযোগ বদলে দিতে পারে।" })}
          </p>
          <Button asChild variant="brand" size="lg" className="mt-8">
            <PricingLink>{t(ui.cta.demo)}</PricingLink>
          </Button>
        </div>
      </section>
    </>
  );
}
