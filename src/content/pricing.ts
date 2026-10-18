import type { L } from "@/i18n/language";

/** Published starting prices in BDT per SMS, as supplied by Ritorica. */
export type PricePlan = {
  id: string;
  name: L;
  fromBdt: number;
  features: L[];
  cta: L;
};

export const pricePlans: PricePlan[] = [
  {
    id: "masking",
    name: { en: "Masking SMS", bn: "মাস্কিং এসএমএস" },
    fromBdt: 0.48,
    features: [
      { en: "Support masking in all operators", bn: "সব অপারেটরে মাস্কিং সাপোর্ট" },
      { en: "Single, bulk & group SMS facility", bn: "একক, বাল্ক ও গ্রুপ এসএমএস সুবিধা" },
      { en: "GSM, extended GSM & Unicode", bn: "জিএসএম, এক্সটেন্ডেড জিএসএম ও ইউনিকোড" },
      { en: "Free SMS API & dashboard", bn: "ফ্রি এসএমএস API ও ড্যাশবোর্ড" },
      { en: "Real-time delivery reports", bn: "রিয়েল-টাইম ডেলিভারি রিপোর্ট" },
      { en: "Bulk SMS from Excel & phonebook", bn: "Excel ও ফোনবুক থেকে বাল্ক এসএমএস" },
      { en: "Support dynamic & long SMS", bn: "ডায়নামিক ও দীর্ঘ এসএমএস সাপোর্ট" },
    ],
    cta: { en: "View masking packages", bn: "মাস্কিং প্যাকেজ দেখুন" },
  },
  {
    id: "non-masking",
    name: { en: "Non-masking SMS", bn: "নন-মাস্কিং এসএমএস" },
    fromBdt: 0.25,
    features: [
      { en: "Single, bulk & group SMS facility", bn: "একক, বাল্ক ও গ্রুপ এসএমএস সুবিধা" },
      { en: "GSM, extended GSM & Unicode", bn: "জিএসএম, এক্সটেন্ডেড জিএসএম ও ইউনিকোড" },
      { en: "Free SMS API & dashboard", bn: "ফ্রি এসএমএস API ও ড্যাশবোর্ড" },
      { en: "Real-time delivery reports", bn: "রিয়েল-টাইম ডেলিভারি রিপোর্ট" },
      { en: "Bulk SMS from Excel & phonebook", bn: "Excel ও ফোনবুক থেকে বাল্ক এসএমএস" },
      { en: "Support dynamic & long SMS", bn: "ডায়নামিক ও দীর্ঘ এসএমএস সাপোর্ট" },
    ],
    cta: { en: "View non-masking packages", bn: "নন-মাস্কিং প্যাকেজ দেখুন" },
  },
  {
    id: "otp",
    name: { en: "OTP SMS", bn: "ওটিপি এসএমএস" },
    fromBdt: 0.35,
    features: [
      { en: "Instantly send & deliver OTP SMS", bn: "তাৎক্ষণিক ওটিপি এসএমএস পাঠানো ও ডেলিভারি" },
      { en: "SMS delivery in under 1 second", bn: "১ সেকেন্ডের কম সময়ে এসএমএস ডেলিভারি" },
      { en: "GSM, extended GSM & Unicode", bn: "জিএসএম, এক্সটেন্ডেড জিএসএম ও ইউনিকোড" },
      { en: "Free SMS API & dashboard", bn: "ফ্রি এসএমএস API ও ড্যাশবোর্ড" },
      { en: "More secure than email", bn: "ইমেইলের চেয়ে বেশি নিরাপদ" },
      { en: "Both masking & non-masking", bn: "মাস্কিং ও নন-মাস্কিং উভয়ই" },
      { en: "Real-time delivery reports", bn: "রিয়েল-টাইম ডেলিভারি রিপোর্ট" },
    ],
    cta: { en: "View OTP packages", bn: "ওটিপি প্যাকেজ দেখুন" },
  },
  {
    id: "location",
    name: { en: "Location-based SMS", bn: "লোকেশন-ভিত্তিক এসএমএস" },
    fromBdt: 0.26,
    features: [
      { en: "Sender type: masking / long code", bn: "সেন্ডারের ধরন: মাস্কিং / লং কোড" },
      { en: "GSM, extended GSM & Unicode", bn: "জিএসএম, এক্সটেন্ডেড জিএসএম ও ইউনিকোড" },
      { en: "Operator-wise summary reports", bn: "অপারেটরভিত্তিক সারাংশ রিপোর্ট" },
      { en: "Sends long SMS in one go", bn: "একবারে দীর্ঘ এসএমএস পাঠায়" },
      { en: "Location coverage: Thana / District", bn: "লোকেশন কভারেজ: থানা / জেলা" },
      { en: "Network: GP, Robi/Airtel & BL", bn: "নেটওয়ার্ক: জিপি, রবি/এয়ারটেল ও বাংলালিংক" },
      { en: "Validity: one-time campaign", bn: "মেয়াদ: একবারের ক্যাম্পেইন" },
    ],
    cta: { en: "View location-based packages", bn: "লোকেশন-ভিত্তিক প্যাকেজ দেখুন" },
  },
];

/** Formats a BDT price in the active language, e.g. "৳0.48" / "৳০.৪৮". */
export function formatBdt(value: number, lang: "en" | "bn") {
  const s = value.toFixed(2);
  if (lang === "en") return `৳${s}`;
  const digits = "০১২৩৪৫৬৭৮৯";
  return "৳" + s.replace(/\d/g, (d) => digits[Number(d)] ?? d);
}

/** Feature cards shown under the price cards (supplied by the client with the pricing section). */
export type SmsFeatureIcon = "api" | "reports" | "unicode" | "recharge" | "schedule" | "excel" | "masking" | "balance" | "language" | "routing" | "location" | "upload";
export const smsFeatures: { icon: SmsFeatureIcon; title: L; text: L }[] = [
  { icon: "api", title: { en: "Powerful SMS API Integration", bn: "শক্তিশালী এসএমএস API ইন্টিগ্রেশন" }, text: { en: "Integrate our **Bulk SMS API** into your website or application with simple documentation. Send high-volume SMS instantly with low latency, high delivery speed, and a reliable SMS gateway.", bn: "সহজ ডকুমেন্টেশন দিয়ে আমাদের **বাল্ক এসএমএস API** আপনার ওয়েবসাইট বা অ্যাপে যুক্ত করুন। কম ল্যাটেন্সি, দ্রুত ডেলিভারি ও নির্ভরযোগ্য গেটওয়েতে মুহূর্তে বিপুল এসএমএস পাঠান।" } },
  { icon: "reports", title: { en: "Real-time Delivery Reports", bn: "রিয়েল-টাইম ডেলিভারি রিপোর্ট" }, text: { en: "Track your **SMS delivery report in Bangladesh** in real time. Monitor sent, delivered, failed, and pending SMS with detailed analytics to optimize your **SMS marketing performance** and improve ROI.", bn: "**বাংলাদেশে এসএমএস ডেলিভারি রিপোর্ট** রিয়েল-টাইমে দেখুন। পাঠানো, পৌঁছানো, ব্যর্থ ও অপেক্ষমাণ এসএমএস বিস্তারিত অ্যানালিটিক্সে দেখে **এসএমএস মার্কেটিংয়ের ফল** ও ROI বাড়ান।" } },
  { icon: "unicode", title: { en: "Unicode & Long SMS Support", bn: "ইউনিকোড ও দীর্ঘ এসএমএস সাপোর্ট" }, text: { en: "Full **Unicode SMS support in Bangladesh** for Bangla, Arabic, and all languages. Send long SMS without truncation using our advanced **bulk SMS system**.", bn: "বাংলা, আরবি ও সব ভাষার জন্য **পূর্ণ ইউনিকোড এসএমএস সাপোর্ট**। আমাদের উন্নত **বাল্ক এসএমএস সিস্টেমে** দীর্ঘ এসএমএস না কেটেই পাঠান।" } },
  { icon: "recharge", title: { en: "24/7 Auto Recharge System", bn: "২৪/৭ অটো রিচার্জ সিস্টেম" }, text: { en: "Recharge your SMS balance anytime using **bKash, Nagad, or bank cards in Bangladesh**. The auto recharge system ensures uninterrupted **bulk SMS service** without downtime.", bn: "**বিকাশ, নগদ বা ব্যাংক কার্ডে** যেকোনো সময় এসএমএস ব্যালেন্স রিচার্জ করুন। অটো রিচার্জে **বাল্ক এসএমএস সেবা** বিরতিহীন চলে।" } },
  { icon: "schedule", title: { en: "SMS Scheduling (GUI & API)", bn: "এসএমএস শিডিউলিং (GUI ও API)" }, text: { en: "Schedule bulk **SMS campaigns in Bangladesh** using the dashboard or API. Perfect for OTP, reminders, promotions, and automated marketing workflows.", bn: "ড্যাশবোর্ড বা API দিয়ে **বাল্ক এসএমএস ক্যাম্পেইন** শিডিউল করুন। OTP, রিমাইন্ডার, প্রচার ও স্বয়ংক্রিয় মার্কেটিংয়ের জন্য উপযুক্ত।" } },
  { icon: "excel", title: { en: "Dynamic SMS from Excel", bn: "Excel থেকে ডায়নামিক এসএমএস" }, text: { en: "Send **Dynamic SMS from an Excel** file via the SMS portal with ease. Upload Excel or CSV to send bulk personalized SMS like results, OTPs, and alerts instantly with high deliverability and automation.", bn: "এসএমএস পোর্টাল থেকে সহজে **Excel ফাইলের ডায়নামিক এসএমএস** পাঠান। Excel বা CSV আপলোড করে ফলাফল, OTP ও সতর্কবার্তার মতো ব্যক্তিগত এসএমএস মুহূর্তে পাঠান।" } },
  { icon: "masking", title: { en: "Masking & Non-Masking SMS", bn: "মাস্কিং ও নন-মাস্কিং এসএমএস" }, text: { en: "Send **masking SMS in Bangladesh** with your brand name or use non-masking SMS for standard messaging. Flexible SMS solutions from a single account for business and marketing needs.", bn: "আপনার ব্র্যান্ডের নামে **মাস্কিং এসএমএস** পাঠান, অথবা সাধারণ বার্তার জন্য নন-মাস্কিং ব্যবহার করুন। ব্যবসা ও মার্কেটিংয়ের জন্য এক অ্যাকাউন্টেই সব।" } },
  { icon: "balance", title: { en: "Auto Low Balance Notification", bn: "কম ব্যালেন্সের স্বয়ংক্রিয় নোটিফিকেশন" }, text: { en: "With the automated SMS Balance Alert System, get instant **low balance SMS alerts and email notifications** so your **bulk SMS campaigns never stop unexpectedly**.", bn: "স্বয়ংক্রিয় ব্যালেন্স অ্যালার্টে সাথে সাথে **কম ব্যালেন্সের এসএমএস ও ইমেইল নোটিফিকেশন** পান, যাতে আপনার **বাল্ক এসএমএস ক্যাম্পেইন হঠাৎ বন্ধ না হয়**।" } },
  { icon: "language", title: { en: "Smart Language Detection", bn: "স্মার্ট ভাষা শনাক্তকরণ" }, text: { en: "The system automatically detects message language and applies the correct encoding for **Bangla SMS and English SMS delivery accuracy**.", bn: "সিস্টেম নিজেই মেসেজের ভাষা চিনে সঠিক এনকোডিং বসায়, ফলে **বাংলা ও ইংরেজি এসএমএস নির্ভুলভাবে পৌঁছায়**।" } },
  { icon: "routing", title: { en: "Smart Failover Routing System", bn: "স্মার্ট ফেইলওভার রাউটিং" }, text: { en: "Our intelligent **SMS routing system** automatically selects the best gateway to ensure maximum delivery success for **bulk SMS campaigns**.", bn: "আমাদের বুদ্ধিমান **এসএমএস রাউটিং সিস্টেম** নিজেই সেরা গেটওয়ে বেছে নেয়, যাতে **বাল্ক এসএমএস ক্যাম্পেইন** সর্বোচ্চ সফলভাবে পৌঁছায়।" } },
  { icon: "location", title: { en: "Location-Based SMS Marketing", bn: "লোকেশন-ভিত্তিক এসএমএস মার্কেটিং" }, text: { en: "Run **geo-targeted SMS campaigns by district or thana in Bangladesh** to improve conversion rate and reach the right audience.", bn: "**জেলা বা থানাভিত্তিক এসএমএস ক্যাম্পেইন** চালিয়ে সঠিক গ্রাহকের কাছে পৌঁছান ও কনভার্সন বাড়ান।" } },
  { icon: "upload", title: { en: "Excel & Bulk Upload Support", bn: "Excel ও বাল্ক আপলোড সাপোর্ট" }, text: { en: "Upload Excel files or paste contacts directly to send bulk SMS in Bangladesh quickly and efficiently.", bn: "Excel ফাইল আপলোড করুন বা সরাসরি কন্টাক্ট পেস্ট করে দ্রুত বাল্ক এসএমএস পাঠান।" } },
];

/** BTRC regulatory notice shown with the pricing section. */
export const btrcNotice: { title: L; text: L } = {
  title: { en: "Promotional SMS must be in Bengali", bn: "প্রচারমূলক এসএমএস অবশ্যই বাংলায় হতে হবে" },
  text: {
    en: "Notice issued by BTRC dated 03 January 2019, sharok: 14.32.0000.600.36.001.19.51 — as per the guidelines of BTRC, all promotional SMS should be in Bangla. If you circulate promotional SMS in English, we will be bound to disconnect your connection as per the BTRC guideline.",
    bn: "বিটিআরসি-র ০৩ জানুয়ারি ২০১৯ তারিখের নোটিশ, স্মারক: 14.32.0000.600.36.001.19.51 — বিটিআরসি-র নির্দেশনা অনুযায়ী সব প্রচারমূলক এসএমএস বাংলায় হতে হবে। ইংরেজিতে প্রচারমূলক এসএমএস পাঠালে বিটিআরসি-র নির্দেশনা অনুযায়ী আমরা আপনার সংযোগ বিচ্ছিন্ন করতে বাধ্য থাকব।",
  },
};
