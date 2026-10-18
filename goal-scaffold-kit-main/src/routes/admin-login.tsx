import { createFileRoute } from "@tanstack/react-router";
import { SignInForm } from "@/components/sign-in-form";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "Admin sign in — Ritorica Support" },
      { name: "description", content: "Administrator sign-in for Ritorica Support with an @ritorica.com.bd address." },
      { property: "og:title", content: "Admin sign in — Ritorica Support" },
      { property: "og:description", content: "Administrator sign-in for Ritorica Support with an @ritorica.com.bd address." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <SignInForm portal="admin" />,
});
