import { createFileRoute } from "@tanstack/react-router";
import { meta } from "@/components/guard";
import { PortalGate } from "@/components/portal-gate";
import { PageHeader } from "@/components/states";
import { SecurityCard } from "@/components/security-card";

export const Route = createFileRoute("/_app/admin/security")({
  head: () => meta("Sign-in Security", "Email service status and recent sign-in and email events."),
  component: () => (
    <PortalGate portal="admin">
      <div className="mx-auto max-w-5xl">
        <PageHeader title="Sign-in Security" description="Email service status and the latest sign-in, setup and email events." />
        <SecurityCard limit={30} />
      </div>
    </PortalGate>
  ),
});
