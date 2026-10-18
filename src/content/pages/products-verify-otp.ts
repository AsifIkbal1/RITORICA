import type { RichPage } from "./types";

/** Source: ritorica.com/products/verify-otp (supplied by the client). */
export const page: RichPage = {
  group: "products",
  slug: "verify-otp",
  name: { en: "Verify OTP", bn: "ভেরিফাই OTP" },
  eyebrow: { en: "Security & Verification Product", bn: "নিরাপত্তা ও যাচাই পণ্য" },
  title: { en: "OTP Delivered in Under 3 Seconds. Every Time.", bn: "৩ সেকেন্ডেরও কম সময়ে OTP ডেলিভারি। প্রতিবার।" },
  intro: {
    en: "Ritorica's Verify OTP routes your one-time password across SMS, WhatsApp, Telegram, and Voice — automatically selecting the fastest, most reliable channel for every user, in every market.",
    bn: "Ritorica-র Verify OTP আপনার ওয়ান-টাইম পাসওয়ার্ড এসএমএস, হোয়াটসঅ্যাপ, টেলিগ্রাম ও ভয়েসে পাঠায় — প্রতিটি বাজারে প্রতিটি ব্যবহারকারীর জন্য সবচেয়ে দ্রুত ও নির্ভরযোগ্য চ্যানেল স্বয়ংক্রিয়ভাবে বেছে নিয়ে।",
  },
  highlight: { en: "99.9% delivery rate  |  4 channels  |  Single API  |  Global reach", bn: "৯৯.৯% ডেলিভারি রেট  |  ৪টি চ্যানেল  |  একক API  |  বৈশ্বিক নাগাল" },
  description: "Ritorica Verify OTP delivers one-time passwords via SMS, WhatsApp, Telegram, and Voice with automatic fallback for maximum reliability.",
  sections: [
    {
      kind: "stats",
      title: { en: "Ritorica Verify at a Glance", bn: "এক নজরে Ritorica Verify" },
      items: [
        { value: { en: "99.9%", bn: "৯৯.৯%" }, label: { en: "OTP delivery rate", bn: "OTP ডেলিভারি রেট" } },
        { value: { en: "<3s", bn: "<৩ সেকেন্ড" }, label: { en: "Average delivery time", bn: "গড় ডেলিভারি সময়" } },
        { value: { en: "5+", bn: "৫+" }, label: { en: "Delivery channels", bn: "ডেলিভারি চ্যানেল" } },
        { value: { en: "10k/s", bn: "১০ হাজার/সেকেন্ড" }, label: { en: "OTP throughput capacity", bn: "OTP থ্রুপুট ক্ষমতা" } },
      ],
    },
    {
      kind: "features",
      title: { en: "Why OTP Delivery Reliability Matters", bn: "কেন OTP ডেলিভারির নির্ভরযোগ্যতা গুরুত্বপূর্ণ" },
      intro: {
        en: "A failed OTP is a failed login, a lost transaction, and a frustrated customer. Ritorica's Verify OTP eliminates single-channel risk by routing each code through the fastest available path — so users verify successfully on the first attempt, every time.",
        bn: "একটি ব্যর্থ OTP মানে ব্যর্থ লগইন, একটি হারানো লেনদেন এবং একজন অসন্তুষ্ট গ্রাহক। Ritorica-র Verify OTP প্রতিটি কোড সবচেয়ে দ্রুত উপলব্ধ পথে পাঠিয়ে একক চ্যানেলের ঝুঁকি দূর করে — ফলে ব্যবহারকারীরা প্রতিবার প্রথম চেষ্টাতেই সফলভাবে যাচাই করতে পারেন।",
      },
      items: [
        { title: { en: "Sub-3-Second Delivery", bn: "৩ সেকেন্ডেরও কম সময়ে ডেলিভারি" }, text: { en: "Most OTPs arrive in under 3 seconds. Users verify without waiting — reducing drop-off at your most critical conversion point.", bn: "বেশিরভাগ OTP ৩ সেকেন্ডেরও কম সময়ে পৌঁছায়। ব্যবহারকারীরা অপেক্ষা ছাড়াই যাচাই করতে পারেন — আপনার সবচেয়ে গুরুত্বপূর্ণ কনভার্সন পয়েন্টে ড্রপ-অফ কমায়।" } },
        { title: { en: "Automatic Channel Fallback", bn: "স্বয়ংক্রিয় চ্যানেল ফলব্যাক" }, text: { en: "If SMS is slow or a user has no WhatsApp, Ritorica instantly switches to the next channel. You set the priority order — we handle the routing.", bn: "এসএমএস ধীরগতির হলে বা ব্যবহারকারীর হোয়াটসঅ্যাপ না থাকলে, Ritorica তাৎক্ষণিকভাবে পরবর্তী চ্যানেলে পরিবর্তন করে। আপনি অগ্রাধিকার ঠিক করুন — রাউটিং আমরা সামলাই।" } },
        { title: { en: "Fraud-Resistant by Design", bn: "নকশা থেকেই প্রতারণা-প্রতিরোধী" }, text: { en: "Short expiry windows, one-time use codes, and delivery-confirmation webhooks make interception and replay attacks effectively impossible.", bn: "সংক্ষিপ্ত মেয়াদ, একবার ব্যবহারযোগ্য কোড এবং ডেলিভারি-নিশ্চিতকরণ ওয়েবহুক ইন্টারসেপশন ও রিপ্লে আক্রমণকে কার্যত অসম্ভব করে তোলে।" } },
        { title: { en: "Real-Time Delivery Reports", bn: "রিয়েল-টাইম ডেলিভারি রিপোর্ট" }, text: { en: "Know exactly which channel delivered, at what timestamp, with what status. Full audit trail per OTP for compliance and debugging.", bn: "ঠিক কোন চ্যানেল কখন কোন স্ট্যাটাসে ডেলিভার করেছে তা জানুন। কমপ্লায়েন্স ও ডিবাগিংয়ের জন্য প্রতিটি OTP-র পূর্ণ অডিট ট্রেইল।" } },
        { title: { en: "One API. All Channels.", bn: "একটি API। সব চ্যানেল।" }, text: { en: "A single HTTP POST sends the OTP across all configured channels. No vendor management per channel, no complex routing logic in your codebase.", bn: "একটি মাত্র HTTP POST দিয়ে সব কনফিগার করা চ্যানেলে OTP পাঠানো হয়। প্রতিটি চ্যানেলের জন্য আলাদা ভেন্ডর ব্যবস্থাপনা বা জটিল রাউটিং লজিক লাগে না।" } },
        { title: { en: "Global Coverage", bn: "বৈশ্বিক কভারেজ" }, text: { en: "Reach users in 207 countries. Ritorica's direct operator agreements and messaging platform partnerships ensure delivery where others fail.", bn: "২০৭টি দেশে ব্যবহারকারীর কাছে পৌঁছান। Ritorica-র সরাসরি অপারেটর চুক্তি ও মেসেজিং প্ল্যাটফর্ম অংশীদারিত্ব অন্যরা যেখানে ব্যর্থ হয় সেখানেও ডেলিভারি নিশ্চিত করে।" } },
      ],
    },
    {
      kind: "features",
      style: "tiles",
      title: { en: "5 Channels. One API Call.", bn: "৫টি চ্যানেল। একটি API কল।" },
      intro: {
        en: "Ritorica routes each OTP through the optimal channel automatically — or you control the priority order via a simple config.",
        bn: "Ritorica প্রতিটি OTP স্বয়ংক্রিয়ভাবে সর্বোত্তম চ্যানেলে পাঠায় — অথবা আপনি একটি সহজ কনফিগ দিয়ে অগ্রাধিকার নিয়ন্ত্রণ করতে পারেন।",
      },
      items: [
        { title: { en: "SMS", bn: "এসএমএস" }, text: { en: "Universal reach — every mobile phone, no app or internet required. The definitive fallback channel.", bn: "সার্বজনীন নাগাল — প্রতিটি মোবাইল ফোনে, কোনো অ্যাপ বা ইন্টারনেট ছাড়াই। চূড়ান্ত ফলব্যাক চ্যানেল।" }, tag: { en: "99.9% reach", bn: "৯৯.৯% নাগাল" } },
        { title: { en: "WhatsApp", bn: "হোয়াটসঅ্যাপ" }, text: { en: "98% open rate. Rich message with branded sender. Preferred channel for markets with high WhatsApp adoption.", bn: "৯৮% ওপেন রেট। ব্র্যান্ডেড সেন্ডারসহ সমৃদ্ধ মেসেজ। উচ্চ হোয়াটসঅ্যাপ ব্যবহারের বাজারে পছন্দের চ্যানেল।" }, tag: { en: "98% open rate", bn: "৯৮% ওপেন রেট" } },
        { title: { en: "Telegram", bn: "টেলিগ্রাম" }, text: { en: "Privacy-first delivery preferred in Eastern Europe and the Middle East. Fast, silent, and bot-delivered.", bn: "পূর্ব ইউরোপ ও মধ্যপ্রাচ্যে পছন্দের গোপনীয়তা-কেন্দ্রিক ডেলিভারি। দ্রুত, নীরব ও বট-চালিত।" }, tag: { en: "Privacy-first", bn: "গোপনীয়তা-কেন্দ্রিক" } },
        { title: { en: "Voice Code", bn: "ভয়েস কোড" }, text: { en: "An automated call reads the OTP aloud. Works without internet and for users who struggle with SMS — the ultimate accessibility fallback.", bn: "একটি স্বয়ংক্রিয় কল জোরে OTP পড়ে শোনায়। ইন্টারনেট ছাড়াই এবং এসএমএসে সমস্যা হওয়া ব্যবহারকারীদের জন্য কাজ করে — চূড়ান্ত অ্যাক্সেসিবিলিটি ফলব্যাক।" }, tag: { en: "Max accessibility", bn: "সর্বোচ্চ অ্যাক্সেসিবিলিটি" } },
      ],
    },
    {
      kind: "steps",
      title: { en: "How Ritorica Verify OTP Works", bn: "Ritorica Verify OTP কীভাবে কাজ করে" },
      intro: {
        en: "From your server to your user's screen — in three steps and under 3 seconds.",
        bn: "আপনার সার্ভার থেকে ব্যবহারকারীর স্ক্রিন পর্যন্ত — তিনটি ধাপে, ৩ সেকেন্ডেরও কম সময়ে।",
      },
      items: [
        { title: { en: "Your App Triggers the API", bn: "আপনার অ্যাপ API চালু করে" }, text: { en: "Send a single POST request to Ritorica's API with the recipient's phone number and your preferred channel order. Ritorica generates or accepts your OTP code and handles the rest. (~10ms API response)", bn: "প্রাপকের ফোন নম্বর ও পছন্দের চ্যানেল ক্রমসহ Ritorica-র API-তে একটি POST রিকোয়েস্ট পাঠান। Ritorica আপনার OTP কোড তৈরি করে বা গ্রহণ করে বাকিটা সামলায়। (~১০ মিলিসেকেন্ড API সাড়া)" } },
        { title: { en: "Ritorica Routes to the Best Channel", bn: "Ritorica সেরা চ্যানেলে রাউট করে" }, text: { en: "The OTP is dispatched to Channel 1 (e.g., WhatsApp). If not delivered within your configured timeout, it automatically falls back to Channel 2, then Channel 3 — until confirmed delivered. (Fallback in <30s per channel)", bn: "OTP প্রথম চ্যানেলে (যেমন হোয়াটসঅ্যাপ) পাঠানো হয়। কনফিগার করা টাইমআউটের মধ্যে ডেলিভার না হলে, এটি স্বয়ংক্রিয়ভাবে দ্বিতীয়, তারপর তৃতীয় চ্যানেলে যায় — নিশ্চিত ডেলিভারি না হওয়া পর্যন্ত। (প্রতি চ্যানেলে <৩০ সেকেন্ডে ফলব্যাক)" } },
        { title: { en: "Delivery Confirmed — You're Notified", bn: "ডেলিভারি নিশ্চিত — আপনাকে জানানো হয়" }, text: { en: "Ritorica fires a webhook to your endpoint with the delivery status, channel used, and timestamp. Your app verifies the code the user enters and grants access. (Webhook in <1s of delivery)", bn: "Ritorica আপনার এন্ডপয়েন্টে ডেলিভারি স্ট্যাটাস, ব্যবহৃত চ্যানেল ও টাইমস্ট্যাম্পসহ একটি ওয়েবহুক পাঠায়। আপনার অ্যাপ ব্যবহারকারীর দেওয়া কোড যাচাই করে অ্যাক্সেস দেয়। (ডেলিভারির <১ সেকেন্ডের মধ্যে ওয়েবহুক)" } },
      ],
    },
    {
      kind: "features",
      title: { en: "Built for Production-Grade Security", bn: "প্রোডাকশন-মানের নিরাপত্তার জন্য তৈরি" },
      intro: {
        en: "Every feature in Ritorica Verify OTP is designed around one requirement: the OTP reaches the right person, on the first attempt, without compromise.",
        bn: "Ritorica Verify OTP-র প্রতিটি ফিচার একটি লক্ষ্যকে কেন্দ্র করে তৈরি: OTP সঠিক ব্যক্তির কাছে, প্রথম চেষ্টায়, কোনো আপস ছাড়াই পৌঁছায়।",
      },
      items: [
        { title: { en: "Configurable Expiry", bn: "কনফিগারযোগ্য মেয়াদ" }, text: { en: "Set OTP validity windows from 30 seconds to 30 minutes. Short windows reduce attack surface; longer windows improve user experience for your use case.", bn: "৩০ সেকেন্ড থেকে ৩০ মিনিট পর্যন্ত OTP-র মেয়াদ নির্ধারণ করুন। সংক্ষিপ্ত মেয়াদ আক্রমণের সুযোগ কমায়; দীর্ঘ মেয়াদ আপনার ব্যবহারের ক্ষেত্রে অভিজ্ঞতা উন্নত করে।" } },
        { title: { en: "Smart Cascade Routing", bn: "স্মার্ট ক্যাসকেড রাউটিং" }, text: { en: "Define your channel priority per user segment, country, or time of day. Ritorica executes the cascade automatically — no code changes required when you update the rules.", bn: "ব্যবহারকারী শ্রেণি, দেশ বা দিনের সময় অনুযায়ী চ্যানেলের অগ্রাধিকার নির্ধারণ করুন। Ritorica স্বয়ংক্রিয়ভাবে ক্যাসকেড চালায় — নিয়ম পরিবর্তন করলেও কোনো কোড পরিবর্তন লাগে না।" } },
        { title: { en: "Delivery Webhooks", bn: "ডেলিভারি ওয়েবহুক" }, text: { en: "Real-time push notifications to your server on every status change — sent, delivered, failed, expired. Build accurate retry and fallback logic on your side.", bn: "প্রতিটি স্ট্যাটাস পরিবর্তনে — পাঠানো, ডেলিভার, ব্যর্থ, মেয়াদোত্তীর্ণ — আপনার সার্ভারে রিয়েল-টাইম পুশ নোটিফিকেশন। আপনার দিক থেকে নির্ভুল রিট্রাই ও ফলব্যাক লজিক তৈরি করুন।" } },
        { title: { en: "Rate Limiting & Anti-Abuse", bn: "রেট লিমিটিং ও অপব্যবহার-প্রতিরোধ" }, text: { en: "Built-in per-number rate limits prevent OTP bombing. Configure max attempts per hour, per day, and per session — with automatic blocking of suspicious patterns.", bn: "অন্তর্নির্মিত প্রতি-নম্বর রেট লিমিট OTP বোমিং প্রতিরোধ করে। ঘণ্টা, দিন ও সেশন প্রতি সর্বোচ্চ চেষ্টা নির্ধারণ করুন — সন্দেহজনক প্যাটার্ন স্বয়ংক্রিয়ভাবে ব্লক করে।" } },
        { title: { en: "Analytics Dashboard", bn: "অ্যানালিটিক্স ড্যাশবোর্ড" }, text: { en: "Track delivery rates, channel performance, average delivery time, and conversion rates per OTP flow. Identify which channels perform best for your user base.", bn: "প্রতিটি OTP ফ্লোর ডেলিভারি রেট, চ্যানেল পারফরম্যান্স, গড় ডেলিভারি সময় ও কনভার্সন রেট ট্র্যাক করুন। আপনার ব্যবহারকারীদের জন্য কোন চ্যানেল সবচেয়ে ভালো কাজ করে তা জানুন।" } },
        { title: { en: "207 Country Coverage", bn: "২০৭টি দেশে কভারেজ" }, text: { en: "Direct operator agreements and tier-1 routing ensure OTPs reach users in emerging markets, high-SMS-cost regions, and restricted territories where generic providers fail.", bn: "সরাসরি অপারেটর চুক্তি ও টিয়ার-১ রাউটিং উদীয়মান বাজার, উচ্চ-এসএমএস-খরচের অঞ্চল ও সীমাবদ্ধ এলাকায় OTP পৌঁছে দেয়, যেখানে সাধারণ প্রোভাইডাররা ব্যর্থ হয়।" } },
      ],
    },
    {
      kind: "features",
      style: "tiles",
      title: { en: "Who Uses Ritorica Verify OTP", bn: "Ritorica Verify OTP কারা ব্যবহার করে" },
      intro: {
        en: "Any product with a login, transaction, or account action relies on OTP. Here's how industries use it.",
        bn: "লগইন, লেনদেন বা অ্যাকাউন্ট কার্যক্রম থাকা যেকোনো পণ্যই OTP-র উপর নির্ভর করে। বিভিন্ন খাত কীভাবে এটি ব্যবহার করে তা দেখুন।",
      },
      items: [
        {
          title: { en: "Banking & Fintech", bn: "ব্যাংকিং ও ফিনটেক" },
          points: {
            en: ["Login and session authentication", "High-value transaction confirmation", "New device registration", "Password reset and account recovery", "Regulatory 2FA compliance (PSD2, GDPR)"],
            bn: ["লগইন ও সেশন প্রমাণীকরণ", "উচ্চমূল্যের লেনদেন নিশ্চিতকরণ", "নতুন ডিভাইস নিবন্ধন", "পাসওয়ার্ড রিসেট ও অ্যাকাউন্ট পুনরুদ্ধার", "নিয়ন্ত্রক 2FA কমপ্লায়েন্স (PSD2, GDPR)"],
          },
        },
        {
          title: { en: "E-Commerce & Retail", bn: "ই-কমার্স ও রিটেইল" },
          points: {
            en: ["Phone number verification at signup", "Checkout confirmation for high-value orders", "Guest login via phone number", "Delivery one-time access codes", "Loyalty account verification"],
            bn: ["সাইনআপে ফোন নম্বর যাচাই", "উচ্চমূল্যের অর্ডারে চেকআউট নিশ্চিতকরণ", "ফোন নম্বর দিয়ে গেস্ট লগইন", "ডেলিভারির ওয়ান-টাইম অ্যাক্সেস কোড", "লয়্যালটি অ্যাকাউন্ট যাচাই"],
          },
        },
        {
          title: { en: "Healthcare", bn: "স্বাস্থ্যসেবা" },
          points: {
            en: ["Patient portal login", "Prescription and test result access", "Teleconsultation room entry", "Consent confirmation for procedures", "HIPAA-compliant identity verification"],
            bn: ["রোগী পোর্টালে লগইন", "প্রেসক্রিপশন ও পরীক্ষার ফলাফল অ্যাক্সেস", "টেলিকনসালটেশন রুমে প্রবেশ", "প্রক্রিয়ার জন্য সম্মতি নিশ্চিতকরণ", "HIPAA-সম্মত পরিচয় যাচাই"],
          },
        },
        {
          title: { en: "Telecom & SaaS", bn: "টেলিকম ও SaaS" },
          points: {
            en: ["SIM swap and number porting verification", "API access credential changes", "Admin panel login protection", "User onboarding phone verification", "Subscription plan changes"],
            bn: ["সিম সোয়াপ ও নম্বর পোর্টিং যাচাই", "API অ্যাক্সেস ক্রেডেনশিয়াল পরিবর্তন", "অ্যাডমিন প্যানেল লগইন সুরক্ষা", "ব্যবহারকারী অনবোর্ডিংয়ে ফোন যাচাই", "সাবস্ক্রিপশন প্ল্যান পরিবর্তন"],
          },
        },
      ],
    },
  ],
  cta: {
    title: { en: "Start Delivering OTPs Now", bn: "এখনই OTP পাঠানো শুরু করুন" },
    text: { en: "Connect via REST API, set your channel order, and send your first verified OTP — all in one session. Your account manager handles the rest.", bn: "REST API দিয়ে যুক্ত হোন, চ্যানেলের ক্রম নির্ধারণ করুন, এবং এক সেশনেই আপনার প্রথম যাচাইকৃত OTP পাঠান। বাকিটা সামলাবেন আপনার অ্যাকাউন্ট ম্যানেজার।" },
  },
};
