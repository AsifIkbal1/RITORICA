import type { RichPage } from "./types";

/** Source: ritorica.com/products/push-platform (supplied by the client). */
export const page: RichPage = {
  group: "products",
  slug: "push-platform",
  name: { en: "Push Platform", bn: "পুশ প্ল্যাটফর্ম" },
  title: { en: "Effective Mobile Push Notifications for Your Business", bn: "আপনার ব্যবসার জন্য কার্যকর মোবাইল পুশ নোটিফিকেশন" },
  intro: {
    en: "Boost conversion rates and improve user retention with mass and trigger-based push campaigns delivered through your mobile app.",
    bn: "আপনার মোবাইল অ্যাপের মাধ্যমে পাঠানো গণ ও ট্রিগার-ভিত্তিক পুশ ক্যাম্পেইনে কনভার্সন রেট বাড়ান এবং ব্যবহারকারী ধরে রাখুন।",
  },
  description: "Ritorica Push Platform: mass and trigger-based app push notifications with cascading routing, analytics and easy API integration.",
  sections: [
    {
      kind: "features",
      title: { en: "Key Features", bn: "মূল বৈশিষ্ট্য" },
      items: [
        {
          title: { en: "Cascading Messaging", bn: "ক্যাসকেডিং মেসেজিং" },
          text: { en: "Combine push notifications with other channels like SMS and Email to create multi-channel strategies that maximize reach and engagement.", bn: "সর্বোচ্চ নাগাল ও সম্পৃক্ততার জন্য পুশ নোটিফিকেশনের সাথে এসএমএস ও ইমেইলের মতো অন্যান্য চ্যানেল মিলিয়ে মাল্টি-চ্যানেল কৌশল তৈরি করুন।" },
        },
        {
          title: { en: "High Throughput Capacity", bn: "উচ্চ থ্রুপুট ক্ষমতা" },
          text: { en: "Optimize performance with server redundancy to ensure uninterrupted delivery and avoid system outages.", bn: "সার্ভার রিডানডেন্সিতে পারফরম্যান্স অপ্টিমাইজ করুন—নিরবচ্ছিন্ন ডেলিভারি নিশ্চিত করুন এবং সিস্টেম বিভ্রাট এড়ান।" },
        },
        {
          title: { en: "Process Automation", bn: "প্রক্রিয়া অটোমেশন" },
          text: { en: "Set up automated push campaigns based on user behavior: registration, purchases, abandoned carts, and more.", bn: "ব্যবহারকারীর আচরণ অনুযায়ী স্বয়ংক্রিয় পুশ ক্যাম্পেইন সেট করুন: নিবন্ধন, ক্রয়, পরিত্যক্ত কার্ট এবং আরও অনেক কিছু।" },
        },
        {
          title: { en: "Simple Integration", bn: "সহজ ইন্টিগ্রেশন" },
          text: { en: "Our platform integrates seamlessly with your mobile app via API, making push setup fast and effortless.", bn: "আমাদের প্ল্যাটফর্ম API-এর মাধ্যমে আপনার মোবাইল অ্যাপের সাথে সহজেই যুক্ত হয়, পুশ সেটআপ হয় দ্রুত ও ঝামেলাহীন।" },
        },
        {
          title: { en: "Detailed Analytics", bn: "বিস্তারিত অ্যানালিটিক্স" },
          text: { en: "Get comprehensive reports on campaign effectiveness: delivery rates, open rates, and user interactions.", bn: "ক্যাম্পেইনের কার্যকারিতা নিয়ে বিস্তারিত রিপোর্ট পান: ডেলিভারি রেট, ওপেন রেট ও ব্যবহারকারীর মিথস্ক্রিয়া।" },
        },
        {
          title: { en: "Security & Compliance", bn: "নিরাপত্তা ও কমপ্লায়েন্স" },
          text: { en: "Compliant with data protection regulations across international markets.", bn: "আন্তর্জাতিক বাজারের ডেটা সুরক্ষা বিধি মেনে চলে।" },
        },
      ],
    },
    {
      kind: "list",
      title: { en: "Save on Communication Costs with Cascading Campaigns", bn: "ক্যাসকেডিং ক্যাম্পেইনে যোগাযোগ খরচ বাঁচান" },
      intro: {
        en: "Sequential message delivery starts from the cheapest channel and moves to more expensive ones only if the recipient doesn't respond — saving costs while ensuring message delivery.",
        bn: "ধারাবাহিক মেসেজ ডেলিভারি সবচেয়ে সস্তা চ্যানেল থেকে শুরু হয় এবং প্রাপক সাড়া না দিলে তবেই ব্যয়বহুল চ্যানেলে যায় — এতে খরচ বাঁচে এবং মেসেজ ডেলিভারিও নিশ্চিত হয়।",
      },
      items: {
        en: [
          "Automatic phone number validation",
          "Personalized messages using user variables",
          "Adaptive messaging based on channel capabilities and cascade settings",
          "Mailing route example: Push → Viber → SMS, if undelivered it's sent via another service",
        ],
        bn: [
          "স্বয়ংক্রিয় ফোন নম্বর যাচাই",
          "ব্যবহারকারীর ভ্যারিয়েবল দিয়ে ব্যক্তিগতকৃত মেসেজ",
          "চ্যানেলের ক্ষমতা ও ক্যাসকেড সেটিংস অনুযায়ী অভিযোজিত মেসেজিং",
          "মেইলিং রুটের উদাহরণ: পুশ → ভাইবার → এসএমএস, ডেলিভার না হলে অন্য সেবার মাধ্যমে পাঠানো হয়",
        ],
      },
    },
    {
      kind: "features",
      title: { en: "App Push Capabilities", bn: "অ্যাপ পুশের সক্ষমতা" },
      items: [
        {
          title: { en: "Inform Your Customers with Push Campaigns", bn: "পুশ ক্যাম্পেইনে গ্রাহকদের জানান" },
          text: { en: "Use push notifications to deliver one-time passwords, payment reminders, order confirmations, purchase confirmations, and receipts.", bn: "ওয়ান-টাইম পাসওয়ার্ড, পেমেন্ট রিমাইন্ডার, অর্ডার নিশ্চিতকরণ, ক্রয় নিশ্চিতকরণ ও রশিদ পাঠাতে পুশ নোটিফিকেশন ব্যবহার করুন।" },
        },
        {
          title: { en: "Powerful Tool for Increasing Sales", bn: "বিক্রি বাড়ানোর শক্তিশালী হাতিয়ার" },
          text: { en: "Notify users about current promotions, personalized discounts, and bonuses — encouraging immediate action and boosting conversion rates, especially when SMS is less effective.", bn: "চলমান প্রমোশন, ব্যক্তিগতকৃত ছাড় ও বোনাস সম্পর্কে ব্যবহারকারীদের জানান — এতে তাৎক্ষণিক পদক্ষেপ উৎসাহিত হয় এবং কনভার্সন রেট বাড়ে, বিশেষ করে যখন এসএমএস কম কার্যকর।" },
        },
        {
          title: { en: "Improve User Retention", bn: "ব্যবহারকারী ধরে রাখুন" },
          text: { en: "Regular and relevant notifications keep users engaged with your app and reduce churn. Push alerts can re-engage inactive users and bring them back into your ecosystem.", bn: "নিয়মিত ও প্রাসঙ্গিক নোটিফিকেশন ব্যবহারকারীদের অ্যাপের সাথে সম্পৃক্ত রাখে এবং চার্ন কমায়। পুশ অ্যালার্ট নিষ্ক্রিয় ব্যবহারকারীদের আবার সক্রিয় করে ফিরিয়ে আনতে পারে।" },
        },
      ],
    },
    {
      kind: "features",
      title: { en: "Benefits", bn: "সুবিধাসমূহ" },
      items: [
        {
          title: { en: "Advanced Segmentation", bn: "অ্যাডভান্সড সেগমেন্টেশন" },
          text: { en: "Create targeted segments based on user preferences, activity level, average check size, demographics, location, and other attributes.", bn: "ব্যবহারকারীর পছন্দ, সক্রিয়তার মাত্রা, গড় কেনাকাটার আকার, জনতাত্ত্বিক তথ্য, অবস্থান ও অন্যান্য বৈশিষ্ট্যের ভিত্তিতে টার্গেটেড সেগমেন্ট তৈরি করুন।" },
        },
        {
          title: { en: "Cost Efficiency", bn: "খরচ সাশ্রয়" },
          text: { en: "Unlike SMS or email, push notifications don't incur per-message fees making them a highly cost-effective tool for ongoing customer engagement.", bn: "এসএমএস বা ইমেইলের মতো নয়, পুশ নোটিফিকেশনে প্রতি-মেসেজ ফি লাগে না—চলমান গ্রাহক সম্পৃক্ততার জন্য এটি একটি অত্যন্ত ব্যয়সাশ্রয়ী হাতিয়ার।" },
        },
        {
          title: { en: "Enhanced Analytics", bn: "উন্নত অ্যানালিটিক্স" },
          text: { en: "Detailed reports on campaign performance: delivery stats, opens, clicks, and user interactions.", bn: "ক্যাম্পেইনের ফলাফল নিয়ে বিস্তারিত রিপোর্ট: ডেলিভারি পরিসংখ্যান, ওপেন, ক্লিক ও ব্যবহারকারীর মিথস্ক্রিয়া।" },
        },
      ],
    },
    {
      kind: "steps",
      title: { en: "Onboarding Process", bn: "অনবোর্ডিং প্রক্রিয়া" },
      items: [
        { title: { en: "Registration", bn: "নিবন্ধন" }, text: { en: "Create your account and set up your profile.", bn: "আপনার অ্যাকাউন্ট তৈরি করুন এবং প্রোফাইল সেট করুন।" } },
        { title: { en: "Integration", bn: "ইন্টিগ্রেশন" }, text: { en: "Integrate our platform into your app via HTTP API.", bn: "HTTP API-এর মাধ্যমে আমাদের প্ল্যাটফর্ম আপনার অ্যাপে যুক্ত করুন।" } },
        { title: { en: "Configuration", bn: "কনফিগারেশন" }, text: { en: "Customize push templates, add buttons, links, UTM tags, and target specific user segments.", bn: "পুশ টেমপ্লেট কাস্টমাইজ করুন, বাটন, লিংক, UTM ট্যাগ যোগ করুন এবং নির্দিষ্ট ব্যবহারকারী সেগমেন্ট টার্গেট করুন।" } },
        { title: { en: "Testing & Results", bn: "টেস্টিং ও ফলাফল" }, text: { en: "Analyze campaign results with detailed reports and optimize your strategy.", bn: "বিস্তারিত রিপোর্টে ক্যাম্পেইনের ফলাফল বিশ্লেষণ করুন এবং কৌশল উন্নত করুন।" } },
      ],
    },
  ],
  cta: {
    title: { en: "Get Started Today!", bn: "আজই শুরু করুন!" },
    text: { en: "Start using push notifications to grow your business today. Click the button below to begin and request a personalized proposal.", bn: "আজই পুশ নোটিফিকেশন দিয়ে ব্যবসা বাড়ানো শুরু করুন। নিচের বোতামে ক্লিক করে একটি ব্যক্তিগতকৃত প্রস্তাব চেয়ে নিন।" },
  },
};
