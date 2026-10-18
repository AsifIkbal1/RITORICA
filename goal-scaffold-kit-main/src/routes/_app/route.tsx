import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Loader2, Ban } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const { session, loading, profile, signOut, portal } = useAuth();
  const nav = useNavigate();
  const isAdminPath = typeof window !== "undefined" && (window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/_app/admin"));
  const lastPortal = useRef(isAdminPath ? "admin" : portal);
  if (session && profile) lastPortal.current = portal;

  useEffect(() => {
    const isCurrentAdmin = typeof window !== "undefined" && (window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/_app/admin"));
    const loginTarget = isCurrentAdmin || lastPortal.current === "admin" ? "/admin-login" : "/login";

    if (!loading && !session) {
      nav({ to: loginTarget, replace: true });
    }
    // Session exists but the profile could not be loaded (expired/revoked session,
    // deleted account): sign out and go back to sign-in instead of spinning forever.
    if (!loading && session && !profile) {
      void signOut();
      nav({ to: loginTarget, replace: true });
    }
    if (!loading && session && profile?.must_change_password) {
      nav({ to: "/account-setup", replace: true });
    }
  }, [loading, session, profile, nav, signOut]);

  if (loading || !session || !profile)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );

  if (!profile.is_active)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
        <Ban className="size-8 text-destructive" />
        <h1 className="text-lg font-semibold">Your account is disabled</h1>
        <p className="text-sm text-muted-foreground">Please contact an administrator.</p>
        <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
      </div>
    );

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
