import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/customer/tickets/new")({
  beforeLoad: () => {
    throw redirect({ to: "/tickets/new" });
  },
});
