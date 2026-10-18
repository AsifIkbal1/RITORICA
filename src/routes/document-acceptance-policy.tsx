import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/document-acceptance-policy")({
  head: () => seo("Document Acceptance Policy", "Draft policy describing the documents Ritorica accepts for account opening and sender ID (masking) registration.", "/document-acceptance-policy"),
  component: () => (
    <LegalPage
      title={{ en: "Document Acceptance Policy", bn: "ডকুমেন্ট গ্রহণ নীতি" }}
      updated="[DATE]"
      sections={[
        { h: { en: "Purpose", bn: "উদ্দেশ্য" }, p: { en: "This policy explains which documents we accept to open an account and to register a sender ID (masking), in line with BTRC requirements.", bn: "BTRC-র শর্ত অনুযায়ী অ্যাকাউন্ট খোলা ও সেন্ডার আইডি (মাস্কিং) নিবন্ধনের জন্য আমরা কোন ডকুমেন্ট গ্রহণ করি, এই নীতিতে তা ব্যাখ্যা করা হয়েছে।" } },
        { h: { en: "Business documents", bn: "ব্যবসায়িক ডকুমেন্ট" }, p: { en: "[LIST, E.G. TRADE LICENSE, TIN / BIN CERTIFICATE, INCORPORATION CERTIFICATE].", bn: "[তালিকা দিন, যেমন ট্রেড লাইসেন্স, TIN / BIN সনদ, নিবন্ধন সনদ]।" } },
        { h: { en: "Identity documents", bn: "পরিচয়পত্র" }, p: { en: "[LIST, E.G. NID OR PASSPORT OF THE AUTHORISED PERSON].", bn: "[তালিকা দিন, যেমন অনুমোদিত ব্যক্তির এনআইডি বা পাসপোর্ট]।" } },
        { h: { en: "Sender ID (masking) registration", bn: "সেন্ডার আইডি (মাস্কিং) নিবন্ধন" }, p: { en: "[REQUIRED LETTERS OR FORMS FOR THE BRAND NAME USED AS SENDER].", bn: "[প্রেরক হিসেবে ব্যবহৃত ব্র্যান্ড নামের জন্য প্রয়োজনীয় চিঠি বা ফর্ম]।" } },
        { h: { en: "Format and verification", bn: "ফরম্যাট ও যাচাই" }, p: { en: "[ACCEPTED FILE FORMATS, CLARITY REQUIREMENTS AND HOW LONG VERIFICATION TAKES].", bn: "[গ্রহণযোগ্য ফাইল ফরম্যাট, স্পষ্টতার শর্ত ও যাচাইয়ে কত সময় লাগে]।" } },
      ]}
    />
  ),
});
