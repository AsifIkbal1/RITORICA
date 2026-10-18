import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useDepartments } from "@/lib/lookups";
import { roleLabel, formatDuration } from "@/lib/constants";
import { Guard, meta } from "@/components/guard";
import { PageHeader, TableSkeleton, EmptyState } from "@/components/states";
import { StatTile } from "@/components/person-tickets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAgentsListFn } from "@/lib/tickets.functions";

export const Route = createFileRoute("/_app/agents/")({
  head: () => meta("Agents", "Support agents and their workload."),
  component: () => <Guard perm="agents.view"><Agents /></Guard>,
});

function Agents() {
  const deps = useDepartments();
  const q = useQuery({
    queryKey: ["agents-list"],
    queryFn: async () => {
      try {
        const local = await getAgentsListFn();
        if (local && local.length > 0) return local;
      } catch {}
      const { data: roles } = await supabase.from("user_roles").select("user_id, role").in("role", ["agent", "admin", "super_admin"]);
      const ids = [...new Set((roles ?? []).map((r) => r.user_id))];
      if (!ids.length) return [];
      const { data } = await supabase.from("profiles").select("*").in("id", ids).order("full_name");
      return (data ?? []).map((p) => ({ ...p, roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role) }));
    },
  });
  const depName = (id: string | null) => deps.data?.find((d) => d.id === id)?.name ?? "—";

  const rows = q.data ?? [];
  const totalAssigned = rows.reduce((acc, a) => acc + (a.assigned || 0), 0);
  const totalOpen = rows.reduce((acc, a) => acc + (a.open || 0), 0);
  const totalSolved = rows.reduce((acc, a) => acc + (a.solved || 0), 0);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Support agents"
        description="Staff members who handle tickets. Review assigned queues, first response times, and resolution speeds."
        actions={<Button asChild variant="outline"><Link to="/admin/users">Manage users</Link></Button>}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total staff" value={rows.length} />
        <StatTile label="Total assigned tickets" value={totalAssigned} />
        <StatTile label="Currently open" value={totalOpen} />
        <StatTile label="Total solved" value={totalSolved} />
      </div>

      <div className="overflow-hidden rounded-lg border bg-card shadow-card">
        {q.isLoading ? <TableSkeleton /> : !rows.length ? <div className="p-4"><EmptyState title="No agents yet" description="Promote a user to Support Agent from the Users page." /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr className="border-b">
                  {["Agent", "Department", "Role", "Assigned", "Open", "Solved", "Avg 1st response", "Avg resolution", "Status", "Last login"].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left font-medium first:pl-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="py-2.5 pl-4 pr-3 font-medium">
                      <Link to="/agents/$id" params={{ id: a.id }} className="hover:text-primary hover:underline">
                        {a.full_name || a.username}
                      </Link>
                      <div className="text-xs text-muted-foreground font-normal">{a.email}</div>
                    </td>
                    <td className="px-3 py-2.5">{depName(a.department_id)}</td>
                    <td className="px-3 py-2.5">{a.roles?.map((r: string) => <Badge key={r} variant="outline" className="mr-1">{roleLabel(r)}</Badge>)}</td>
                    <td className="px-3 py-2.5 font-semibold tabular-nums">{a.assigned ?? 0}</td>
                    <td className="px-3 py-2.5">
                      <Badge variant={(a.open ?? 0) > 0 ? "default" : "outline"} className="tabular-nums">
                        {a.open ?? 0}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                      {a.solved ?? 0}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs tabular-nums text-muted-foreground">
                      {formatDuration(a.avg_first_response_ms)}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs tabular-nums text-muted-foreground">
                      {formatDuration(a.avg_resolution_ms)}
                    </td>
                    <td className="px-3 py-2.5"><Badge variant={a.is_active ? "secondary" : "destructive"}>{a.is_active ? "Active" : "Disabled"}</Badge></td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{a.last_login_at ? formatDistanceToNow(new Date(a.last_login_at), { addSuffix: true }) : "Never"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
