import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Guard, meta } from "@/components/guard";
import { ErrorState } from "@/components/states";
import { PortalHeading } from "@/components/dashboard-kit";
import { StatTile } from "@/components/person-tickets";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminCharts, useDashboardStats } from "./admin/dashboard";

export const Route = createFileRoute("/_app/analytics")({
  head: () => meta("Ticket Analytics", "Ticket trends, status, priority and department analytics."),
  component: () => <Guard perm="reports.view"><Analytics /></Guard>,
});

function Analytics() {
  const [days, setDays] = useState("30");
  const q = useDashboardStats(days);
  const s = q.data;
  return (
    <div className="mx-auto max-w-7xl">
      <PortalHeading
        eyebrow="Analytics"
        title="Ticket Analytics"
        description="Live ticket trends and distributions. For date-range exports and agent performance, see Reports."
        actions={
          <Tabs value={days} onValueChange={setDays}>
            <TabsList>
              {([["1", "Today"], ["7", "7 days"], ["30", "30 days"], ["90", "90 days"]] as const).map(([v, l]) => (
                <TabsTrigger key={v} value={v}>{l}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
      />
      {q.isError && <ErrorState onRetry={() => q.refetch()} />}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Total tickets" value={s?.total ?? (q.isLoading ? "…" : 0)} />
        <StatTile label="Created today" value={s?.today ?? (q.isLoading ? "…" : 0)} />
        <StatTile label="Last 7 days" value={s?.week ?? (q.isLoading ? "…" : 0)} />
        <StatTile label="Last 30 days" value={s?.month ?? (q.isLoading ? "…" : 0)} />
      </div>
      <AdminCharts stats={s} loading={q.isLoading} />
    </div>
  );
}
