import type { L } from "@/i18n/language";
import { site } from "@/config/site";

/** Main menu, modelled on ritorica.com. Every item points at an existing page; detail pages live in src/content/pages. */
/** `href` = external link (opens in a new tab) and wins over `to`. */
export type NavItem = { to: string; params?: Record<string, string>; hash?: string; href?: string; title: L; sub: L };
export type NavGroup = { id: string; label: L; items: NavItem[]; wide?: boolean };

const pg = (group: string, slug: string) => ({ to: `/${group}/$slug`, params: { slug } });
const svc = (slug: string) => ({ to: "/services/$slug", params: { slug } });
const prod = (slug: string) => pg("products", slug);
const chan = (slug: string) => pg("channels", slug);

export const navGroups: NavGroup[] = [
  {
    id: "products",
    label: { en: "Products", bn: "প্রোডাক্ট" },
    items: [
      { ...prod("sms-mailing"), title: { en: "SMS Mailing", bn: "এসএমএস মেইলিং" }, sub: { en: "Bulk SMS campaigns & OTP", bn: "বাল্ক এসএমএস ক্যাম্পেইন ও ওটিপি" } },
      { ...prod("push-platform"), title: { en: "Push Platform", bn: "পুশ প্ল্যাটফর্ম" }, sub: { en: "Web & mobile push notifications", bn: "ওয়েব ও মোবাইল পুশ নোটিফিকেশন" } },
      { ...prod("chat-platform"), title: { en: "Chat Platform", bn: "চ্যাট প্ল্যাটফর্ম" }, sub: { en: "Unified inbox for all channels", bn: "সব চ্যানেলের জন্য এক ইনবক্স" } },
      { ...prod("cascaded-messaging"), title: { en: "Cascaded Messaging", bn: "ক্যাসকেডেড মেসেজিং" }, sub: { en: "Smart multi-channel delivery", bn: "স্মার্ট মাল্টি-চ্যানেল ডেলিভারি" } },
      { ...prod("verify-otp"), title: { en: "Verify OTP", bn: "ভেরিফাই ওটিপি" }, sub: { en: "Secure multi-channel OTP delivery", bn: "নিরাপদ মাল্টি-চ্যানেল ওটিপি ডেলিভারি" } },
    ],
  },
  {
    id: "channels",
    label: { en: "Channels", bn: "চ্যানেল" },
    wide: true,
    items: [
      { ...chan("sms"), title: { en: "SMS Channel", bn: "এসএমএস চ্যানেল" }, sub: { en: "Direct SMS to any mobile", bn: "যেকোনো মোবাইলে সরাসরি এসএমএস" } },
      { ...chan("viber-business"), title: { en: "Viber Business Messaging", bn: "ভাইবার বিজনেস মেসেজিং" }, sub: { en: "Rich messages via Viber", bn: "ভাইবারে রিচ মেসেজ" } },
      { ...chan("whatsapp-business"), title: { en: "WhatsApp Business API", bn: "হোয়াটসঅ্যাপ বিজনেস API" }, sub: { en: "Official WhatsApp for business", bn: "ব্যবসার জন্য অফিসিয়াল হোয়াটসঅ্যাপ" } },
      { ...chan("email-business"), title: { en: "Email for Business", bn: "বিজনেস ইমেইল" }, sub: { en: "Transactional & bulk email", bn: "ট্রানজ্যাকশনাল ও বাল্ক ইমেইল" } },
      { ...chan("app-push"), title: { en: "App Push", bn: "অ্যাপ পুশ" }, sub: { en: "iOS & Android push notifications", bn: "iOS ও Android পুশ নোটিফিকেশন" } },
      { ...svc("voice"), title: { en: "Voice Messaging", bn: "ভয়েস মেসেজিং" }, sub: { en: "Voice calls & voice OTP", bn: "ভয়েস কল ও ভয়েস ওটিপি" } },
      { ...chan("telegram-gateway"), title: { en: "Telegram Gateway", bn: "টেলিগ্রাম গেটওয়ে" }, sub: { en: "OTP & alerts via Telegram", bn: "টেলিগ্রামে ওটিপি ও অ্যালার্ট" } },
      { ...chan("viber-bots"), title: { en: "Viber Bots", bn: "ভাইবার বট" }, sub: { en: "Automated customer dialogs", bn: "স্বয়ংক্রিয় গ্রাহক কথোপকথন" } },
    ],
  },
  {
    id: "solutions",
    label: { en: "Solutions", bn: "সমাধান" },
    items: [
      { ...pg("solutions", "industry-solutions"), title: { en: "Industry-Specific Solutions", bn: "শিল্পখাতভিত্তিক সমাধান" }, sub: { en: "Tailored for your sector", bn: "আপনার খাতের জন্য তৈরি" } },
      { ...pg("solutions", "use-cases"), title: { en: "Use Cases", bn: "ব্যবহারের ক্ষেত্র" }, sub: { en: "Notifications, verification & engagement", bn: "নোটিফিকেশন, ভেরিফিকেশন ও সম্পৃক্ততা" } },
    ],
  },
  {
    id: "resources",
    label: { en: "Resources", bn: "রিসোর্স" },
    items: [
      { ...pg("resources", "blog"), href: site.social.linkedin, title: { en: "Blogs", bn: "ব্লগ" }, sub: { en: "News & messaging tips", bn: "খবর ও মেসেজিং টিপস" } },
      { ...pg("resources", "guides"), title: { en: "Industry Insights", bn: "ইন্ডাস্ট্রি ইনসাইট" }, sub: { en: "Research, reports & playbooks", bn: "গবেষণা, রিপোর্ট ও প্লেবুক" } },
      { to: "/platform", title: { en: "CPaaS Platform", bn: "সিপাস প্ল্যাটফর্ম" }, sub: { en: "How the platform works", bn: "প্ল্যাটফর্ম কীভাবে কাজ করে" } },
      { to: "/security", title: { en: "Security", bn: "নিরাপত্তা" }, sub: { en: "Security & reliability principles", bn: "নিরাপত্তা ও নির্ভরযোগ্যতার নীতি" } },
      { to: "/pricing", title: { en: "Pricing", bn: "মূল্য" }, sub: { en: "Starting prices per SMS", bn: "প্রতি এসএমএসের শুরুর মূল্য" } },
    ],
  },
];

/** Plain links shown between the main dropdowns and the trailing ones (Help Desk, Company). */
export const navLinks: { to: string; label: L }[] = [
  { to: "/pricing", label: { en: "Pricing", bn: "মূল্য" } },
];

/** Dropdowns after Pricing. About us and Contacts live inside Company and Help Desk (client request). */
export const navTrailingGroups: NavGroup[] = [
  {
    id: "help-desk",
    label: { en: "Help Desk", bn: "হেল্প ডেস্ক" },
    items: [
      { to: "/help-desk/open-ticket", title: { en: "Open Ticket", bn: "টিকিট খুলুন" }, sub: { en: "Report a technical issue", bn: "কারিগরি সমস্যা জানান" } },
      { to: "/help-desk/faq", title: { en: "FAQ", bn: "সাধারণ প্রশ্ন" }, sub: { en: "Answers to common questions", bn: "সাধারণ প্রশ্নের উত্তর" } },
      { to: "/help-desk/noticeboard", title: { en: "Noticeboard", bn: "নোটিশবোর্ড" }, sub: { en: "Regulatory & service notices", bn: "নিয়ন্ত্রক ও সেবা নোটিশ" } },
      { to: "/contact", title: { en: "Contact Us", bn: "যোগাযোগ করুন" }, sub: { en: "Talk to our team", bn: "আমাদের টিমের সাথে কথা বলুন" } },
      { to: "/pricing", hash: "pricing", title: { en: "Get Proposal", bn: "প্রস্তাব নিন" }, sub: { en: "Request a tailored quotation", bn: "আপনার জন্য কোটেশন চান" } },
    ],
  },
  {
    id: "company",
    label: { en: "Company", bn: "কোম্পানি" },
    items: [
      { to: "/about", hash: "why-ritorica", title: { en: "Why Ritorica", bn: "কেন Ritorica" }, sub: { en: "What sets us apart", bn: "আমরা কেন আলাদা" } },
      { to: "/about", title: { en: "About Us", bn: "আমাদের সম্পর্কে" }, sub: { en: "Who we are", bn: "আমরা কারা" } },
      { to: "/privacy", title: { en: "Privacy Policy", bn: "গোপনীয়তা নীতি" }, sub: { en: "How we handle your data", bn: "আপনার তথ্য কীভাবে রাখি" } },
      { to: "/terms", title: { en: "Terms of Service", bn: "সেবার শর্তাবলি" }, sub: { en: "Rules for using our services", bn: "সেবা ব্যবহারের নিয়ম" } },
      { to: "/document-acceptance-policy", title: { en: "Document Acceptance Policy", bn: "ডকুমেন্ট গ্রহণ নীতি" }, sub: { en: "Documents we accept", bn: "যে ডকুমেন্ট গ্রহণ করা হয়" } },
    ],
  },
];
