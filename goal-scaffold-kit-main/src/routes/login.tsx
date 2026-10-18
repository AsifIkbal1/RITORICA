import { createFileRoute } from "@tanstack/react-router";
import { SignInForm } from "@/components/sign-in-form";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Ritorica Support" },
      { name: "description", content: "Sign in to Ritorica Support with the username and password from your administrator." },
      { property: "og:title", content: "Sign in — Ritorica Support" },
      { property: "og:description", content: "Sign in to Ritorica Support with the username and password from your administrator." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <SignInForm portal="user" />,
});
