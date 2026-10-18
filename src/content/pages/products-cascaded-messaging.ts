import type { RichPage } from "./types";

/** Source: ritorica.com/products/cascaded-messaging (supplied by the client). */
export const page: RichPage = {
  group: "products",
  slug: "cascaded-messaging",
  name: { en: "Cascaded Messaging", bn: "ক্যাসকেডেড মেসেজিং" },
  eyebrow: { en: "Multi-Channel Product", bn: "মাল্টি-চ্যানেল পণ্য" },
  title: { en: "Never Miss a Customer — Deliver on Any Channel", bn: "কোনো গ্রাহক হাতছাড়া নয় — যেকোনো চ্যানেলে পৌঁছে দিন" },
  intro: {
    en: "Cascaded Messaging automatically routes your message through multiple channels in sequence. Start with Viber, fall back to WhatsApp, and guarantee delivery via SMS — all in one API call.",
    bn: "ক্যাসকেডেড মেসেজিং আপনার মেসেজ একাধিক চ্যানেলের মধ্য দিয়ে ক্রমানুসারে স্বয়ংক্রিয়ভাবে পাঠায়। ভাইবার দিয়ে শুরু করুন, না হলে হোয়াটসঅ্যাপে যান, আর এসএমএসে নিশ্চিত ডেলিভারি পান — সব এক API কলেই।",
  },
  highlight: { en: "Up to 4 channels per cascade  |  Sub-second switching  |  Single API", bn: "প্রতি ক্যাসকেডে সর্বোচ্চ ৪টি চ্যানেল  |  সেকেন্ডেরও কম সময়ে পরিবর্তন  |  একক API" },
  description: "Ritorica Cascaded Messaging routes messages through Viber, WhatsApp, and SMS in sequence to guarantee delivery via a single API call.",
  sections: [
    {
      kind: "features",
      title: { en: "Why Choose Ritorica for Cascaded Messaging?", bn: "কেন ক্যাসকেডেড মেসেজিংয়ের জন্য Ritorica বেছে নেবেন?" },
      intro: {
        en: "Ritorica's Cascaded Messaging ensures your critical messages always reach their destination — by intelligently switching channels when one fails, so you never leave a customer without a response.",
        bn: "Ritorica-র ক্যাসকেডেড মেসেজিং নিশ্চিত করে যে আপনার গুরুত্বপূর্ণ মেসেজ সবসময় গন্তব্যে পৌঁছায় — একটি চ্যানেল ব্যর্থ হলে বুদ্ধিমত্তার সাথে অন্য চ্যানেলে পাঠিয়ে, যাতে কোনো গ্রাহক উত্তরহীন না থাকেন।",
      },
      items: [
        { title: { en: "Maximum Delivery Rate", bn: "সর্বোচ্চ ডেলিভারি রেট" }, text: { en: "Achieve near-100% delivery by automatically routing to the next available channel when one fails.", bn: "একটি চ্যানেল ব্যর্থ হলে পরবর্তী উপলব্ধ চ্যানেলে স্বয়ংক্রিয়ভাবে পাঠিয়ে প্রায় ১০০% ডেলিভারি নিশ্চিত করুন।" } },
        { title: { en: "Cost-Optimised Routing", bn: "খরচ-অপ্টিমাইজড রাউটিং" }, text: { en: "Start with the cheapest channel (e.g., Viber) and only pay for SMS when needed. Reduce costs by up to 60%.", bn: "সবচেয়ে সাশ্রয়ী চ্যানেল (যেমন ভাইবার) দিয়ে শুরু করুন, প্রয়োজনে কেবল এসএমএসের জন্য খরচ করুন। খরচ কমান সর্বোচ্চ ৬০%।" } },
        { title: { en: "Single API Integration", bn: "একক API ইন্টিগ্রেশন" }, text: { en: "One API call handles the entire cascade — no separate integrations per channel, no complex logic in your code.", bn: "একটি API কলেই পুরো ক্যাসকেড পরিচালিত হয় — প্রতিটি চ্যানেলের জন্য আলাদা ইন্টিগ্রেশন বা জটিল কোড লাগে না।" } },
        { title: { en: "Fully Configurable Rules", bn: "সম্পূর্ণ কনফিগারযোগ্য নিয়ম" }, text: { en: "Set custom timeout windows, define channel priority, and control fallback conditions for each message type.", bn: "নিজের মতো টাইমআউট নির্ধারণ করুন, চ্যানেলের অগ্রাধিকার ঠিক করুন, এবং প্রতিটি মেসেজের ধরন অনুযায়ী ফলব্যাক শর্ত নিয়ন্ত্রণ করুন।" } },
        { title: { en: "Real-Time Delivery Tracking", bn: "রিয়েল-টাইম ডেলিভারি ট্র্যাকিং" }, text: { en: "Monitor cascade status live — see exactly which channel delivered, at what time, and with what result.", bn: "লাইভ ক্যাসকেড স্ট্যাটাস দেখুন — ঠিক কোন চ্যানেল কখন ডেলিভার করেছে এবং কী ফলাফল হয়েছে।" } },
        { title: { en: "Compliance Built In", bn: "অন্তর্নির্মিত কমপ্লায়েন্স" }, text: { en: "Every cascade respects channel-specific opt-out rules, sender ID requirements, and regional regulations automatically.", bn: "প্রতিটি ক্যাসকেড স্বয়ংক্রিয়ভাবে চ্যানেলভিত্তিক অপ্ট-আউট নিয়ম, সেন্ডার আইডি প্রয়োজনীয়তা এবং আঞ্চলিক নিয়মাবলী মেনে চলে।" } },
      ],
    },
    {
      kind: "steps",
      title: { en: "How Cascaded Messaging Works", bn: "ক্যাসকেডেড মেসেজিং কীভাবে কাজ করে" },
      intro: {
        en: "You define the channel order and timing. Ritorica handles the delivery logic — automatically and in real time.",
        bn: "আপনি চ্যানেলের ক্রম ও সময় নির্ধারণ করেন। Ritorica স্বয়ংক্রিয়ভাবে ও রিয়েল-টাইমে ডেলিভারির যুক্তি পরিচালনা করে।",
      },
      items: [
        { title: { en: "You Configure the Route", bn: "আপনি রুট কনফিগার করেন" }, text: { en: "Choose which channels to use, their priority order, and how long to wait before moving to the next one.", bn: "কোন চ্যানেলগুলো ব্যবহার করবেন, তাদের অগ্রাধিকার এবং পরবর্তীটিতে যাওয়ার আগে কতক্ষণ অপেক্ষা করবেন তা বেছে নিন।" } },
        { title: { en: "Ritorica Handles the Rest", bn: "বাকিটা Ritorica সামলায়" }, text: { en: "Our platform monitors delivery in real time and triggers the fallback automatically — no code changes needed on your end.", bn: "আমাদের প্ল্যাটফর্ম রিয়েল-টাইমে ডেলিভারি পর্যবেক্ষণ করে এবং স্বয়ংক্রিয়ভাবে ফলব্যাক চালু করে — আপনার দিক থেকে কোনো কোড পরিবর্তন লাগে না।" } },
        { title: { en: "You Get a Single Report", bn: "আপনি একটি একক রিপোর্ট পান" }, text: { en: "A unified delivery report shows the full cascade path, final status, channel used, and timing for every message.", bn: "একটি একীভূত ডেলিভারি রিপোর্টে প্রতিটি মেসেজের পূর্ণ ক্যাসকেড পথ, চূড়ান্ত স্ট্যাটাস, ব্যবহৃত চ্যানেল ও সময় দেখা যায়।" } },
      ],
    },
    {
      kind: "features",
      title: { en: "Everything You Need for Reliable Multi-Channel Delivery", bn: "নির্ভরযোগ্য মাল্টি-চ্যানেল ডেলিভারির জন্য যা যা দরকার" },
      intro: {
        en: "A complete set of controls to configure, monitor, and optimize your message cascades at scale.",
        bn: "বড় পরিসরে মেসেজ ক্যাসকেড কনফিগার, পর্যবেক্ষণ ও অপ্টিমাইজ করার জন্য পূর্ণ নিয়ন্ত্রণ ব্যবস্থা।",
      },
      items: [
        {
          title: { en: "Smart Channel Routing", bn: "স্মার্ট চ্যানেল রাউটিং" },
          text: { en: "Define a priority-ordered list of channels. Ritorica tries each one in sequence until delivery is confirmed.", bn: "অগ্রাধিকার অনুযায়ী চ্যানেলের তালিকা তৈরি করুন। ডেলিভারি নিশ্চিত না হওয়া পর্যন্ত Ritorica একে একে চেষ্টা করে।" },
          points: {
            en: ["Up to 4 channels per cascade route", "Per-route timeout windows (5s to 24h)", "Fallback on non-delivery or read receipt", "Custom routes per message type or audience"],
            bn: ["প্রতি ক্যাসকেড রুটে সর্বোচ্চ ৪টি চ্যানেল", "প্রতি রুটে টাইমআউট (৫ সেকেন্ড থেকে ২৪ ঘণ্টা)", "ডেলিভারি না হলে বা রিড রিসিপ্টে ফলব্যাক", "মেসেজের ধরন বা শ্রোতা অনুযায়ী কাস্টম রুট"],
          },
        },
        {
          title: { en: "Cascade Analytics", bn: "ক্যাসকেড অ্যানালিটিক্স" },
          text: { en: "Full visibility into your cascade performance — by channel, time window, and delivery outcome.", bn: "চ্যানেল, সময়কাল ও ডেলিভারি ফলাফল অনুযায়ী ক্যাসকেড পারফরম্যান্সের পূর্ণ চিত্র।" },
          points: {
            en: ["Per-channel delivery rate breakdown", "Average fallback trigger time", "Cost per delivered message by route", "Export reports in CSV, XLSX, or API"],
            bn: ["চ্যানেলভিত্তিক ডেলিভারি রেট বিশ্লেষণ", "গড় ফলব্যাক সক্রিয় হওয়ার সময়", "রুট অনুযায়ী প্রতি ডেলিভারড মেসেজের খরচ", "CSV, XLSX বা API-তে রিপোর্ট এক্সপোর্ট"],
          },
        },
        {
          title: { en: "Security & Compliance", bn: "নিরাপত্তা ও কমপ্লায়েন্স" },
          text: { en: "Enterprise-grade controls keep every cascade secure, compliant, and fully auditable.", bn: "এন্টারপ্রাইজ-মানের নিয়ন্ত্রণ প্রতিটি ক্যাসকেডকে নিরাপদ, নিয়মমাফিক ও সম্পূর্ণ অডিটযোগ্য রাখে।" },
          points: {
            en: ["End-to-end encryption on all channels", "Automatic opt-out enforcement per channel", "GDPR, TCPA, and local regulation compliance", "Full delivery audit trail with timestamps"],
            bn: ["সব চ্যানেলে এন্ড-টু-এন্ড এনক্রিপশন", "চ্যানেলভিত্তিক স্বয়ংক্রিয় অপ্ট-আউট প্রয়োগ", "GDPR, TCPA ও স্থানীয় নিয়ম মেনে চলা", "টাইমস্ট্যাম্পসহ পূর্ণ ডেলিভারি অডিট ট্রেইল"],
          },
        },
        {
          title: { en: "Seamless Integration", bn: "সহজ ইন্টিগ্রেশন" },
          text: { en: "One REST API endpoint sends a cascade message — your existing messaging code works with minimal changes.", bn: "একটি REST API এন্ডপয়েন্টেই ক্যাসকেড মেসেজ পাঠানো যায় — আপনার বর্তমান কোডে সামান্য পরিবর্তনেই কাজ করবে।" },
          points: {
            en: ["Single REST API with webhook callbacks", "SDKs for Python, PHP, Node.js, Java", "CRM & marketing platform connectors", "Sandbox environment for testing cascades"],
            bn: ["ওয়েবহুক কলব্যাকসহ একক REST API", "Python, PHP, Node.js, Java-র জন্য SDK", "CRM ও মার্কেটিং প্ল্যাটফর্ম কানেক্টর", "ক্যাসকেড পরীক্ষার জন্য স্যান্ডবক্স পরিবেশ"],
          },
        },
      ],
    },
    {
      kind: "steps",
      title: { en: "Onboarding Process", bn: "অনবোর্ডিং প্রক্রিয়া" },
      items: [
        { title: { en: "Contract Signing", bn: "চুক্তি স্বাক্ষর" }, text: { en: "Finalise the service agreement and select your channel mix.", bn: "সেবা চুক্তি চূড়ান্ত করুন এবং আপনার চ্যানেল মিশ্রণ বেছে নিন।" } },
        { title: { en: "Channel Activation", bn: "চ্যানেল সক্রিয়করণ" }, text: { en: "Register sender IDs and activate Viber, WhatsApp, and SMS accounts.", bn: "সেন্ডার আইডি নিবন্ধন করুন এবং ভাইবার, হোয়াটসঅ্যাপ ও এসএমএস অ্যাকাউন্ট সক্রিয় করুন।" } },
        { title: { en: "Route Configuration", bn: "রুট কনফিগারেশন" }, text: { en: "Define cascade routes, priorities, and timeout rules in the dashboard.", bn: "ড্যাশবোর্ডে ক্যাসকেড রুট, অগ্রাধিকার ও টাইমআউট নিয়ম নির্ধারণ করুন।" } },
        { title: { en: "API Integration", bn: "API ইন্টিগ্রেশন" }, text: { en: "Connect via our REST API. Use the sandbox to test all fallback paths.", bn: "আমাদের REST API দিয়ে যুক্ত হোন। সব ফলব্যাক পথ পরীক্ষা করতে স্যান্ডবক্স ব্যবহার করুন।" } },
        { title: { en: "Go Live", bn: "চালু করুন" }, text: { en: "Launch with full monitoring. Our team stays on hand for the first 48 hours.", bn: "পূর্ণ পর্যবেক্ষণসহ চালু করুন। প্রথম ৪৮ ঘণ্টা আমাদের দল পাশে থাকে।" } },
      ],
    },
    {
      kind: "features",
      style: "tiles",
      title: { en: "Built for Real Business Scenarios", bn: "বাস্তব ব্যবসায়িক পরিস্থিতির জন্য তৈরি" },
      intro: {
        en: "Cascaded Messaging solves the delivery challenge across every critical communication type.",
        bn: "প্রতিটি গুরুত্বপূর্ণ যোগাযোগ ক্ষেত্রে ক্যাসকেডেড মেসেজিং ডেলিভারির সমস্যা সমাধান করে।",
      },
      items: [
        { title: { en: "OTP & Authentication", bn: "OTP ও প্রমাণীকরণ" }, text: { en: "Critical one-time passwords must reach the user on any device. Ritorica uses an official Viber generic sender ID for OTP messaging — with no extra monthly fee — then cascades to SMS to guarantee delivery even when the user is offline on messaging apps.", bn: "গুরুত্বপূর্ণ ওয়ান-টাইম পাসওয়ার্ড যেকোনো ডিভাইসে পৌঁছাতে হবে। Ritorica OTP মেসেজিংয়ের জন্য একটি অফিসিয়াল ভাইবার জেনেরিক সেন্ডার আইডি ব্যবহার করে — কোনো অতিরিক্ত মাসিক ফি ছাড়াই — এরপর ব্যবহারকারী মেসেজিং অ্যাপে অফলাইন থাকলেও ডেলিভারি নিশ্চিত করতে এসএমএসে ক্যাসকেড করে।" } },
        { title: { en: "Transactional Alerts", bn: "ট্রানজ্যাকশনাল অ্যালার্ট" }, text: { en: "Payment confirmations, order updates, and shipment tracking need to reach customers fast. Push first — SMS only if needed. Faster, cheaper, and more reliable.", bn: "পেমেন্ট নিশ্চিতকরণ, অর্ডার আপডেট ও শিপমেন্ট ট্র্যাকিং দ্রুত গ্রাহকের কাছে পৌঁছাতে হয়। প্রথমে পুশ — প্রয়োজনে কেবল এসএমএস। দ্রুত, সাশ্রয়ী ও বেশি নির্ভরযোগ্য।" } },
        { title: { en: "Marketing Campaigns", bn: "মার্কেটিং ক্যাম্পেইন" }, text: { en: "Send rich promotional messages via Viber or WhatsApp with images and CTAs. Fall back to plain SMS only for contacts not on messaging apps.", bn: "ছবি ও CTA-সহ সমৃদ্ধ প্রচারণামূলক মেসেজ ভাইবার বা হোয়াটসঅ্যাপে পাঠান। মেসেজিং অ্যাপ নেই এমন গ্রাহকদের জন্য কেবল সাধারণ এসএমএসে যান।" } },
      ],
    },
    {
      kind: "stats",
      title: { en: "High Performance & Reliability", bn: "উচ্চ কর্মক্ষমতা ও নির্ভরযোগ্যতা" },
      items: [
        { value: { en: "up to 10,000 msg/sec", bn: "সর্বোচ্চ ১০,০০০ মেসেজ/সেকেন্ড" }, label: { en: "Industry-leading cascade throughput", bn: "শিল্পের শীর্ষস্থানীয় ক্যাসকেড থ্রুপুট" } },
        { value: { en: "99.2%", bn: "৯৯.২%" }, label: { en: "Delivery Rate — Across cascaded routes globally", bn: "ডেলিভারি রেট — বিশ্বব্যাপী ক্যাসকেড রুটে" } },
        { value: { en: "< 1s", bn: "< ১ সেকেন্ড" }, label: { en: "Fallback — Sub-second channel switch on failure detection", bn: "ফলব্যাক — ব্যর্থতা শনাক্ত হলে সেকেন্ডেরও কমে চ্যানেল পরিবর্তন" } },
      ],
    },
  ],
  cta: {
    title: { en: "Start Delivering on Every Channel Today", bn: "আজই প্রতিটি চ্যানেলে ডেলিভারি শুরু করুন" },
    text: { en: "Stop losing messages to single-channel failures. Set up your first cascade route in minutes and guarantee delivery at scale.", bn: "একক চ্যানেলের ব্যর্থতায় মেসেজ হারানো বন্ধ করুন। কয়েক মিনিটেই প্রথম ক্যাসকেড রুট তৈরি করুন এবং বড় পরিসরে ডেলিভারি নিশ্চিত করুন।" },
  },
};
