import type { RichPage } from "./types";

/** Source: ritorica.com/developers/integration-guides (supplied by the client). */
export const page: RichPage = {
  group: "developers",
  slug: "integration-guides",
  trust: false,
  name: { en: "Integration Guides", bn: "ইন্টিগ্রেশন গাইড" },
  eyebrow: { en: "Developer Guides", bn: "ডেভেলপার গাইড" },
  title: { en: "Integrate Once.", bn: "একবার ইন্টিগ্রেট করুন।" },
  intro: {
    en: "Practical, step-by-step guides for every channel, language, and use case. From your first API call to production-ready automation flows — we've written the playbook.",
    bn: "প্রতিটি চ্যানেল, ভাষা ও ব্যবহারের ক্ষেত্রের জন্য বাস্তবসম্মত, ধাপে-ধাপে গাইড। আপনার প্রথম API কল থেকে প্রোডাকশন-রেডি অটোমেশন ফ্লো পর্যন্ত — পুরো প্লেবুক আমরা লিখে রেখেছি।",
  },
  description: "Step-by-step integration guides for SMS, WhatsApp, Viber, Push, Telegram, callbacks, and complete messaging flows via the Ritorica API.",
  sections: [],
  dev: {
    titleAccent: { en: "Message Everywhere.", bn: "সবখানে মেসেজ পাঠান।" },
    badges: [
      { icon: "clock", label: { en: "First message in under 10 minutes", bn: "১০ মিনিটের মধ্যে প্রথম মেসেজ" } },
      { icon: "code", label: { en: "HTTP(S) & SMPP — any language", bn: "HTTP(S) ও SMPP — যেকোনো ভাষায়" } },
      { icon: "hexagon", label: { en: "Works with any HTTP client", bn: "যেকোনো HTTP ক্লায়েন্টে চলে" } },
      { icon: "shield", label: { en: "XML responses — simple to parse", bn: "XML রেসপন্স — পার্স করা সহজ" } },
    ],
    heroActions: [{ label: { en: "Talk to a Developer", bn: "ডেভেলপারের সাথে কথা বলুন" }, to: "/contact" }],
    ctaActions: [
      { label: { en: "Contact Dev Support", bn: "ডেভ সাপোর্টে যোগাযোগ" }, to: "/contact" },
      { label: { en: "API Reference", bn: "API রেফারেন্স" }, to: "/developers/api-docs", solid: true },
    ],
    sections: [
      {
        kind: "steps",
        id: "quick-start",
        tone: "dark",
        eyebrow: { en: "Quick Start", bn: "কুইক স্টার্ট" },
        title: { en: "Send Your First Message in 4 Steps", bn: "৪টি ধাপে আপনার প্রথম মেসেজ পাঠান" },
        intro: {
          en: "No setup wizard. No 30-minute onboarding call. Just your login credentials, a few lines of code, and a delivered message.",
          bn: "কোনো সেটআপ উইজার্ড নেই। ৩০ মিনিটের অনবোর্ডিং কলও নেই। শুধু লগইন ক্রেডেনশিয়াল, কয়েক লাইন কোড, আর একটি ডেলিভার হওয়া মেসেজ।",
        },
        items: [
          {
            title: { en: "Create your account", bn: "আপনার অ্যাকাউন্ট তৈরি করুন" },
            text: {
              en: "Contact Ritorica to create your account. Your login and password are issued by your account manager — the same credentials work for HTTP(S), SMPP, and the web dashboard.",
              bn: "অ্যাকাউন্ট তৈরি করতে Ritorica-র সাথে যোগাযোগ করুন। আপনার অ্যাকাউন্ট ম্যানেজার লগইন ও পাসওয়ার্ড দেবেন — একই ক্রেডেনশিয়াল HTTP(S), SMPP ও ওয়েব ড্যাশবোর্ডে কাজ করে।",
            },
          },
          {
            title: { en: "Get your login credentials", bn: "লগইন ক্রেডেনশিয়াল সংগ্রহ করুন" },
            text: {
              en: "Your account manager provides a login and password. Keep them server-side — never expose them in frontend code or public repositories. The same credentials are used for all protocols.",
              bn: "আপনার অ্যাকাউন্ট ম্যানেজার একটি লগইন ও পাসওয়ার্ড দেবেন। এগুলো সার্ভার-সাইডে রাখুন — কখনো ফ্রন্টএন্ড কোড বা পাবলিক রিপোজিটরিতে প্রকাশ করবেন না। একই ক্রেডেনশিয়াল সব প্রোটোকলে ব্যবহৃত হয়।",
            },
          },
          {
            title: { en: "Send a test SMS", bn: "একটি টেস্ট এসএমএস পাঠান" },
            text: {
              en: "Make a single HTTP POST to **http.ritorica.com/multi.php** with your login, password, phone number, and message text. The response is XML confirming how many messages were queued.",
              bn: "আপনার login, password, ফোন নম্বর ও মেসেজ টেক্সট দিয়ে http.ritorica.com/multi.php-তে একটি HTTP POST করুন। কতগুলো মেসেজ কিউ হয়েছে তা নিশ্চিত করে একটি XML রেসপন্স আসবে।",
            },
          },
          {
            title: { en: "Go live", bn: "লাইভ শুরু করুন" },
            text: {
              en: "Top up your balance and you're live — same endpoint, same credentials. Use **want_sms_ids=1** to get message IDs back for delivery tracking.",
              bn: "আপনার ব্যালেন্স টপ-আপ করলেই আপনি লাইভ — একই এন্ডপয়েন্ট, একই ক্রেডেনশিয়াল। ডেলিভারি ট্র্যাকিংয়ের জন্য মেসেজ আইডি পেতে want_sms_ids=1 ব্যবহার করুন।",
            },
          },
        ],
      },
      {
        kind: "codeTabs",
        id: "code-samples",
        tone: "dark",
        eyebrow: { en: "Code Samples", bn: "কোড স্যাম্পল" },
        title: { en: "Send a Message — Code Samples", bn: "মেসেজ পাঠানো — কোড স্যাম্পল" },
        tabs: [
          { label: "cURL", code: `curl -X POST https://http.ritorica.com/multi.php \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "login=YOUR_LOGIN&password=YOUR_PASSWORD&phones=447911123456&originator=Ritorica&message=Hello+from+Ritorica%21&want_sms_ids=1"

# HTTP 200 — XML response
<?xml version="1.0" ?>
<reply>
<result>OK</result>
<code>0</code>
<description>queued 1 messages</description>
<message_infos>
<message_info>
<phone>447911123456</phone>
<sms_id>1000472891</sms_id>
</message_info>
</message_infos>
</reply>` },
          { label: "Python", code: `import requests

response = requests.post(
    "https://http.ritorica.com/multi.php",
    data={
        "login": "YOUR_LOGIN",
        "password": "YOUR_PASSWORD",
        "phones": "447911123456",
        "originator": "Ritorica",
        "message": "Hello from Ritorica!",
        "want_sms_ids": 1
    }
)
print(response.text)
# <reply><result>OK</result><code>0</code><description>queued 1 messages</description>...</reply>` },
          { label: "Node.js", code: `const params = new URLSearchParams({
  login: 'YOUR_LOGIN',
  password: 'YOUR_PASSWORD',
  phones: '447911123456',
  originator: 'Ritorica',
  message: 'Hello from Ritorica!',
  want_sms_ids: 1
});

const res = await fetch('https://http.ritorica.com/multi.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body:    params.toString()
});
const xml = await res.text();
// <reply><result>OK</result><code>0</code>...</reply>` },
          { label: "PHP", code: `$response = file_get_contents(
    'https://http.ritorica.com/multi.php',
    false,
    stream_context_create(['http' => [
        'method'  => 'POST',
        'header'  => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query([
            'login' => 'YOUR_LOGIN',
            'password' => 'YOUR_PASSWORD',
            'phones' => '447911123456',
            'originator' => 'Ritorica',
            'message' => 'Hello from Ritorica!',
            'want_sms_ids' => 1
        ])
    ]])
);
// <reply><result>OK</result><code>0</code>...</reply>` },
          { label: "Java", code: `String body = "login=YOUR_LOGIN&password=YOUR_PASSWORD"
    + "&phones=447911123456&originator=Ritorica"
    + "&message=Hello+from+Ritorica%21&want_sms_ids=1";

HttpResponse<String> res = HttpClient.newHttpClient().send(
    HttpRequest.newBuilder()
        .uri(URI.create("https://http.ritorica.com/multi.php"))
        .header("Content-Type", "application/x-www-form-urlencoded")
        .POST(BodyPublishers.ofString(body))
        .build(),
    BodyHandlers.ofString()
);
System.out.println(res.body());
// <reply><result>OK</result><code>0</code>...</reply>` },
          { label: "Go", code: `body := strings.NewReader(
    "login=YOUR_LOGIN&password=YOUR_PASSWORD" +
    "&phones=447911123456&originator=Ritorica" +
    "&message=Hello+from+Ritorica%21&want_sms_ids=1",
)
req, _ := http.NewRequest("POST", "https://http.ritorica.com/multi.php", body)
req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
resp, _ := http.DefaultClient.Do(req)
defer resp.Body.Close()
// resp.StatusCode == 200, parse XML body` },
        ],
      },
      {
        kind: "guides",
        id: "channel-setup",
        eyebrow: { en: "Channel Setup", bn: "চ্যানেল সেটআপ" },
        title: { en: "Connect Each Channel", bn: "প্রতিটি চ্যানেল যুক্ত করুন" },
        intro: {
          en: "Each messaging channel has its own approval process, template rules, and delivery behaviour. These guides walk you through every step.",
          bn: "প্রতিটি মেসেজিং চ্যানেলের নিজস্ব অনুমোদন প্রক্রিয়া, টেমপ্লেট নিয়ম ও ডেলিভারি আচরণ রয়েছে। এই গাইডগুলো আপনাকে প্রতিটি ধাপে নিয়ে যাবে।",
        },
        items: [
          {
            icon: "sms",
            color: "primary",
            level: "beginner",
            title: { en: "SMS — Single & Bulk Sending", bn: "এসএমএস — সিঙ্গেল ও বাল্ক পাঠানো" },
            text: {
              en: "Send transactional or marketing SMS globally via HTTP(S) POST to **http.ritorica.com/multi.php**. Covers single send, bulk with comma-separated phones, personalised messages per recipient, Unicode/Cyrillic encoding, message concatenation, scheduled sending, and alphanumeric sender IDs.",
              bn: "http.ritorica.com/multi.php-তে HTTP(S) POST-এর মাধ্যমে বিশ্বব্যাপী লেনদেন বা মার্কেটিং এসএমএস পাঠান। সিঙ্গেল সেন্ড, কমা-দিয়ে-আলাদা করা ফোন নম্বরে বাল্ক সেন্ড, প্রতিটি প্রাপকের জন্য আলাদা মেসেজ, ইউনিকোড/সিরিলিক এনকোডিং, মেসেজ কনক্যাটিনেশন, শিডিউলড সেন্ডিং এবং আলফানিউমেরিক সেন্ডার আইডি নিয়ে আলোচনা।",
            },
            read: { en: "15 min read", bn: "১৫ মিনিটের পাঠ" },
            tags: "HTTP(S) · SMPP",
          },
          {
            icon: "whatsapp",
            color: "success",
            level: "intermediate",
            title: { en: "WhatsApp Business API Setup", bn: "WhatsApp Business API সেটআপ" },
            text: {
              en: "Get your WhatsApp Business account approved through Ritorica, configure message templates, set up delivery callbacks for inbound messages, and send your first template message. Contact your account manager to get started.",
              bn: "Ritorica-র মাধ্যমে আপনার WhatsApp Business অ্যাকাউন্ট অনুমোদন করান, মেসেজ টেমপ্লেট কনফিগার করুন, ইনবাউন্ড মেসেজের জন্য ডেলিভারি কলব্যাক সেট করুন এবং আপনার প্রথম টেমপ্লেট মেসেজ পাঠান। শুরু করতে আপনার অ্যাকাউন্ট ম্যানেজারের সাথে যোগাযোগ করুন।",
            },
            read: { en: "30 min read", bn: "৩০ মিনিটের পাঠ" },
            tags: "Platform · Callbacks",
          },
          {
            icon: "phone",
            color: "violet",
            level: "intermediate",
            title: { en: "Viber Business Messaging", bn: "Viber বিজনেস মেসেজিং" },
            text: {
              en: "Configure a Viber Business account through Ritorica, create rich messages with images and CTA buttons, set up Viber Bots for two-way conversations, and handle delivery reports. Contact your account manager to enable.",
              bn: "Ritorica-র মাধ্যমে একটি Viber Business অ্যাকাউন্ট কনফিগার করুন, ছবি ও CTA বাটনসহ রিচ মেসেজ তৈরি করুন, দ্বিমুখী কথোপকথনের জন্য Viber Bots সেট করুন এবং ডেলিভারি রিপোর্ট পরিচালনা করুন। চালু করতে আপনার অ্যাকাউন্ট ম্যানেজারের সাথে যোগাযোগ করুন।",
            },
            read: { en: "25 min read", bn: "২৫ মিনিটের পাঠ" },
            tags: "Platform · Callbacks",
          },
          {
            icon: "bell",
            color: "pink",
            level: "intermediate",
            title: { en: "Push Notifications — Web & Mobile", bn: "পুশ নোটিফিকেশন — ওয়েব ও মোবাইল" },
            text: {
              en: "Send web and mobile push notifications via the Ritorica Push Platform. Covers subscription management for iOS (APNs) and Android (FCM), silent pushes, and rich notifications. Contact your account manager to enable push for your account.",
              bn: "Ritorica Push Platform-এর মাধ্যমে ওয়েব ও মোবাইল পুশ নোটিফিকেশন পাঠান। iOS (APNs) ও Android (FCM)-এর সাবস্ক্রিপশন ব্যবস্থাপনা, সাইলেন্ট পুশ ও রিচ নোটিফিকেশন নিয়ে আলোচনা। আপনার অ্যাকাউন্টে পুশ চালু করতে অ্যাকাউন্ট ম্যানেজারের সাথে যোগাযোগ করুন।",
            },
            read: { en: "35 min read", bn: "৩৫ মিনিটের পাঠ" },
            tags: "Platform · HTTP(S)",
          },
          {
            icon: "send",
            color: "sky",
            level: "beginner",
            title: { en: "Telegram Gateway", bn: "Telegram গেটওয়ে" },
            text: {
              en: "Send transactional messages via Telegram without managing a bot yourself. Covers channel setup through Ritorica, message delivery, and OTP via Telegram as a channel fallback. Contact your account manager to enable.",
              bn: "নিজে কোনো বট পরিচালনা না করেই Telegram-এর মাধ্যমে লেনদেন মেসেজ পাঠান। Ritorica-র মাধ্যমে চ্যানেল সেটআপ, মেসেজ ডেলিভারি, এবং ফলব্যাক চ্যানেল হিসেবে Telegram-এ OTP নিয়ে আলোচনা। চালু করতে আপনার অ্যাকাউন্ট ম্যানেজারের সাথে যোগাযোগ করুন।",
            },
            read: { en: "20 min read", bn: "২০ মিনিটের পাঠ" },
            tags: "Platform · HTTP(S)",
          },
          {
            icon: "repeat",
            color: "warning",
            level: "intermediate",
            title: { en: "Delivery Callbacks & Status Events", bn: "ডেলিভারি কলব্যাক ও স্ট্যাটাস ইভেন্ট" },
            text: {
              en: "Receive real-time delivery status updates automatically. Set up a script on your server and share the URL with Ritorica — the platform will POST status events (sms_id, status, delivery_date, error_code) to your endpoint after every status change.",
              bn: "স্বয়ংক্রিয়ভাবে রিয়েল-টাইম ডেলিভারি স্ট্যাটাস আপডেট পান। আপনার সার্ভারে একটি স্ক্রিপ্ট সেট করুন এবং সেই URL Ritorica-কে জানান — প্রতিটি স্ট্যাটাস পরিবর্তনের পর প্ল্যাটফর্ম আপনার এন্ডপয়েন্টে স্ট্যাটাস ইভেন্ট (sms_id, status, delivery_date, error_code) POST করবে।",
            },
            read: { en: "20 min read", bn: "২০ মিনিটের পাঠ" },
            tags: "All channels",
          },
        ],
      },
      {
        kind: "guides",
        id: "flow-recipes",
        eyebrow: { en: "Flow Recipes", bn: "ফ্লো রেসিপি" },
        title: { en: "Build Complete Messaging Flows", bn: "সম্পূর্ণ মেসেজিং ফ্লো তৈরি করুন" },
        intro: {
          en: "End-to-end implementation guides for the most common business messaging workflows — copy the pattern, adapt to your stack.",
          bn: "সবচেয়ে প্রচলিত ব্যবসায়িক মেসেজিং ওয়ার্কফ্লোর জন্য এন্ড-টু-এন্ড ইমপ্লিমেন্টেশন গাইড — প্যাটার্ন অনুসরণ করুন, নিজের স্ট্যাকে প্রয়োগ করুন।",
        },
        items: [
          {
            icon: "lock",
            color: "primary",
            level: "intermediate",
            title: { en: "OTP & Two-Factor Authentication Flow", bn: "OTP ও দ্বি-স্তর যাচাইকরণ ফ্লো" },
            text: {
              en: "Build a complete 2FA system: generate secure OTPs server-side, send via SMS using the Ritorica HTTP API, track the Checked status when the subscriber enters the code, and implement expiry and rate limiting. Includes code samples in Python and Node.js.",
              bn: "একটি সম্পূর্ণ 2FA সিস্টেম তৈরি করুন: সার্ভার-সাইডে নিরাপদ OTP তৈরি করুন, Ritorica HTTP API দিয়ে এসএমএস-এ পাঠান, গ্রাহক কোড দিলে Checked স্ট্যাটাস ট্র্যাক করুন, এবং মেয়াদ উত্তীর্ণ হওয়া ও রেট লিমিটিং যুক্ত করুন। Python ও Node.js-এ কোড স্যাম্পল অন্তর্ভুক্ত।",
            },
            read: { en: "40 min read", bn: "৪০ মিনিটের পাঠ" },
            tags: "SMS · WhatsApp",
          },
          {
            icon: "cart",
            color: "success",
            level: "intermediate",
            title: { en: "Abandoned Cart Recovery Sequence", bn: "পরিত্যক্ত কার্ট পুনরুদ্ধার সিকোয়েন্স" },
            text: {
              en: "Trigger a WhatsApp message with product image 1 hour after cart abandonment, SMS follow-up at 3 hours, and a final push notification at 24 hours. Covers webhook triggers, template variables, and opt-out handling.",
              bn: "কার্ট পরিত্যাগের ১ ঘণ্টা পর পণ্যের ছবিসহ একটি WhatsApp মেসেজ, ৩ ঘণ্টায় এসএমএস ফলো-আপ এবং ২৪ ঘণ্টায় একটি চূড়ান্ত পুশ নোটিফিকেশন ট্রিগার করুন। ওয়েবহুক ট্রিগার, টেমপ্লেট ভেরিয়েবল এবং অপ্ট-আউট হ্যান্ডলিং নিয়ে আলোচনা।",
            },
            read: { en: "45 min read", bn: "৪৫ মিনিটের পাঠ" },
            tags: "WhatsApp · SMS · Push",
          },
          {
            icon: "calendar",
            color: "violet",
            level: "beginner",
            title: { en: "Appointment Reminder System", bn: "অ্যাপয়েন্টমেন্ট রিমাইন্ডার সিস্টেম" },
            text: {
              en: "Schedule automated SMS + WhatsApp reminders at configurable intervals before an appointment. Includes confirm/cancel/reschedule reply handling and calendar sync patterns.",
              bn: "অ্যাপয়েন্টমেন্টের আগে নির্ধারিত বিরতিতে স্বয়ংক্রিয় SMS + WhatsApp রিমাইন্ডার শিডিউল করুন। কনফার্ম/বাতিল/পুনঃনির্ধারণ রিপ্লাই হ্যান্ডলিং এবং ক্যালেন্ডার সিঙ্ক প্যাটার্ন অন্তর্ভুক্ত।",
            },
            read: { en: "30 min read", bn: "৩০ মিনিটের পাঠ" },
            tags: "SMS · WhatsApp",
          },
          {
            icon: "pulse",
            color: "warning",
            level: "intermediate",
            title: { en: "Bulk Campaign with Personalisation", bn: "ব্যক্তিগতকৃত বাল্ক ক্যাম্পেইন" },
            text: {
              en: "Send personalised SMS campaigns to millions of contacts using the **individual_messages** parameter. Covers mailing list management via list.php, per-recipient message text, send pacing with the gap parameter, delivery tracking, and unsubscribe management.",
              bn: "individual_messages প্যারামিটার ব্যবহার করে লক্ষ লক্ষ কন্টাক্টে ব্যক্তিগতকৃত এসএমএস ক্যাম্পেইন পাঠান। list.php-এর মাধ্যমে মেইলিং লিস্ট ব্যবস্থাপনা, প্রতিটি প্রাপকের আলাদা মেসেজ টেক্সট, gap প্যারামিটার দিয়ে পাঠানোর গতি নিয়ন্ত্রণ, ডেলিভারি ট্র্যাকিং ও আনসাবস্ক্রাইব ব্যবস্থাপনা নিয়ে আলোচনা।",
            },
            read: { en: "35 min read", bn: "৩৫ মিনিটের পাঠ" },
            tags: "Viber · SMS · Email",
          },
          {
            icon: "map",
            color: "destructive",
            level: "advanced",
            title: { en: "Omnichannel Fallback Routing", bn: "অমনিচ্যানেল ফলব্যাক রাউটিং" },
            text: {
              en: "Build a channel waterfall: try WhatsApp first, fall back to Viber if undelivered within 60s, then SMS as the final guarantee. Covers delivery event listening, timeout logic, and cost optimisation strategies.",
              bn: "একটি চ্যানেল ওয়াটারফল তৈরি করুন: প্রথমে WhatsApp চেষ্টা করুন, ৬০ সেকেন্ডের মধ্যে ডেলিভার না হলে Viber-এ ফলব্যাক করুন, এরপর চূড়ান্ত নিশ্চয়তা হিসেবে SMS। ডেলিভারি ইভেন্ট শোনা, টাইমআউট লজিক এবং খরচ অপ্টিমাইজেশন কৌশল নিয়ে আলোচনা।",
            },
            read: { en: "50 min read", bn: "৫০ মিনিটের পাঠ" },
            tags: "WhatsApp · Viber · SMS",
          },
          {
            icon: "refresh",
            color: "violet",
            level: "advanced",
            title: { en: "Dormant User Re-engagement Sequence", bn: "নিষ্ক্রিয় ব্যবহারকারী পুনরায় সম্পৃক্ত করার সিকোয়েন্স" },
            text: {
              en: "Identify inactive users via API query, build a personalised multi-step sequence across Push, Viber, and SMS, and measure reactivation rates. Includes A/B testing setup and suppression list handling.",
              bn: "API কোয়েরি দিয়ে নিষ্ক্রিয় ব্যবহারকারী শনাক্ত করুন, Push, Viber ও SMS জুড়ে একটি ব্যক্তিগতকৃত বহু-ধাপের সিকোয়েন্স তৈরি করুন এবং পুনঃসক্রিয়করণের হার পরিমাপ করুন। A/B টেস্টিং সেটআপ এবং সাপ্রেশন লিস্ট হ্যান্ডলিং অন্তর্ভুক্ত।",
            },
            read: { en: "55 min read", bn: "৫৫ মিনিটের পাঠ" },
            tags: "Push · Viber · SMS",
          },
        ],
      },
    ],
  },
  cta: {
    title: { en: "Need Help with Your Integration?", bn: "আপনার ইন্টিগ্রেশনে সাহায্য দরকার?" },
    text: {
      en: "Our developer support team answers technical questions within 4 hours. Or browse the full API reference for endpoint details, error codes, and rate limits.",
      bn: "আমাদের ডেভেলপার সাপোর্ট টিম ৪ ঘণ্টার মধ্যে কারিগরি প্রশ্নের উত্তর দেয়। অথবা এন্ডপয়েন্টের বিস্তারিত, এরর কোড ও রেট লিমিটের জন্য পূর্ণ API রেফারেন্স দেখুন।",
    },
  },
};
