import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/customer/tickets/$id")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/tickets/$id", params: { id: params.id } });
  },
});
