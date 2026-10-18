import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth, PORTALS, type Portal } from "@/lib/auth";

/** Sends users to the dashboard of their own portal. Cosmetic routing only — RLS protects the data. */
export function PortalGate({ portal, children }: { portal: Portal; children: ReactNode }) {
  const auth = useAuth();
  const nav = useNavigate();
  const wrong = auth.portal !== portal;
  useEffect(() => {
    if (wrong) nav({ to: PORTALS[auth.portal].home, replace: true });
  }, [wrong, auth.portal, nav]);
  if (wrong)
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  return <>{children}</>;
}
