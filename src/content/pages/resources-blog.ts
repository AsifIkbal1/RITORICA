import type { RichPage } from "./types";

/** Source: ritorica.com/resources/blog (supplied by the client). */
export const page: RichPage = {
  group: "resources",
  slug: "blog",
  name: { en: "Blog", bn: "ব্লগ" },
  eyebrow: { en: "Ritorica Blog", bn: "Ritorica ব্লগ" },
  title: { en: "Insights to Power Your Messaging Strategy", bn: "আপনার মেসেজিং কৌশলকে শক্তিশালী করার অন্তর্দৃষ্টি" },
  intro: {
    en: "Practical guides, expert analysis, and real-world tactics from our team of messaging engineers, business developers, and strategists.",
    bn: "আমাদের মেসেজিং ইঞ্জিনিয়ার, বিজনেস ডেভেলপার ও স্ট্র্যাটেজিস্টদের দল থেকে প্রায়োগিক গাইড, বিশেষজ্ঞ বিশ্লেষণ ও বাস্তব কৌশল।",
  },
  highlight: { en: "From the Ritorica Team", bn: "Ritorica টিমের পক্ষ থেকে" },
  description: "Ritorica Blog: practical guides, expert analysis, and real-world tactics on WhatsApp, CPaaS, and omnichannel messaging.",
  trust: false,
  sections: [
    {
      kind: "articles",
      title: { en: "Latest Articles", bn: "সাম্প্রতিক নিবন্ধ" },
      items: [
        {
          tag: { en: "WhatsApp API", bn: "হোয়াটসঅ্যাপ API" },
          title: {
            en: "WhatsApp Business API Integration: A Technical Guide for Enterprise Teams",
            bn: "হোয়াটসঅ্যাপ বিজনেস API ইন্টিগ্রেশন: এন্টারপ্রাইজ টিমের জন্য টেকনিক্যাল গাইড",
          },
          text: {
            en: "From webhook setup to message templates and delivery optimization — everything your engineering and marketing teams need to get WhatsApp running at scale.",
            bn: "ওয়েবহুক সেটআপ থেকে মেসেজ টেমপ্লেট ও ডেলিভারি অপটিমাইজেশন পর্যন্ত — বড় পরিসরে হোয়াটসঅ্যাপ চালু করতে আপনার ইঞ্জিনিয়ারিং ও মার্কেটিং টিমের যা যা দরকার।",
          },
          meta: { en: "April 15, 2025 · 8 min read · Moustafa Elkoushy", bn: "১৫ এপ্রিল, ২০২৫ · ৮ মিনিট পড়া · Moustafa Elkoushy" },
        },
        {
          tag: { en: "Business Growth", bn: "ব্যবসায়িক প্রবৃদ্ধি" },
          title: {
            en: "CPaaS in 2025: How Business Developers Are Driving Revenue Through Messaging",
            bn: "CPaaS ২০২৫-এ: বিজনেস ডেভেলপাররা কীভাবে মেসেজিং দিয়ে রাজস্ব বাড়াচ্ছেন",
          },
          text: {
            en: "The enterprise messaging market is growing fast. Here's how savvy business developers are turning CPaaS platforms into consistent revenue streams across verticals.",
            bn: "এন্টারপ্রাইজ মেসেজিং বাজার দ্রুত বাড়ছে। দক্ষ বিজনেস ডেভেলপাররা কীভাবে CPaaS প্ল্যাটফর্মকে বিভিন্ন খাতে নিয়মিত রাজস্বের উৎসে পরিণত করছেন, তা এখানে দেখুন।",
          },
          meta: { en: "April 8, 2025 · 6 min read · Abdo Futhai", bn: "৮ এপ্রিল, ২০২৫ · ৬ মিনিট পড়া · Abdo Futhai" },
        },
        {
          tag: { en: "CMO Strategy", bn: "সিএমও স্ট্র্যাটেজি" },
          title: {
            en: "The CMO's Omnichannel Messaging Playbook: From Strategy to Execution",
            bn: "সিএমও-দের অমনিচ্যানেল মেসেজিং প্লেবুক: কৌশল থেকে বাস্তবায়ন",
          },
          text: {
            en: "Customers expect seamless communication across every channel. This playbook outlines the strategic framework CMOs are using to connect SMS, WhatsApp, email, and push into one coherent journey.",
            bn: "গ্রাহকরা প্রতিটি চ্যানেলে নির্বিঘ্ন যোগাযোগ আশা করেন। এই প্লেবুকে সেই কৌশলগত কাঠামো তুলে ধরা হয়েছে, যা দিয়ে সিএমও-রা এসএমএস, হোয়াটসঅ্যাপ, ইমেইল ও পুশকে একটি সুসংগত যাত্রায় যুক্ত করছেন।",
          },
          meta: { en: "March 28, 2025 · 7 min read · Gleb Yastrebko", bn: "২৮ মার্চ, ২০২৫ · ৭ মিনিট পড়া · Gleb Yastrebko" },
        },
        {
          tag: { en: "SMS Delivery", bn: "এসএমএস ডেলিভারি" },
          title: { en: "Masking vs Non-Masking SMS: The Complete Guide", bn: "মাস্কিং বনাম নন-মাস্কিং এসএমএস: সম্পূর্ণ গাইড" },
          text: {
            en: "One shows your brand name, the other a number — and the difference is roughly double the price plus weeks of approval. What each costs, what each requires, and which to start on.",
            bn: "একটিতে দেখা যায় আপনার ব্র্যান্ডের নাম, অন্যটিতে একটি নম্বর — আর পার্থক্যটা প্রায় দ্বিগুণ দাম এবং অনুমোদনের কয়েক সপ্তাহ। প্রতিটির খরচ, প্রয়োজনীয়তা ও শুরু করার সঠিক পথ।",
          },
          meta: { en: "October 1, 2026 · 9 min read · Moustafa Elkoushy", bn: "১ অক্টোবর, ২০২৬ · ৯ মিনিট পড়া · Moustafa Elkoushy" },
        },
      ],
    },
    {
      kind: "list",
      title: { en: "Popular Tags", bn: "জনপ্রিয় ট্যাগ" },
      items: {
        en: ["WhatsApp API", "SMS Marketing", "Omnichannel", "CPaaS", "Authentication", "Customer Engagement", "E-commerce", "ROI"],
        bn: ["হোয়াটসঅ্যাপ API", "এসএমএস মার্কেটিং", "অমনিচ্যানেল", "CPaaS", "অথেনটিকেশন", "কাস্টমার এনগেজমেন্ট", "ই-কমার্স", "ROI"],
      },
    },
  ],
  cta: {
    title: { en: "Ready to Transform Your Customer Communication?", bn: "আপনার গ্রাহক যোগাযোগ বদলে দিতে প্রস্তুত?" },
    text: {
      en: "Join thousands of businesses using Ritorica to deliver personalized messaging at scale.",
      bn: "হাজারো ব্যবসার সাথে যুক্ত হোন, যারা Ritorica ব্যবহার করে বড় পরিসরে ব্যক্তিগতকৃত মেসেজিং পৌঁছে দিচ্ছে।",
    },
  },
};
