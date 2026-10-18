import type { L } from "@/i18n/language";
import type { ParamRow, ParamTable, RichPage } from "./types";

/** Source: ritorica.com/developers/api-docs (screenshots supplied by the client). */

const FIELD: L = { en: "Field", bn: "ফিল্ড" };
const TYPE: L = { en: "Type", bn: "টাইপ" };
const DESC: L = { en: "Description", bn: "বিবরণ" };
const REQ_PARAMS: L = { en: "Request Parameters", bn: "রিকোয়েস্ট প্যারামিটার" };

const login: ParamRow = { field: "login", type: "string", req: "required", text: { en: "Your account login", bn: "আপনার অ্যাকাউন্ট লগইন" } };
const password: ParamRow = { field: "password", type: "string", req: "required", text: { en: "Your account password", bn: "আপনার অ্যাকাউন্ট পাসওয়ার্ড" } };
const params = (rows: ParamRow[]): ParamTable => ({ title: REQ_PARAMS, head: [FIELD, TYPE, DESC], rows });
const FINAL: L = { en: "Final", bn: "চূড়ান্ত" };
const TRANSITIONAL: L = { en: "Transitional", bn: "অস্থায়ী" };

export const page: RichPage = {
  group: "developers",
  slug: "api-docs",
  trust: false,
  name: { en: "API Documentation", bn: "API ডকুমেন্টেশন" },
  eyebrow: { en: "API Reference", bn: "API রেফারেন্স" },
  title: { en: "Ritorica Messaging", bn: "Ritorica মেসেজিং" },
  intro: {
    en: "HTTP(S) and SMPP protocols for global SMS delivery. Form-encoded requests, XML responses, login and password authentication. Works with any language or HTTP client.",
    bn: "গ্লোবাল এসএমএস ডেলিভারির জন্য HTTP(S) ও SMPP প্রোটোকল। ফর্ম-এনকোডেড রিকোয়েস্ট, XML রেসপন্স, লগইন ও পাসওয়ার্ড অথেন্টিকেশন। যেকোনো ভাষা বা HTTP ক্লায়েন্টে কাজ করে।",
  },
  description: "Ritorica Messaging API v1 reference: authentication, send SMS, delivery status, callbacks, mailing lists, rate limits, and error codes.",
  sections: [],
  cta: {
    title: { en: "Ready to Start Building?", bn: "তৈরি শুরু করতে প্রস্তুত?" },
    text: {
      en: "Contact our team to get your API credentials, whitelist your server IP, and go live. Our technical support team is available to help with your integration.",
      bn: "আপনার API ক্রেডেনশিয়াল পেতে, সার্ভার আইপি হোয়াইটলিস্ট করতে এবং লাইভ যেতে আমাদের টিমের সাথে যোগাযোগ করুন। আমাদের টেকনিক্যাল সাপোর্ট টিম আপনার ইন্টিগ্রেশনে সাহায্য করতে প্রস্তুত।",
    },
  },
  dev: {
    titleAccent: { en: "API v1", bn: "API v1" },
    badges: [
      { icon: "code", label: { en: "HTTP(S) + SMPP", bn: "HTTP(S) + SMPP" } },
      { icon: "shield", label: { en: "TLS 1.2+ only", bn: "শুধু TLS 1.2+" } },
      { icon: "lock", label: { en: "Login & password auth", bn: "লগইন ও পাসওয়ার্ড অথেন্টিকেশন" } },
      { icon: "pulse", label: { en: "XML responses", bn: "XML রেসপন্স" } },
      { icon: "hexagon", label: { en: "Any language", bn: "যেকোনো ভাষা" } },
    ],
    heroActions: [
      { label: { en: "Integration Guides", bn: "ইন্টিগ্রেশন গাইড" }, to: "/developers/integration-guides", solid: true },
      { label: { en: "Request Access", bn: "অ্যাক্সেসের অনুরোধ" }, to: "/request-demo" },
    ],
    ctaActions: [
      { label: { en: "Get API Access", bn: "API অ্যাক্সেস নিন" }, to: "/request-demo", solid: true },
      { label: { en: "Browse Guides", bn: "গাইড দেখুন" }, to: "/developers/integration-guides" },
    ],
    sections: [
      {
        kind: "auth",
        id: "authentication",
        tone: "dark",
        eyebrow: { en: "Authentication", bn: "অথেন্টিকেশন" },
        title: { en: "Authentication", bn: "অথেন্টিকেশন" },
        intro: {
          en: "All requests use your login and password as POST body parameters. Credentials are issued by your account manager — the same login and password work for HTTP(S), SMPP, and the web dashboard.",
          bn: "সব রিকোয়েস্টে আপনার লগইন ও পাসওয়ার্ড POST বডি প্যারামিটার হিসেবে পাঠাতে হয়। আপনার অ্যাকাউন্ট ম্যানেজার এই ক্রেডেনশিয়াল দেন — একই লগইন ও পাসওয়ার্ড HTTP(S), SMPP এবং ওয়েব ড্যাশবোর্ডে কাজ করে।",
        },
        endpoint: { label: { en: "HTTP(S) Endpoint", bn: "HTTP(S) এন্ডপয়েন্ট" }, url: "https://http.ritorica.com/multi.php", tag: "HTTP(S) · SMPP" },
        items: [
          {
            title: { en: "Login & Password", bn: "লগইন ও পাসওয়ার্ড" },
            text: {
              en: "Pass your login and password as POST body parameters in every request. Keep credentials server-side — never expose them in frontend code or public repositories.",
              bn: "প্রতিটি রিকোয়েস্টে আপনার লগইন ও পাসওয়ার্ড POST বডি প্যারামিটার হিসেবে পাঠান। ক্রেডেনশিয়াল সার্ভার-সাইডে রাখুন — কখনো ফ্রন্টএন্ড কোড বা পাবলিক রিপোজিটরিতে প্রকাশ করবেন না।",
            },
            code: "login=YOUR_LOGIN&password=YOUR_PASSWORD",
          },
          {
            title: { en: "Content-Type", bn: "Content-Type" },
            text: {
              en: "All POST requests must use form-encoded body. Always include the Content-Type header — every parameter is sent as a key-value pair in the POST body.",
              bn: "সব POST রিকোয়েস্টে ফর্ম-এনকোডেড বডি ব্যবহার করতে হবে। সবসময় Content-Type হেডার দিন — প্রতিটি প্যারামিটার POST বডিতে কী-ভ্যালু জোড়া হিসেবে যায়।",
            },
            code: "Content-Type: application/x-www-form-urlencoded",
          },
          {
            title: { en: "Response Format", bn: "রেসপন্স ফরম্যাট" },
            text: {
              en: "All responses are XML. On success the result tag contains OK and code is 0. On error result is ERROR and the description tag explains what went wrong.",
              bn: "সব রেসপন্স XML আকারে আসে। সফল হলে result ট্যাগে OK থাকে এবং code হয় 0। ত্রুটি হলে result হয় ERROR এবং description ট্যাগে কী ভুল হয়েছে তা লেখা থাকে।",
            },
            code: "Content-Type: text/xml",
          },
        ],
      },
      {
        kind: "endpoints",
        id: "endpoints",
        tone: "dark",
        eyebrow: { en: "Endpoints", bn: "এন্ডপয়েন্ট" },
        title: { en: "API Operations", bn: "API অপারেশন" },
        intro: {
          en: "All HTTP(S) operations use the same endpoint — `http.ritorica.com/multi.php` — with different parameters. Mailing list operations use `http.ritorica.com/list.php`.",
          bn: "সব HTTP(S) অপারেশন একই এন্ডপয়েন্ট — `http.ritorica.com/multi.php` — ব্যবহার করে, শুধু প্যারামিটার আলাদা। মেইলিং লিস্ট অপারেশনে `http.ritorica.com/list.php` ব্যবহার হয়।",
        },
        items: [
          {
            method: "POST",
            path: "/multi.php",
            summary: { en: "Send a single or bulk SMS", bn: "একক বা বাল্ক এসএমএস পাঠান" },
            tables: [
              params([
                login,
                password,
                { field: "phones", type: "string", req: "required*", text: { en: "Comma-separated phone numbers in international format without +. E.g. 447911123456,79051112233", bn: "আন্তর্জাতিক ফরম্যাটে, + ছাড়া, কমা দিয়ে আলাদা করা ফোন নম্বর। যেমন: 447911123456,79051112233" } },
                { field: "message", type: "string", req: "required*", text: { en: "SMS text body. Max 160 chars Latin, 70 chars Cyrillic/Unicode. Long messages auto-split into parts.", bn: "এসএমএস-এর লেখা। ল্যাটিনে সর্বোচ্চ ১৬০ অক্ষর, সিরিলিক/ইউনিকোডে ৭০ অক্ষর। দীর্ঘ মেসেজ স্বয়ংক্রিয়ভাবে অংশে ভাগ হয়।" } },
                { field: "originator", type: "string", req: "optional", text: { en: "Sender name — max 11 alphanumeric chars or 15 digits as a phone number.", bn: "প্রেরকের নাম — সর্বোচ্চ ১১টি অক্ষর-সংখ্যা অথবা ফোন নম্বর হিসেবে ১৫টি সংখ্যা।" } },
                { field: "rus", type: "integer", req: "optional", text: { en: "Encoding: 0 = Latin/transliterate (default), 1 = Windows-1251 Cyrillic, 5 = UTF-8", bn: "এনকোডিং: 0 = ল্যাটিন/ট্রান্সলিটারেট (ডিফল্ট), 1 = Windows-1251 সিরিলিক, 5 = UTF-8" } },
                { field: "start_date", type: "string", req: "optional", text: { en: "Schedule time in format YYYY-MM-DD HH:MM:SS (UTC+5). Max 3 days in future.", bn: "YYYY-MM-DD HH:MM:SS (UTC+5) ফরম্যাটে শিডিউল সময়। ভবিষ্যতে সর্বোচ্চ ৩ দিন।" } },
                { field: "gap", type: "float", req: "optional", text: { en: "Interval between sends in seconds. Default 1, minimum 0.05.", bn: "প্রতিটি পাঠানোর মধ্যে বিরতি (সেকেন্ডে)। ডিফল্ট 1, সর্বনিম্ন 0.05।" } },
                { field: "timeout", type: "integer", req: "optional", text: { en: "SMS lifetime in seconds. Max 86400 (24h).", bn: "এসএমএস-এর মেয়াদ (সেকেন্ডে)। সর্বোচ্চ 86400 (২৪ ঘণ্টা)।" } },
                { field: "want_sms_ids", type: "0 or 1", req: "optional", text: { en: "Set to 1 to receive message IDs in the response for delivery tracking.", bn: "ডেলিভারি ট্র্যাকিংয়ের জন্য রেসপন্সে মেসেজ আইডি পেতে 1 দিন।" } },
                { field: "individual_messages", type: "0 or 1", req: "optional", text: { en: "Set to 1 to send a different text to each phone number.", bn: "প্রতিটি ফোন নম্বরে আলাদা টেক্সট পাঠাতে 1 দিন।" } },
                { field: "group", type: "string", req: "optional", text: { en: "Name of a saved contacts group — replaces the phones parameter.", bn: "সংরক্ষিত কন্টাক্ট গ্রুপের নাম — phones প্যারামিটারের বদলে ব্যবহার হয়।" } },
              ]),
            ],
            example: {
              title: { en: "Example Request & Response", bn: "উদাহরণ রিকোয়েস্ট ও রেসপন্স" },
              code: `POST /multi.php HTTP/1.0
Host: http.ritorica.com
Content-Type: application/x-www-form-urlencoded

login=mylogin&password=mypassword
&phones=447911123456
&originator=Ritorica
&message=Your+OTP+is+481923
&want_sms_ids=1

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
</reply>`,
            },
          },
          {
            method: "POST",
            path: "/multi.php?operation=status",
            summary: { en: "Check delivery status of a message", bn: "মেসেজের ডেলিভারি স্ট্যাটাস যাচাই" },
            tables: [
              params([
                login,
                password,
                { field: "operation", type: "string", req: "required", text: { en: 'Always "status"', bn: 'সবসময় "status"' } },
                { field: "sms_id", type: "string", req: "required", text: { en: "Comma-separated message IDs returned from the send call. Status history kept for 2 days only.", bn: "পাঠানোর কল থেকে পাওয়া মেসেজ আইডি, কমা দিয়ে আলাদা করে। স্ট্যাটাস হিস্ট্রি শুধু ২ দিন থাকে।" } },
              ]),
              {
                title: { en: "Delivery Status Values", bn: "ডেলিভারি স্ট্যাটাসের মান" },
                head: [{ en: "Status", bn: "স্ট্যাটাস" }, TYPE, DESC],
                rows: [
                  { field: "Delivered", type: FINAL, text: { en: "Message reached the handset", bn: "মেসেজ হ্যান্ডসেটে পৌঁছেছে" } },
                  { field: "Non Delivered", type: FINAL, text: { en: "Failed — invalid number, subscriber blocked, or call barring", bn: "ব্যর্থ — ভুল নম্বর, সাবস্ক্রাইবার ব্লকড, বা কল বারিং" } },
                  { field: "Expired", type: FINAL, text: { en: "Phone off too long or memory full during message lifetime", bn: "মেসেজের মেয়াদে ফোন অনেকক্ষণ বন্ধ ছিল বা মেমোরি পূর্ণ ছিল" } },
                  { field: "Rejected", type: FINAL, text: { en: "Operator rejected — bad sender, wrong format, or spam filter", bn: "অপারেটর প্রত্যাখ্যান করেছে — ভুল প্রেরক, ভুল ফরম্যাট, বা স্প্যাম ফিল্টার" } },
                  { field: "Deleted", type: FINAL, text: { en: "Removed from SMSC — routing restriction or link shortening reduced SMS size", bn: "SMSC থেকে সরানো হয়েছে — রাউটিং সীমাবদ্ধতা বা লিংক শর্টেনিংয়ে এসএমএসের আকার কমেছে" } },
                  { field: "Unknown status", type: FINAL, text: { en: "No delivery report received from SMSC", bn: "SMSC থেকে কোনো ডেলিভারি রিপোর্ট আসেনি" } },
                  { field: "Clicked", type: FINAL, text: { en: "Subscriber clicked a tracked link in the message", bn: "সাবস্ক্রাইবার মেসেজের ট্র্যাক করা লিংকে ক্লিক করেছেন" } },
                  { field: "Checked", type: FINAL, text: { en: "Subscriber used the OTP (e.g. typed it on your website)", bn: "সাবস্ক্রাইবার OTP ব্যবহার করেছেন (যেমন আপনার ওয়েবসাইটে টাইপ করে)" } },
                  { field: "Buffered SMSC", type: TRANSITIONAL, text: { en: "Still trying to deliver — phone off or memory full", bn: "এখনো ডেলিভারির চেষ্টা চলছে — ফোন বন্ধ বা মেমোরি পূর্ণ" } },
                  { field: "(blank)", type: TRANSITIONAL, text: { en: "No status received yet — scheduled or just sent", bn: "এখনো স্ট্যাটাস আসেনি — শিডিউল করা বা সদ্য পাঠানো" } },
                ],
              },
            ],
            example: {
              title: { en: "Example Response", bn: "উদাহরণ রেসপন্স" },
              code: `<reply>
  <submition_date>2025-04-29 10:23:01</submition_date>
  <send_date>2025-04-29 10:23:01</send_date>
  <last_status_change_date>
    2025-04-29 10:23:03
  </last_status_change_date>
  <status>Delivered</status>
  <error></error>
  <sms_id>1000472891</sms_id>
</reply>`,
            },
          },
          {
            method: "POST",
            path: "/multi.php?operation=account",
            summary: { en: "Check account credit balance", bn: "অ্যাকাউন্টের ক্রেডিট ব্যালেন্স যাচাই" },
            tables: [params([login, password, { field: "operation", type: "string", req: "required", text: { en: 'Always "account"', bn: 'সবসময় "account"' } }])],
            example: {
              title: { en: "Example Response", bn: "উদাহরণ রেসপন্স" },
              code: `<?xml version="1.0" ?>
<reply>
  <account>10025</account>
</reply>

<!-- Balance is returned as a raw number -->
<!-- Use this to build low-balance alerts -->`,
            },
          },
          {
            method: "CALLBACK",
            path: "your-server/callback-url",
            summary: { en: "Automatic delivery status notifications", bn: "স্বয়ংক্রিয় ডেলিভারি স্ট্যাটাস নোটিফিকেশন" },
            how: {
              en: "Set up a script on your server that accepts POST requests, then send your URL to the Ritorica support team. The platform will automatically call your endpoint after every status change.",
              bn: "আপনার সার্ভারে একটি স্ক্রিপ্ট বানান যা POST রিকোয়েস্ট গ্রহণ করে, তারপর URL-টি Ritorica সাপোর্ট টিমকে পাঠান। প্রতিটি স্ট্যাটাস পরিবর্তনের পর প্ল্যাটফর্ম স্বয়ংক্রিয়ভাবে আপনার এন্ডপয়েন্টে কল করবে।",
            },
            tables: [
              {
                title: { en: "Parameters Ritorica posts to your URL", bn: "Ritorica আপনার URL-এ যে প্যারামিটার পাঠায়" },
                head: [FIELD, DESC],
                rows: [
                  { field: "sms_id", text: { en: "Message identifier (unsigned 8-byte number)", bn: "মেসেজ শনাক্তকারী (unsigned 8-byte সংখ্যা)" } },
                  { field: "status", text: { en: "Delivery status value (see status table above)", bn: "ডেলিভারি স্ট্যাটাসের মান (উপরের স্ট্যাটাস টেবিল দেখুন)" } },
                  { field: "delivery_date", text: { en: "Date/time of last status change (UTC+5, YYYY-MM-DD HH:MM:SS)", bn: "সর্বশেষ স্ট্যাটাস পরিবর্তনের তারিখ/সময় (UTC+5, YYYY-MM-DD HH:MM:SS)" } },
                  { field: "error_code", text: { en: "Error code if not delivered (0 if delivered or unknown reason)", bn: "ডেলিভার না হলে এরর কোড (ডেলিভার হলে বা কারণ অজানা হলে 0)" } },
                ],
              },
            ],
            example: {
              title: { en: "Example Callback POST", bn: "উদাহরণ কলব্যাক POST" },
              code: `POST /your-callback-url HTTP/1.1
Host: yourapp.com
Content-Type: application/x-www-form-urlencoded

sms_id=1000472891
&status=Delivered
&delivery_date=2025-04-29 10:23:03
&error_code=0

<!-- Your server must respond with HTTP 200 -->`,
            },
          },
          {
            method: "POST",
            path: "/list.php",
            summary: { en: "Manage contact mailing lists", bn: "কন্টাক্ট মেইলিং লিস্ট পরিচালনা" },
            tables: [
              {
                title: { en: "Operations", bn: "অপারেশন" },
                head: [{ en: "Operation value", bn: "operation মান" }, DESC],
                rows: [
                  { field: "status_all", text: { en: "Get all mailing lists in your account (default)", bn: "আপনার অ্যাকাউন্টের সব মেইলিং লিস্ট (ডিফল্ট)" } },
                  { field: "status", text: { en: "Get info about a specific list (requires group_id)", bn: "নির্দিষ্ট লিস্টের তথ্য (group_id লাগবে)" } },
                  { field: "add_member", text: { en: "Add phone numbers to a list (max 5,000 per request)", bn: "লিস্টে ফোন নম্বর যোগ (প্রতি রিকোয়েস্টে সর্বোচ্চ ৫,০০০)" } },
                  { field: "remove_member", text: { en: "Remove phone numbers from a list (max 5,000 per request)", bn: "লিস্ট থেকে ফোন নম্বর সরানো (প্রতি রিকোয়েস্টে সর্বোচ্চ ৫,০০০)" } },
                ],
              },
            ],
            example: {
              title: { en: "Example — Add numbers to list", bn: "উদাহরণ — লিস্টে নম্বর যোগ" },
              code: `POST /list.php HTTP/1.1
Host: http.ritorica.com
Content-Type: application/x-www-form-urlencoded

login=mylogin&password=mypassword
&operation=add_member
&group_id=59353
&member=447911123456,79051112233

<?xml version="1.0" ?>
<reply>
  <result>OK</result>
  <code>0</code>
  <description>added or updated members: 2</description>
</reply>`,
            },
          },
        ],
      },
      {
        kind: "limits",
        id: "rate-limits",
        eyebrow: { en: "Rate Limits", bn: "রেট লিমিট" },
        title: { en: "Limits & Throughput", bn: "সীমা ও থ্রুপুট" },
        intro: {
          en: "Limits depend on the protocol and operation. HTTP throughput is account-specific — contact your account manager to increase it. SMPP limits are enforced per connection.",
          bn: "সীমা নির্ভর করে প্রোটোকল ও অপারেশনের ওপর। HTTP থ্রুপুট অ্যাকাউন্ট-নির্দিষ্ট — বাড়াতে আপনার অ্যাকাউন্ট ম্যানেজারের সাথে যোগাযোগ করুন। SMPP সীমা প্রতিটি কানেকশনে প্রযোজ্য।",
        },
        head: [
          { en: "Operation / Protocol", bn: "অপারেশন / প্রোটোকল" },
          { en: "Default limit", bn: "ডিফল্ট সীমা" },
          { en: "Notes", bn: "নোট" },
        ],
        rows: [
          { op: "SMPP submit_sm", limit: { en: "20 SMS / sec", bn: "২০ এসএমএস / সেকেন্ড" }, note: { en: "Per connection. Contact your account manager to increase.", bn: "প্রতি কানেকশনে। বাড়াতে আপনার অ্যাকাউন্ট ম্যানেজারের সাথে যোগাযোগ করুন।" } },
          { op: "POST /multi.php — Send SMS", limit: { en: "Account-specific", bn: "অ্যাকাউন্ট-নির্দিষ্ট" }, note: { en: "HTTP throughput set per account. Contact your manager for details.", bn: "HTTP থ্রুপুট প্রতিটি অ্যাকাউন্টে আলাদা। বিস্তারিত জানতে ম্যানেজারের সাথে যোগাযোগ করুন।" } },
          { op: "POST /multi.php?operation=status", limit: { en: "Max 5,000 IDs / req", bn: "সর্বোচ্চ ৫,০০০ আইডি / রিকোয়েস্ট" }, note: { en: "Status history available for the last 2 days only.", bn: "স্ট্যাটাস হিস্ট্রি শুধু গত ২ দিনের।" } },
          { op: "POST /multi.php?operation=set_checked", limit: { en: "Max 5,000 IDs / req", bn: "সর্বোচ্চ ৫,০০০ আইডি / রিকোয়েস্ট" }, note: { en: "Can only mark messages sent within the last 3 days.", bn: "শুধু গত ৩ দিনে পাঠানো মেসেজ চিহ্নিত করা যায়।" } },
          { op: "POST /list.php — Mailing list", limit: { en: "Max 5,000 numbers / req", bn: "সর্বোচ্চ ৫,০০০ নম্বর / রিকোয়েস্ট" }, note: { en: "Per add_member or remove_member request.", bn: "প্রতিটি add_member বা remove_member রিকোয়েস্টে।" } },
        ],
      },
      {
        kind: "errors",
        id: "error-codes",
        eyebrow: { en: "Error Codes", bn: "এরর কোড" },
        title: { en: "API Error Code Reference", bn: "API এরর কোড রেফারেন্স" },
        intro: {
          en: "Errors are returned in the XML response body as a numeric `<error>` code. A value of `0` means success.",
          bn: "এরর XML রেসপন্স বডিতে একটি সংখ্যাসূচক `<error>` কোড হিসেবে আসে। `0` মানে সফল।",
        },
        items: [
          { code: "401", title: { en: "Login not transferred", bn: "লগইন পাঠানো হয়নি" }, text: { en: "The `login` parameter is missing from the request.", bn: "রিকোয়েস্টে `login` প্যারামিটার নেই।" } },
          { code: "402", title: { en: "Password not transferred", bn: "পাসওয়ার্ড পাঠানো হয়নি" }, text: { en: "The `password` parameter is missing from the request.", bn: "রিকোয়েস্টে `password` প্যারামিটার নেই।" } },
          { code: "403", title: { en: "Phones not transferred", bn: "ফোন নম্বর পাঠানো হয়নি" }, text: { en: "The `phones` parameter is missing from the request.", bn: "রিকোয়েস্টে `phones` প্যারামিটার নেই।" } },
          { code: "411", title: { en: "Wrong login or password", bn: "ভুল লগইন বা পাসওয়ার্ড" }, text: { en: "Authentication failed. Verify your `login` and `password` credentials.", bn: "অথেন্টিকেশন ব্যর্থ। আপনার `login` ও `password` যাচাই করুন।" } },
          { code: "412", title: { en: "Incorrect IP address", bn: "ভুল আইপি ঠিকানা" }, text: { en: "Your server's IP is not whitelisted. Contact your account manager to add it.", bn: "আপনার সার্ভারের আইপি হোয়াইটলিস্টে নেই। যোগ করতে অ্যাকাউন্ট ম্যানেজারের সাথে যোগাযোগ করুন।" } },
          { code: "415", title: { en: "Insufficient funds", bn: "অপর্যাপ্ত ব্যালেন্স" }, text: { en: "Account balance is too low to send the requested messages. Top up your account.", bn: "মেসেজ পাঠানোর মতো ব্যালেন্স নেই। অ্যাকাউন্ট রিচার্জ করুন।" } },
          { code: "420", title: { en: "Message text too long", bn: "মেসেজের লেখা অনেক বড়" }, text: { en: "The message exceeds the allowed length. Split into multiple parts or use concatenation.", bn: "মেসেজটি অনুমোদিত দৈর্ঘ্যের চেয়ে বড়। একাধিক অংশে ভাগ করুন বা কনক্যাটেনেশন ব্যবহার করুন।" } },
          { code: "421", title: { en: "Originator too long", bn: "অরিজিনেটর অনেক বড়" }, text: { en: "The `originator` value exceeds the allowed length (max 11 alphanumeric or 15 numeric).", bn: "`originator`-এর মান অনুমোদিত দৈর্ঘ্যের চেয়ে বড় (সর্বোচ্চ ১১টি অক্ষর-সংখ্যা বা ১৫টি সংখ্যা)।" } },
          { code: "425", title: { en: "Incorrect phone number format", bn: "ভুল ফোন নম্বর ফরম্যাট" }, text: { en: "Phone must be in international format without leading + or 00 (e.g. 447911123456).", bn: "ফোন নম্বর + বা 00 ছাড়া আন্তর্জাতিক ফরম্যাটে দিন (যেমন 447911123456)।" } },
          { code: "429", title: { en: "Operator not supported", bn: "অপারেটর সমর্থিত নয়" }, text: { en: "The destination operator is not available in your account's routing configuration.", bn: "গন্তব্য অপারেটর আপনার অ্যাকাউন্টের রাউটিং কনফিগারেশনে নেই।" } },
          { code: "432", title: { en: "Phone number blocked", bn: "ফোন নম্বর ব্লকড" }, text: { en: "This number has been blocked (subscriber opt-out or admin block). Do not retry.", bn: "নম্বরটি ব্লক করা (সাবস্ক্রাইবার অপ্ট-আউট বা অ্যাডমিন ব্লক)। আবার চেষ্টা করবেন না।" } },
          { code: "436", title: { en: "Originator forbidden", bn: "অরিজিনেটর নিষিদ্ধ" }, text: { en: "The sender name is not approved for your account. Use a pre-approved originator.", bn: "প্রেরকের নাম আপনার অ্যাকাউন্টে অনুমোদিত নয়। পূর্ব-অনুমোদিত অরিজিনেটর ব্যবহার করুন।" } },
          { code: "501", title: { en: "Incorrect XML structure", bn: "ভুল XML কাঠামো" }, text: { en: "The XML body of the request is malformed or missing required elements.", bn: "রিকোয়েস্টের XML বডি ভুলভাবে গঠিত বা প্রয়োজনীয় অংশ নেই।" } },
          { code: "503", title: { en: "Internal system error", bn: "ইন্টারনাল সিস্টেম এরর" }, text: { en: "An unexpected error occurred on the server. Retry the request after a short delay.", bn: "সার্ভারে অপ্রত্যাশিত এরর হয়েছে। একটু পরে আবার চেষ্টা করুন।" } },
          { code: "1000", title: { en: "Temporary server problems", bn: "সাময়িক সার্ভার সমস্যা" }, text: { en: "The server is temporarily unavailable. Implement exponential backoff and retry.", bn: "সার্ভার সাময়িকভাবে বন্ধ। এক্সপোনেনশিয়াল ব্যাকঅফ দিয়ে আবার চেষ্টা করুন।" } },
        ],
      },
      {
        kind: "languages",
        id: "code-examples",
        eyebrow: { en: "Code Examples", bn: "কোড উদাহরণ" },
        title: { en: "Send Your First Message", bn: "আপনার প্রথম মেসেজ পাঠান" },
        intro: {
          en: "The Ritorica API is a standard HTTPS endpoint — use it directly from any language or HTTP client. No extra library needed.",
          bn: "Ritorica API একটি সাধারণ HTTPS এন্ডপয়েন্ট — যেকোনো ভাষা বা HTTP ক্লায়েন্ট থেকে সরাসরি ব্যবহার করুন। আলাদা লাইব্রেরি লাগে না।",
        },
        items: [
          { name: "cURL", lib: "Works in any terminal", color: "primary", text: { en: "The fastest way to test the API from the command line. Copy, paste your credentials, and you're live.", bn: "কমান্ড লাইন থেকে API পরীক্ষার দ্রুততম উপায়। কপি করুন, ক্রেডেনশিয়াল বসান, ব্যস লাইভ।" }, link: { label: { en: "Integration guide", bn: "ইন্টিগ্রেশন গাইড" }, to: "/developers/integration-guides" } },
          { name: "Python", lib: "requests library", color: "warning", text: { en: "Use the standard `requests` library — no proprietary SDK needed. Works with any Python 3.x version.", bn: "সাধারণ `requests` লাইব্রেরি ব্যবহার করুন — আলাদা SDK লাগে না। যেকোনো Python 3.x-এ চলে।" }, link: { label: { en: "Integration guide", bn: "ইন্টিগ্রেশন গাইড" }, to: "/developers/integration-guides" } },
          { name: "Node.js", lib: "node-fetch / axios", color: "success", text: { en: "Use `fetch` (Node 18+) or `axios`. Works in Express, NestJS, or any backend framework.", bn: "`fetch` (Node 18+) বা `axios` ব্যবহার করুন। Express, NestJS বা যেকোনো ব্যাকএন্ডে চলে।" }, link: { label: { en: "Integration guide", bn: "ইন্টিগ্রেশন গাইড" }, to: "/developers/integration-guides" } },
          { name: "PHP", lib: "cURL / Guzzle", color: "violet", text: { en: "Use PHP's built-in cURL extension or the Guzzle HTTP client. Compatible with Laravel and Symfony.", bn: "PHP-এর বিল্ট-ইন cURL বা Guzzle HTTP ক্লায়েন্ট ব্যবহার করুন। Laravel ও Symfony-তে চলে।" }, link: { label: { en: "Integration guide", bn: "ইন্টিগ্রেশন গাইড" }, to: "/developers/integration-guides" } },
          { name: "Java", lib: "HttpClient (Java 11+)", color: "destructive", text: { en: "Use Java's built-in `java.net.http.HttpClient` or OkHttp. Works with Spring Boot projects.", bn: "Java-র বিল্ট-ইন `java.net.http.HttpClient` বা OkHttp ব্যবহার করুন। Spring Boot প্রজেক্টে চলে।" }, link: { label: { en: "Integration guide", bn: "ইন্টিগ্রেশন গাইড" }, to: "/developers/integration-guides" } },
          { name: { en: "Any Language", bn: "যেকোনো ভাষা" }, lib: "Standard HTTP POST", color: "sky", text: { en: "Plain HTTPS POST with a form-encoded body (`application/x-www-form-urlencoded`). If your language can make an HTTP request, it can use the Ritorica API.", bn: "ফর্ম-এনকোডেড বডিসহ (`application/x-www-form-urlencoded`) সাধারণ HTTPS POST। আপনার ভাষা HTTP রিকোয়েস্ট পাঠাতে পারলেই Ritorica API ব্যবহার করতে পারবে।" }, link: { label: { en: "Ask our team", bn: "আমাদের টিমকে জিজ্ঞেস করুন" }, to: "/contact" } },
        ],
      },
    ],
  },
};
