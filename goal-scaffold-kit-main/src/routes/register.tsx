import { createFileRoute, redirect } from "@tanstack/react-router";

// Self sign-up is turned off: administrators create every account.
export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    throw redirect({ to: "/login" });
  },
});
