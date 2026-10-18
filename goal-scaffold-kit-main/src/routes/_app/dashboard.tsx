import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth, PORTALS } from "@/lib/auth";
import { meta } from "@/components/guard";

// Role router: everyone lands here after sign-in and is sent to their own portal's dashboard.
export const Route = createFileRoute("/_app/dashboard")({
  head: () => meta("Dashboard", "Your SupportDesk dashboard."),
  component: DashboardRedirect,
});

function DashboardRedirect() {
  const { portal } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    nav({ to: PORTALS[portal].home, replace: true });
  }, [portal, nav]);
  return (
    <div className="flex justify-center py-24">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
