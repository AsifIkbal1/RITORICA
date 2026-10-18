import type { RichPage } from "./types";

/** Source: ritorica.com/channels/telegram-gateway (supplied by the client). */
export const page: RichPage = {
  group: "channels",
  slug: "telegram-gateway",
  name: { en: "Telegram Gateway", bn: "টেলিগ্রাম গেটওয়ে" },
  title: { en: "Telegram Gateway by Ritorica", bn: "Ritorica-র টেলিগ্রাম গেটওয়ে" },
  intro: {
    en: "Verify users faster, more securely, and at a fraction of the cost using Telegram global messaging network.",
    bn: "Telegram-এর বৈশ্বিক মেসেজিং নেটওয়ার্ক ব্যবহার করে দ্রুত, নিরাপদ ও কম খরচে ব্যবহারকারী যাচাই করুন।",
  },
  highlight: { en: "Reduce verification costs by up to 80% compared to traditional SMS OTP.", bn: "প্রচলিত এসএমএস OTP-র তুলনায় যাচাইকরণ খরচ ৮০% পর্যন্ত কমান।" },
  description: "Ritorica Telegram Gateway: official Telegram API for sending OTPs and verification codes faster and cheaper than SMS.",
  sections: [
    {
      kind: "text",
      title: { en: "What Is Telegram Gateway?", bn: "টেলিগ্রাম গেটওয়ে কী?" },
      paragraphs: [
        {
          en: "Telegram Gateway is an official Telegram API that lets businesses send one-time passwords (OTPs) and verification codes directly to users via Telegram — without SMS. It delivers faster, cheaper, and more secure authentication for any platform.",
          bn: "টেলিগ্রাম গেটওয়ে হলো টেলিগ্রামের একটি অফিশিয়াল API, যা ব্যবসাকে এসএমএস ছাড়াই সরাসরি টেলিগ্রামের মাধ্যমে ব্যবহারকারীদের কাছে ওয়ান-টাইম পাসওয়ার্ড (OTP) ও যাচাইকরণ কোড পাঠাতে দেয়। এটি যেকোনো প্ল্যাটফর্মের জন্য দ্রুত, সাশ্রয়ী ও বেশি নিরাপদ অথেনটিকেশন নিশ্চিত করে।",
        },
      ],
    },
    {
      kind: "list",
      title: { en: "Why Telegram Gateway", bn: "কেন টেলিগ্রাম গেটওয়ে" },
      items: {
        en: [
          "Send OTPs via Telegram instead of expensive SMS",
          "Instant delivery to any Telegram user worldwide",
          "End-to-end encrypted — messages cannot be intercepted",
          "Official Telegram Business API — fully compliant",
        ],
        bn: [
          "ব্যয়বহুল এসএমএসের বদলে টেলিগ্রামের মাধ্যমে OTP পাঠান",
          "বিশ্বের যেকোনো টেলিগ্রাম ব্যবহারকারীর কাছে তাৎক্ষণিক ডেলিভারি",
          "এন্ড-টু-এন্ড এনক্রিপ্টেড — মেসেজ আটকানো সম্ভব নয়",
          "অফিশিয়াল টেলিগ্রাম বিজনেস API — সম্পূর্ণ কমপ্লায়েন্ট",
        ],
      },
    },
    {
      kind: "features",
      title: { en: "Key Benefits of Telegram Gateway", bn: "টেলিগ্রাম গেটওয়ের প্রধান সুবিধা" },
      items: [
        { title: { en: "Instant Delivery", bn: "তাৎক্ষণিক ডেলিভারি" }, text: { en: "OTPs arrive in under a second via Telegram's global infrastructure — no SMS delays or carrier bottlenecks.", bn: "টেলিগ্রামের বৈশ্বিক অবকাঠামোর মাধ্যমে OTP এক সেকেন্ডেরও কম সময়ে পৌঁছায় — এসএমএস বিলম্ব বা অপারেটর জটিলতা নেই।" } },
        { title: { en: "Lower Cost", bn: "কম খরচ" }, text: { en: "Significantly cheaper than SMS-based OTP. Cut authentication costs without sacrificing reliability.", bn: "এসএমএসভিত্তিক OTP-র চেয়ে অনেক সাশ্রয়ী। নির্ভরযোগ্যতা বজায় রেখেই অথেনটিকেশন খরচ কমান।" } },
        { title: { en: "End-to-End Encrypted", bn: "এন্ড-টু-এন্ড এনক্রিপ্টেড" }, text: { en: "Messages are secured by Telegram's encryption. Codes cannot be intercepted or spoofed.", bn: "টেলিগ্রামের এনক্রিপশনে মেসেজ সুরক্ষিত থাকে। কোড আটকানো বা জাল করা সম্ভব নয়।" } },
        {
          title: { en: "Global Reach", bn: "বৈশ্বিক নাগাল" },
          text: { en: "Telegram has 900+ million active users worldwide. Reach customers in any country without per-country SMS routing complexity.", bn: "বিশ্বজুড়ে টেলিগ্রামের ৯০ কোটিরও বেশি সক্রিয় ব্যবহারকারী আছে। প্রতিটি দেশের জন্য আলাদা এসএমএস রাউটিং ঝামেলা ছাড়াই যেকোনো দেশের গ্রাহকের কাছে পৌঁছান।" },
          points: {
            en: ["180+ countries supported", "No carrier agreements needed", "Works on iOS, Android, and Desktop"],
            bn: ["১৮০+ দেশে সমর্থিত", "কোনো অপারেটর চুক্তির প্রয়োজন নেই", "iOS, Android ও ডেস্কটপে কাজ করে"],
          },
        },
      ],
    },
    {
      kind: "steps",
      title: { en: "How It Works", bn: "যেভাবে কাজ করে" },
      items: [
        { title: { en: "User Initiates Login", bn: "ব্যবহারকারী লগইন শুরু করেন" }, text: { en: "User enters their phone number on your platform and requests a verification code.", bn: "ব্যবহারকারী আপনার প্ল্যাটফর্মে ফোন নম্বর দিয়ে যাচাইকরণ কোড চান।" } },
        { title: { en: "API Request Sent", bn: "API রিকোয়েস্ট পাঠানো হয়" }, text: { en: "Your backend calls the Ritorica Telegram Gateway API with the user's phone number.", bn: "আপনার ব্যাকএন্ড ব্যবহারকারীর ফোন নম্বরসহ Ritorica টেলিগ্রাম গেটওয়ে API কল করে।" } },
        { title: { en: "Code Delivered via Telegram", bn: "টেলিগ্রামে কোড পাঠানো হয়" }, text: { en: "The OTP is sent directly to the user's Telegram app — instantly and securely.", bn: "OTP সরাসরি ব্যবহারকারীর টেলিগ্রাম অ্যাপে তাৎক্ষণিক ও নিরাপদভাবে পাঠানো হয়।" } },
        { title: { en: "User Verified", bn: "ব্যবহারকারী যাচাই হন" }, text: { en: "User enters the code and verification is confirmed. The session is established.", bn: "ব্যবহারকারী কোড দিলে যাচাই নিশ্চিত হয় এবং সেশন শুরু হয়।" } },
      ],
    },
    {
      kind: "features",
      style: "tiles",
      title: { en: "Use Cases", bn: "ব্যবহারের ক্ষেত্র" },
      items: [
        { title: { en: "Two-Factor Authentication", bn: "টু-ফ্যাক্টর অথেনটিকেশন" }, text: { en: "Replace SMS 2FA with Telegram OTP for faster, cheaper, and more secure logins.", bn: "দ্রুত, সাশ্রয়ী ও নিরাপদ লগইনের জন্য এসএমএস 2FA-র বদলে টেলিগ্রাম OTP ব্যবহার করুন।" } },
        { title: { en: "User Registration", bn: "ব্যবহারকারী নিবন্ধন" }, text: { en: "Verify new users at signup with a Telegram code — instant confirmation without SMS cost.", bn: "সাইনআপের সময় টেলিগ্রাম কোড দিয়ে নতুন ব্যবহারকারী যাচাই করুন — এসএমএস খরচ ছাড়াই তাৎক্ষণিক নিশ্চিতকরণ।" } },
        { title: { en: "Transaction Confirmation", bn: "লেনদেন নিশ্চিতকরণ" }, text: { en: "Send real-time OTPs to confirm payments, transfers, and other sensitive transactions.", bn: "পেমেন্ট, ট্রান্সফার ও অন্যান্য স্পর্শকাতর লেনদেন নিশ্চিত করতে রিয়েল-টাইম OTP পাঠান।" } },
        { title: { en: "Alerts & Notifications", bn: "অ্যালার্ট ও নোটিফিকেশন" }, text: { en: "Deliver time-sensitive service alerts and security notifications directly via Telegram.", bn: "সময়-সংবেদনশীল সার্ভিস অ্যালার্ট ও নিরাপত্তা নোটিফিকেশন সরাসরি টেলিগ্রামে পাঠান।" } },
      ],
    },
    {
      kind: "list",
      title: { en: "Developer-Friendly Integration", bn: "ডেভেলপার-বান্ধব ইন্টিগ্রেশন" },
      intro: {
        en: "Integrate Telegram Gateway in minutes with our clean REST API. Full SDK support for Python, Node.js, PHP, Java, and more.",
        bn: "আমাদের সহজ REST API দিয়ে মিনিটেই টেলিগ্রাম গেটওয়ে ইন্টিগ্রেট করুন। Python, Node.js, PHP, Java ও আরও অনেক ভাষার জন্য সম্পূর্ণ SDK সাপোর্ট।",
      },
      items: {
        en: ["REST API with JSON responses", "Webhook support for delivery status", "Sandbox environment for testing", "Detailed request_id tracking per OTP"],
        bn: ["JSON রেসপন্সসহ REST API", "ডেলিভারি স্ট্যাটাসের জন্য ওয়েবহুক সাপোর্ট", "টেস্টিংয়ের জন্য স্যান্ডবক্স পরিবেশ", "প্রতিটি OTP-র জন্য বিস্তারিত request_id ট্র্যাকিং"],
      },
    },
    {
      kind: "code",
      title: { en: "API Example", bn: "API উদাহরণ" },
      blocks: [
        {
          label: { en: "api-request.js", bn: "api-request.js" },
          code: `// Send verification code via Telegram Gateway
const response = await fetch('https://api.ritorica.com/v1/telegram/send', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phone: '+1234567890', // E.164 format
    ttl: 120 // seconds
  })
});
const { request_id, code } = await response.json();`,
        },
      ],
    },
  ],
  cta: {
    title: { en: "Get Started Today!", bn: "আজই শুরু করুন!" },
    text: { en: "Start using Telegram Gateway for fast, secure, low-cost OTP delivery. Click below to request a personalized proposal.", bn: "দ্রুত, নিরাপদ ও কম খরচে OTP ডেলিভারির জন্য আজই টেলিগ্রাম গেটওয়ে ব্যবহার শুরু করুন। নিচে ক্লিক করে ব্যক্তিগতকৃত প্রস্তাব চান।" },
  },
};
