import type { RichPage } from "./types";

/** Source: ritorica.com/resources/case-studies (supplied by the client). */
export const page: RichPage = {
  group: "resources",
  slug: "case-studies",
  name: { en: "Case Studies", bn: "কেস স্টাডি" },
  eyebrow: { en: "Client Case Studies", bn: "ক্লায়েন্ট কেস স্টাডি" },
  title: { en: "Real Clients. Measurable Results.", bn: "বাস্তব ক্লায়েন্ট। পরিমাপযোগ্য ফলাফল।" },
  intro: {
    en: "From fintech startups to enterprise telecom — see how businesses across every industry use Ritorica to cut costs, increase revenue, and keep customers coming back.",
    bn: "ফিনটেক স্টার্টআপ থেকে এন্টারপ্রাইজ টেলিকম পর্যন্ত — দেখুন কীভাবে সব শিল্পের ব্যবসাগুলো Ritorica ব্যবহার করে খরচ কমায়, রাজস্ব বাড়ায় ও গ্রাহককে ধরে রাখে।",
  },
  description: "Ritorica client case studies: how FinTech, E-Commerce, Healthcare, Logistics and Telecom businesses cut costs and grew revenue with Ritorica.",
  trust: false,
  sections: [
    {
      kind: "stats",
      title: { en: "Stories Behind the Numbers", bn: "সংখ্যার পেছনের গল্প" },
      intro: {
        en: "Five clients. Five challenges. Five transformations powered by Ritorica.",
        bn: "পাঁচ ক্লায়েন্ট। পাঁচটি চ্যালেঞ্জ। Ritorica দ্বারা চালিত পাঁচটি রূপান্তর।",
      },
      items: [
        { value: { en: "5+", bn: "৫+" }, label: { en: "Industries covered", bn: "কভার করা শিল্প" } },
        { value: { en: "↓40%", bn: "↓৪০%" }, label: { en: "Avg. support cost reduction", bn: "গড় সাপোর্ট খরচ হ্রাস" } },
        { value: { en: "4.7×", bn: "৪.৭×" }, label: { en: "Average ROAS on campaigns", bn: "ক্যাম্পেইনে গড় ROAS" } },
        { value: { en: "22%", bn: "২২%" }, label: { en: "Avg. re-engagement rate", bn: "গড় রি-এনগেজমেন্ট রেট" } },
      ],
    },
    {
      kind: "articles",
      title: { en: "Case Studies", bn: "কেস স্টাডি" },
      items: [
        {
          tag: { en: "FinTech", bn: "ফিনটেক" },
          title: { en: "NovaPay — Digital payment platform", bn: "NovaPay — ডিজিটাল পেমেন্ট প্ল্যাটফর্ম" },
          text: {
            en: "NovaPay (Eastern Europe, 1.2M users) was losing 12% of signups to failed email OTPs, while fraudulent login attempts flooded support with account-recovery tickets. Ritorica replaced the email OTP flow with a dual-channel system: SMS as the primary delivery method, with automatic fallback to WhatsApp if undelivered within 30 seconds, plus instant WhatsApp alerts for every login and payment event. Results: OTP delivery rate jumped from 88% to 99.4%, completed registrations rose 18% in the first month, fraud-related support tickets dropped 72%, and average OTP delivery time fell from 4.2 seconds to under 1.8 seconds. \"We were losing 1 in 8 new customers at the very last step of signup because of a failed email OTP. Within two weeks of switching to Ritorica, that number dropped to essentially zero. The ROI paid for itself in the first week.\" — Aleksei V., CTO, NovaPay",
            bn: "NovaPay (পূর্ব ইউরোপ, ১২ লক্ষ ব্যবহারকারী) ইমেইল OTP ব্যর্থ হওয়ার কারণে ১২% সাইনআপ হারাচ্ছিল, আর প্রতারণামূলক লগইন চেষ্টা সাপোর্ট টিমকে অ্যাকাউন্ট-রিকভারি টিকেটে ভাসিয়ে দিচ্ছিল। Ritorica ইমেইল OTP ফ্লো বদলে একটি ডুয়াল-চ্যানেল সিস্টেম বসায়: প্রাথমিক ডেলিভারি হিসেবে এসএমএস, ৩০ সেকেন্ডে ডেলিভার না হলে স্বয়ংক্রিয়ভাবে হোয়াটসঅ্যাপে ফলব্যাক, সাথে প্রতিটি লগইন ও পেমেন্ট ইভেন্টে তাৎক্ষণিক হোয়াটসঅ্যাপ অ্যালার্ট। ফলাফল: OTP ডেলিভারি রেট ৮৮% থেকে ৯৯.৪%-এ উঠেছে, প্রথম মাসে সম্পূর্ণ নিবন্ধন ১৮% বেড়েছে, প্রতারণা-সংক্রান্ত সাপোর্ট টিকেট ৭২% কমেছে, এবং গড় OTP ডেলিভারি সময় ৪.২ সেকেন্ড থেকে ১.৮ সেকেন্ডের নিচে নেমেছে। \"ইমেইল OTP ব্যর্থ হওয়ার কারণে সাইনআপের একদম শেষ ধাপে প্রতি ৮ জনে ১ জন নতুন গ্রাহক হারাচ্ছিলাম। Ritorica-তে পরিবর্তনের দুই সপ্তাহের মধ্যে সেই সংখ্যা কার্যত শূন্যে নেমে এসেছে। প্রথম সপ্তাহেই ROI নিজের খরচ তুলে নিয়েছে।\" — Aleksei V., CTO, NovaPay",
          },
          meta: { en: "Channels used: SMS, WhatsApp", bn: "ব্যবহৃত চ্যানেল: এসএমএস, হোয়াটসঅ্যাপ" },
        },
        {
          tag: { en: "E-Commerce", bn: "ই-কমার্স" },
          title: { en: "Moderno — Online fashion retailer", bn: "Moderno — অনলাইন ফ্যাশন রিটেইলার" },
          text: {
            en: "Moderno (Mediterranean region, 500k+ customers) relied almost entirely on email marketing, with open rates down to 9% and 74% cart abandonment. Ahead of Black Friday, Ritorica built a segmented Viber campaign with product images and personalised recommendations to 200k subscribers (SMS fallback for non-Viber users), plus an automated abandoned-cart sequence: a WhatsApp message with the product photo and a one-tap checkout link 1 hour after abandonment, with SMS fallback at 3 hours. Results: the Black Friday campaign generated 4.7× ROAS versus 1.1× on the prior year's email campaign, a 31% click-through rate on the Viber campaign within 2 hours, 18% of abandoned carts recovered via WhatsApp (up from 2% via email), and messaging-channel revenue up 340% year-on-year during the campaign period. \"Viber messages get read. Email gets ignored. It really is that simple. Our Black Friday campaign via Ritorica outperformed our entire previous year's email spend — in a single afternoon.\" — Sofia K., Head of Digital Marketing, Moderno",
            bn: "Moderno (ভূমধ্যসাগরীয় অঞ্চল, ৫ লক্ষ+ গ্রাহক) প্রায় সম্পূর্ণভাবে ইমেইল মার্কেটিংয়ের উপর নির্ভরশীল ছিল, যেখানে ওপেন রেট নেমেছিল ৯%-এ এবং কার্ট ত্যাগের হার ছিল ৭৪%। ব্ল্যাক ফ্রাইডের আগে, Ritorica ২ লক্ষ সাবস্ক্রাইবারের জন্য প্রোডাক্ট ছবি ও ব্যক্তিগতকৃত সুপারিশসহ একটি সেগমেন্টেড ভাইবার ক্যাম্পেইন তৈরি করে (ভাইবার নেই এমন ব্যবহারকারীদের জন্য এসএমএস ফলব্যাক), সাথে একটি স্বয়ংক্রিয় অ্যাবান্ডনড-কার্ট সিকোয়েন্স: কার্ট ত্যাগের ১ ঘণ্টা পর প্রোডাক্ট ছবি ও ওয়ান-ট্যাপ চেকআউট লিংকসহ হোয়াটসঅ্যাপ মেসেজ, ৩ ঘণ্টায় এসএমএস ফলব্যাক। ফলাফল: ব্ল্যাক ফ্রাইডে ক্যাম্পেইনে ৪.৭× ROAS এসেছে, আগের বছরের ইমেইল ক্যাম্পেইনে ছিল ১.১×; ভাইবার ক্যাম্পেইনে প্রথম ২ ঘণ্টায় ৩১% ক্লিক-থ্রু রেট; হোয়াটসঅ্যাপ ফ্লোতে ১৮% অ্যাবান্ডনড কার্ট পুনরুদ্ধার হয়েছে (ইমেইলে ছিল মাত্র ২%); এবং ক্যাম্পেইন চলাকালীন মেসেজিং চ্যানেল থেকে রাজস্ব বছরে ৩৪০% বেড়েছে। \"ভাইবার মেসেজ পড়া হয়। ইমেইল উপেক্ষা করা হয়। ব্যাপারটা আসলেই এত সহজ। Ritorica দিয়ে আমাদের ব্ল্যাক ফ্রাইডে ক্যাম্পেইন এক বিকেলেই আগের সম্পূর্ণ বছরের ইমেইল খরচকে ছাড়িয়ে গেছে।\" — Sofia K., হেড অফ ডিজিটাল মার্কেটিং, Moderno",
          },
          meta: { en: "Channels used: Viber, WhatsApp, SMS, Email", bn: "ব্যবহৃত চ্যানেল: ভাইবার, হোয়াটসঅ্যাপ, এসএমএস, ইমেইল" },
        },
        {
          tag: { en: "Healthcare", bn: "স্বাস্থ্যসেবা" },
          title: { en: "HealthFirst Clinics — Private clinic network", bn: "HealthFirst Clinics — প্রাইভেট ক্লিনিক নেটওয়ার্ক" },
          text: {
            en: "HealthFirst (Middle East, 45 locations) was losing an estimated $180,000 per month to a 22% patient no-show rate, with staff spending hours on manual reminder calls. Ritorica integrated with HealthFirst's booking system via API and deployed an automated reminder sequence: an SMS reminder 24 hours before each appointment, followed by a WhatsApp message 1 hour before with a branded confirmation prompt; patients could reply with a single tap to confirm, cancel, or reschedule, and cancelled slots were added to a waiting list filled within minutes. Results: the no-show rate dropped from 22% to 8.8% (a 60% reduction), $108,000 in monthly revenue was recovered, over 120 staff hours per month were freed from manual reminder calls, and the waiting-list fill rate reached 91%. \"We used to have two full-time receptionists whose main job was calling patients to confirm appointments. Now Ritorica handles all of that automatically. Those two team members have been redeployed to patient-facing roles where they actually add value.\" — Dr. Rania M., Operations Director, HealthFirst Clinics",
            bn: "HealthFirst (মধ্যপ্রাচ্য, ৪৫টি লোকেশন) প্রতি মাসে আনুমানিক $১৮০,০০০ হারাচ্ছিল ২২% রোগী নো-শো রেটের কারণে, আর স্টাফরা ম্যানুয়াল রিমাইন্ডার কলে ঘণ্টার পর ঘণ্টা ব্যয় করছিলেন। Ritorica API-র মাধ্যমে HealthFirst-এর বুকিং সিস্টেমে যুক্ত হয়ে একটি স্বয়ংক্রিয় রিমাইন্ডার সিকোয়েন্স চালু করে: প্রতিটি অ্যাপয়েন্টমেন্টের ২৪ ঘণ্টা আগে এসএমএস রিমাইন্ডার, এরপর ১ ঘণ্টা আগে ব্র্যান্ডেড কনফার্মেশন প্রম্পটসহ হোয়াটসঅ্যাপ মেসেজ; রোগীরা এক ট্যাপেই নিশ্চিত, বাতিল বা পুনঃনির্ধারণ করতে পারতেন, আর বাতিল হওয়া স্লট মিনিটের মধ্যেই ওয়েটিং লিস্ট থেকে পূরণ হত। ফলাফল: নো-শো রেট ২২% থেকে ৮.৮%-এ নেমেছে (৬০% হ্রাস), মাসে $১০৮,০০০ রাজস্ব পুনরুদ্ধার হয়েছে, মাসে ১২০+ স্টাফ-ঘণ্টা ম্যানুয়াল রিমাইন্ডার কল থেকে মুক্ত হয়েছে, এবং ওয়েটিং-লিস্ট ফিল রেট পৌঁছেছে ৯১%-এ। \"আমাদের দুইজন পূর্ণকালীন রিসেপশনিস্ট ছিলেন, যাদের প্রধান কাজ ছিল অ্যাপয়েন্টমেন্ট নিশ্চিত করতে রোগীদের ফোন করা। এখন Ritorica স্বয়ংক্রিয়ভাবে এটি করে। ঐ দুইজন সহকর্মীকে এখন রোগী-মুখী ভূমিকায় বদলি করা হয়েছে, যেখানে তারা প্রকৃত মূল্য যোগ করেন।\" — Dr. Rania M., অপারেশনস ডিরেক্টর, HealthFirst Clinics",
          },
          meta: { en: "Channels used: SMS, WhatsApp", bn: "ব্যবহৃত চ্যানেল: এসএমএস, হোয়াটসঅ্যাপ" },
        },
        {
          tag: { en: "Logistics", bn: "লজিস্টিকস" },
          title: { en: "SwiftRoute — Last-mile delivery company", bn: "SwiftRoute — লাস্ট-মাইল ডেলিভারি কোম্পানি" },
          text: {
            en: "SwiftRoute (3M+ deliveries per month) had an overwhelmed call centre: \"Where is my package?\" accounted for 45% of inbound calls and CSAT had dropped to 72%. Ritorica connected to SwiftRoute's logistics system and built an automated WhatsApp notification sequence at each delivery milestone — order confirmed, collected from warehouse, out for delivery, delivered — each with a live tracking link and estimated delivery window, with SMS fallback for customers without WhatsApp and a push notification layer for app users. Results: inbound \"where is my order?\" calls fell 40%, CSAT rose from 72% to 94% within 90 days, 18 call centre agents were redeployed to fraud and escalation teams, and first-delivery-attempt success improved 11% as customers could reschedule via WhatsApp reply. \"Before Ritorica, 'where is my package?' was our number one support topic — every single day. Now customers know before they even think to ask. Our agents finally have the bandwidth to handle the cases that actually need a human.\" — Marcus T., VP Operations, SwiftRoute",
            bn: "SwiftRoute (মাসে ৩০ লক্ষ+ ডেলিভারি) ভারাক্রান্ত কল সেন্টার নিয়ে সংগ্রাম করছিল: \"আমার প্যাকেজ কোথায়?\" প্রশ্নটি ইনবাউন্ড কলের ৪৫%, আর CSAT নেমে গিয়েছিল ৭২%-এ। Ritorica SwiftRoute-এর লজিস্টিক্স সিস্টেমের সাথে যুক্ত হয়ে প্রতিটি ডেলিভারি মাইলস্টোনে স্বয়ংক্রিয় হোয়াটসঅ্যাপ নোটিফিকেশন সিকোয়েন্স তৈরি করে — অর্ডার নিশ্চিত, গুদাম থেকে সংগ্রহ, ডেলিভারির পথে, ডেলিভার্ড — প্রতিটিতে লাইভ ট্র্যাকিং লিংক ও আনুমানিক সময়সহ, হোয়াটসঅ্যাপ না থাকা গ্রাহকদের জন্য এসএমএস ফলব্যাক এবং অ্যাপ ব্যবহারকারীদের জন্য পুশ নোটিফিকেশন লেয়ার। ফলাফল: \"আমার অর্ডার কোথায়?\" কল ৪০% কমেছে, CSAT ৯০ দিনের মধ্যে ৭২% থেকে ৯৪%-এ উঠেছে, ১৮ জন কল সেন্টার এজেন্টকে প্রতারণা ও এস্কালেশন টিমে বদলি করা হয়েছে, এবং গ্রাহকরা হোয়াটসঅ্যাপ রিপ্লাইয়ে পুনঃনির্ধারণ করতে পারায় প্রথম ডেলিভারি চেষ্টার সফলতা ১১% বেড়েছে। \"Ritorica-র আগে, 'আমার প্যাকেজ কোথায়?' ছিল প্রতিদিনের এক নম্বর সাপোর্ট বিষয়। এখন গ্রাহকরা জিজ্ঞাসা করার আগেই জেনে যান। আমাদের এজেন্টদের এখন সেই কেসগুলো সামলানোর সময় আছে, যেখানে সত্যিই একজন মানুষের প্রয়োজন।\" — Marcus T., ভিপি অপারেশনস, SwiftRoute",
          },
          meta: { en: "Channels used: WhatsApp, Push, SMS", bn: "ব্যবহৃত চ্যানেল: হোয়াটসঅ্যাপ, পুশ, এসএমএস" },
        },
        {
          tag: { en: "Telecom", bn: "টেলিকম" },
          title: { en: "ConnectX — Regional telecom operator", bn: "ConnectX — আঞ্চলিক টেলিকম অপারেটর" },
          text: {
            en: "ConnectX (2.4M subscribers) had 310,000 dormant subscribers (nearly 13% of its base), with email re-engagement campaigns generating under 2% reactivation. Ritorica built a personalised re-engagement sequence using historical usage data: Day 1, a push notification with a service-specific offer based on the subscriber's most-used feature before going dormant; if unopened after 48 hours, Day 3, a richer Viber message with image, headline and a single CTA button; if still no engagement by Day 7, a final SMS with a time-limited offer — all personalised at the individual level. Results: a 22% reactivation rate on the dormant segment (11× higher than the email campaigns it replaced), monthly churn across the full subscriber base dropped 14% within 60 days, $2.1M in previously lost subscription revenue was recovered in the first quarter, and the average offer discount required fell from 35% to 18%. \"Our email re-engagement campaigns were basically background noise — everyone had learned to ignore them. The personalised push and Viber sequence from Ritorica felt completely different to customers. People actually responded. We got 11× the reactivation rate with a smaller discount. That's not a marginal improvement — that's a completely different strategy.\" — Lena B., Head of CRM, ConnectX",
            bn: "ConnectX (২৪ লক্ষ সাবস্ক্রাইবার)-এর ৩,১০,০০০ জন নিষ্ক্রিয় সাবস্ক্রাইবার ছিল (মোট গ্রাহকের প্রায় ১৩%), যেখানে ইমেইল রি-এনগেজমেন্ট ক্যাম্পেইন থেকে পুনরায় সক্রিয়তার হার ছিল ২%-এরও কম। Ritorica পূর্বের ব্যবহারের তথ্য দিয়ে একটি ব্যক্তিগতকৃত রি-এনগেজমেন্ট সিকোয়েন্স তৈরি করে: ১ম দিন, নিষ্ক্রিয় হওয়ার আগে সাবস্ক্রাইবারের সবচেয়ে বেশি ব্যবহৃত ফিচারের উপর ভিত্তি করে একটি নির্দিষ্ট অফারসহ পুশ নোটিফিকেশন; ৪৮ ঘণ্টায় না খুললে, ৩য় দিন, ছবি, শিরোনাম ও একটি CTA বোতামসহ আরও সমৃদ্ধ ভাইবার মেসেজ; ৭ম দিনেও সাড়া না পেলে, একটি সময়সীমিত অফারসহ চূড়ান্ত এসএমএস — সবকিছুই ব্যক্তি পর্যায়ে ব্যক্তিগতকৃত। ফলাফল: নিষ্ক্রিয় সেগমেন্টে ২২% পুনঃসক্রিয়তার হার (প্রতিস্থাপিত ইমেইল ক্যাম্পেইনের চেয়ে ১১× বেশি), ৬০ দিনের মধ্যে সম্পূর্ণ সাবস্ক্রাইবার বেসে মাসিক churn ১৪% কমেছে, প্রথম প্রান্তিকে পূর্বে হারানো $২.১ মিলিয়ন সাবস্ক্রিপশন রাজস্ব পুনরুদ্ধার হয়েছে, এবং প্রয়োজনীয় গড় অফার ছাড় ৩৫% থেকে ১৮%-এ নেমেছে। \"আমাদের ইমেইল রি-এনগেজমেন্ট ক্যাম্পেইনগুলো মূলত পটভূমির শব্দ হয়ে গিয়েছিল — সবাই সেগুলো উপেক্ষা করতে শিখে গিয়েছিল। Ritorica-র ব্যক্তিগতকৃত পুশ ও ভাইবার সিকোয়েন্স গ্রাহকদের কাছে একেবারে আলাদা মনে হয়েছে। মানুষ সত্যিই সাড়া দিয়েছে। আমরা ছোট ছাড়েই ১১× বেশি পুনঃসক্রিয়তার হার পেয়েছি। এটা সামান্য উন্নতি নয় — এটা সম্পূর্ণ ভিন্ন একটি কৌশল।\" — Lena B., হেড অফ CRM, ConnectX",
          },
          meta: { en: "Channels used: Push, Viber, SMS", bn: "ব্যবহৃত চ্যানেল: পুশ, ভাইবার, এসএমএস" },
        },
      ],
    },
  ],
  cta: {
    title: { en: "Your Story Could Be Next", bn: "পরেরবার হতে পারে আপনারই গল্প" },
    text: {
      en: "Whether you're solving authentication, engagement, support, or retention — our team will help you design a messaging strategy that delivers results like these.",
      bn: "অথেনটিকেশন, এনগেজমেন্ট, সাপোর্ট বা রিটেনশন — যেটাই সমাধান করতে চান, আমাদের টিম এমন ফলাফল এনে দেওয়ার মতো একটি মেসেজিং কৌশল সাজাতে সাহায্য করবে।",
    },
  },
};
