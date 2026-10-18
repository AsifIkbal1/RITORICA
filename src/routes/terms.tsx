import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { terms, termsCompany, termsUpdated } from "@/content/terms";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    seo(
      "Terms & Conditions",
      "Ritorica SMS service terms: minimum monthly traffic, prepaid payment, offer validity, sender ID approval, VAT, billing and BTRC compliance.",
      "/terms",
    ),
  component: () => (
    <LegalPage
      title={{ en: "Terms & Conditions", bn: "শর্তাবলি" }}
      subtitle={{ en: termsCompany, bn: termsCompany }}
      updated={termsUpdated}
      draft={false}
      sections={terms}
    />
  ),
});
