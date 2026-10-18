import { createFileRoute, redirect } from "@tanstack/react-router";

// Customer portal alias: the shared ticket pages already scope data to the signed-in customer.
export const Route = createFileRoute("/_app/customer/tickets/")({
  beforeLoad: () => {
    throw redirect({ to: "/tickets" });
  },
});
