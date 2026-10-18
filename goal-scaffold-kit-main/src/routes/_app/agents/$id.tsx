import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDuration } from "@/lib/constants";
import { Guard, meta } from "@/components/guard";
import { EmptyState, ErrorState } from "@/components/states";
import { MiniTicketTable, StatTile } from "@/components/person-tickets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_app/agents/$id")({
  head: () => meta("Agent", "Agent profile and workload."),
  component: () => <Guard perm="agents.view"><Agent /></Guard>,
});

import { getAgentDetailsFn } from "@/lib/tickets.functions";

function Agent() {
  const { id } = Route.useParams();
  const q = useQuery({
    queryKey: ["agent", id],
    queryFn: async () => {
      try {
        const local = await getAgentDetailsFn({ data: { id } });
        if (local?.profile) return local;
      } catch {}
      const [p, t, a] = await Promise.all([
        supabase.from("profiles").select("*, department:departments(name)").eq("id", id).maybeSingle(),
        supabase.from("tickets").select("id, ticket_number, subject, status, priority, created_at, reopened_at").eq("assigned_agent_id", id).order("created_at", { ascending: false }),
        supabase.from("ticket_activity").select("id, description, created_at, ticket_id").eq("user_id", id).order("created_at", { ascending: false }).limit(20),
      ]);
      if (p.error) throw p.error;
      return { profile: p.data, tickets: t.data ?? [], activity: a.data ?? [] };
    },
  });
  if (q.isLoading) return <Skeleton className="mx-auto h-96 max-w-6xl" />;
  if (q.isError) return <ErrorState onRetry={() => q.refetch()} />;
  if (!q.data?.profile) return <EmptyState title="Agent not found" />;
  const { profile: p, tickets, activity } = q.data;
  const open = tickets.filter((t) => !["solved", "closed"].includes(t.status));
  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/agents" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Agents</Link>
      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <Card className="h-fit shadow-card">
          <CardHeader><CardTitle>{p.full_name}</CardTitle><p className="text-xs text-muted-foreground">{p.department?.name ?? "No department"}</p></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Mail className="size-4" /> {p.email}</div>
            <div className="flex items-center gap-2"><Phone className="size-4" /> {p.phone ?? "—"}</div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <StatTile label="Assigned" value={tickets.length} />
            <StatTile label="Open" value={open.length} />
            <StatTile label="Solved" value={tickets.filter((t) => t.status === "solved" || t.status === "closed").length} />
            <StatTile label="Avg 1st response" value={formatDuration(q.data.stats?.avg_first_response_ms)} />
            <StatTile label="Avg resolution" value={formatDuration(q.data.stats?.avg_resolution_ms)} />
          </div>
          <h2 className="text-sm font-semibold">Assigned tickets</h2>
          <MiniTicketTable rows={tickets} />
          <h2 className="text-sm font-semibold">Recent activity</h2>
          {!activity.length ? <EmptyState title="No activity yet" /> : (
            <ul className="divide-y rounded-lg border bg-card">
              {activity.map((a) => (
                <li key={a.id} className="flex justify-between gap-3 px-4 py-2.5 text-sm">
                  <Link to="/tickets/$id" params={{ id: a.ticket_id }} className="hover:text-primary">{a.description}</Link>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">{formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
