import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SupportDesk — Customer Support Helpdesk" },
      { name: "description", content: "SupportDesk helps customers submit tickets and support teams resolve them fast." },
      { property: "og:title", content: "SupportDesk — Customer Support Helpdesk" },
      { property: "og:description", content: "SupportDesk helps customers submit tickets and support teams resolve them fast." },
    ],
  }),
  component: Index,
});

function Index() {
  const { session, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading) nav({ to: session ? "/dashboard" : "/login", replace: true });
  }, [loading, session, nav]);
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
