import type { L } from "@/i18n/language";

/** Home-page "how an OTP travels" animation: copy for each stage, in order. */
export const otpJourney = {
  eyebrow: { en: "See it in action", bn: "চোখের সামনে দেখুন" } as L,
  title: { en: "How an OTP travels through Ritorica", bn: "একটি OTP কীভাবে Ritorica হয়ে পৌঁছায়" } as L,
  intro: {
    en: "From your system to your customer's phone — follow one verification code on its way.",
    bn: "আপনার সিস্টেম থেকে গ্রাহকের ফোন পর্যন্ত — একটি ভেরিফিকেশন কোডের পথ দেখুন।",
  } as L,
  stations: [
    { en: "Business", bn: "ব্যবসা" },
    { en: "Ritorica", bn: "Ritorica" },
    { en: "Operator", bn: "অপারেটর" },
    { en: "Customer", bn: "গ্রাহক" },
  ] as L[],
  steps: [
    {
      title: { en: "Your business sends an OTP", bn: "আপনার প্রতিষ্ঠান OTP পাঠায়" },
      text: { en: "A bank or app requests a one-time code through the Ritorica API.", bn: "ব্যাংক বা অ্যাপ Ritorica API দিয়ে একটি ওয়ান-টাইম কোড পাঠানোর অনুরোধ করে।" },
    },
    {
      title: { en: "Ritorica receives and routes it", bn: "Ritorica গ্রহণ করে রাউট করে" },
      text: { en: "The messaging platform checks the request and selects the delivery route.", bn: "মেসেজিং প্ল্যাটফর্ম অনুরোধটি যাচাই করে ডেলিভারির পথ বেছে নেয়।" },
    },
    {
      title: { en: "The mobile operator delivers", bn: "মোবাইল অপারেটর পৌঁছে দেয়" },
      text: { en: "The message is handed to the customer's mobile network operator.", bn: "মেসেজটি গ্রাহকের মোবাইল নেটওয়ার্ক অপারেটরের কাছে যায়।" },
    },
    {
      title: { en: "The OTP reaches the phone", bn: "OTP ফোনে পৌঁছায়" },
      text: { en: "The customer sees the code as an SMS notification.", bn: "গ্রাহক কোডটি SMS নোটিফিকেশন হিসেবে দেখেন।" },
    },
    {
      title: { en: "Verified", bn: "ভেরিফাইড" },
      text: { en: "The customer enters the code and the login or payment is confirmed.", bn: "গ্রাহক কোডটি দেন, লগইন বা পেমেন্ট নিশ্চিত হয়।" },
    },
  ] as { title: L; text: L }[],
  phone: {
    sender: { en: "YourBank", bn: "YourBank" } as L,
    now: { en: "now", bn: "এখন" } as L,
    message: { en: "is your verification code. Do not share it with anyone.", bn: "আপনার ভেরিফিকেশন কোড। কাউকে জানাবেন না।" } as L,
    enter: { en: "Enter the code", bn: "কোডটি লিখুন" } as L,
    verified: { en: "Verified", bn: "ভেরিফাইড" } as L,
    waiting: { en: "Waiting for code…", bn: "কোডের অপেক্ষায়…" } as L,
    illustrative: { en: "Illustration — sample code", bn: "উদাহরণ — নমুনা কোড" } as L,
  },
  code: "481923",
};
