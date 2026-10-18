import type { RichPage } from "./types";

/** Source: ritorica.com/solutions/industry-solutions (supplied by the client). */
export const page: RichPage = {
  group: "solutions",
  slug: "industry-solutions",
  name: { en: "Industry Solutions", bn: "ইন্ডাস্ট্রি সলিউশন" },
  eyebrow: { en: "Industry Solutions", bn: "ইন্ডাস্ট্রি সলিউশন" },
  title: { en: "Built for Your Industry.", bn: "আপনার ইন্ডাস্ট্রির জন্য তৈরি।" },
  intro: {
    en: "Every sector has its own compliance requirements, customer expectations, and communication rhythms. Ritorica adapts to all of them — from regulated banking flows to real-time logistics alerts.",
    bn: "প্রতিটি খাতের নিজস্ব কমপ্লায়েন্স প্রয়োজনীয়তা, গ্রাহকের প্রত্যাশা এবং যোগাযোগের ছন্দ আছে। Ritorica এগুলোর সবকিছুর সাথে মানিয়ে নেয় — নিয়ন্ত্রিত ব্যাংকিং প্রবাহ থেকে শুরু করে রিয়েল-টাইম লজিস্টিক অ্যালার্ট পর্যন্ত।",
  },
  description: "Ritorica industry solutions for banking, healthcare, retail, logistics, telecom, travel and education.",
  trust: false,
  sections: [
    {
      kind: "stats",
      title: { en: "Industry Solutions", bn: "ইন্ডাস্ট্রি সলিউশন" },
      items: [
        { value: { en: "7+", bn: "৭+" }, label: { en: "Industries served", bn: "সেবাপ্রাপ্ত ইন্ডাস্ট্রি" } },
        { value: { en: "150+", bn: "১৫০+" }, label: { en: "Countries covered", bn: "কাভার করা দেশ" } },
        { value: { en: "99.5%", bn: "৯৯.৫%" }, label: { en: "Platform uptime SLA", bn: "প্ল্যাটফর্ম আপটাইম SLA" } },
        { value: { en: "8+", bn: "৮+" }, label: { en: "Channels in one platform", bn: "এক প্ল্যাটফর্মে চ্যানেল" } },
      ],
    },
    {
      kind: "features",
      title: { en: "Messaging That Fits Your Sector", bn: "আপনার খাতের উপযোগী মেসেজিং" },
      intro: {
        en: "Explore how Ritorica is used across seven major industries — each with its own channel mix, use cases, and proven results.",
        bn: "সাতটি প্রধান ইন্ডাস্ট্রিতে Ritorica কীভাবে ব্যবহৃত হয় তা দেখুন — প্রতিটির নিজস্ব চ্যানেল মিশ্রণ, ব্যবহারের ক্ষেত্র এবং প্রমাণিত ফলাফল রয়েছে।",
      },
      items: [
        {
          title: { en: "Banking & Finance", bn: "ব্যাংকিং ও ফাইন্যান্স" },
          text: {
            en: "Retail banks · FinTech · Insurance · Payments. Financial services demand the highest delivery reliability and the strictest compliance. Ritorica's infrastructure is built for regulated environments — with audit logs, encrypted delivery, and sub-2-second OTP latency.",
            bn: "রিটেইল ব্যাংক · ফিনটেক · ইনস্যুরেন্স · পেমেন্ট। আর্থিক সেবায় সর্বোচ্চ ডেলিভারি নির্ভরযোগ্যতা ও কঠোরতম কমপ্লায়েন্স প্রয়োজন। Ritorica-র অবকাঠামো নিয়ন্ত্রিত পরিবেশের জন্য তৈরি — অডিট লগ, এনক্রিপ্টেড ডেলিভারি এবং ২ সেকেন্ডের কম OTP লেটেন্সিসহ।",
          },
          points: {
            en: [
              "OTP & two-factor authentication for login and transactions",
              "Real-time fraud and transaction alerts via SMS or WhatsApp",
              "Loan approval, card activation, and KYC status notifications",
              "Monthly statement and payment due reminders",
              "Personalised product offers for savings, loans, and insurance",
            ],
            bn: [
              "লগইন ও লেনদেনের জন্য OTP ও টু-ফ্যাক্টর অথেন্টিকেশন",
              "এসএমএস বা হোয়াটসঅ্যাপে রিয়েল-টাইম প্রতারণা ও লেনদেন সতর্কতা",
              "ঋণ অনুমোদন, কার্ড সক্রিয়করণ ও KYC স্ট্যাটাস বিজ্ঞপ্তি",
              "মাসিক স্টেটমেন্ট ও পেমেন্ট বকেয়ার রিমাইন্ডার",
              "সঞ্চয়, ঋণ ও ইনস্যুরেন্সের জন্য ব্যক্তিগতকৃত অফার",
            ],
          },
          tag: { en: "✅ 99.4% OTP delivery rate · ↓ 72% fraud-related support tickets  |  Channels: SMS, WhatsApp, Email, Push", bn: "✅ ৯৯.৪% OTP ডেলিভারি রেট · প্রতারণা সংক্রান্ত সাপোর্ট টিকিট ৭২% কমেছে  |  চ্যানেল: SMS, WhatsApp, Email, Push" },
        },
        {
          title: { en: "Healthcare", bn: "স্বাস্থ্যসেবা" },
          text: {
            en: "Clinics · Hospitals · Pharmacies · Telemedicine. Patient communication in healthcare must be timely, personal, and compliant. Ritorica integrates with booking and EHR systems to automate the full patient journey — from first appointment to follow-up care.",
            bn: "ক্লিনিক · হাসপাতাল · ফার্মেসি · টেলিমেডিসিন। স্বাস্থ্যসেবায় রোগীর সাথে যোগাযোগ সময়মতো, ব্যক্তিগত ও কমপ্লায়েন্ট হতে হয়। Ritorica বুকিং ও EHR সিস্টেমের সাথে যুক্ত হয়ে পুরো রোগী যাত্রা স্বয়ংক্রিয় করে — প্রথম অ্যাপয়েন্টমেন্ট থেকে ফলো-আপ কেয়ার পর্যন্ত।",
          },
          points: {
            en: [
              "Appointment reminders with confirm / cancel / reschedule",
              "Prescription ready and medication refill notifications",
              "Post-visit follow-up and satisfaction surveys",
              "Lab result alerts and telemedicine session links",
              "Health campaign broadcasts — flu season, screening drives",
            ],
            bn: [
              "কনফার্ম/বাতিল/পুনঃনির্ধারণ অপশনসহ অ্যাপয়েন্টমেন্ট রিমাইন্ডার",
              "প্রেসক্রিপশন প্রস্তুত ও ওষুধ রিফিল বিজ্ঞপ্তি",
              "ভিজিটের পরের ফলো-আপ ও সন্তুষ্টি জরিপ",
              "ল্যাব রিপোর্ট সতর্কতা ও টেলিমেডিসিন সেশন লিংক",
              "স্বাস্থ্য প্রচারণা — ফ্লু মৌসুম, স্ক্রিনিং ড্রাইভ",
            ],
          },
          tag: { en: "✅ ↓ 60% no-show rate · $108k/month revenue recovered  |  Channels: SMS, WhatsApp, Email", bn: "✅ নো-শো রেট ৬০% কমেছে · মাসে $১০৮,০০০ রাজস্ব পুনরুদ্ধার  |  চ্যানেল: SMS, WhatsApp, Email" },
        },
        {
          title: { en: "E-Commerce & Retail", bn: "ই-কমার্স ও রিটেইল" },
          text: {
            en: "Online stores · Fashion · Electronics · D2C brands. Retail moves fast — promotions, restocks, cart abandonment, delivery windows. Ritorica puts the right message on the right channel at precisely the right moment, from the first ad click to the fifth repeat purchase.",
            bn: "অনলাইন স্টোর · ফ্যাশন · ইলেকট্রনিক্স · D2C ব্র্যান্ড। রিটেইল দ্রুত চলে — প্রমোশন, রিস্টক, কার্ট ত্যাগ, ডেলিভারি সময়। প্রথম বিজ্ঞাপনে ক্লিক থেকে পঞ্চম বারবার কেনাকাটা পর্যন্ত Ritorica সঠিক সময়ে সঠিক চ্যানেলে সঠিক মেসেজ পাঠায়।",
          },
          points: {
            en: [
              "Abandoned cart recovery via WhatsApp with product image",
              "Flash sale announcements to opted-in Viber subscribers",
              "Order confirmed, dispatched, and delivered notifications",
              "Loyalty points balance and reward redemption alerts",
              "Back-in-stock and personalised product recommendations",
            ],
            bn: [
              "প্রোডাক্ট ছবিসহ হোয়াটসঅ্যাপে কার্ট ত্যাগের পুনরুদ্ধার",
              "অপ্ট-ইন ভাইবার গ্রাহকদের কাছে ফ্ল্যাশ সেল ঘোষণা",
              "অর্ডার নিশ্চিত, প্রেরিত ও ডেলিভারির বিজ্ঞপ্তি",
              "লয়্যালটি পয়েন্ট ব্যালেন্স ও রিওয়ার্ড রিডেম্পশন সতর্কতা",
              "স্টকে ফেরত ও ব্যক্তিগতকৃত প্রোডাক্ট সুপারিশ",
            ],
          },
          tag: { en: "✅ 4.7× ROAS on campaigns · 18% abandoned cart recovery  |  Channels: WhatsApp, Viber, SMS, Push", bn: "✅ ক্যাম্পেইনে ৪.৭× ROAS · ১৮% কার্ট ত্যাগ পুনরুদ্ধার  |  চ্যানেল: WhatsApp, Viber, SMS, Push" },
        },
        {
          title: { en: "Logistics & Delivery", bn: "লজিস্টিক ও ডেলিভারি" },
          text: {
            en: "Couriers · Freight · Last-mile · Warehousing. In logistics, every delivery is a customer interaction. Proactive notifications reduce failed delivery attempts, cut inbound support volume, and drive the CSAT scores that win renewal contracts.",
            bn: "কুরিয়ার · ফ্রেইট · লাস্ট-মাইল · ওয়্যারহাউজিং। লজিস্টিকে প্রতিটি ডেলিভারিই গ্রাহকের সাথে একটি মিথস্ক্রিয়া। আগাম বিজ্ঞপ্তি ব্যর্থ ডেলিভারি কমায়, সাপোর্ট চাহিদা কমায় এবং CSAT স্কোর বাড়ায় যা নবায়ন চুক্তি জেতায়।",
          },
          points: {
            en: [
              "Real-time shipment stage updates via WhatsApp or SMS",
              "Estimated delivery window alerts on the day of delivery",
              "Driver dispatch notifications and collection reminders",
              "Delivery confirmation with one-tap reschedule option",
              "Returns and exchange initiation via WhatsApp chat",
            ],
            bn: [
              "হোয়াটসঅ্যাপ বা এসএমএসে রিয়েল-টাইম শিপমেন্ট স্টেজ আপডেট",
              "ডেলিভারির দিনে প্রাক্কলিত সময়সীমার সতর্কতা",
              "ড্রাইভার ডিসপ্যাচ বিজ্ঞপ্তি ও সংগ্রহ রিমাইন্ডার",
              "এক-ট্যাপ পুনঃনির্ধারণ অপশনসহ ডেলিভারি নিশ্চিতকরণ",
              "হোয়াটসঅ্যাপ চ্যাটের মাধ্যমে রিটার্ন ও এক্সচেঞ্জ শুরু",
            ],
          },
          tag: { en: "✅ ↓ 40% inbound support calls · 94% CSAT score  |  Channels: WhatsApp, SMS, Push", bn: "✅ ইনবাউন্ড সাপোর্ট কল ৪০% কমেছে · ৯৪% CSAT স্কোর  |  চ্যানেল: WhatsApp, SMS, Push" },
        },
        {
          title: { en: "Telecom & Subscriptions", bn: "টেলিকম ও সাবস্ক্রিপশন" },
          text: {
            en: "ISPs · Mobile operators · SaaS · Streaming. Telecom and subscription businesses fight churn every day. Ritorica powers the full subscriber lifecycle — onboarding, upsell, renewal, and re-engagement — across the channels subscribers actually respond to.",
            bn: "ISP · মোবাইল অপারেটর · SaaS · স্ট্রিমিং। টেলিকম ও সাবস্ক্রিপশন ব্যবসা প্রতিদিন churn-এর বিরুদ্ধে লড়ে। Ritorica সম্পূর্ণ সাবস্ক্রাইবার লাইফসাইকেল চালায় — অনবোর্ডিং, আপসেল, নবায়ন ও পুনঃসম্পৃক্তি — গ্রাহকরা যে চ্যানেলে সাড়া দেন সেখানে।",
          },
          points: {
            en: [
              "Data / balance low alerts and top-up prompts",
              "Plan upgrade offers based on usage patterns",
              "Bill ready, payment due, and overdue reminders",
              "Dormant subscriber re-engagement sequences",
              "New service launches and feature announcements",
            ],
            bn: [
              "ডেটা/ব্যালেন্স কম থাকার সতর্কতা ও টপ-আপ প্রম্পট",
              "ব্যবহারের ধরন অনুযায়ী প্ল্যান আপগ্রেড অফার",
              "বিল প্রস্তুত, পেমেন্ট বকেয়া ও মেয়াদোত্তীর্ণের রিমাইন্ডার",
              "নিষ্ক্রিয় সাবস্ক্রাইবারদের পুনঃসম্পৃক্তি ধারাবাহিকতা",
              "নতুন সেবা চালু ও ফিচার ঘোষণা",
            ],
          },
          tag: { en: "✅ 22% reactivation rate · ↓ 14% monthly churn  |  Channels: Push, Viber, SMS, Email", bn: "✅ ২২% রিঅ্যাক্টিভেশন রেট · মাসিক churn ১৪% কমেছে  |  চ্যানেল: Push, Viber, SMS, Email" },
        },
        {
          title: { en: "Travel & Hospitality", bn: "ভ্রমণ ও আতিথেয়তা" },
          text: {
            en: "Airlines · Hotels · OTAs · Car rental · Tourism. Travellers expect instant communication at every step — from booking confirmation to check-out survey. Ritorica's real-time triggers and rich message formats let hospitality brands deliver premium digital experiences at scale.",
            bn: "এয়ারলাইন · হোটেল · OTA · গাড়ি ভাড়া · পর্যটন। ভ্রমণকারীরা প্রতিটি ধাপে তাৎক্ষণিক যোগাযোগ আশা করেন — বুকিং নিশ্চিতকরণ থেকে চেক-আউট জরিপ পর্যন্ত। Ritorica-র রিয়েল-টাইম ট্রিগার ও রিচ মেসেজ ফরম্যাট আতিথেয়তা ব্র্যান্ডগুলোকে বড় পরিসরে প্রিমিয়াম ডিজিটাল অভিজ্ঞতা দিতে সাহায্য করে।",
          },
          points: {
            en: [
              "Booking confirmations and itinerary summaries via WhatsApp",
              "Check-in reminders with digital boarding pass or room key",
              "Flight status updates, gate changes, and delay notifications",
              "Upsell offers — room upgrades, airport transfers, tours",
              "Post-stay satisfaction surveys and loyalty point updates",
            ],
            bn: [
              "হোয়াটসঅ্যাপে বুকিং নিশ্চিতকরণ ও ভ্রমণসূচির সারাংশ",
              "ডিজিটাল বোর্ডিং পাস বা রুম কীসহ চেক-ইন রিমাইন্ডার",
              "ফ্লাইট স্ট্যাটাস আপডেট, গেট পরিবর্তন ও দেরির বিজ্ঞপ্তি",
              "আপসেল অফার — রুম আপগ্রেড, এয়ারপোর্ট ট্রান্সফার, ট্যুর",
              "থাকার পরে সন্তুষ্টি জরিপ ও লয়্যালটি পয়েন্ট আপডেট",
            ],
          },
          tag: { en: "✅ ↑ 27% ancillary upsell revenue · 4.8★ guest messaging satisfaction  |  Channels: WhatsApp, SMS, Email, Push", bn: "✅ অতিরিক্ত আপসেল রাজস্ব ২৭% বেড়েছে · ৪.৮★ অতিথি মেসেজিং সন্তুষ্টি  |  চ্যানেল: WhatsApp, SMS, Email, Push" },
        },
        {
          title: { en: "Education", bn: "শিক্ষা" },
          text: {
            en: "Universities · Schools · EdTech · Training centres. Education institutions communicate with students, parents, and staff across different time zones and preferences. Ritorica handles everything from enrolment drives to exam-day alerts — all from a single platform.",
            bn: "বিশ্ববিদ্যালয় · স্কুল · EdTech · প্রশিক্ষণ কেন্দ্র। শিক্ষাপ্রতিষ্ঠানগুলোকে বিভিন্ন টাইম জোন ও পছন্দের শিক্ষার্থী, অভিভাবক ও কর্মীদের সাথে যোগাযোগ করতে হয়। Ritorica ভর্তি প্রচারণা থেকে পরীক্ষার দিনের সতর্কতা পর্যন্ত সবকিছু একটি প্ল্যাটফর্ম থেকে সামলায়।",
          },
          points: {
            en: [
              "Enrolment deadline and application status notifications",
              "Class schedule changes, cancellations, and exam reminders",
              "Fee payment due alerts with direct payment links",
              "Course completion certificates and achievement badges",
              "Parent updates for attendance, grades, and school events",
            ],
            bn: [
              "ভর্তির শেষ তারিখ ও আবেদন স্ট্যাটাসের বিজ্ঞপ্তি",
              "ক্লাস শিডিউল পরিবর্তন, বাতিল ও পরীক্ষার রিমাইন্ডার",
              "সরাসরি পেমেন্ট লিংকসহ ফি বকেয়ার সতর্কতা",
              "কোর্স সমাপ্তি সার্টিফিকেট ও অর্জনের ব্যাজ",
              "উপস্থিতি, গ্রেড ও স্কুল ইভেন্টের জন্য অভিভাবক আপডেট",
            ],
          },
          tag: { en: "✅ ↑ 34% enrolment conversion · ↓ 55% missed fee payment rate  |  Channels: SMS, WhatsApp, Email, Push", bn: "✅ ভর্তি কনভার্সন ৩৪% বেড়েছে · ফি বকেয়ার হার ৫৫% কমেছে  |  চ্যানেল: SMS, WhatsApp, Email, Push" },
        },
      ],
    },
    {
      kind: "list",
      title: { en: "Built for Regulated and High-Volume Environments", bn: "নিয়ন্ত্রিত ও উচ্চ-ভলিউম পরিবেশের জন্য তৈরি" },
      items: {
        en: [
          "GDPR compliant infrastructure",
          "End-to-end encrypted delivery",
          "99.5% uptime SLA",
          "24/7 technical support",
          "Full delivery analytics",
          "Dedicated account manager",
        ],
        bn: [
          "GDPR-সম্মত অবকাঠামো",
          "এন্ড-টু-এন্ড এনক্রিপ্টেড ডেলিভারি",
          "৯৯.৫% আপটাইম SLA",
          "২৪/৭ কারিগরি সহায়তা",
          "সম্পূর্ণ ডেলিভারি অ্যানালিটিক্স",
          "নিবেদিত অ্যাকাউন্ট ম্যানেজার",
        ],
      },
    },
  ],
  cta: {
    title: { en: "Let's Build Your Industry Solution", bn: "আপনার ইন্ডাস্ট্রি সলিউশন তৈরি করি" },
    text: {
      en: "Tell us your sector and your goal. Our solutions team will design a messaging flow tailored to your compliance requirements, channels, and customers — ready to deploy in days.",
      bn: "আপনার খাত ও লক্ষ্য আমাদের জানান। আমাদের সলিউশন টিম আপনার কমপ্লায়েন্স প্রয়োজনীয়তা, চ্যানেল ও গ্রাহকদের উপযোগী একটি মেসেজিং ফ্লো তৈরি করবে — কয়েক দিনের মধ্যেই চালু করা যাবে।",
    },
  },
};
