import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPolicyView } from "@/components/site/PrivacyPolicyView";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    seo(
      "Privacy Policy",
      "What personal data the Ritorica website collects through its forms and chat assistant, why, who we share it with, how long we keep it and your rights.",
      "/privacy",
    ),
  component: PrivacyPolicyView,
});
