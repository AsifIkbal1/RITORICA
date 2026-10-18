import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/refund-policy")({
  head: () => seo("Refund Policy", "Draft refund policy for Ritorica SMS and messaging services: balance, refunds and how to request one.", "/refund-policy"),
  component: () => (
    <LegalPage
      title={{ en: "Refund Policy", bn: "রিফান্ড নীতি" }}
      updated="[DATE]"
      sections={[
        { h: { en: "Scope", bn: "পরিধি" }, p: { en: "This policy applies to SMS balance and messaging packages purchased from Ritorica Information Technology Bangladesh Limited.", bn: "এই নীতি Ritorica Information Technology Bangladesh Limited থেকে কেনা এসএমএস ব্যালান্স ও মেসেজিং প্যাকেজের ক্ষেত্রে প্রযোজ্য।" } },
        { h: { en: "Used balance", bn: "ব্যবহৃত ব্যালান্স" }, p: { en: "[STATE WHETHER BALANCE ALREADY USED FOR SENT MESSAGES IS REFUNDABLE].", bn: "[পাঠানো মেসেজে ইতিমধ্যে ব্যবহৃত ব্যালান্স ফেরতযোগ্য কিনা লিখুন]।" } },
        { h: { en: "Unused balance", bn: "অব্যবহৃত ব্যালান্স" }, p: { en: "[CONDITIONS AND TIME LIMIT FOR REFUNDING UNUSED BALANCE].", bn: "[অব্যবহৃত ব্যালান্স ফেরতের শর্ত ও সময়সীমা]।" } },
        { h: { en: "How to request a refund", bn: "রিফান্ডের অনুরোধ কীভাবে করবেন" }, p: { en: "Open a support ticket or email us with your account login, payment reference and reason. [PROCESSING TIME AND PAYMENT METHOD].", bn: "আপনার অ্যাকাউন্ট লগইন, পেমেন্ট রেফারেন্স ও কারণসহ সাপোর্ট টিকিট খুলুন বা ইমেইল করুন। [প্রক্রিয়ার সময় ও পেমেন্ট পদ্ধতি]।" } },
        { h: { en: "Non-refundable cases", bn: "যেসব ক্ষেত্রে রিফান্ড হয় না" }, p: { en: "[E.G. ACCOUNTS SUSPENDED FOR BREAKING BTRC GUIDELINES OR THE TERMS OF SERVICE].", bn: "[যেমন BTRC নির্দেশনা বা সেবার শর্ত ভঙ্গের কারণে স্থগিত অ্যাকাউন্ট]।" } },
      ]}
    />
  ),
});
