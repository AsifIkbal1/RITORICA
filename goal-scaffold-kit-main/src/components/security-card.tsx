import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { MailCheck, MailWarning, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { emailServiceStatus } from "@/lib/setup.functions";
import { getSecurityLogsRecentFn } from "@/lib/activity-logs.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Meta = { status?: string; username?: string; error?: string };

/** Admin security page: email service status + the latest security / email events. */
export function SecurityCard({ limit = 6 }: { limit?: number }) {
  const statusFn = useServerFn(emailServiceStatus);
  const status = useQuery({ queryKey: ["email-service-status"], queryFn: () => statusFn() });
  const events = useQuery({
    queryKey: ["security-events-recent", limit],
    refetchInterval: 5000,
    queryFn: async () => {
      try {
        const local = await getSecurityLogsRecentFn({ data: { limit } });
        if (local && local.length > 0) return local;
      } catch {}

      try {
        const { data, error } = await supabase.from("activity_logs").select("id, action, description, metadata, created_at")
          .eq("entity_type", "auth").order("created_at", { ascending: false }).limit(limit);
        if (!error && data?.length) return data;
      } catch {}

      try {
        const local = await getSecurityLogsRecentFn({ data: { limit } });
        return local || [];
      } catch {}

      return [];
    },
  });
  const ok = status.data?.configured;
  return (
    <Card className="mb-4 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm"><ShieldCheck className="size-4 text-primary" /> Sign-in security & email</CardTitle>
        <Button size="sm" variant="outline" asChild><Link to="/activity-logs" search={{ tab: "security" }}>Open audit log</Link></Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {status.isLoading ? null : ok ? (
          <p className="flex items-center gap-2 text-sm"><MailCheck className="size-4 text-online" /> Email service connected ({status.data?.provider}). Codes and alerts are being sent.</p>
        ) : (
          <p className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm">
            <MailWarning className="mt-0.5 size-4 shrink-0 text-destructive" />
            <span>Email service is not connected. New users can't verify their company email, and reset codes and login alerts can't be sent until it is.</span>
          </p>
        )}
        <ul className="divide-y rounded-md border text-sm">
          {(events.data ?? []).map((e) => {
            const m = (e.metadata ?? {}) as Meta;
            return (
              <li key={e.id} className="flex items-center gap-3 px-3 py-2">
                <span className="w-28 shrink-0 text-xs text-muted-foreground">{format(new Date(e.created_at), "MMM d, HH:mm")}</span>
                <span className="min-w-0 flex-1 truncate">{e.description}{m.username ? ` · ${m.username}` : ""}{m.error ? ` — ${m.error}` : ""}</span>
                <Badge variant={m.status === "failure" ? "destructive" : "secondary"} className="text-[11px]">{m.status === "failure" ? "Failed" : "OK"}</Badge>
              </li>
            );
          })}
          {!events.data?.length && <li className="px-3 py-2 text-xs text-muted-foreground">No sign-in or email events yet.</li>}
        </ul>
      </CardContent>
    </Card>
  );
}
