import type { RichPage } from "./types";

/** Source: ritorica.com/channels/app-push (supplied by the client). */
export const page: RichPage = {
  group: "channels",
  slug: "app-push",
  name: { en: "App Push", bn: "অ্যাপ পুশ" },
  title: { en: "App Push — iOS & Android Push Notifications", bn: "অ্যাপ পুশ — iOS ও Android পুশ নোটিফিকেশন" },
  intro: {
    en: "App Push Notifications are messages sent directly to a user's mobile device through your iOS or Android application — even when the app is closed. They are the most direct, cost-free channel to re-engage your app's users with timely, relevant content.",
    bn: "অ্যাপ পুশ নোটিফিকেশন হলো এমন মেসেজ যা আপনার iOS বা Android অ্যাপের মাধ্যমে সরাসরি ব্যবহারকারীর মোবাইল ডিভাইসে পাঠানো হয়—এমনকি অ্যাপ বন্ধ থাকলেও। সময়োপযোগী ও প্রাসঙ্গিক কনটেন্টে আপনার অ্যাপের ব্যবহারকারীদের পুনরায় সম্পৃক্ত করার সবচেয়ে সরাসরি, খরচবিহীন চ্যানেল এটি।",
  },
  highlight: { en: "Real-time delivery to iOS and Android  |  Rich notifications with images and buttons  |  Advanced segmentation and targeting", bn: "iOS ও Android-এ রিয়েল-টাইম ডেলিভারি  |  ছবি ও বাটনসহ সমৃদ্ধ নোটিফিকেশন  |  উন্নত সেগমেন্টেশন ও টার্গেটিং" },
  description: "Ritorica App Push: cost-free, real-time iOS and Android push notifications with rich media and advanced segmentation.",
  sections: [
    {
      kind: "list",
      title: { en: "Advantages of Push Notifications", bn: "পুশ নোটিফিকেশনের সুবিধা" },
      items: {
        en: [
          "Instant Delivery — Messages reach users within milliseconds—no SMS cost, no carrier delays.",
          "Zero Per-Message Cost — Unlike SMS, push notifications have no per-message fees—ideal for high-volume engagement.",
          "Rich Notifications — Include images, action buttons, and deep links to deliver highly engaging notifications.",
          "Advanced Segmentation — Target by user behavior, preferences, geography, device type, and custom attributes.",
        ],
        bn: [
          "তাৎক্ষণিক ডেলিভারি — মেসেজ মিলিসেকেন্ডের মধ্যে ব্যবহারকারীর কাছে পৌঁছায়—কোনো এসএমএস খরচ বা অপারেটর বিলম্ব নেই।",
          "কোনো পার-মেসেজ খরচ নেই — এসএমএসের মতো নয়, পুশ নোটিফিকেশনে প্রতি মেসেজে ফি নেই—উচ্চ-ভলিউম সম্পৃক্ততার জন্য আদর্শ।",
          "সমৃদ্ধ নোটিফিকেশন — ছবি, অ্যাকশন বাটন ও ডিপ লিংকসহ আকর্ষণীয় নোটিফিকেশন পাঠান।",
          "উন্নত সেগমেন্টেশন — ব্যবহারকারীর আচরণ, পছন্দ, ভৌগোলিক অবস্থান, ডিভাইসের ধরন ও কাস্টম বৈশিষ্ট্য অনুযায়ী টার্গেট করুন।",
        ],
      },
    },
    {
      kind: "features",
      title: { en: "Additional Services", bn: "অতিরিক্ত সেবা" },
      items: [
        { title: { en: "Transactional Notifications", bn: "ট্রানজ্যাকশনাল নোটিফিকেশন" }, text: { en: "Order status, payment confirmations, delivery tracking — critical updates sent in real time.", bn: "অর্ডারের অবস্থা, পেমেন্ট নিশ্চিতকরণ, ডেলিভারি ট্র্যাকিং—গুরুত্বপূর্ণ আপডেট রিয়েল-টাইমে পাঠানো হয়।" } },
        { title: { en: "Promotional Campaigns", bn: "প্রমোশনাল ক্যাম্পেইন" }, text: { en: "Flash sales, discount offers, new arrivals — drive conversions with timely push campaigns.", bn: "ফ্ল্যাশ সেল, ছাড়ের অফার, নতুন পণ্য—সময়োপযোগী পুশ ক্যাম্পেইনে কনভার্সন বাড়ান।" } },
        { title: { en: "Re-engagement Flows", bn: "পুনঃসম্পৃক্তকরণ ফ্লো" }, text: { en: "Win back inactive users with personalized re-engagement notifications and special offers.", bn: "ব্যক্তিগতকৃত নোটিফিকেশন ও বিশেষ অফারে নিষ্ক্রিয় ব্যবহারকারীদের ফিরিয়ে আনুন।" } },
        { title: { en: "Behavioural Triggers", bn: "আচরণভিত্তিক ট্রিগার" }, text: { en: "Automatically send notifications based on user actions — cart abandonment, app inactivity, and more.", bn: "ব্যবহারকারীর কর্মকাণ্ড অনুযায়ী—কার্ট পরিত্যাগ, অ্যাপ নিষ্ক্রিয়তা ইত্যাদি—স্বয়ংক্রিয়ভাবে নোটিফিকেশন পাঠান।" } },
        { title: { en: "Scheduled Campaigns", bn: "শিডিউল করা ক্যাম্পেইন" }, text: { en: "Plan and schedule push campaigns in advance for optimal delivery times and time zones.", bn: "সঠিক সময় ও টাইম জোনের জন্য পুশ ক্যাম্পেইন আগে থেকে পরিকল্পনা ও শিডিউল করুন।" } },
        { title: { en: "A/B Testing", bn: "A/B টেস্টিং" }, text: { en: "Test different message variants to find the highest-performing content for your audience.", bn: "আপনার দর্শকদের জন্য সর্বোচ্চ কার্যকর কনটেন্ট খুঁজে পেতে বিভিন্ন মেসেজ সংস্করণ পরীক্ষা করুন।" } },
      ],
    },
    {
      kind: "features",
      style: "tiles",
      title: { en: "Why App Push with Ritorica?", bn: "কেন Ritorica-তে অ্যাপ পুশ?" },
      intro: { en: "Enterprise infrastructure for mobile notifications at any scale.", bn: "যেকোনো পরিসরের মোবাইল নোটিফিকেশনের জন্য এন্টারপ্রাইজ অবকাঠামো।" },
      items: [
        { title: { en: "99.9% Uptime SLA", bn: "৯৯.৯% আপটাইম SLA" }, text: { en: "Our infrastructure guarantees high availability for mission-critical push delivery.", bn: "অত্যন্ত গুরুত্বপূর্ণ পুশ ডেলিভারির জন্য আমাদের অবকাঠামো উচ্চ উপলব্ধতা নিশ্চিত করে।" } },
        { title: { en: "Secure & Compliant", bn: "নিরাপদ ও কমপ্লায়েন্ট" }, text: { en: "GDPR-compliant platform with full user consent management built in.", bn: "GDPR-সম্মত প্ল্যাটফর্ম, যেখানে ব্যবহারকারীর সম্মতি ব্যবস্থাপনা সম্পূর্ণভাবে যুক্ত।" } },
        { title: { en: "Simple SDK Integration", bn: "সহজ SDK ইন্টিগ্রেশন" }, text: { en: "iOS and Android SDKs that integrate with your app in hours, not weeks.", bn: "iOS ও Android SDK যা সপ্তাহ নয়, ঘণ্টার মধ্যে আপনার অ্যাপে যুক্ত হয়।" } },
        { title: { en: "Real-Time Analytics", bn: "রিয়েল-টাইম অ্যানালিটিক্স" }, text: { en: "Live dashboards for delivery rates, open rates, clicks, and conversion tracking.", bn: "ডেলিভারি রেট, ওপেন রেট, ক্লিক ও কনভার্সন ট্র্যাকিংয়ের জন্য লাইভ ড্যাশবোর্ড।" } },
      ],
    },
    {
      kind: "steps",
      title: { en: "Steps to Activate App Push", bn: "অ্যাপ পুশ চালু করার ধাপ" },
      items: [
        { title: { en: "SDK Integration", bn: "SDK ইন্টিগ্রেশন" }, text: { en: "Add the Ritorica Push SDK to your iOS and Android app. Takes under an hour.", bn: "আপনার iOS ও Android অ্যাপে Ritorica পুশ SDK যুক্ত করুন। এক ঘণ্টারও কম সময় লাগে।" } },
        { title: { en: "FCM / APNs Configuration", bn: "FCM / APNs কনফিগারেশন" }, text: { en: "Connect your Firebase (Android) and Apple Push Notification certificates to our platform.", bn: "আপনার Firebase (Android) ও Apple পুশ নোটিফিকেশন সার্টিফিকেট আমাদের প্ল্যাটফর্মের সাথে যুক্ত করুন।" } },
        { title: { en: "Audience Segmentation", bn: "অডিয়েন্স সেগমেন্টেশন" }, text: { en: "Define user segments based on behavior, attributes, and engagement history.", bn: "আচরণ, বৈশিষ্ট্য ও সম্পৃক্ততার ইতিহাস অনুযায়ী ব্যবহারকারী সেগমেন্ট নির্ধারণ করুন।" } },
        { title: { en: "Campaign Launch", bn: "ক্যাম্পেইন চালু" }, text: { en: "Create, schedule, and send your first push campaign. Monitor results in real time.", bn: "আপনার প্রথম পুশ ক্যাম্পেইন তৈরি, শিডিউল ও পাঠান। ফলাফল রিয়েল-টাইমে পর্যবেক্ষণ করুন।" } },
      ],
    },
    {
      kind: "features",
      style: "tiles",
      title: { en: "Solving Business Challenges", bn: "ব্যবসার চ্যালেঞ্জ সমাধান" },
      items: [
        { title: { en: "User Churn", bn: "ব্যবহারকারী চার্ন" }, text: { en: "Re-engage dormant users with personalized win-back campaigns before they fully disengage.", bn: "সম্পূর্ণ বিচ্ছিন্ন হওয়ার আগে ব্যক্তিগতকৃত উইন-ব্যাক ক্যাম্পেইনে নিষ্ক্রিয় ব্যবহারকারীদের পুনরায় সম্পৃক্ত করুন।" } },
        { title: { en: "Low Conversion Rates", bn: "কম কনভার্সন রেট" }, text: { en: "Nudge users at the right moment with targeted push offers to complete purchases.", bn: "কেনাকাটা সম্পূর্ণ করতে সঠিক সময়ে টার্গেটেড পুশ অফারে ব্যবহারকারীদের উৎসাহিত করুন।" } },
        { title: { en: "Time-Sensitive Updates", bn: "সময়সংবেদনশীল আপডেট" }, text: { en: "Deliver critical alerts instantly — flight updates, security notifications, breaking news.", bn: "তাৎক্ষণিক গুরুত্বপূর্ণ সতর্কতা পাঠান—ফ্লাইট আপডেট, নিরাপত্তা নোটিফিকেশন, ব্রেকিং নিউজ।" } },
      ],
    },
    {
      kind: "list",
      title: { en: "Explore Other Communication Channels", bn: "অন্যান্য যোগাযোগ চ্যানেল দেখুন" },
      intro: { en: "Build a Full Omnichannel Strategy! Combine App Push with:", bn: "একটি পূর্ণ অমনিচ্যানেল কৌশল তৈরি করুন! অ্যাপ পুশের সাথে যুক্ত করুন:" },
      items: {
        en: ["SMS Channel", "Viber Business", "WhatsApp Business", "Telegram Gateway"],
        bn: ["এসএমএস চ্যানেল", "ভাইবার বিজনেস", "হোয়াটসঅ্যাপ বিজনেস", "টেলিগ্রাম গেটওয়ে"],
      },
    },
  ],
  cta: {
    title: { en: "Get Started Today!", bn: "আজই শুরু করুন!" },
    text: { en: "Start using App Push Notifications to grow your business today. Click below to request a personalized proposal.", bn: "আজই অ্যাপ পুশ নোটিফিকেশন দিয়ে ব্যবসা বাড়ানো শুরু করুন। নিচে ক্লিক করে একটি ব্যক্তিগতকৃত প্রস্তাব চেয়ে নিন।" },
  },
};
