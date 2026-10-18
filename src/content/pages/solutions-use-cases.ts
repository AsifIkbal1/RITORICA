import type { RichPage } from "./types";

/** Source: ritorica.com/solutions/use-cases (supplied by the client). */
export const page: RichPage = {
  group: "solutions",
  slug: "use-cases",
  name: { en: "Use Cases", bn: "ইউজ কেস" },
  eyebrow: { en: "Solutions & Use Cases", bn: "সলিউশন ও ইউজ কেস" },
  title: { en: "Real Scenarios. Proven Results.", bn: "বাস্তব পরিস্থিতি। প্রমাণিত ফলাফল।" },
  intro: {
    en: "See how leading enterprises use Ritorica's messaging channels to drive authentication, engagement, support, and revenue — across every industry.",
    bn: "অথেন্টিকেশন, সম্পৃক্ততা, সাপোর্ট ও রাজস্ব বাড়াতে শীর্ষস্থানীয় প্রতিষ্ঠানগুলো কীভাবে Ritorica-র মেসেজিং চ্যানেল ব্যবহার করে — প্রতিটি ইন্ডাস্ট্রিতে দেখুন।",
  },
  description: "Real-world Ritorica use cases: OTP, marketing campaigns, order updates, support, bookings, cart recovery, retention, flash sales.",
  trust: false,
  sections: [
    {
      kind: "stats",
      title: { en: "Solutions & Use Cases", bn: "সলিউশন ও ইউজ কেস" },
      items: [
        { value: { en: "98%", bn: "৯৮%" }, label: { en: "SMS open rate within 3 minutes", bn: "৩ মিনিটের মধ্যে এসএমএস ওপেন রেট" } },
        { value: { en: "8+", bn: "৮+" }, label: { en: "Messaging channels in one platform", bn: "এক প্ল্যাটফর্মে মেসেজিং চ্যানেল" } },
        { value: { en: "3×", bn: "৩×" }, label: { en: "Higher conversion vs email alone", bn: "শুধু ইমেইলের তুলনায় বেশি কনভার্সন" } },
        { value: { en: "150+", bn: "১৫০+" }, label: { en: "Countries covered globally", bn: "বিশ্বব্যাপী কাভার করা দেশ" } },
      ],
    },
    {
      kind: "features",
      title: { en: "What Businesses Build with Ritorica", bn: "Ritorica দিয়ে ব্যবসাগুলো যা তৈরি করে" },
      intro: {
        en: "From one-time passwords to full omnichannel journeys — here's how enterprises put our platform to work.",
        bn: "ওয়ান-টাইম পাসওয়ার্ড থেকে শুরু করে সম্পূর্ণ অমনিচ্যানেল যাত্রা পর্যন্ত — প্রতিষ্ঠানগুলো কীভাবে আমাদের প্ল্যাটফর্ম ব্যবহার করে তা দেখুন।",
      },
      items: [
        {
          title: { en: "OTP & Two-Factor Authentication", bn: "OTP ও টু-ফ্যাক্টর অথেন্টিকেশন" },
          text: {
            en: "Deliver one-time passwords in under 3 seconds via SMS, WhatsApp, or Telegram. Reduce fraud and increase login security without adding friction. Example: a fintech startup was losing 12% of new signups due to delayed email OTPs. They switched to SMS + WhatsApp dual-channel delivery with automatic fallback.",
            bn: "এসএমএস, হোয়াটসঅ্যাপ বা টেলিগ্রামে ৩ সেকেন্ডের কম সময়ে ওয়ান-টাইম পাসওয়ার্ড পৌঁছান। ঝামেলা ছাড়াই প্রতারণা কমান ও লগইন নিরাপত্তা বাড়ান। উদাহরণ: দেরিতে আসা ইমেইল OTP-র কারণে একটি ফিনটেক স্টার্টআপ ১২% নতুন সাইনআপ হারাচ্ছিল। তারা স্বয়ংক্রিয় ফলব্যাকসহ SMS + WhatsApp ডুয়াল-চ্যানেল ডেলিভারিতে স্থানান্তরিত হয়।",
          },
          tag: { en: "✅ ↓ 87% OTP delivery time · ↑ 12% signup completion rate  |  Channels: SMS, WhatsApp, Telegram", bn: "✅ OTP ডেলিভারি সময় ৮৭% কমেছে · সাইনআপ সম্পন্ন হওয়ার হার ১২% বেড়েছে  |  চ্যানেল: SMS, WhatsApp, Telegram" },
        },
        {
          title: { en: "Promotional & Marketing Campaigns", bn: "প্রমোশনাল ও মার্কেটিং ক্যাম্পেইন" },
          text: {
            en: "Run bulk campaigns across SMS, Viber, WhatsApp, and Email simultaneously. Personalise messages at scale, track click-through rates, and A/B test in real time. Example: a fashion retailer sent a combined Viber + SMS campaign to 200k subscribers before Black Friday, with personalised product recommendations per segment.",
            bn: "একসাথে SMS, Viber, WhatsApp ও Email-এ বাল্ক ক্যাম্পেইন চালান। বড় পরিসরে মেসেজ ব্যক্তিগতকৃত করুন, ক্লিক-থ্রু রেট ট্র্যাক করুন ও রিয়েল-টাইমে A/B টেস্ট করুন। উদাহরণ: একটি ফ্যাশন রিটেইলার ব্ল্যাক ফ্রাইডের আগে ২ লক্ষ সাবস্ক্রাইবারের কাছে Viber + SMS সম্মিলিত ক্যাম্পেইন পাঠায়, প্রতিটি সেগমেন্টের জন্য ব্যক্তিগতকৃত প্রোডাক্ট সুপারিশসহ।",
          },
          tag: { en: "✅ 31% click-through rate · 4.7× ROAS within 2 hours of send  |  Channels: SMS, Viber, WhatsApp, Email", bn: "✅ ৩১% ক্লিক-থ্রু রেট · পাঠানোর ২ ঘণ্টার মধ্যে ৪.৭× ROAS  |  চ্যানেল: SMS, Viber, WhatsApp, Email" },
        },
        {
          title: { en: "Order & Delivery Notifications", bn: "অর্ডার ও ডেলিভারি বিজ্ঞপ্তি" },
          text: {
            en: "Keep customers informed at every stage — order confirmed, shipped, out for delivery, delivered. Automated triggers reduce inbound support calls by up to 40%. Example: an e-commerce platform automated WhatsApp updates at 4 shipping stages — confirmed, dispatched, out for delivery, and delivered — for every order.",
            bn: "প্রতিটি ধাপে গ্রাহককে জানিয়ে রাখুন — অর্ডার নিশ্চিত, প্রেরিত, ডেলিভারির পথে, ডেলিভারি হয়েছে। স্বয়ংক্রিয় ট্রিগার ইনবাউন্ড সাপোর্ট কল ৪০% পর্যন্ত কমায়। উদাহরণ: একটি ই-কমার্স প্ল্যাটফর্ম প্রতিটি অর্ডারের ৪টি শিপিং ধাপে — নিশ্চিত, প্রেরিত, ডেলিভারির পথে ও ডেলিভারি হয়েছে — স্বয়ংক্রিয় হোয়াটসঅ্যাপ আপডেট চালু করে।",
          },
          tag: { en: "✅ ↓ 40% inbound support calls · 94% customer satisfaction score  |  Channels: SMS, WhatsApp, Push, Viber", bn: "✅ ইনবাউন্ড সাপোর্ট কল ৪০% কমেছে · ৯৪% গ্রাহক সন্তুষ্টি স্কোর  |  চ্যানেল: SMS, WhatsApp, Push, Viber" },
        },
        {
          title: { en: "Omnichannel Customer Support", bn: "অমনিচ্যানেল কাস্টমার সাপোর্ট" },
          text: {
            en: "Handle all customer conversations — WhatsApp, Viber, SMS, Email — inside one unified inbox. Assign to agents, set SLA timers, and automate first responses with bots. Example: a telecom operator routed all WhatsApp, Viber, and SMS customer messages into a single agent workspace, with bot-handled first responses.",
            bn: "WhatsApp, Viber, SMS, Email — সব গ্রাহক কথোপকথন একটি একীভূত ইনবক্সে পরিচালনা করুন। এজেন্টদের দায়িত্ব দিন, SLA টাইমার সেট করুন এবং বট দিয়ে প্রথম উত্তর স্বয়ংক্রিয় করুন। উদাহরণ: একটি টেলিকম অপারেটর সব WhatsApp, Viber ও SMS গ্রাহক মেসেজ একটি এজেন্ট ওয়ার্কস্পেসে পাঠায়, যেখানে বট প্রথম উত্তর দেয়।",
          },
          tag: { en: "✅ ↓ 35% average handle time · ↑ 28% first-contact resolution  |  Channels: Chat Platform, WhatsApp, Viber Bots", bn: "✅ গড় হ্যান্ডল সময় ৩৫% কমেছে · প্রথম যোগাযোগেই সমাধান ২৮% বেড়েছে  |  চ্যানেল: Chat Platform, WhatsApp, Viber Bots" },
        },
        {
          title: { en: "Appointment & Booking Reminders", bn: "অ্যাপয়েন্টমেন্ট ও বুকিং রিমাইন্ডার" },
          text: {
            en: "Automatically send reminders 24h and 1h before appointments. Include confirm/cancel/reschedule options. Used widely in healthcare, banking, and service industries. Example: a clinic chain sent SMS + WhatsApp reminders 24h and 1h before each appointment, with one-tap confirm, cancel, and reschedule options.",
            bn: "অ্যাপয়েন্টমেন্টের ২৪ ঘণ্টা ও ১ ঘণ্টা আগে স্বয়ংক্রিয়ভাবে রিমাইন্ডার পাঠান। কনফার্ম/বাতিল/পুনঃনির্ধারণ অপশনসহ। স্বাস্থ্যসেবা, ব্যাংকিং ও সেবা খাতে ব্যাপকভাবে ব্যবহৃত হয়। উদাহরণ: একটি ক্লিনিক চেইন প্রতিটি অ্যাপয়েন্টমেন্টের ২৪ ঘণ্টা ও ১ ঘণ্টা আগে SMS + WhatsApp রিমাইন্ডার পাঠায়, এক-ট্যাপ কনফার্ম, বাতিল ও পুনঃনির্ধারণ অপশনসহ।",
          },
          tag: { en: "✅ ↓ 60% no-show rate · 120+ staff hours saved per month  |  Channels: SMS, WhatsApp, Viber, Email", bn: "✅ নো-শো রেট ৬০% কমেছে · মাসে ১২০+ কর্মঘণ্টা সাশ্রয়  |  চ্যানেল: SMS, WhatsApp, Viber, Email" },
        },
        {
          title: { en: "Abandoned Cart Recovery", bn: "কার্ট ত্যাগের পুনরুদ্ধার" },
          text: {
            en: "Re-engage shoppers who left without buying. Send a personalised reminder with product image and a direct checkout link via WhatsApp or SMS — average recovery rate of 15–20%. Example: a home-goods retailer triggered personalised WhatsApp messages — with product photo and direct checkout link — 1 hour after cart abandonment.",
            bn: "না কিনে চলে যাওয়া ক্রেতাদের ফিরিয়ে আনুন। প্রোডাক্টের ছবি ও সরাসরি চেকআউট লিংকসহ হোয়াটসঅ্যাপ বা এসএমএসে ব্যক্তিগতকৃত রিমাইন্ডার পাঠান — গড় পুনরুদ্ধার হার ১৫–২০%। উদাহরণ: একটি হোম-গুডস রিটেইলার কার্ট ত্যাগের ১ ঘণ্টা পর প্রোডাক্ট ছবি ও সরাসরি চেকআউট লিংকসহ ব্যক্তিগতকৃত হোয়াটসঅ্যাপ মেসেজ পাঠায়।",
          },
          tag: { en: "✅ 18% cart recovery rate · 3.2× ROI vs email-only follow-up  |  Channels: WhatsApp, SMS, Push, Email", bn: "✅ ১৮% কার্ট পুনরুদ্ধার হার · শুধু ইমেইল ফলো-আপের তুলনায় ৩.২× ROI  |  চ্যানেল: WhatsApp, SMS, Push, Email" },
        },
        {
          title: { en: "Customer Re-engagement & Retention", bn: "কাস্টমার পুনঃসম্পৃক্তি ও ধরে রাখা" },
          text: {
            en: "Win back dormant users with targeted push notifications, Viber messages, or personalised email flows. Trigger based on inactivity windows, loyalty tiers, or lifecycle stage. Example: a subscription app targeted 90-day inactive users with a personalised push notification followed by a Viber message if unopened after 48 hours.",
            bn: "লক্ষ্যভিত্তিক পুশ নোটিফিকেশন, ভাইবার মেসেজ বা ব্যক্তিগতকৃত ইমেইল প্রবাহে নিষ্ক্রিয় ব্যবহারকারীদের ফিরিয়ে আনুন। নিষ্ক্রিয়তার সময়কাল, লয়্যালটি স্তর বা লাইফসাইকেল পর্যায়ের ভিত্তিতে ট্রিগার করুন। উদাহরণ: একটি সাবস্ক্রিপশন অ্যাপ ৯০ দিন নিষ্ক্রিয় ব্যবহারকারীদের লক্ষ্য করে ব্যক্তিগতকৃত পুশ নোটিফিকেশন পাঠায়, ৪৮ ঘণ্টা পরেও না খুললে ভাইবার মেসেজ পাঠায়।",
          },
          tag: { en: "✅ 22% reactivation rate · ↓ 14% monthly churn in 60 days  |  Channels: Push, Viber, Email, SMS", bn: "✅ ২২% রিঅ্যাক্টিভেশন রেট · ৬০ দিনে মাসিক churn ১৪% কমেছে  |  চ্যানেল: Push, Viber, Email, SMS" },
        },
        {
          title: { en: "Flash Sales & Time-Limited Offers", bn: "ফ্ল্যাশ সেল ও সময়সীমিত অফার" },
          text: {
            en: "Announce limited-time promotions to opted-in subscribers in seconds. Rich Viber and WhatsApp messages with banners and CTA buttons drive up to 5× higher engagement than email. Example: a retail chain sent a Viber rich message with a banner image and CTA button to 80k opted-in subscribers announcing a 4-hour flash discount at 10:00 AM.",
            bn: "কয়েক সেকেন্ডেই অপ্ট-ইন সাবস্ক্রাইবারদের কাছে সীমিত সময়ের প্রমোশন ঘোষণা করুন। ব্যানার ও CTA বাটনসহ রিচ ভাইবার ও হোয়াটসঅ্যাপ মেসেজ ইমেইলের তুলনায় ৫× পর্যন্ত বেশি সম্পৃক্ততা আনে। উদাহরণ: একটি রিটেইল চেইন সকাল ১০টায় ৪ ঘণ্টার ফ্ল্যাশ ডিসকাউন্ট ঘোষণা করে ৮০,০০০ অপ্ট-ইন সাবস্ক্রাইবারের কাছে ব্যানার ছবি ও CTA বাটনসহ একটি ভাইবার রিচ মেসেজ পাঠায়।",
          },
          tag: { en: "✅ 5,200 orders in 90 minutes · 5× revenue vs previous email flash sale  |  Channels: Viber, WhatsApp, SMS, Push", bn: "✅ ৯০ মিনিটে ৫,২০০ অর্ডার · আগের ইমেইল ফ্ল্যাশ সেলের তুলনায় ৫× রাজস্ব  |  চ্যানেল: Viber, WhatsApp, SMS, Push" },
        },
      ],
    },
    {
      kind: "steps",
      title: { en: "From Idea to Live Campaign in 4 Steps", bn: "আইডিয়া থেকে লাইভ ক্যাম্পেইন, ৪ ধাপে" },
      intro: {
        en: "Whether you're sending OTPs or running an omnichannel campaign, you're live in hours — not weeks.",
        bn: "আপনি OTP পাঠান বা অমনিচ্যানেল ক্যাম্পেইন চালান — কয়েক সপ্তাহ নয়, কয়েক ঘণ্টাতেই লাইভ হতে পারবেন।",
      },
      items: [
        { title: { en: "Connect via API", bn: "API দিয়ে সংযুক্ত করুন" }, text: { en: "Integrate Ritorica's REST API or use a ready-made SDK for your stack. Takes under an hour.", bn: "Ritorica-র REST API ইন্টিগ্রেট করুন বা আপনার স্ট্যাকের জন্য তৈরি SDK ব্যবহার করুন। এক ঘণ্টারও কম সময় লাগে।" } },
        { title: { en: "Choose Your Channels", bn: "আপনার চ্যানেল বেছে নিন" }, text: { en: "Select SMS, WhatsApp, Viber, Push, Email, or any combination from one dashboard.", bn: "এক ড্যাশবোর্ড থেকে SMS, WhatsApp, Viber, Push, Email বা যেকোনো সমন্বয় বেছে নিন।" } },
        { title: { en: "Build Your Flow", bn: "আপনার ফ্লো তৈরি করুন" }, text: { en: "Set triggers, templates, fallbacks, and personalisation rules — no code required for simple flows.", bn: "ট্রিগার, টেমপ্লেট, ফলব্যাক ও ব্যক্তিগতকরণ নিয়ম সেট করুন — সাধারণ ফ্লোর জন্য কোনো কোডের দরকার নেই।" } },
        { title: { en: "Launch & Measure", bn: "চালু করুন ও পরিমাপ করুন" }, text: { en: "Go live and track delivery, opens, clicks, and conversions in real time from the analytics dashboard.", bn: "লাইভ হোন এবং অ্যানালিটিক্স ড্যাশবোর্ড থেকে রিয়েল-টাইমে ডেলিভারি, ওপেন, ক্লিক ও কনভার্সন ট্র্যাক করুন।" } },
      ],
    },
  ],
  cta: {
    title: { en: "Ready to Build Your Use Case?", bn: "আপনার ইউজ কেস তৈরি করতে প্রস্তুত?" },
    text: {
      en: "Our solutions team will help you design the right messaging flow for your business — from first message to full scale.",
      bn: "আমাদের সলিউশন টিম আপনার ব্যবসার জন্য সঠিক মেসেজিং ফ্লো তৈরি করতে সাহায্য করবে — প্রথম মেসেজ থেকে পূর্ণ স্কেল পর্যন্ত।",
    },
  },
};
