import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { STATUSES, PRIORITIES, formatDuration } from "@/lib/constants";
import { Guard, meta } from "@/components/guard";
import { PageHeader, ErrorState } from "@/components/states";
import { StatTile } from "@/components/person-tickets";
import { DonutChart } from "@/components/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/reports")({
  head: () => meta("Reports", "Ticket volume, resolution and performance reports."),
  component: () => <Guard perm="reports.view"><Reports /></Guard>,
});

type R = {
  total: number; resolved: number; avg_first_response_ms: number | null; avg_resolution_ms: number | null;
  volume: { period: string; created: number; resolved: number }[];
  by_status: Record<string, number>; by_priority: Record<string, number>;
  by_department: { name: string; count: number; solved: number }[];
  agents: { name: string; assigned: number; solved: number; open: number; reopened: number; avg_first_response_ms: number | null; avg_resolution_ms: number | null }[];
  customers: { name: string; email: string; count: number }[];
};

import { getReportStatsFn } from "@/lib/tickets.functions";

const iso = (d: Date) => d.toISOString().slice(0, 10);

function Reports() {
  const [from, setFrom] = useState(iso(new Date(Date.now() - 30 * 864e5)));
  const [to, setTo] = useState(iso(new Date()));
  const [bucket, setBucket] = useState("day");
  const q = useQuery({
    queryKey: ["reports", from, to, bucket],
    queryFn: async () => {
      try {
        const stats = await getReportStatsFn({ data: { from, to, bucket } });
        if (stats) return stats as unknown as R;
      } catch {}
      const end = new Date(to); end.setDate(end.getDate() + 1);
      const { data, error } = await supabase.rpc("report_stats", { _from: new Date(from).toISOString(), _to: end.toISOString(), _bucket: bucket });
      if (error) throw error;
      return data as unknown as R;
    },
  });
  const r = q.data;
  const box = (title: string, body: React.ReactNode, cls = "") => (
    <Card className={`shadow-card ${cls}`}><CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader><CardContent>{q.isLoading ? <Skeleton className="h-56" /> : body}</CardContent></Card>
  );
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Reports"
        description="All figures are calculated from real ticket data."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 w-40 bg-card" aria-label="From" />
            <span className="text-xs text-muted-foreground">to</span>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-9 w-40 bg-card" aria-label="To" />
            <Select value={bucket} onValueChange={setBucket}>
              <SelectTrigger className="h-9 w-32 bg-card"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="day">Daily</SelectItem><SelectItem value="week">Weekly</SelectItem><SelectItem value="month">Monthly</SelectItem></SelectContent>
            </Select>
          </div>
        }
      />
      {q.isError && <ErrorState onRetry={() => q.refetch()} />}
      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Tickets in range" value={r?.total ?? "…"} />
        <StatTile label="Resolved" value={r?.resolved ?? "…"} />
        <StatTile label="Avg first response" value={r ? formatDuration(r.avg_first_response_ms) : "…"} />
        <StatTile label="Avg resolution time" value={r ? formatDuration(r.avg_resolution_ms) : "…"} />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {box("Ticket volume & resolution trend", (
          <div className="h-64"><ResponsiveContainer>
            <LineChart data={(r?.volume ?? []).map((v) => ({ ...v, label: format(new Date(v.period), bucket === "month" ? "MMM yyyy" : "MMM d") }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} width={28} />
              <Tooltip /><Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="created" name="Created" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="resolved" name="Resolved" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer></div>
        ), "lg:col-span-2")}
        {box("Status distribution", (
          <div className="space-y-3">
            <div className="h-36" aria-label="Tickets over time">
              <ResponsiveContainer>
                <LineChart data={(r?.volume ?? []).map((v) => ({ ...v, label: format(new Date(v.period), bucket === "month" ? "MMM yyyy" : "MMM d") }))} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" fontSize={10} tickLine={false} axisLine={false} minTickGap={16} />
                  <YAxis allowDecimals={false} fontSize={10} tickLine={false} axisLine={false} width={24} />
                  <Tooltip />
                  <Line type="monotone" dataKey="created" name="Tickets" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="resolved" name="Resolved" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="h-52 border-t pt-3"><DonutChart data={STATUSES.map((s) => ({ name: s.label, value: r?.by_status[s.value] ?? 0, color: s.color }))} /></div>
          </div>
        ), "lg:row-span-2")}
        {box("Priority distribution", (
          <div className="h-56"><ResponsiveContainer>
            <BarChart data={PRIORITIES.map((p) => ({ name: p.label, value: r?.by_priority[p.value] ?? 0 }))}>
              <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} /><YAxis allowDecimals={false} fontSize={11} width={28} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "var(--muted)" }} />
              <Bar dataKey="value" name="Tickets" radius={[4, 4, 0, 0]}>{PRIORITIES.map((p) => <Cell key={p.value} fill={p.color} />)}</Bar>
            </BarChart>
          </ResponsiveContainer></div>
        ))}
        {box("Department performance", (
          <div className="h-56"><ResponsiveContainer>
            <BarChart data={r?.by_department ?? []} layout="vertical">
              <XAxis type="number" allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" width={110} fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "var(--muted)" }} /><Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" name="Total" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="solved" name="Solved/Closed" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer></div>
        ))}
        {box("Top customers by ticket volume", !r?.customers.length ? <p className="py-8 text-center text-xs text-muted-foreground">No data in range</p> : (
          <ul className="divide-y text-sm">{r.customers.map((c) => (
            <li key={c.email} className="flex justify-between py-2"><span className="truncate">{c.name}<span className="ml-2 text-xs text-muted-foreground">{c.email}</span></span><span className="font-medium tabular-nums">{c.count}</span></li>
          ))}</ul>
        ))}
        {box("Agent performance", !r?.agents.length ? <p className="py-8 text-center text-xs text-muted-foreground">No assigned tickets in range</p> : (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground"><tr className="border-b">{["Agent", "Assigned", "Open", "Solved", "Reopened", "Avg 1st response", "Avg resolution"].map((h) => <th key={h} className="py-2 pr-3 text-left font-medium">{h}</th>)}</tr></thead>
            <tbody>{r.agents.map((a) => (
              <tr key={a.name} className="border-b last:border-0">
                <td className="py-2 pr-3 font-medium">{a.name}</td><td className="pr-3 tabular-nums">{a.assigned}</td><td className="pr-3 tabular-nums">{a.open}</td>
                <td className="pr-3 tabular-nums">{a.solved}</td><td className="pr-3 tabular-nums">{a.reopened}</td>
                <td className="pr-3 tabular-nums">{formatDuration(a.avg_first_response_ms)}</td><td className="pr-3 tabular-nums">{formatDuration(a.avg_resolution_ms)}</td>
              </tr>
            ))}</tbody>
          </table></div>
        ), "lg:col-span-3")}
      </div>
    </div>
  );
}
