import type { LucideIcon } from "lucide-react";
import { Mail, ShieldCheck, Layers, GitBranch, Megaphone, Receipt } from "lucide-react";
import type { L, LList } from "@/i18n/language";
import smsIcon from "@/assets/brand/sms-icon.webp";
import viberIcon from "@/assets/brand/viber-icon.webp";
import whatsappIcon from "@/assets/brand/whatsapp-icon.webp";
import telegramIcon from "@/assets/brand/telegram-icon.webp";
import pushIcon from "@/assets/brand/in-app-push-notifications-icon.webp";
import voiceIcon from "@/assets/brand/voice-code-icon.webp";

export type ServiceIcon = { image: string } | { lucide: LucideIcon };

export type Service = {
  slug: string;
  icon: ServiceIcon;
  name: L;
  short: L;
  intro: L;
  problems: LList;
  capabilities: LList;
  useCases: LList;
  integration: L;
  related: string[];
};

export const services: Service[] = [
  {
    slug: "sms",
    icon: { image: smsIcon },
    name: { en: "SMS Messaging", bn: "এসএমএস মেসেজিং" },
    short: {
      en: "Reach any mobile phone directly with fast, dependable text messages.",
      bn: "দ্রুত ও নির্ভরযোগ্য টেক্সট মেসেজে সরাসরি যেকোনো মোবাইল ফোনে পৌঁছান।",
    },
    intro: {
      en: "SMS works on every mobile phone, needs no internet connection and is read within minutes. Ritorica gives your business a single connection for sending SMS from your own systems or from bulk uploads.",
      bn: "এসএমএস প্রতিটি মোবাইল ফোনে কাজ করে, ইন্টারনেট লাগে না এবং কয়েক মিনিটের মধ্যেই পড়া হয়। Ritorica আপনার ব্যবসাকে নিজস্ব সিস্টেম বা বাল্ক আপলোড থেকে এসএমএস পাঠানোর জন্য একটি একক সংযোগ দেয়।",
    },
    problems: {
      en: [
        "Customers miss emails and app notifications",
        "Managing several operator connections is complex",
        "No clear view of whether messages were delivered",
      ],
      bn: [
        "গ্রাহকরা ইমেইল ও অ্যাপ নোটিফিকেশন মিস করেন",
        "একাধিক অপারেটরের সংযোগ পরিচালনা জটিল",
        "মেসেজ পৌঁছেছে কিনা তার স্পষ্ট তথ্য নেই",
      ],
    },
    capabilities: {
      en: [
        "Masking and non-masking sender IDs",
        "GSM, extended GSM and Unicode (Bangla) text",
        "Long messages split and joined automatically",
        "Delivery reports for every message",
      ],
      bn: [
        "মাস্কিং ও নন-মাস্কিং সেন্ডার আইডি",
        "জিএসএম, এক্সটেন্ডেড জিএসএম ও ইউনিকোড (বাংলা) টেক্সট",
        "দীর্ঘ মেসেজ স্বয়ংক্রিয়ভাবে ভাগ ও যুক্ত হয়",
        "প্রতিটি মেসেজের ডেলিভারি রিপোর্ট",
      ],
    },
    useCases: {
      en: ["Account and transaction alerts", "Appointment reminders", "Order and delivery updates"],
      bn: ["অ্যাকাউন্ট ও লেনদেনের অ্যালার্ট", "অ্যাপয়েন্টমেন্ট রিমাইন্ডার", "অর্ডার ও ডেলিভারি আপডেট"],
    },
    integration: {
      en: "Send through the HTTP API from your application, or upload contacts from Excel and phonebook lists for bulk sending.",
      bn: "আপনার অ্যাপ্লিকেশন থেকে HTTP API দিয়ে পাঠান, অথবা বাল্ক পাঠানোর জন্য Excel ও ফোনবুক থেকে কনট্যাক্ট আপলোড করুন।",
    },
    related: ["transactional-sms", "bulk-sms", "otp-verification"],
  },
  {
    slug: "transactional-sms",
    icon: { lucide: Receipt },
    name: { en: "Transactional SMS", bn: "ট্রানজ্যাকশনাল এসএমএস" },
    short: {
      en: "Time-critical service messages triggered by your systems.",
      bn: "আপনার সিস্টেম থেকে স্বয়ংক্রিয়ভাবে পাঠানো সময়-সংবেদনশীল সার্ভিস মেসেজ।",
    },
    intro: {
      en: "Transactional messages confirm something the customer did or needs to know right now — a payment, a booking, a password change. They are sent automatically, one at a time, as events happen in your systems.",
      bn: "ট্রানজ্যাকশনাল মেসেজ গ্রাহকের কোনো কাজ বা এখনই জানা দরকার এমন তথ্য নিশ্চিত করে — পেমেন্ট, বুকিং, পাসওয়ার্ড পরিবর্তন। আপনার সিস্টেমে ঘটনা ঘটার সাথে সাথে এগুলো স্বয়ংক্রিয়ভাবে একটি একটি করে পাঠানো হয়।",
    },
    problems: {
      en: ["Delayed confirmations create support calls", "Customers doubt whether a payment went through", "Manual notifications do not scale"],
      bn: ["দেরিতে নিশ্চিতকরণে সাপোর্ট কল বাড়ে", "পেমেন্ট হয়েছে কিনা গ্রাহক নিশ্চিত হতে পারেন না", "হাতে পাঠানো নোটিফিকেশন বড় পরিসরে চলে না"],
    },
    capabilities: {
      en: ["Event-driven sending through the API", "Dedicated sender ID for your brand", "Per-message status tracking", "Delivery status callbacks to your server"],
      bn: ["API দিয়ে ঘটনা-ভিত্তিক পাঠানো", "আপনার ব্র্যান্ডের নিজস্ব সেন্ডার আইডি", "প্রতিটি মেসেজের স্ট্যাটাস ট্র্যাকিং", "আপনার সার্ভারে ডেলিভারি স্ট্যাটাস কলব্যাক"],
    },
    useCases: {
      en: ["Payment and debit confirmations", "Booking and ticket confirmations", "Security and account-change notices"],
      bn: ["পেমেন্ট ও ডেবিট নিশ্চিতকরণ", "বুকিং ও টিকিট নিশ্চিতকরণ", "নিরাপত্তা ও অ্যাকাউন্ট পরিবর্তনের নোটিশ"],
    },
    integration: {
      en: "Your application calls the send operation when an event occurs and receives a message ID to track delivery.",
      bn: "কোনো ঘটনা ঘটলে আপনার অ্যাপ্লিকেশন send অপারেশন কল করে এবং ডেলিভারি ট্র্যাক করার জন্য একটি মেসেজ আইডি পায়।",
    },
    related: ["sms", "otp-verification", "cascaded-messaging"],
  },
  {
    slug: "bulk-sms",
    icon: { lucide: Megaphone },
    name: { en: "Promotional & Bulk SMS", bn: "প্রমোশনাল ও বাল্ক এসএমএস" },
    short: {
      en: "Send campaigns and announcements to large audiences at once.",
      bn: "একসাথে বড় সংখ্যক মানুষের কাছে ক্যাম্পেইন ও ঘোষণা পাঠান।",
    },
    intro: {
      en: "Bulk SMS lets you send the same or personalised message to thousands of recipients in one go — for offers, announcements and reminders — with scheduling and contact-group management.",
      bn: "বাল্ক এসএমএস দিয়ে একবারে হাজার হাজার প্রাপকের কাছে একই বা ব্যক্তিগতকৃত মেসেজ পাঠাতে পারেন — অফার, ঘোষণা ও রিমাইন্ডারের জন্য — শিডিউলিং ও কনট্যাক্ট গ্রুপ ব্যবস্থাপনাসহ।",
    },
    problems: {
      en: ["Social posts reach only a fraction of customers", "Sending to large lists by hand is slow", "Hard to measure who received a campaign"],
      bn: ["সোশ্যাল পোস্ট অল্প কিছু গ্রাহকের কাছে পৌঁছায়", "বড় তালিকায় হাতে পাঠানো ধীর", "ক্যাম্পেইন কে পেয়েছে তা মাপা কঠিন"],
    },
    capabilities: {
      en: ["Upload recipients from Excel or saved groups", "Schedule campaigns in advance", "Personalised text per recipient", "Campaign-level delivery reporting"],
      bn: ["Excel বা সংরক্ষিত গ্রুপ থেকে প্রাপক আপলোড", "আগে থেকে ক্যাম্পেইন শিডিউল", "প্রতি প্রাপকের জন্য ব্যক্তিগতকৃত টেক্সট", "ক্যাম্পেইন-ভিত্তিক ডেলিভারি রিপোর্ট"],
    },
    useCases: {
      en: ["Seasonal offers and discounts", "Event and admission announcements", "Re-engagement of inactive customers"],
      bn: ["মৌসুমি অফার ও ছাড়", "ইভেন্ট ও ভর্তির ঘোষণা", "নিষ্ক্রিয় গ্রাহকদের পুনরায় সম্পৃক্ত করা"],
    },
    integration: {
      en: "Manage contact lists through the mailing-list API and send to a whole group with a single request.",
      bn: "মেইলিং-লিস্ট API দিয়ে কনট্যাক্ট তালিকা পরিচালনা করুন এবং একটি রিকোয়েস্টে পুরো গ্রুপে পাঠান।",
    },
    related: ["sms", "whatsapp", "viber"],
  },
  {
    slug: "otp-verification",
    icon: { lucide: ShieldCheck },
    name: { en: "OTP & Verification", bn: "ওটিপি ও ভেরিফিকেশন" },
    short: {
      en: "Deliver one-time passwords quickly to verify users and transactions.",
      bn: "ব্যবহারকারী ও লেনদেন যাচাই করতে দ্রুত ওয়ান-টাইম পাসওয়ার্ড পাঠান।",
    },
    intro: {
      en: "One-time passwords confirm that a real person holds the phone number. Ritorica delivers OTP codes over SMS, messaging apps or voice so sign-ups, logins and payments stay secure.",
      bn: "ওয়ান-টাইম পাসওয়ার্ড নিশ্চিত করে যে ফোন নম্বরটি একজন প্রকৃত ব্যক্তির কাছে আছে। Ritorica এসএমএস, মেসেজিং অ্যাপ বা ভয়েসে ওটিপি কোড পাঠায়, যাতে সাইন-আপ, লগইন ও পেমেন্ট নিরাপদ থাকে।",
    },
    problems: {
      en: ["Fake sign-ups and account takeover", "Users abandon when codes arrive late", "Single-channel OTP fails when SMS is blocked"],
      bn: ["ভুয়া সাইন-আপ ও অ্যাকাউন্ট দখল", "কোড দেরিতে এলে ব্যবহারকারী চলে যান", "এসএমএস বন্ধ থাকলে একক-চ্যানেল ওটিপি ব্যর্থ হয়"],
    },
    capabilities: {
      en: ["Priority OTP routing", "Masking and non-masking sender options", "Status that shows when a code was used", "Fallback to another channel when configured"],
      bn: ["অগ্রাধিকারভিত্তিক ওটিপি রাউটিং", "মাস্কিং ও নন-মাস্কিং সেন্ডার অপশন", "কোড কখন ব্যবহৃত হয়েছে তা দেখায় এমন স্ট্যাটাস", "কনফিগার করা থাকলে অন্য চ্যানেলে ফলব্যাক"],
    },
    useCases: {
      en: ["Sign-up and login verification", "Payment and transfer approval", "Password reset"],
      bn: ["সাইন-আপ ও লগইন যাচাই", "পেমেন্ট ও ট্রান্সফার অনুমোদন", "পাসওয়ার্ড রিসেট"],
    },
    integration: {
      en: "Your system generates the code and sends it through the API; delivery and usage status are returned to your callback URL.",
      bn: "আপনার সিস্টেম কোড তৈরি করে API দিয়ে পাঠায়; ডেলিভারি ও ব্যবহারের স্ট্যাটাস আপনার কলব্যাক URL-এ ফেরত আসে।",
    },
    related: ["voice", "cascaded-messaging", "telegram"],
  },
  {
    slug: "whatsapp",
    icon: { image: whatsappIcon },
    name: { en: "WhatsApp Business Messaging", bn: "হোয়াটসঅ্যাপ বিজনেস মেসেজিং" },
    short: {
      en: "Rich, two-way conversations on the app your customers already use.",
      bn: "গ্রাহকরা যে অ্যাপ ইতিমধ্যে ব্যবহার করেন, সেখানে সমৃদ্ধ দ্বিমুখী কথোপকথন।",
    },
    intro: {
      en: "WhatsApp Business messaging lets you send notifications with images, documents and buttons, and hold support conversations — all under your verified business profile.",
      bn: "হোয়াটসঅ্যাপ বিজনেস মেসেজিং দিয়ে ছবি, ডকুমেন্ট ও বাটনসহ নোটিফিকেশন পাঠাতে এবং সাপোর্ট কথোপকথন চালাতে পারেন — সবই আপনার ভেরিফায়েড বিজনেস প্রোফাইলের অধীনে।",
    },
    problems: {
      en: ["Plain text cannot show receipts or products", "Customers want to reply, not call", "Support teams juggle personal phones"],
      bn: ["সাধারণ টেক্সটে রসিদ বা পণ্য দেখানো যায় না", "গ্রাহকরা কল নয়, উত্তর দিতে চান", "সাপোর্ট টিম ব্যক্তিগত ফোনে কাজ করে"],
    },
    capabilities: {
      en: ["Approved message templates", "Images, documents and interactive buttons", "Two-way customer conversations", "Delivery and read status"],
      bn: ["অনুমোদিত মেসেজ টেমপ্লেট", "ছবি, ডকুমেন্ট ও ইন্টারঅ্যাকটিভ বাটন", "গ্রাহকের সাথে দ্বিমুখী কথোপকথন", "ডেলিভারি ও পড়ার স্ট্যাটাস"],
    },
    useCases: {
      en: ["Order confirmations with invoices", "Customer support chat", "Appointment booking"],
      bn: ["ইনভয়েসসহ অর্ডার নিশ্চিতকরণ", "গ্রাহক সাপোর্ট চ্যাট", "অ্যাপয়েন্টমেন্ট বুকিং"],
    },
    integration: {
      en: "Onboarding requires a WhatsApp Business account and template approval. Our team guides the setup during your demo.",
      bn: "চালুর জন্য একটি হোয়াটসঅ্যাপ বিজনেস অ্যাকাউন্ট ও টেমপ্লেট অনুমোদন প্রয়োজন। ডেমোর সময় আমাদের টিম সেটআপে সহায়তা করবে।",
    },
    related: ["viber", "omnichannel", "cascaded-messaging"],
  },
  {
    slug: "viber",
    icon: { image: viberIcon },
    name: { en: "Viber Business Messaging", bn: "ভাইবার বিজনেস মেসেজিং" },
    short: {
      en: "Branded rich messages and chatbots through Viber.",
      bn: "ভাইবারের মাধ্যমে ব্র্যান্ডেড রিচ মেসেজ ও চ্যাটবট।",
    },
    intro: {
      en: "Viber Business Messages show your brand name and logo, support images and action buttons, and can be combined with automated Viber bots for common questions.",
      bn: "ভাইবার বিজনেস মেসেজে আপনার ব্র্যান্ডের নাম ও লোগো দেখায়, ছবি ও অ্যাকশন বাটন সমর্থন করে, এবং সাধারণ প্রশ্নের জন্য স্বয়ংক্রিয় ভাইবার বটের সাথে যুক্ত করা যায়।",
    },
    problems: {
      en: ["Unbranded messages are ignored or distrusted", "Promotions need visuals to perform", "Repetitive questions overload agents"],
      bn: ["ব্র্যান্ডবিহীন মেসেজ উপেক্ষিত বা অবিশ্বস্ত হয়", "প্রমোশনে ভিজ্যুয়াল দরকার", "একই প্রশ্নে এজেন্টদের চাপ বাড়ে"],
    },
    capabilities: {
      en: ["Branded sender with logo", "Rich media and buttons", "Automated Viber bots", "Fallback to SMS when configured"],
      bn: ["লোগোসহ ব্র্যান্ডেড সেন্ডার", "রিচ মিডিয়া ও বাটন", "স্বয়ংক্রিয় ভাইবার বট", "কনফিগার করা থাকলে এসএমএসে ফলব্যাক"],
    },
    useCases: {
      en: ["Promotions with images", "Transactional updates", "Automated FAQs"],
      bn: ["ছবিসহ প্রমোশন", "ট্রানজ্যাকশনাল আপডেট", "স্বয়ংক্রিয় প্রশ্নোত্তর"],
    },
    integration: {
      en: "A Viber business sender must be registered for your brand before sending. Availability is confirmed during onboarding.",
      bn: "পাঠানোর আগে আপনার ব্র্যান্ডের জন্য একটি ভাইবার বিজনেস সেন্ডার নিবন্ধন করতে হয়। চালুর সময় প্রাপ্যতা নিশ্চিত করা হয়।",
    },
    related: ["whatsapp", "cascaded-messaging", "sms"],
  },
  {
    slug: "telegram",
    icon: { image: telegramIcon },
    name: { en: "Telegram Messaging", bn: "টেলিগ্রাম মেসেজিং" },
    short: {
      en: "Send OTP codes and alerts to Telegram users at low cost.",
      bn: "কম খরচে টেলিগ্রাম ব্যবহারকারীদের কাছে ওটিপি কোড ও অ্যালার্ট পাঠান।",
    },
    intro: {
      en: "Telegram is a privacy-focused messenger. Delivering verification codes and alerts there can reduce costs and reach users who rely on Telegram daily.",
      bn: "টেলিগ্রাম একটি গোপনীয়তা-কেন্দ্রিক মেসেঞ্জার। সেখানে ভেরিফিকেশন কোড ও অ্যালার্ট পাঠালে খরচ কমতে পারে এবং যারা প্রতিদিন টেলিগ্রাম ব্যবহার করেন তাদের কাছে পৌঁছানো যায়।",
    },
    problems: {
      en: ["High OTP costs at scale", "Users prefer app-based codes", "SMS delays in some routes"],
      bn: ["বড় পরিসরে ওটিপির উচ্চ খরচ", "ব্যবহারকারীরা অ্যাপ-ভিত্তিক কোড পছন্দ করেন", "কিছু রুটে এসএমএস দেরিতে পৌঁছায়"],
    },
    capabilities: {
      en: ["OTP delivery to Telegram accounts", "Alert and notification messages", "Delivery status", "Fallback to SMS when configured"],
      bn: ["টেলিগ্রাম অ্যাকাউন্টে ওটিপি ডেলিভারি", "অ্যালার্ট ও নোটিফিকেশন মেসেজ", "ডেলিভারি স্ট্যাটাস", "কনফিগার করা থাকলে এসএমএসে ফলব্যাক"],
    },
    useCases: {
      en: ["Login verification", "Security alerts", "Service notifications"],
      bn: ["লগইন যাচাই", "নিরাপত্তা অ্যালার্ট", "সার্ভিস নোটিফিকেশন"],
    },
    integration: {
      en: "Telegram delivery is enabled per account. Ask our team about availability for your use case.",
      bn: "টেলিগ্রাম ডেলিভারি প্রতিটি অ্যাকাউন্টের জন্য আলাদাভাবে চালু করা হয়। আপনার প্রয়োজনে প্রাপ্যতা জানতে আমাদের টিমকে জিজ্ঞেস করুন।",
    },
    related: ["otp-verification", "cascaded-messaging", "sms"],
  },
  {
    slug: "email",
    icon: { lucide: Mail },
    name: { en: "Business Email", bn: "বিজনেস ইমেইল" },
    short: {
      en: "Transactional and bulk email alongside your other channels.",
      bn: "অন্যান্য চ্যানেলের পাশাপাশি ট্রানজ্যাকশনাল ও বাল্ক ইমেইল।",
    },
    intro: {
      en: "Email remains the right channel for longer content: statements, receipts, newsletters and documents. Ritorica lets you manage email together with your messaging channels.",
      bn: "দীর্ঘ কনটেন্টের জন্য ইমেইল এখনও সঠিক চ্যানেল: স্টেটমেন্ট, রসিদ, নিউজলেটার ও ডকুমেন্ট। Ritorica দিয়ে মেসেজিং চ্যানেলের সাথে ইমেইলও একসাথে পরিচালনা করুন।",
    },
    problems: {
      en: ["Emails land in spam", "Separate tools for email and SMS", "No combined view of customer contact"],
      bn: ["ইমেইল স্প্যামে চলে যায়", "ইমেইল ও এসএমএসের জন্য আলাদা টুল", "গ্রাহক যোগাযোগের সমন্বিত চিত্র নেই"],
    },
    capabilities: {
      en: ["Transactional email", "Bulk newsletters", "Templates with personalisation", "Delivery and bounce tracking"],
      bn: ["ট্রানজ্যাকশনাল ইমেইল", "বাল্ক নিউজলেটার", "ব্যক্তিগতকরণসহ টেমপ্লেট", "ডেলিভারি ও বাউন্স ট্র্যাকিং"],
    },
    useCases: {
      en: ["Monthly statements", "Receipts and invoices", "Newsletters"],
      bn: ["মাসিক স্টেটমেন্ট", "রসিদ ও ইনভয়েস", "নিউজলেটার"],
    },
    integration: {
      en: "Email sending requires domain verification for your brand. Setup details are shared during onboarding.",
      bn: "ইমেইল পাঠাতে আপনার ব্র্যান্ডের ডোমেইন ভেরিফিকেশন প্রয়োজন। সেটআপের বিস্তারিত চালুর সময় জানানো হয়।",
    },
    related: ["omnichannel", "sms", "push-notifications"],
  },
  {
    slug: "push-notifications",
    icon: { image: pushIcon },
    name: { en: "Push Notifications", bn: "পুশ নোটিফিকেশন" },
    short: {
      en: "Engage app and website users with real-time push messages.",
      bn: "রিয়েল-টাইম পুশ মেসেজে অ্যাপ ও ওয়েবসাইট ব্যবহারকারীদের সম্পৃক্ত করুন।",
    },
    intro: {
      en: "Push notifications reach users of your iOS, Android or web app instantly and at no per-message operator cost — ideal for frequent updates and engagement.",
      bn: "পুশ নোটিফিকেশন আপনার iOS, Android বা ওয়েব অ্যাপের ব্যবহারকারীদের কাছে তাৎক্ষণিক পৌঁছায় এবং প্রতি মেসেজে অপারেটর খরচ নেই — ঘন ঘন আপডেট ও সম্পৃক্ততার জন্য আদর্শ।",
    },
    problems: {
      en: ["App users forget to open the app", "SMS is costly for frequent updates", "Generic blasts annoy users"],
      bn: ["ব্যবহারকারীরা অ্যাপ খুলতে ভুলে যান", "ঘন ঘন আপডেটে এসএমএস ব্যয়বহুল", "সবার কাছে একই মেসেজ বিরক্তিকর"],
    },
    capabilities: {
      en: ["Mobile app and web push", "Rich notifications with images", "Audience segmentation", "Delivery reporting"],
      bn: ["মোবাইল অ্যাপ ও ওয়েব পুশ", "ছবিসহ রিচ নোটিফিকেশন", "অডিয়েন্স সেগমেন্টেশন", "ডেলিভারি রিপোর্ট"],
    },
    useCases: {
      en: ["Real-time order status", "Personalised offers", "Content and feature updates"],
      bn: ["রিয়েল-টাইম অর্ডার স্ট্যাটাস", "ব্যক্তিগতকৃত অফার", "কনটেন্ট ও ফিচার আপডেট"],
    },
    integration: {
      en: "Your app registers devices with the push service; your backend triggers notifications by user or segment.",
      bn: "আপনার অ্যাপ পুশ সার্ভিসে ডিভাইস নিবন্ধন করে; আপনার ব্যাকএন্ড ব্যবহারকারী বা সেগমেন্ট অনুযায়ী নোটিফিকেশন পাঠায়।",
    },
    related: ["omnichannel", "sms", "email"],
  },
  {
    slug: "voice",
    icon: { image: voiceIcon },
    name: { en: "Voice Messaging & Voice OTP", bn: "ভয়েস মেসেজিং ও ভয়েস ওটিপি" },
    short: {
      en: "Automated voice calls for codes, reminders and announcements.",
      bn: "কোড, রিমাইন্ডার ও ঘোষণার জন্য স্বয়ংক্রিয় ভয়েস কল।",
    },
    intro: {
      en: "Voice messages read out codes or announcements over an automated call. They work on any phone, including landlines, and help customers who cannot read text messages easily.",
      bn: "ভয়েস মেসেজ স্বয়ংক্রিয় কলে কোড বা ঘোষণা পড়ে শোনায়। এটি ল্যান্ডলাইনসহ যেকোনো ফোনে কাজ করে এবং যারা সহজে টেক্সট পড়তে পারেন না তাদের সাহায্য করে।",
    },
    problems: {
      en: ["Some users cannot read SMS easily", "SMS codes fail to arrive on some routes", "Urgent notices need attention"],
      bn: ["কিছু ব্যবহারকারী সহজে এসএমএস পড়তে পারেন না", "কিছু রুটে এসএমএস কোড পৌঁছায় না", "জরুরি নোটিশে মনোযোগ দরকার"],
    },
    capabilities: {
      en: ["Voice OTP read-out", "Pre-recorded or text-to-speech messages", "Works on mobile and landline", "Call status reporting"],
      bn: ["ভয়েসে ওটিপি পড়ে শোনানো", "আগে রেকর্ড করা বা টেক্সট-টু-স্পিচ মেসেজ", "মোবাইল ও ল্যান্ডলাইনে কাজ করে", "কল স্ট্যাটাস রিপোর্ট"],
    },
    useCases: {
      en: ["OTP fallback after SMS", "Appointment reminders", "Emergency announcements"],
      bn: ["এসএমএসের পর ওটিপি ফলব্যাক", "অ্যাপয়েন্টমেন্ট রিমাইন্ডার", "জরুরি ঘোষণা"],
    },
    integration: {
      en: "Voice delivery is configured per account and language. Ask our team about available voices and destinations.",
      bn: "ভয়েস ডেলিভারি প্রতিটি অ্যাকাউন্ট ও ভাষা অনুযায়ী কনফিগার করা হয়। উপলব্ধ ভয়েস ও গন্তব্য জানতে আমাদের টিমকে জিজ্ঞেস করুন।",
    },
    related: ["otp-verification", "cascaded-messaging", "sms"],
  },
  {
    slug: "omnichannel",
    icon: { lucide: Layers },
    name: { en: "Omnichannel Messaging", bn: "অমনিচ্যানেল মেসেজিং" },
    short: {
      en: "Manage every channel and conversation from one platform.",
      bn: "এক প্ল্যাটফর্ম থেকে প্রতিটি চ্যানেল ও কথোপকথন পরিচালনা করুন।",
    },
    intro: {
      en: "Customers move between SMS, messengers, email and apps. Omnichannel messaging brings those channels together so your team sees one conversation history and sends from one place.",
      bn: "গ্রাহকরা এসএমএস, মেসেঞ্জার, ইমেইল ও অ্যাপের মধ্যে ঘোরাফেরা করেন। অমনিচ্যানেল মেসেজিং এই চ্যানেলগুলো একত্র করে, যাতে আপনার টিম একটি কথোপকথনের ইতিহাস দেখে এবং এক জায়গা থেকে পাঠায়।",
    },
    problems: {
      en: ["Conversations scattered across tools", "No single customer history", "Inconsistent replies across channels"],
      bn: ["বিভিন্ন টুলে ছড়িয়ে থাকা কথোপকথন", "গ্রাহকের একক ইতিহাস নেই", "চ্যানেলভেদে অসামঞ্জস্যপূর্ণ উত্তর"],
    },
    capabilities: {
      en: ["Unified inbox for all channels", "Shared conversation history", "Team assignment", "Cross-channel reporting"],
      bn: ["সব চ্যানেলের জন্য ইউনিফাইড ইনবক্স", "যৌথ কথোপকথনের ইতিহাস", "টিমে কাজ বণ্টন", "চ্যানেল-জুড়ে রিপোর্টিং"],
    },
    useCases: {
      en: ["Customer support centres", "Sales follow-up", "Service updates on the preferred channel"],
      bn: ["গ্রাহক সাপোর্ট সেন্টার", "সেলস ফলো-আপ", "পছন্দের চ্যানেলে সার্ভিস আপডেট"],
    },
    integration: {
      en: "Each channel is enabled for your account during onboarding. The platform then connects them in one workspace.",
      bn: "চালুর সময় আপনার অ্যাকাউন্টের জন্য প্রতিটি চ্যানেল চালু করা হয়। এরপর প্ল্যাটফর্ম সেগুলোকে একটি ওয়ার্কস্পেসে যুক্ত করে।",
    },
    related: ["cascaded-messaging", "whatsapp", "email"],
  },
  {
    slug: "cascaded-messaging",
    icon: { lucide: GitBranch },
    name: { en: "Cascaded Messaging & Fallback", bn: "ক্যাসকেডেড মেসেজিং ও ফলব্যাক" },
    short: {
      en: "Try the best channel first and fall back automatically.",
      bn: "প্রথমে সেরা চ্যানেলে চেষ্টা করুন, প্রয়োজনে স্বয়ংক্রিয়ভাবে বিকল্পে যান।",
    },
    intro: {
      en: "Cascaded messaging sends through a sequence of channels — for example Viber, then WhatsApp, then SMS. If a message is not delivered within the time you set, the next channel is tried.",
      bn: "ক্যাসকেডেড মেসেজিং পর্যায়ক্রমে কয়েকটি চ্যানেলে পাঠায় — যেমন প্রথমে ভাইবার, তারপর হোয়াটসঅ্যাপ, তারপর এসএমএস। নির্ধারিত সময়ের মধ্যে মেসেজ না পৌঁছালে পরের চ্যানেলে চেষ্টা করা হয়।",
    },
    problems: {
      en: ["Single-channel messages go undelivered", "SMS-only sending is costly", "Manual resending wastes time"],
      bn: ["একক চ্যানেলের মেসেজ পৌঁছায় না", "শুধু এসএমএস পাঠানো ব্যয়বহুল", "হাতে আবার পাঠাতে সময় নষ্ট"],
    },
    capabilities: {
      en: ["Configurable channel order", "Time-based fallback rules", "Pay mainly for delivered messages on cheaper channels", "One combined status per message"],
      bn: ["কনফিগারযোগ্য চ্যানেল ক্রম", "সময়-ভিত্তিক ফলব্যাক নিয়ম", "সস্তা চ্যানেলে পৌঁছানো মেসেজের জন্য মূলত খরচ", "প্রতিটি মেসেজের জন্য একটি সমন্বিত স্ট্যাটাস"],
    },
    useCases: {
      en: ["OTP that must arrive", "Critical service alerts", "Cost-optimised notifications"],
      bn: ["যে ওটিপি অবশ্যই পৌঁছাতে হবে", "গুরুত্বপূর্ণ সার্ভিস অ্যালার্ট", "খরচ-সাশ্রয়ী নোটিফিকেশন"],
    },
    integration: {
      en: "Fallback sequences depend on which channels are enabled for your account. We design the flow with you during onboarding.",
      bn: "ফলব্যাক ক্রম আপনার অ্যাকাউন্টে কোন চ্যানেল চালু আছে তার উপর নির্ভর করে। চালুর সময় আমরা আপনার সাথে ফ্লো তৈরি করি।",
    },
    related: ["omnichannel", "otp-verification", "viber"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
