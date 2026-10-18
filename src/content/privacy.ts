import type { L } from "@/i18n/language";
import { site } from "@/config/site";

/**
 * Privacy Policy, structured like ritorica.com/privacy-policy (client supplied the screenshots).
 * Adapted to what THIS website really does: Bangladesh office only, our own forms, an AI chat
 * assistant that saves nothing, no newsletter / whitepaper forms and no Google Analytics.
 */
export type PrivacyBlock =
  | { type: "p"; b?: L; text: L }
  | { type: "h3"; text: L }
  | { type: "list"; items: { b?: L; text: L }[] }
  | { type: "table"; head: [L, L]; rows: [L, L][] }
  | { type: "offices" };

export type PrivacySection = { id: string; h: L; blocks: PrivacyBlock[] };

export const privacyUpdated: L = { en: "14 October 2026", bn: "১৪ অক্টোবর ২০২৬" };

export const privacyIntro: L = {
  en: "This policy explains what personal data we collect when you use our website, why we collect it, who we share it with, and the choices you have.",
  bn: "আপনি আমাদের ওয়েবসাইট ব্যবহার করলে আমরা কোন ব্যক্তিগত তথ্য সংগ্রহ করি, কেন করি, কার সাথে শেয়ার করি এবং আপনার কী কী বিকল্প আছে — এই নীতিতে তা ব্যাখ্যা করা হয়েছে।",
};

export const privacyLead: L = {
  en: "We have written this policy in plain language and kept it specific to what this website actually does. It describes only this website. If you are a Ritorica customer, the handling of message data we process on your behalf is governed by your service agreement with us, not by this policy.",
  bn: "আমরা এই নীতি সহজ ভাষায় লিখেছি এবং এই ওয়েবসাইট আসলে যা করে শুধু সেটুকুই বলেছি। এটি কেবল এই ওয়েবসাইটের জন্য। আপনি Ritorica-র গ্রাহক হলে, আপনার পক্ষে আমরা যে মেসেজ ডেটা প্রসেস করি তা এই নীতি নয়, আমাদের সাথে আপনার সেবা চুক্তি অনুযায়ী পরিচালিত হয়।",
};

const email = site.email;

export const privacySections: PrivacySection[] = [
  {
    id: "who-we-are",
    h: { en: "Who we are", bn: "আমরা কারা" },
    blocks: [
      {
        type: "p",
        text: {
          en: "This website is operated by Ritorica, a business messaging provider connecting companies to their customers over SMS, WhatsApp, Viber, Telegram, push and email. Ritorica is responsible for the personal data described in this policy.",
          bn: "এই ওয়েবসাইট পরিচালনা করে Ritorica — একটি বিজনেস মেসেজিং সেবাদাতা, যা এসএমএস, হোয়াটসঅ্যাপ, ভাইবার, টেলিগ্রাম, পুশ ও ইমেইলের মাধ্যমে প্রতিষ্ঠানগুলোকে তাদের গ্রাহকদের সাথে যুক্ত করে। এই নীতিতে বর্ণিত ব্যক্তিগত তথ্যের দায়িত্ব Ritorica-র।",
        },
      },
      { type: "p", text: { en: "Our office:", bn: "আমাদের অফিস:" } },
      { type: "offices" },
      {
        type: "p",
        text: {
          en: `You can reach us about anything in this policy at ${email}.`,
          bn: `এই নীতির যেকোনো বিষয়ে আমাদের সাথে যোগাযোগ করুন: ${email}।`,
        },
      },
    ],
  },
  {
    id: "what-we-collect",
    h: { en: "What we collect", bn: "আমরা কী সংগ্রহ করি" },
    blocks: [
      { type: "h3", text: { en: "Information you give us", bn: "আপনি যে তথ্য দেন" } },
      {
        type: "p",
        text: {
          en: "We collect personal data only through the forms on this site. This is exactly what each one records:",
          bn: "আমরা শুধু এই সাইটের ফর্মের মাধ্যমে ব্যক্তিগত তথ্য সংগ্রহ করি। প্রতিটি ফর্ম ঠিক যা রেকর্ড করে:",
        },
      },
      {
        type: "table",
        head: [
          { en: "Form", bn: "ফর্ম" },
          { en: "What it records", bn: "যা রেকর্ড করে" },
        ],
        rows: [
          [
            { en: "Request a demo / Get proposal", bn: "ডেমোর অনুরোধ / প্রস্তাব নিন" },
            {
              en: "Your name, company name, work email, job title (optional), country, expected message volume (optional), the services you are interested in, your integration notes (optional), your message (optional), the fact that you agreed to this policy, and the date and time you submitted it.",
              bn: "আপনার নাম, প্রতিষ্ঠানের নাম, কাজের ইমেইল, পদবি (ঐচ্ছিক), দেশ, সম্ভাব্য মেসেজের পরিমাণ (ঐচ্ছিক), আগ্রহের সেবা, ইন্টিগ্রেশন সংক্রান্ত নোট (ঐচ্ছিক), আপনার বার্তা (ঐচ্ছিক), এই নীতিতে আপনার সম্মতি, এবং জমা দেওয়ার তারিখ ও সময়।",
            },
          ],
          [
            { en: "Contact us / Open ticket", bn: "যোগাযোগ / টিকিট খুলুন" },
            {
              en: "Your name, company name, work email, country, phone number (optional), the service your message is about, your message, the fact that you agreed to this policy, and the date and time you submitted it.",
              bn: "আপনার নাম, প্রতিষ্ঠানের নাম, কাজের ইমেইল, দেশ, ফোন নম্বর (ঐচ্ছিক), বার্তাটি কোন সেবা নিয়ে, আপনার বার্তা, এই নীতিতে আপনার সম্মতি, এবং জমা দেওয়ার তারিখ ও সময়।",
            },
          ],
        ],
      },
      { type: "h3", text: { en: "Information collected automatically", bn: "স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য" } },
      {
        type: "p",
        b: { en: "Visit statistics.", bn: "ভিজিটের পরিসংখ্যান।" },
        text: {
          en: "Our hosting provider records basic, aggregated statistics — which pages are visited, roughly where visitors are located, what device and browser they use, and how they arrived — so we can understand how the site is used.",
          bn: "সাইট কীভাবে ব্যবহার হচ্ছে বুঝতে আমাদের হোস্টিং সেবাদাতা মৌলিক ও সমষ্টিগত পরিসংখ্যান রাখে — কোন পেজ দেখা হচ্ছে, ভিজিটররা মোটামুটি কোথা থেকে আসছেন, কোন ডিভাইস ও ব্রাউজার ব্যবহার করছেন এবং কীভাবে সাইটে এসেছেন।",
        },
      },
      {
        type: "p",
        b: { en: "Your language choice.", bn: "আপনার ভাষার পছন্দ।" },
        text: {
          en: "Your browser remembers whether you chose English or Bangla. This stays on your device and is not sent to us.",
          bn: "আপনি ইংরেজি না বাংলা বেছে নিয়েছেন, তা আপনার ব্রাউজার মনে রাখে। এটি আপনার ডিভাইসেই থাকে, আমাদের কাছে পাঠানো হয় না।",
        },
      },
      { type: "h3", text: { en: "What we do not collect", bn: "আমরা যা সংগ্রহ করি না" } },
      {
        type: "p",
        b: { en: "The chat assistant stores nothing.", bn: "চ্যাট সহকারী কিছুই সংরক্ষণ করে না।" },
        text: {
          en: "The chat assistant on this site (\"Asif\") uses artificial intelligence to answer questions using only the information published on this website. To produce an answer, your question is sent to our AI service provider. We do not save your conversation — it disappears when you close or reload the page. Please do not type personal or confidential details into the chat.",
          bn: "এই সাইটের চ্যাট সহকারী (\"Asif\") কৃত্রিম বুদ্ধিমত্তা (AI) ব্যবহার করে, শুধু এই ওয়েবসাইটে প্রকাশিত তথ্য দিয়ে প্রশ্নের উত্তর দেয়। উত্তর তৈরির জন্য আপনার প্রশ্ন আমাদের AI সেবাদাতার কাছে পাঠানো হয়। আমরা আপনার কথোপকথন সংরক্ষণ করি না — পেজ বন্ধ বা রিলোড করলে তা মুছে যায়। অনুগ্রহ করে চ্যাটে ব্যক্তিগত বা গোপন তথ্য লিখবেন না।",
        },
      },
      {
        type: "p",
        b: { en: "No payment data.", bn: "কোনো পেমেন্ট তথ্য নয়।" },
        text: {
          en: "This website does not take payments, so we never receive card or bank details through it.",
          bn: "এই ওয়েবসাইটে কোনো পেমেন্ট নেওয়া হয় না, তাই এর মাধ্যমে আমরা কখনো কার্ড বা ব্যাংকের তথ্য পাই না।",
        },
      },
      {
        type: "p",
        b: { en: "No special category data.", bn: "কোনো বিশেষ শ্রেণির তথ্য নয়।" },
        text: {
          en: "We do not ask for, and do not want, data about health, beliefs, ethnicity or anything similar. Please do not include such details in a form message.",
          bn: "স্বাস্থ্য, বিশ্বাস, জাতিগত পরিচয় বা এ ধরনের কোনো তথ্য আমরা চাই না এবং নিতেও চাই না। অনুগ্রহ করে ফর্মের বার্তায় এমন তথ্য দেবেন না।",
        },
      },
      {
        type: "p",
        b: { en: "No advertising or cross-site tracking.", bn: "কোনো বিজ্ঞাপন বা ক্রস-সাইট ট্র্যাকিং নয়।" },
        text: {
          en: "We do not run advertising pixels on this site, and we do not build profiles of you across other websites.",
          bn: "এই সাইটে আমরা কোনো বিজ্ঞাপন পিক্সেল চালাই না, এবং অন্য ওয়েবসাইট জুড়ে আপনার কোনো প্রোফাইল তৈরি করি না।",
        },
      },
    ],
  },
  {
    id: "why-we-use-it",
    h: { en: "Why we use it", bn: "কেন ব্যবহার করি" },
    blocks: [
      {
        type: "p",
        text: {
          en: "We use your personal data only for the purposes below, and we always have a lawful reason for doing so.",
          bn: "আমরা আপনার ব্যক্তিগত তথ্য শুধু নিচের উদ্দেশ্যে ব্যবহার করি, এবং প্রতিটির পেছনে সবসময় একটি বৈধ কারণ থাকে।",
        },
      },
      {
        type: "table",
        head: [
          { en: "Purpose", bn: "উদ্দেশ্য" },
          { en: "Our lawful basis", bn: "আমাদের বৈধ ভিত্তি" },
        ],
        rows: [
          [
            { en: "Responding to your demo request, proposal request, sales enquiry or support ticket", bn: "আপনার ডেমো, প্রস্তাব, বিক্রয় সংক্রান্ত অনুসন্ধান বা সাপোর্ট টিকিটের উত্তর দেওয়া" },
            { en: "Your consent when you submit the form, and our legitimate interest in answering people who contact us", bn: "ফর্ম জমা দেওয়ার সময় আপনার সম্মতি, এবং যারা যোগাযোগ করেন তাদের উত্তর দেওয়ায় আমাদের বৈধ স্বার্থ" },
          ],
          [
            { en: "Answering the questions you type into the chat assistant", bn: "চ্যাট সহকারীতে লেখা আপনার প্রশ্নের উত্তর দেওয়া" },
            { en: "Your request — you asked the question", bn: "আপনার অনুরোধ — আপনি প্রশ্নটি করেছেন" },
          ],
          [
            { en: "Following up with you about our products after you contact us", bn: "যোগাযোগের পর আমাদের প্রোডাক্ট নিয়ে আপনার সাথে ফলো-আপ করা" },
            { en: "Our legitimate interest in marketing to business contacts, subject to your right to object at any time", bn: "ব্যবসায়িক যোগাযোগে মার্কেটিংয়ে আমাদের বৈধ স্বার্থ — আপনি যেকোনো সময় আপত্তি জানাতে পারেন" },
          ],
          [
            { en: "Understanding how the website is used, so we can improve it", bn: "ওয়েবসাইট কীভাবে ব্যবহার হয় তা বুঝে উন্নত করা" },
            { en: "Our legitimate interest in maintaining and improving our own website", bn: "নিজেদের ওয়েবসাইট রক্ষণাবেক্ষণ ও উন্নত করায় আমাদের বৈধ স্বার্থ" },
          ],
          [
            { en: "Keeping the site secure and preventing spam and abuse", bn: "সাইট নিরাপদ রাখা এবং স্প্যাম ও অপব্যবহার ঠেকানো" },
            { en: "Our legitimate interest in protecting our systems and our other visitors", bn: "আমাদের সিস্টেম ও অন্য ভিজিটরদের সুরক্ষায় আমাদের বৈধ স্বার্থ" },
          ],
          [
            { en: "Meeting a legal or regulatory obligation", bn: "আইনগত বা নিয়ন্ত্রক বাধ্যবাধকতা পূরণ" },
            { en: "Compliance with a legal obligation", bn: "আইনগত বাধ্যবাধকতা মেনে চলা" },
          ],
        ],
      },
      {
        type: "p",
        text: {
          en: "We do not sell your personal data, we do not rent or trade it, and we do not use it to make automated decisions about you.",
          bn: "আমরা আপনার ব্যক্তিগত তথ্য বিক্রি করি না, ভাড়া বা বিনিময় করি না, এবং আপনার ব্যাপারে স্বয়ংক্রিয় সিদ্ধান্ত নিতে এটি ব্যবহার করি না।",
        },
      },
    ],
  },
  {
    id: "who-we-share-it-with",
    h: { en: "Who we share it with", bn: "কার সাথে শেয়ার করি" },
    blocks: [
      {
        type: "p",
        text: {
          en: "We do not sell or rent personal data. We share it only with the service providers we need in order to run our business and this website — for example website hosting and our AI service provider for the chat assistant — and only for the purposes described in this policy. Each of them is required to protect your data and to use it only on our instructions. If you would like to know which providers we use, email us and we will tell you.",
          bn: "আমরা ব্যক্তিগত তথ্য বিক্রি বা ভাড়া দিই না। ব্যবসা ও এই ওয়েবসাইট চালাতে যে সেবাদাতাদের প্রয়োজন — যেমন ওয়েবসাইট হোস্টিং এবং চ্যাট সহকারীর AI সেবাদাতা — শুধু তাদের সাথে এবং শুধু এই নীতিতে বর্ণিত উদ্দেশ্যে শেয়ার করি। তাদের প্রত্যেককে আপনার তথ্য সুরক্ষিত রাখতে এবং শুধু আমাদের নির্দেশ অনুযায়ী ব্যবহার করতে হয়। আমরা কোন সেবাদাতা ব্যবহার করি জানতে চাইলে ইমেইল করুন, আমরা জানাব।",
        },
      },
      {
        type: "p",
        text: {
          en: "We may also disclose personal data where we are required to by law, or where it is necessary to establish, exercise or defend legal claims. If Ritorica is ever involved in a merger or acquisition, personal data may be transferred as part of that transaction, and we will tell you before it happens.",
          bn: "আইন অনুযায়ী প্রয়োজন হলে, অথবা আইনগত দাবি প্রতিষ্ঠা, প্রয়োগ বা প্রতিরক্ষার জন্য প্রয়োজন হলে আমরা ব্যক্তিগত তথ্য প্রকাশ করতে পারি। Ritorica কখনো একীভূতকরণ বা অধিগ্রহণে জড়িত হলে, সেই লেনদেনের অংশ হিসেবে ব্যক্তিগত তথ্য হস্তান্তর হতে পারে, এবং তা হওয়ার আগেই আমরা আপনাকে জানাব।",
        },
      },
    ],
  },
  {
    id: "international-transfers",
    h: { en: "International transfers", bn: "আন্তর্জাতিক স্থানান্তর" },
    blocks: [
      {
        type: "p",
        text: {
          en: "We operate from Bangladesh, and our service providers operate internationally. Your personal data may therefore be transferred to, stored in, or accessed from countries outside your own.",
          bn: "আমরা বাংলাদেশ থেকে কাজ করি, আর আমাদের সেবাদাতারা আন্তর্জাতিকভাবে কাজ করে। তাই আপনার ব্যক্তিগত তথ্য আপনার দেশের বাইরের দেশে স্থানান্তরিত, সংরক্ষিত বা সেখান থেকে দেখা হতে পারে।",
        },
      },
      {
        type: "p",
        text: {
          en: "Where that happens, we rely on appropriate safeguards for the transfer — such as contractual data protection commitments, or the provider's own approved transfer mechanism. If you would like to know which safeguard applies to a particular transfer, email us and we will tell you.",
          bn: "এমন হলে আমরা স্থানান্তরের জন্য উপযুক্ত সুরক্ষাব্যবস্থার ওপর নির্ভর করি — যেমন চুক্তিভিত্তিক তথ্য সুরক্ষার অঙ্গীকার, অথবা সেবাদাতার নিজস্ব অনুমোদিত স্থানান্তর পদ্ধতি। কোনো নির্দিষ্ট স্থানান্তরে কোন সুরক্ষাব্যবস্থা প্রযোজ্য জানতে চাইলে ইমেইল করুন, আমরা জানাব।",
        },
      },
    ],
  },
  {
    id: "how-long-we-keep-it",
    h: { en: "How long we keep it", bn: "কতদিন রাখি" },
    blocks: [
      { type: "p", text: { en: "We keep personal data only for as long as we actually need it.", bn: "আমরা ব্যক্তিগত তথ্য শুধু যতদিন সত্যিই প্রয়োজন ততদিন রাখি।" } },
      {
        type: "table",
        head: [
          { en: "What", bn: "কী" },
          { en: "How long", bn: "কতদিন" },
        ],
        rows: [
          [
            { en: "Demo, proposal and sales enquiries", bn: "ডেমো, প্রস্তাব ও বিক্রয় সংক্রান্ত অনুসন্ধান" },
            { en: "Up to 24 months after our last contact with you, then deleted", bn: "আপনার সাথে শেষ যোগাযোগের পর সর্বোচ্চ ২৪ মাস, তারপর মুছে ফেলা হয়" },
          ],
          [
            { en: "Contact messages and support tickets", bn: "যোগাযোগের বার্তা ও সাপোর্ট টিকিট" },
            { en: "Up to 24 months after our last contact with you, then deleted", bn: "আপনার সাথে শেষ যোগাযোগের পর সর্বোচ্চ ২৪ মাস, তারপর মুছে ফেলা হয়" },
          ],
          [
            { en: "Chat assistant conversations", bn: "চ্যাট সহকারীর কথোপকথন" },
            { en: "Not stored by us", bn: "আমরা সংরক্ষণ করি না" },
          ],
          [
            { en: "Server logs", bn: "সার্ভার লগ" },
            { en: "A short rolling period for security and troubleshooting", bn: "নিরাপত্তা ও সমস্যা সমাধানের জন্য অল্প সময়, নিয়মিত হালনাগাদ হয়" },
          ],
        ],
      },
      {
        type: "p",
        text: {
          en: "You can ask us to delete your data sooner than this at any time — see section 7.",
          bn: "আপনি যেকোনো সময় এর আগেই আপনার তথ্য মুছে ফেলতে বলতে পারেন — ৭ নম্বর অংশ দেখুন।",
        },
      },
    ],
  },
  {
    id: "your-rights",
    h: { en: "Your rights", bn: "আপনার অধিকার" },
    blocks: [
      {
        type: "p",
        text: {
          en: "Depending on where you live, you have some or all of the following rights over your personal data:",
          bn: "আপনি কোথায় থাকেন তার ওপর নির্ভর করে, আপনার ব্যক্তিগত তথ্যের ওপর নিচের কিছু বা সবগুলো অধিকার আপনার আছে:",
        },
      },
      {
        type: "list",
        items: [
          { b: { en: "Access", bn: "দেখার অধিকার" }, text: { en: "ask for a copy of the personal data we hold about you.", bn: "আপনার সম্পর্কে আমাদের কাছে থাকা ব্যক্তিগত তথ্যের কপি চাইতে পারেন।" } },
          { b: { en: "Correction", bn: "সংশোধন" }, text: { en: "have inaccurate or incomplete data corrected.", bn: "ভুল বা অসম্পূর্ণ তথ্য সংশোধন করাতে পারেন।" } },
          { b: { en: "Deletion", bn: "মুছে ফেলা" }, text: { en: "ask us to delete your data.", bn: "আপনার তথ্য মুছে ফেলতে বলতে পারেন।" } },
          { b: { en: "Objection", bn: "আপত্তি" }, text: { en: "object to us using your data for marketing. If you object to marketing, we will stop, with no questions asked.", bn: "মার্কেটিংয়ে আপনার তথ্য ব্যবহারে আপত্তি জানাতে পারেন। আপত্তি জানালে আমরা কোনো প্রশ্ন ছাড়াই বন্ধ করব।" } },
          { b: { en: "Restriction", bn: "সীমিতকরণ" }, text: { en: "ask us to limit how we use your data while a concern is resolved.", bn: "কোনো উদ্বেগের সমাধান হওয়া পর্যন্ত আপনার তথ্যের ব্যবহার সীমিত রাখতে বলতে পারেন।" } },
          { b: { en: "Portability", bn: "বহনযোগ্যতা" }, text: { en: "receive your data in a portable, machine-readable format.", bn: "আপনার তথ্য বহনযোগ্য, মেশিনে পড়া যায় এমন ফরম্যাটে পেতে পারেন।" } },
          { b: { en: "Withdraw consent", bn: "সম্মতি প্রত্যাহার" }, text: { en: "at any time, where we rely on your consent. Withdrawing it does not affect anything we did before you withdrew it.", bn: "যেখানে আমরা আপনার সম্মতির ওপর নির্ভর করি, সেখানে যেকোনো সময় প্রত্যাহার করতে পারেন। প্রত্যাহারের আগে আমরা যা করেছি তার ওপর এর প্রভাব পড়ে না।" } },
        ],
      },
      {
        type: "p",
        text: {
          en: `To exercise any of these, email ${email}. We will respond within 30 days. There is no charge. We may need to verify your identity first, so that we never disclose your data to someone else pretending to be you.`,
          bn: `এর যেকোনোটি প্রয়োগ করতে ${email}-এ ইমেইল করুন। আমরা ৩০ দিনের মধ্যে উত্তর দেব। কোনো খরচ নেই। আপনার পরিচয় যাচাই করার প্রয়োজন হতে পারে, যাতে আপনার ভান করে অন্য কেউ আপনার তথ্য না পায়।`,
        },
      },
      {
        type: "p",
        text: {
          en: "If you are unhappy with how we have handled your personal data, you have the right to complain to the data protection authority in your country. We would appreciate the chance to put things right first.",
          bn: "আমরা আপনার ব্যক্তিগত তথ্য যেভাবে সামলেছি তাতে আপনি অসন্তুষ্ট হলে, আপনার দেশের তথ্য সুরক্ষা কর্তৃপক্ষের কাছে অভিযোগ করার অধিকার আপনার আছে। তবে আগে আমাদের বিষয়টি ঠিক করার সুযোগ দিলে আমরা কৃতজ্ঞ থাকব।",
        },
      },
    ],
  },
  {
    id: "security",
    h: { en: "Security", bn: "নিরাপত্তা" },
    blocks: [
      { type: "p", text: { en: "We take reasonable technical and organisational measures to protect the data we hold:", bn: "আমাদের কাছে থাকা তথ্য সুরক্ষায় আমরা যুক্তিসঙ্গত কারিগরি ও সাংগঠনিক ব্যবস্থা নিই:" } },
      {
        type: "list",
        items: [
          { text: { en: "the entire site is served over an encrypted HTTPS connection;", bn: "পুরো সাইট এনক্রিপ্ট করা HTTPS সংযোগে চলে;" } },
          { text: { en: "form submissions can only be added through the website — visitors cannot read them back, and the records are accessible only to authorised Ritorica staff who need access;", bn: "ফর্মের তথ্য শুধু ওয়েবসাইট থেকে জমা দেওয়া যায় — ভিজিটররা তা আর দেখতে পারেন না, এবং রেকর্ডগুলো শুধু প্রয়োজনীয় অনুমতিপ্রাপ্ত Ritorica কর্মীরাই দেখতে পারেন;" } },
          { text: { en: "our infrastructure sits behind a content delivery network that filters malicious traffic.", bn: "আমাদের অবকাঠামো একটি কনটেন্ট ডেলিভারি নেটওয়ার্কের পেছনে থাকে, যা ক্ষতিকর ট্রাফিক ছেঁকে ফেলে।" } },
        ],
      },
      {
        type: "p",
        text: {
          en: "No system can be guaranteed completely secure. If we ever suffer a breach that puts your rights at risk, we will notify you and the relevant authority as the law requires.",
          bn: "কোনো সিস্টেমই সম্পূর্ণ নিরাপদ বলে নিশ্চয়তা দেওয়া যায় না। কখনো এমন কোনো তথ্য ফাঁস ঘটলে যা আপনার অধিকার ঝুঁকিতে ফেলে, আইন অনুযায়ী আমরা আপনাকে ও সংশ্লিষ্ট কর্তৃপক্ষকে জানাব।",
        },
      },
    ],
  },
  {
    id: "children",
    h: { en: "Children", bn: "শিশু" },
    blocks: [
      {
        type: "p",
        text: {
          en: "Ritorica sells to businesses. This site is not intended for children, and we do not knowingly collect personal data from anyone under 16. If you believe a child has given us their data, email us and we will delete it promptly.",
          bn: "Ritorica ব্যবসা প্রতিষ্ঠানের কাছে সেবা বিক্রি করে। এই সাইট শিশুদের জন্য নয়, এবং আমরা জেনেশুনে ১৬ বছরের কম বয়সী কারো ব্যক্তিগত তথ্য সংগ্রহ করি না। কোনো শিশু আমাদের তথ্য দিয়েছে বলে মনে হলে ইমেইল করুন, আমরা দ্রুত তা মুছে ফেলব।",
        },
      },
    ],
  },
  {
    id: "changes",
    h: { en: "Changes to this policy", bn: "এই নীতির পরিবর্তন" },
    blocks: [
      {
        type: "p",
        text: {
          en: "We may update this policy as our services or the law change. When we do, we will update the \"last updated\" date at the top of this page. If a change materially affects how we use your personal data, we will do more than that — we will make it clear on the site, and where we are required to, we will ask for your consent again.",
          bn: "আমাদের সেবা বা আইন বদলালে আমরা এই নীতি হালনাগাদ করতে পারি। তখন এই পেজের ওপরে \"সর্বশেষ হালনাগাদ\" তারিখ বদলে দেব। কোনো পরিবর্তন আপনার ব্যক্তিগত তথ্যের ব্যবহারে উল্লেখযোগ্য প্রভাব ফেললে আমরা এর চেয়ে বেশি করব — সাইটে তা স্পষ্টভাবে জানাব, এবং প্রয়োজন হলে আবার আপনার সম্মতি নেব।",
        },
      },
    ],
  },
  {
    id: "contact",
    h: { en: "How to contact us", bn: "কীভাবে যোগাযোগ করবেন" },
    blocks: [
      { type: "p", text: { en: "For any question about this policy, or to exercise any of the rights in section 7:", bn: "এই নীতি নিয়ে যেকোনো প্রশ্ন, বা ৭ নম্বর অংশের কোনো অধিকার প্রয়োগ করতে:" } },
      {
        type: "list",
        items: [
          { b: { en: "Email", bn: "ইমেইল" }, text: { en: email, bn: email } },
          { b: { en: "Post", bn: "ডাক" }, text: { en: `Ritorica, ${site.address.en}`, bn: `Ritorica, ${site.address.bn}` } },
        ],
      },
      {
        type: "p",
        text: {
          en: "Please write \"Privacy\" in the subject line so your message reaches the right people quickly.",
          bn: "অনুগ্রহ করে বিষয়ের ঘরে \"Privacy\" লিখুন, যাতে আপনার বার্তা দ্রুত সঠিক মানুষের কাছে পৌঁছায়।",
        },
      },
    ],
  },
];
