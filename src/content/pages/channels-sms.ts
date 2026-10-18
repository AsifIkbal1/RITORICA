import type { RichPage } from "./types";

/** Source: ritorica.com/channels/sms (supplied by the client). */
export const page: RichPage = {
  group: "channels",
  slug: "sms",
  name: { en: "SMS Channel", bn: "এসএমএস চ্যানেল" },
  title: { en: "Effective SMS Campaigns for Your Business", bn: "আপনার ব্যবসার জন্য কার্যকর এসএমএস ক্যাম্পেইন" },
  intro: {
    en: "Optimize customer communication via SMS, reducing costs and boosting engagement.",
    bn: "এসএমএসের মাধ্যমে গ্রাহক যোগাযোগ অপ্টিমাইজ করুন, খরচ কমান এবং সম্পৃক্ততা বাড়ান।",
  },
  highlight: { en: "90%+ Open Rate  |  95%+ Coverage worldwide  |  Near 100% Deliverability", bn: "৯০%+ ওপেন রেট  |  বিশ্বব্যাপী ৯৫%+ কভারেজ  |  প্রায় ১০০% ডেলিভারিযোগ্যতা" },
  description: "Ritorica SMS Channel: fast, personalized, secure SMS campaigns with 90%+ open rates and global reach.",
  sections: [
    {
      kind: "text",
      title: { en: "SMS Campaigns for Business", bn: "ব্যবসার জন্য এসএমএস ক্যাম্পেইন" },
      paragraphs: [
        { en: "SMS is a proven method to reach customers directly via mobile devices. Reduce costs and boost response rates with targeted, personalized messages.", bn: "মোবাইল ডিভাইসে সরাসরি গ্রাহকের কাছে পৌঁছানোর একটি প্রমাণিত পদ্ধতি এসএমএস। টার্গেটেড ও ব্যক্তিগতকৃত মেসেজে খরচ কমান এবং সাড়া দেওয়ার হার বাড়ান।" },
        { en: "Fast Delivery, 90%+ Open Rate, support for 160-character messages, personalized messaging, 95%+ coverage worldwide, near 100% deliverability.", bn: "দ্রুত ডেলিভারি, ৯০%+ ওপেন রেট, ১৬০-অক্ষরের মেসেজ সাপোর্ট, ব্যক্তিগতকৃত মেসেজিং, বিশ্বব্যাপী ৯৫%+ কভারেজ এবং প্রায় ১০০% ডেলিভারিযোগ্যতা।" },
      ],
    },
    {
      kind: "list",
      title: { en: "Advantages of SMS Channels", bn: "এসএমএস চ্যানেলের সুবিধা" },
      items: {
        en: [
          "Direct Delivery — Messages go straight to recipients' mobile devices, ensuring visibility.",
          "Instant Interaction — Enable immediate customer responses through concise, clear messaging.",
          "Seamless Integration — Easily connect with existing marketing systems via API.",
          "Global Reach — Send SMS worldwide without additional costs.",
          "Security — Protect message confidentiality with advanced encryption protocols.",
          "Personalization — Automatically tailor messages for each client to enhance loyalty and engagement.",
        ],
        bn: [
          "সরাসরি ডেলিভারি — মেসেজ সরাসরি প্রাপকের মোবাইল ডিভাইসে যায়, দৃশ্যমানতা নিশ্চিত হয়।",
          "তাৎক্ষণিক মিথস্ক্রিয়া — স্পষ্ট ও সংক্ষিপ্ত মেসেজিংয়ের মাধ্যমে গ্রাহকের তাৎক্ষণিক সাড়া সম্ভব হয়।",
          "সহজ ইন্টিগ্রেশন — API-র মাধ্যমে বিদ্যমান মার্কেটিং সিস্টেমের সাথে সহজে যুক্ত করুন।",
          "বৈশ্বিক নাগাল — কোনো অতিরিক্ত খরচ ছাড়াই বিশ্বব্যাপী এসএমএস পাঠান।",
          "নিরাপত্তা — উন্নত এনক্রিপশন প্রোটোকলে মেসেজের গোপনীয়তা রক্ষা করুন।",
          "ব্যক্তিগতকরণ — আনুগত্য ও সম্পৃক্ততা বাড়াতে প্রতিটি গ্রাহকের জন্য মেসেজ স্বয়ংক্রিয়ভাবে উপযোগী করুন।",
        ],
      },
    },
    {
      kind: "features",
      title: { en: "Use Cases for SMS Channel", bn: "এসএমএস চ্যানেলের ব্যবহারক্ষেত্র" },
      items: [
        { title: { en: "Promotional", bn: "প্রমোশনাল" }, text: { en: "Share exclusive offers, discounts, and tailored deals to drive sales.", bn: "বিক্রি বাড়াতে এক্সক্লুসিভ অফার, ছাড় ও উপযোগী ডিল জানান।" } },
        { title: { en: "Service", bn: "সার্ভিস" }, text: { en: "Notify customers about order status, send reminders, or share relevant updates.", bn: "অর্ডারের অবস্থা জানান, রিমাইন্ডার পাঠান বা প্রাসঙ্গিক আপডেট শেয়ার করুন।" } },
        { title: { en: "Authentication", bn: "অথেনটিকেশন" }, text: { en: "Deliver one-time passwords (OTP) or verification codes for secure user identification.", bn: "নিরাপদ পরিচয় নিশ্চিতকরণের জন্য ওয়ান-টাইম পাসওয়ার্ড (OTP) বা ভেরিফিকেশন কোড পাঠান।" } },
        { title: { en: "Transactional", bn: "ট্রানজ্যাকশনাল" }, text: { en: "Confirm purchases, notify about payments, share account balances, or update service terms.", bn: "কেনাকাটা নিশ্চিত করুন, পেমেন্ট জানান, অ্যাকাউন্ট ব্যালেন্স শেয়ার করুন বা সেবার শর্ত আপডেট করুন।" } },
      ],
    },
    {
      kind: "steps",
      title: { en: "New Client Implementation Process", bn: "নতুন ক্লায়েন্টের বাস্তবায়ন প্রক্রিয়া" },
      items: [
        { title: { en: "Contract Signing", bn: "চুক্তি স্বাক্ষর" }, text: { en: "Formalizing our service agreement partnership.", bn: "আমাদের সেবা চুক্তি অংশীদারিত্ব আনুষ্ঠানিক করা।" } },
        { title: { en: "Sender Registration", bn: "সেন্ডার নিবন্ধন" }, text: { en: "Complete documentation to register your sender ID.", bn: "আপনার সেন্ডার আইডি নিবন্ধনের জন্য প্রয়োজনীয় কাগজপত্র সম্পন্ন করুন।" } },
        { title: { en: "Message Setup", bn: "মেসেজ সেটআপ" }, text: { en: "Create and register message templates.", bn: "মেসেজ টেমপ্লেট তৈরি ও নিবন্ধন করুন।" } },
        { title: { en: "Technical Integration", bn: "টেকনিক্যাল ইন্টিগ্রেশন" }, text: { en: "Connect the system to your existing workflows.", bn: "সিস্টেম আপনার বিদ্যমান কার্যপ্রবাহের সাথে যুক্ত করুন।" } },
        { title: { en: "Testing", bn: "টেস্টিং" }, text: { en: "Verify the entire message sending and delivery process.", bn: "মেসেজ পাঠানো ও ডেলিভারির পুরো প্রক্রিয়া যাচাই করুন।" } },
      ],
    },
  ],
  cta: {
    title: { en: "Get Started Today!", bn: "আজই শুরু করুন!" },
    text: { en: "Start using SMS to grow your business today! Click the button below to begin and request a personalized proposal.", bn: "আজই এসএমএস দিয়ে ব্যবসা বাড়ানো শুরু করুন! নিচের বোতামে ক্লিক করে আপনার জন্য প্রস্তাব চেয়ে নিন।" },
  },
};
