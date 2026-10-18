import type { L } from "@/i18n/language";

/** Home-page interactive OTP demo (pretend only — nothing is sent or collected). */
export const otpDemo = {
  title: { en: "Try a demo OTP", bn: "ডেমো OTP চেষ্টা করুন" } as L,
  text: {
    en: "Press the button to watch a pretend one-time code being sent, received and verified.",
    bn: "বাটন চাপুন — একটি কাল্পনিক ওয়ান-টাইম কোড পাঠানো, পৌঁছানো ও ভেরিফাই হওয়া দেখুন।",
  } as L,
  start: { en: "Send demo OTP", bn: "ডেমো OTP পাঠান" } as L,
  sending: { en: "Sending…", bn: "পাঠানো হচ্ছে…" } as L,
  received: { en: "Code received — press Verify", bn: "কোড পৌঁছেছে — Verify চাপুন" } as L,
  verify: { en: "Verify", bn: "Verify" } as L,
  verifying: { en: "Checking…", bn: "যাচাই হচ্ছে…" } as L,
  success: { en: "Verified successfully", bn: "সফলভাবে ভেরিফাইড" } as L,
  again: { en: "Try again", bn: "আবার চেষ্টা করুন" } as L,
  idle: { en: "Waiting for a code", bn: "কোডের অপেক্ষায়" } as L,
  sampleNumber: "+880 1•••-•••••",
  sender: { en: "Demo", bn: "Demo" } as L,
  message: { en: "is your demo code. Do not share it.", bn: "আপনার ডেমো কোড। কাউকে জানাবেন না।" } as L,
  notice: {
    en: "Demo only — no real SMS is sent and no personal data is collected.",
    bn: "শুধু ডেমো — কোনো আসল SMS পাঠানো হয় না এবং কোনো ব্যক্তিগত তথ্য নেওয়া হয় না।",
  } as L,
};

/** Developer block: app ↔ Ritorica API ↔ messaging network illustration. */
export const apiConnection = {
  title: { en: "How your app talks to Ritorica", bn: "আপনার অ্যাপ কীভাবে Ritorica-র সাথে কথা বলে" } as L,
  nodes: [
    { en: "Your application", bn: "আপনার অ্যাপ্লিকেশন" },
    { en: "Ritorica API", bn: "Ritorica API" },
    { en: "Messaging network", bn: "মেসেজিং নেটওয়ার্ক" },
  ] as L[],
  request: { en: "Request", bn: "রিকোয়েস্ট" } as L,
  report: { en: "Delivery report", bn: "ডেলিভারি রিপোর্ট" } as L,
  caption: {
    en: "Visual illustration only — not live API traffic.",
    bn: "শুধু চিত্রণ — এটি আসল API ট্রাফিক নয়।",
  } as L,
};
