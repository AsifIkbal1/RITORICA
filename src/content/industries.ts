import type { LucideIcon } from "lucide-react";
import { Landmark, Wallet, ShoppingCart, HeartPulse, GraduationCap, Plane, Truck, Building2 } from "lucide-react";
import type { L, LList } from "@/i18n/language";

export type Industry = {
  slug: string;
  icon: LucideIcon;
  name: L;
  short: L;
  intro: L;
  useCases: LList;
  channels: string[];
};

export const industries: Industry[] = [
  {
    slug: "banking",
    icon: Landmark,
    name: { en: "Banking & Financial Services", bn: "ব্যাংকিং ও আর্থিক সেবা" },
    short: { en: "Secure alerts, OTP and service messages for banks.", bn: "ব্যাংকের জন্য নিরাপদ অ্যালার্ট, ওটিপি ও সার্ভিস মেসেজ।" },
    intro: {
      en: "Banks need every alert and verification code to reach the right customer quickly. Messaging supports security, reduces branch and call-centre load and keeps customers informed.",
      bn: "ব্যাংকের প্রতিটি অ্যালার্ট ও ভেরিফিকেশন কোড দ্রুত সঠিক গ্রাহকের কাছে পৌঁছানো দরকার। মেসেজিং নিরাপত্তা বাড়ায়, শাখা ও কল সেন্টারের চাপ কমায় এবং গ্রাহককে অবগত রাখে।",
    },
    useCases: {
      en: ["Debit and credit transaction alerts", "OTP for internet banking and cards", "Loan and EMI due-date reminders", "Account statements by email"],
      bn: ["ডেবিট ও ক্রেডিট লেনদেনের অ্যালার্ট", "ইন্টারনেট ব্যাংকিং ও কার্ডের জন্য ওটিপি", "ঋণ ও কিস্তির তারিখের রিমাইন্ডার", "ইমেইলে অ্যাকাউন্ট স্টেটমেন্ট"],
    },
    channels: ["transactional-sms", "otp-verification", "email"],
  },
  {
    slug: "fintech",
    icon: Wallet,
    name: { en: "Fintech & Digital Payments", bn: "ফিনটেক ও ডিজিটাল পেমেন্ট" },
    short: { en: "Fast verification and payment notifications.", bn: "দ্রুত ভেরিফিকেশন ও পেমেন্ট নোটিফিকেশন।" },
    intro: {
      en: "Wallets and payment apps depend on instant verification and real-time confirmations. Multi-channel delivery keeps onboarding smooth and payments trusted.",
      bn: "ওয়ালেট ও পেমেন্ট অ্যাপ তাৎক্ষণিক ভেরিফিকেশন ও রিয়েল-টাইম নিশ্চিতকরণের উপর নির্ভর করে। মাল্টি-চ্যানেল ডেলিভারি অনবোর্ডিং সহজ রাখে এবং পেমেন্টে আস্থা বাড়ায়।",
    },
    useCases: {
      en: ["Sign-up and device verification", "Send and receive money confirmations", "Cash-back and offer campaigns", "Fraud and security warnings"],
      bn: ["সাইন-আপ ও ডিভাইস যাচাই", "টাকা পাঠানো ও গ্রহণের নিশ্চিতকরণ", "ক্যাশব্যাক ও অফার ক্যাম্পেইন", "প্রতারণা ও নিরাপত্তা সতর্কবার্তা"],
    },
    channels: ["otp-verification", "push-notifications", "cascaded-messaging"],
  },
  {
    slug: "ecommerce",
    icon: ShoppingCart,
    name: { en: "E-commerce & Retail", bn: "ই-কমার্স ও রিটেইল" },
    short: { en: "Order updates, delivery alerts and promotions.", bn: "অর্ডার আপডেট, ডেলিভারি অ্যালার্ট ও প্রমোশন।" },
    intro: {
      en: "Online shoppers want to know where their order is. Timely updates cut 'where is my order' calls, while targeted campaigns bring customers back.",
      bn: "অনলাইন ক্রেতারা জানতে চান তাদের অর্ডার কোথায়। সময়মতো আপডেট ‘আমার অর্ডার কোথায়’ কল কমায়, আর লক্ষ্যভিত্তিক ক্যাম্পেইন গ্রাহকদের ফিরিয়ে আনে।",
    },
    useCases: {
      en: ["Order and payment confirmation", "Shipping and delivery updates", "Cash-on-delivery verification", "Abandoned-cart and offer messages"],
      bn: ["অর্ডার ও পেমেন্ট নিশ্চিতকরণ", "শিপিং ও ডেলিভারি আপডেট", "ক্যাশ-অন-ডেলিভারি যাচাই", "পরিত্যক্ত কার্ট ও অফার মেসেজ"],
    },
    channels: ["whatsapp", "bulk-sms", "push-notifications"],
  },
  {
    slug: "healthcare",
    icon: HeartPulse,
    name: { en: "Healthcare", bn: "স্বাস্থ্যসেবা" },
    short: { en: "Appointment reminders and patient notifications.", bn: "অ্যাপয়েন্টমেন্ট রিমাইন্ডার ও রোগীর নোটিফিকেশন।" },
    intro: {
      en: "Hospitals, clinics and diagnostic centres use messaging to reduce missed appointments and keep patients informed — while keeping message content appropriate for sensitive information.",
      bn: "হাসপাতাল, ক্লিনিক ও ডায়াগনস্টিক সেন্টার মিস হওয়া অ্যাপয়েন্টমেন্ট কমাতে ও রোগীদের অবগত রাখতে মেসেজিং ব্যবহার করে — সংবেদনশীল তথ্যের জন্য উপযুক্ত কনটেন্ট বজায় রেখে।",
    },
    useCases: {
      en: ["Appointment confirmations and reminders", "Report-ready notifications", "Vaccination and follow-up reminders", "Voice messages for elderly patients"],
      bn: ["অ্যাপয়েন্টমেন্ট নিশ্চিতকরণ ও রিমাইন্ডার", "রিপোর্ট প্রস্তুতের নোটিফিকেশন", "টিকা ও ফলো-আপ রিমাইন্ডার", "বয়স্ক রোগীদের জন্য ভয়েস মেসেজ"],
    },
    channels: ["sms", "voice", "whatsapp"],
  },
  {
    slug: "education",
    icon: GraduationCap,
    name: { en: "Education", bn: "শিক্ষা" },
    short: { en: "Notices, results and attendance alerts for institutions.", bn: "প্রতিষ্ঠানের জন্য নোটিশ, ফলাফল ও উপস্থিতি অ্যালার্ট।" },
    intro: {
      en: "Schools, colleges, universities and coaching centres reach students and guardians quickly with notices, results and fee reminders — in Bangla or English.",
      bn: "স্কুল, কলেজ, বিশ্ববিদ্যালয় ও কোচিং সেন্টার বাংলা বা ইংরেজিতে নোটিশ, ফলাফল ও ফি রিমাইন্ডার দিয়ে শিক্ষার্থী ও অভিভাবকদের কাছে দ্রুত পৌঁছায়।",
    },
    useCases: {
      en: ["Admission and exam notices", "Result publication", "Attendance alerts to guardians", "Fee payment reminders"],
      bn: ["ভর্তি ও পরীক্ষার নোটিশ", "ফলাফল প্রকাশ", "অভিভাবকদের উপস্থিতি অ্যালার্ট", "ফি পরিশোধের রিমাইন্ডার"],
    },
    channels: ["bulk-sms", "sms", "voice"],
  },
  {
    slug: "travel",
    icon: Plane,
    name: { en: "Travel & Hospitality", bn: "ভ্রমণ ও আতিথেয়তা" },
    short: { en: "Booking confirmations and trip updates.", bn: "বুকিং নিশ্চিতকরণ ও ভ্রমণ আপডেট।" },
    intro: {
      en: "Airlines, bus operators, hotels and agencies keep travellers informed from booking to check-out, wherever they are.",
      bn: "এয়ারলাইন, বাস অপারেটর, হোটেল ও এজেন্সি বুকিং থেকে চেক-আউট পর্যন্ত ভ্রমণকারীদের যেখানেই থাকুক অবগত রাখে।",
    },
    useCases: {
      en: ["Ticket and booking confirmations", "Schedule change alerts", "Check-in reminders", "Guest service conversations"],
      bn: ["টিকিট ও বুকিং নিশ্চিতকরণ", "সময়সূচি পরিবর্তনের অ্যালার্ট", "চেক-ইন রিমাইন্ডার", "অতিথি সেবার কথোপকথন"],
    },
    channels: ["transactional-sms", "whatsapp", "email"],
  },
  {
    slug: "logistics",
    icon: Truck,
    name: { en: "Logistics", bn: "লজিস্টিকস" },
    short: { en: "Pickup, tracking and delivery notifications.", bn: "পিকআপ, ট্র্যাকিং ও ডেলিভারি নোটিফিকেশন।" },
    intro: {
      en: "Courier and logistics companies coordinate senders, riders and recipients. Automated updates reduce failed deliveries and support calls.",
      bn: "কুরিয়ার ও লজিস্টিকস কোম্পানি প্রেরক, রাইডার ও প্রাপকের মধ্যে সমন্বয় করে। স্বয়ংক্রিয় আপডেট ব্যর্থ ডেলিভারি ও সাপোর্ট কল কমায়।",
    },
    useCases: {
      en: ["Parcel booking confirmation", "Out-for-delivery alerts", "Delivery OTP for handover", "Payment collection notices"],
      bn: ["পার্সেল বুকিং নিশ্চিতকরণ", "ডেলিভারির জন্য রওনা অ্যালার্ট", "হস্তান্তরের জন্য ডেলিভারি ওটিপি", "পেমেন্ট সংগ্রহের নোটিশ"],
    },
    channels: ["transactional-sms", "otp-verification", "cascaded-messaging"],
  },
  {
    slug: "enterprise",
    icon: Building2,
    name: { en: "Enterprise Services", bn: "এন্টারপ্রাইজ সেবা" },
    short: { en: "Customer support and internal communication at scale.", bn: "বড় পরিসরে গ্রাহক সাপোর্ট ও অভ্যন্তরীণ যোগাযোগ।" },
    intro: {
      en: "Large organisations, telecom resellers and service providers combine messaging with their CRM and support systems to serve customers and staff consistently.",
      bn: "বড় প্রতিষ্ঠান, টেলিকম রিসেলার ও সেবা প্রদানকারীরা গ্রাহক ও কর্মীদের ধারাবাহিক সেবা দিতে তাদের CRM ও সাপোর্ট সিস্টেমের সাথে মেসেজিং যুক্ত করে।",
    },
    useCases: {
      en: ["Support ticket updates", "Employee alerts and HR notices", "CRM-triggered campaigns", "Multi-department messaging"],
      bn: ["সাপোর্ট টিকিট আপডেট", "কর্মী অ্যালার্ট ও এইচআর নোটিশ", "CRM-ভিত্তিক ক্যাম্পেইন", "বহু-বিভাগীয় মেসেজিং"],
    },
    channels: ["omnichannel", "email", "sms"],
  },
];

export const getIndustry = (slug: string) => industries.find((i) => i.slug === slug);
