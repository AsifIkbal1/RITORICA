import { site } from "@/config/site";
import { pricePlans } from "@/content/pricing";

export function generateKnowledgeReply(query: string, lang: "en" | "bn" = "en"): string {
  const q = query.trim().toLowerCase();

  // 1. Greetings
  if (/^(hi|hello|hey|hola|assalamu\s*alaikum|salam|greetings|হাই|হ্যালো|সালাম|নমস্কার|কেমন আছেন|shunchen|hello asif)/i.test(q)) {
    if (lang === "bn" || /[\u0980-\u09FF]/.test(query)) {
      return `হ্যালো! 👋 আমি আসিফ, Ritorica সহকারী।

আমি আপনাকে আমাদের বাল্ক এসএমএস, মাস্কিং/নন-মাস্কিং রেট, ওটিপি গেটওয়ে, হোয়াটসঅ্যাপ বিজনেস এপিআই অথবা সিস্টেম ইন্টিগ্রেশনের বিষয়ে সাহায্য করতে পারি। 

আজকে আপনার ব্যবসার জন্য কীভাবে সাহায্য করতে পারি?`;
    }
    return `Hello! 👋 I'm Asif, your Ritorica Assistant.

I'm here to help you with our messaging products, SMS pricing, OTP services, WhatsApp Business API, and operator integrations.

What can I help your business with today?`;
  }

  // 2. Pricing / Rates / SMS price
  if (/price|pricing|rate|cost|how much|package|charge|দাম|খরচ|রেট|মূল্য|টাকা|প্যাকেজ|dam|khoroch|koto/i.test(q)) {
    if (lang === "bn" || /[\u0980-\u09FF]/.test(query)) {
      return `Ritorica-র অফিসিয়াল এসএমএস প্যাকেজ ও প্রারম্ভিক রেটসমূহ:

• **মাস্কিং এসএমএস (Masking SMS)**: শুরু মাত্র **৳০.৪৮** / এসএমএস
  (সকল অপারেটরে সেন্ডার আইডি ব্র্যান্ডিং, রিয়েল-টাইম DLR, বাংলা ও ইংরেজি ইউনিকোড সাপোর্ট)

• **নন-মাস্কিং এসএমএস (Non-Masking SMS)**: শুরু মাত্র **৳০.২৫** / এসএমএস
  (সর্বনিম্ন রেট, বাল্ক মার্কেটিং ক্যাম্পেইন, এক্সেল থেকে সরাসরি পাঠানো)

• **ওটিপি এসএমএস (OTP SMS)**: শুরু মাত্র **৳০.৩৫** / এসএমএস
  (১ সেকেন্ডের কম সময়ে তাৎক্ষণিক ডেলিভারি, ব্যাংকিং গ্রেড নিরাপত্তা)

• **লোকেশন-ভিত্তিক এসএমএস (Location-based)**: শুরু মাত্র **৳০.২৬** / এসএমএস
  (নির্দিষ্ট জেলা, থানা বা এলাকা টার্গেট করে পাঠানো)

📌 *বিঃদ্রঃ মাসিক ভলিউম বৃদ্ধির সাথে সাথে রেট আরও কমে। BTRC নির্দেশনা অনুযায়ী প্রমোশনাল এসএমএস বাংলায় পাঠানো বাধ্যতামূলক।*

সম্পূর্ণ মূল্য তালিকা দেখতে ভিজিট করুন [/pricing](/pricing) অথবা বিশেষ ভলিউম ডিসকাউন্টের জন্য আমাদের সেলস টিমের সাথে যোগাযোগ করুন ([sales@ritorica.com.bd](mailto:sales@ritorica.com.bd))।`;
    }
    return `Here are Ritorica's official starting SMS rates in Bangladesh:

• **Masking SMS**: from **BDT 0.48** / SMS
  (Your official brand/company name as Sender ID across all operators, instant DLR)

• **Non-masking SMS**: from **BDT 0.25** / SMS
  (Most cost-effective for high-volume broadcasts and promotional campaigns)

• **OTP SMS**: from **BDT 0.35** / SMS
  (Priority delivery in under 1 second, banking-grade security, 99.99% uptime)

• **Location-based SMS**: from **BDT 0.26** / SMS
  (Target audiences by specific divisions, districts, or BTS telecom towers)

📌 *Note: Exact rates depend on monthly volume. Promotional SMS in Bangladesh must be in Bangla as per BTRC regulations. VAT is applicable as per government policy.*

Check out our full packages on our [/pricing](/pricing) page or contact our team at [sales@ritorica.com.bd](mailto:sales@ritorica.com.bd) for a custom volume quotation!`;
  }

  // 3. OTP Service
  if (/otp|verification|auth|pin|one time password|ওটিপি|ভেরিফিকেশন/i.test(q)) {
    if (lang === "bn" || /[\u0980-\u09FF]/.test(query)) {
      return `আমাদের ডেডিকেটেড ওটিপি এসএমএস গেটওয়ে সেবা:
• **ডেলিভারি সময়**: ১ সেকেন্ডের কম
• **প্রারম্ভিক রেট**: মাত্র ৳০.৩৫ / এসএমএস
• **নেটওয়ার্ক**: গ্রামীণফোন, রবি, বাংলালিংক ও টেলিটকে প্রায়োরিটি রাউটিং
• **নিরাপত্তা**: ব্যাংকিং ও ফিনটেক গ্রেড এনক্রিপশন
• **ইন্টিগ্রেশন**: সহজ REST API ও ওয়েবহুক DLR

টেকনিক্যাল ডকুমেন্টেশন দেখতে ভিজিট করুন [/developers/api-docs](/developers/api-docs)।`;
    }
    return `Ritorica's dedicated OTP SMS Gateway provides:
• **Ultra-fast delivery**: under 1 second
• **Starting rate**: from BDT 0.35 / SMS
• **Direct priority routes**: across Grameenphone, Robi, Banglalink & Teletalk
• **High availability**: 99.99% uptime guarantee for banks, fintech & apps
• **Easy setup**: REST APIs, SDKs, and real-time delivery webhooks

Explore developer guides at [/developers/api-docs](/developers/api-docs) or test it via [/request-demo](/request-demo).`;
  }

  // 4. Masking SMS
  if (/masking|brand name|sender id|মাস্কিং/i.test(q)) {
    if (lang === "bn" || /[\u0980-\u09FF]/.test(query)) {
      return `মাস্কিং এসএমএস (Masking SMS) সুবিধা:
• প্রেরকের নম্বরের বদলে আপনার কোম্পানির নাম (Sender ID) প্রদর্শিত হবে
• রেট শুরু মাত্র **৳০.৪৮** / এসএমএস
• বাংলাদেশের সকল মোবাইল অপারেটরে অনুমোদিত
• রিয়েল-টাইম ডেলিভারি রিপোর্ট ও ওয়েব পোর্টাল
• API এবং এক্সেল শিট থেকে সরাসরি সেন্ড করার সুবিধা

বিস্তারিত জানতে দেখুন [/services/masking-sms](/services/masking-sms)।`;
    }
    return `Ritorica Masking SMS lets you send messages displaying your official brand name (Sender ID) instead of a random number:
• Approved across all Bangladesh mobile operators
• Starting from **BDT 0.48** / SMS
• Instant real-time delivery reports (DLR)
• Supports dynamic parameters, Excel bulk upload & developer API
• Builds customer trust for alerts, notifications, and updates

Learn more on our [/services/masking-sms](/services/masking-sms) page.`;
  }

  // 5. WhatsApp Business API
  if (/whatsapp|meta|হোয়াটসঅ্যাপ/i.test(q)) {
    if (lang === "bn" || /[\u0980-\u09FF]/.test(query)) {
      return `Ritorica হলো মেটার অফিসিয়াল বিজনেস পার্টনার (Meta Business Partner):
• অফিসিয়াল WhatsApp Business API অ্যাক্টিভেশন
• গ্রীন টিক ভেরিফিকেশন (Green Tick) সহায়তা
• রিচ মিডিয়া মেসেজ (ছবি, ভিডিও, পিডিএফ এবং ইন্টারেক্টিভ বাটন)
• অটোমেটেড চ্যাটবট এবং কাস্টমার সাপোর্ট ইন্টিগ্রেশন

বিস্তারিত জানতে বা ডেমো নিতে ভিজিট করুন [/request-demo](/request-demo) অথবা [/contact](/contact)।`;
    }
    return `As an official Meta Business Partner, Ritorica powers verified WhatsApp Business API solutions:
• Official Green Badge verification assistance
• Rich interactive messaging (buttons, catalogs, PDF statements, videos)
• 2-way messaging and automated chatbot workflows
• High reliability and 24/7 enterprise support

Get started by requesting a demo at [/request-demo](/request-demo) or contact [sales@ritorica.com.bd](mailto:sales@ritorica.com.bd).`;
  }

  // 6. API / Developer Docs
  if (/api|docs|sdk|smpp|developer|curl|postman|এপিআই|ইন্টিগ্রেশন|কোড/i.test(q)) {
    if (lang === "bn" || /[\u0980-\u09FF]/.test(query)) {
      return `Ritorica ডেভেলপারদের জন্য আধুনিক ও দ্রুতগতির এপিআই প্রদান করে:
• **REST API**: JSON ভিত্তিক সহজ রিকোয়েস্ট ও রেসপন্স
• **SMPP v3.4**: হাই-ভলিউম এন্টারপ্রাইজ সিস্টেমের জন্য SMPP সাপোর্ট
• **কোড এক্সাম্পল**: cURL, Python, Node.js, PHP ও Java
• **ওয়েবহুক**: রিয়েল-টাইম ডেলিভারি স্ট্যাটাস (DLR Callback)

সম্পূর্ণ এপিআই ডকুমেন্টেশন দেখতে ভিজিট করুন [/developers/api-docs](/developers/api-docs) এবং ইন্টিগ্রেশন গাইড দেখুন [/developers/integration-guides](/developers/integration-guides)।`;
    }
    return `Ritorica provides enterprise-grade developer APIs:
• **RESTful HTTP API**: fast, secure JSON endpoints
• **SMPP v3.4 Protocol**: for high-throughput enterprise telecom routing
• **SDKs & Samples**: ready-to-use snippets for cURL, Node.js, Python, PHP, and Java
• **DLR Webhooks**: instant callbacks on message delivery status

Check out our documentation at [/developers/api-docs](/developers/api-docs) and guides at [/developers/integration-guides](/developers/integration-guides).`;
  }

  // 7. Support / Contact / Tickets
  if (/support|ticket|help|contact|phone|email|office|address|টিকেট|সাপোর্ট|সাহায্য|যোগাযোগ|ফোন|ঠিকানা|সমস্যা|problem|issue/i.test(q)) {
    if (lang === "bn" || /[\u0980-\u09FF]/.test(query)) {
      return `আমাদের ২৪/৭ সাপোর্ট টিম আপনার সেবায় প্রস্তুত:
• **সাপোর্ট টিকেট ওপেন করুন**: [/help-desk/open-ticket](/help-desk/open-ticket)
• **হেল্প সেন্টার ও FAQ**: [/help-desk/faq](/help-desk/faq)
• **ইমেইল**: [support@ritorica.com.bd](mailto:support@ritorica.com.bd) / [sales@ritorica.com.bd](mailto:sales@ritorica.com.bd)
• **হটলাইন / ফোন**: ${site.phone}
• **অফিস**: ${site.address.bn}

আপনার কোনো অভিযোগ বা কারিগরি সমস্যা থাকলে সরাসরি টিকেট ওপেন করুন, আমাদের প্রতিনিধি দ্রুত যোগাযোগ করবেন।`;
    }
    return `Our 24/7 Support Team is always available to assist you:
• **Open a Support Ticket**: [/help-desk/open-ticket](/help-desk/open-ticket)
• **Help Center & FAQs**: [/help-desk/faq](/help-desk/faq)
• **Email**: [support@ritorica.com.bd](mailto:support@ritorica.com.bd) or [sales@ritorica.com.bd](mailto:sales@ritorica.com.bd)
• **Phone**: ${site.phone}
• **Headquarters**: ${site.address.en}

Feel free to open a ticket for any technical inquiries or troubleshooting!`;
  }

  // 8. General / Company / About
  if (lang === "bn" || /[\u0980-\u09FF]/.test(query)) {
    return `Ritorica Information Technology Bangladesh Limited — দেশের শীর্ষস্থানীয় A2P বিজনেস মেসেজিং (CPaaS) বিশেষজ্ঞ।

• **অভিজ্ঞতা**: ২০+ বছর এবং ১৫০ জনের বেশি অভিজ্ঞ প্রফেশনাল টিম
• **সক্ষমতা**: বার্ষিক ১২+ বিলিয়ন মেসেজ ডেলিভারি এবং ৯৯.৯৯% আপটাইম
• **পার্টনারশিপ**: GSMA মেম্বার এবং অফিসিয়াল Meta Business Partner
• **কভারেজ**: ২০৭টি দেশে ৫০০+ ডিরেক্ট টেলিকম অপারেটর সংযোগ

আমাদের সার্ভিস সম্পর্কে আরও জানতে বা ট্রায়াল অ্যাকাউন্ট পেতে ভিজিট করুন [/request-demo](/request-demo) অথবা টিকেট ওপেন করুন [/help-desk/open-ticket](/help-desk/open-ticket)-এ।`;
  }

  return `Ritorica Information Technology Bangladesh Limited is an enterprise CPaaS and A2P messaging provider:

• **Experience**: 20+ years of telecom experience with 150+ professionals
• **Scale**: 12+ billion messages delivered with 99.99% uptime
• **Global Reach**: 500+ direct operator connections across 207 countries
• **Accreditations**: Official Meta Business Partner & GSMA Member
• **Solutions**: Masking SMS, Non-masking SMS, OTP Gateway, WhatsApp Business API, Voice broadcasting and Omnichannel APIs

Would you like to explore our [/pricing](/pricing), review our [/developers/api-docs](/developers/api-docs), or [open a support ticket](/help-desk/open-ticket)?`;
}
