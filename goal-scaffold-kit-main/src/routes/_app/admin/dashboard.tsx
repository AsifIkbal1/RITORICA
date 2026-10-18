import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  PlusCircle, Ticket, Users, Headset, Building2, Tags, BarChart3, ScrollText, Settings, AlertTriangle, Inbox, RotateCcw, UserX, Clock, Bell,
  Radio, Globe, Activity, Eye, BookOpen, HelpCircle, RefreshCw, Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { STATUSES, PRIORITIES, formatDuration } from "@/lib/constants";
import { useAuth } from "@/lib/auth";
import { publishNotification } from "@/lib/notifications";
import { meta } from "@/components/guard";
import { ErrorState } from "@/components/states";
import { DonutChart } from "@/components/charts";
import { PortalGate } from "@/components/portal-gate";
import { StatCard, TicketListCard, QuickAction, SectionTitle, PortalHeading, useTicketList } from "@/components/dashboard-kit";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getVisitorStatsFn } from "@/lib/visitor-tracker.functions";

export const Route = createFileRoute("/_app/admin/dashboard")({
  head: () => meta("Admin Dashboard", "Support administration: the whole support operation at a glance."),
  component: () => <PortalGate portal="admin"><AdminDashboard /></PortalGate>,
});

export type Stats = {
  total: number;
  by_status: Record<string, number>;
  by_priority: Record<string, number>;
  urgent_open: number; high_open: number; unassigned: number; today: number; week: number; month: number;
  trend: { day: string; count: number }[];
  by_department: { name: string; count: number }[];
  agents: { id: string; name: string; assigned: number; solved: number; open: number; avg_first_response_ms: number | null }[];
};

import { getDashboardStatsFn } from "@/lib/tickets.functions";

export function useDashboardStats(days: string) {
  return useQuery({
    queryKey: ["dashboard", days],
    queryFn: async () => {
      try {
        const stats = await getDashboardStatsFn({ data: { days: Number(days) || 30 } });
        if (stats) return stats as Stats;
      } catch {}
      const { data, error } = await supabase.rpc("dashboard_stats", { _days: Number(days) });
      if (error) throw error;
      return data as unknown as Stats;
    },
  });
}

const OPEN = "(solved,closed)";

function AdminDashboard() {
  const { can } = useAuth();
  const [days, setDays] = useState("30");
  const q = useDashboardStats(days);
  const s = q.data;
  const L = q.isLoading;

  const vq = useQuery({
    queryKey: ["admin-visitor-stats"],
    queryFn: () => getVisitorStatsFn(),
    refetchInterval: 5000,
  });
  const vStats = vq.data;

  const recent = useTicketList(["admin-recent"], (x) => x.order("created_at", { ascending: false }));
  const unanswered = useTicketList(["admin-unanswered"], (x) => x.eq("status", "unanswered").order("created_at", { ascending: true }));
  const urgent = useTicketList(["admin-urgent"], (x) => x.eq("priority", "urgent").not("status", "in", OPEN).order("created_at", { ascending: false }));
  const reopened = useTicketList(["admin-reopened"], (x) => x.eq("status", "reopened").order("updated_at", { ascending: false }));
  const unassigned = useTicketList(["admin-unassigned"], (x) => x.is("assigned_agent_id", null).not("status", "in", OPEN).order("created_at", { ascending: true }));

  const attention = (s?.by_status["unanswered"] ?? 0) + (s?.by_status["reopened"] ?? 0);

  return (
    <div className="mx-auto max-w-7xl">
      <PortalHeading
        eyebrow="Support Administration"
        title="Admin Dashboard"
        description="Operations overview of the entire support desk — queues, agents, departments and performance."
        actions={
          <>
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                publishNotification({
                  type: "ticket",
                  title: "Admin Alert: System Live",
                  message: "🔔 Admin notification pop-up and sound chime are working perfectly!",
                  target_role: "admin",
                  ticket: { ticket_number: "TK-1001", subject: "System Alert Test" },
                });
              }}
            >
              <Bell className="size-4 text-primary" /> Test Alert & Sound
            </Button>
            <Button variant="outline" asChild><Link to="/tickets"><Ticket className="size-4" /> All tickets</Link></Button>
            <Button asChild><Link to="/tickets/new"><PlusCircle className="size-4" /> Create ticket</Link></Button>
          </>
        }
      />
      {q.isError && <ErrorState onRetry={() => q.refetch()} />}

      {/* Attention strip */}
      <div className="grid gap-3 md:grid-cols-4">
        {[
          { label: "Need attention", value: attention, hint: "Unanswered + reopened", icon: Clock, search: { status: "unanswered" } },
          { label: "Urgent (open)", value: s?.urgent_open, hint: "Highest priority", icon: AlertTriangle, search: { priority: "urgent" } },
          { label: "Unassigned (open)", value: s?.unassigned, hint: "No agent yet", icon: UserX, search: { unassigned: true } },
          { label: "Created today", value: s?.today, hint: `${s?.week ?? 0} this week · ${s?.month ?? 0} this month`, icon: Inbox, search: {} },
        ].map((c) => (
          <Link key={c.label} to="/tickets" search={c.search as never} className="flex items-center gap-4 hover-lift rounded-lg border bg-card p-4 text-foreground shadow-card hover:bg-accent/40">
            <span className="rounded-md bg-primary/10 p-2.5 text-primary"><c.icon className="size-5" /></span>
            <span className="min-w-0">
              <span className="block text-xs font-medium opacity-80">{c.label}</span>
              {L ? <Skeleton className="mt-1 h-7 w-12" /> : <span className="block font-display text-2xl font-semibold text-sidebar-accent-foreground tabular-nums">{c.value ?? 0}</span>}
              <span className="block truncate text-[11px] opacity-60">{c.hint}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* Real-time Concurrent Visitors & Hit Tracking Banner */}
      <Card className="my-6 border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-transparent shadow-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-emerald-500"></span>
              </span>
              <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                Live Website Traffic & Concurrent Visitors
              </CardTitle>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Live Tracking (5s sync)
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Monitor real-time visitors hitting your website simultaneously, today's hit count, and detailed visitor activity logs.
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs"
            onClick={() => vq.refetch()}
            disabled={vq.isFetching}
          >
            <RefreshCw className={`size-3.5 ${vq.isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border bg-card/80 p-3.5 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Active Right Now</span>
                <Radio className="size-4 text-emerald-500 animate-pulse" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {vStats?.activeVisitorsNow ?? (vq.isLoading ? "—" : 1)}
                </span>
                <span className="text-xs text-muted-foreground">online now</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Concurrent visitors (5m window)</p>
            </div>

            <div className="rounded-lg border bg-card/80 p-3.5 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Today's Hits</span>
                <Zap className="size-4 text-amber-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold tracking-tight text-foreground tabular-nums">
                  {vStats?.todayHits ?? (vq.isLoading ? "—" : 0)}
                </span>
                <span className="text-xs text-muted-foreground">page views</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">Total hits recorded today</p>
            </div>

            <div className="rounded-lg border bg-card/80 p-3.5 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">All-Time Hits</span>
                <Globe className="size-4 text-blue-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold tracking-tight text-foreground tabular-nums">
                  {vStats?.totalHits ?? (vq.isLoading ? "—" : 0)}
                </span>
                <span className="text-xs text-muted-foreground">total requests</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">All logged page accesses</p>
            </div>

            <div className="rounded-lg border bg-card/80 p-3.5 shadow-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Last Hit Activity</span>
                <Activity className="size-4 text-violet-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-sm font-semibold text-foreground truncate">
                  {vStats?.recentHits?.[0]?.timestamp
                    ? formatDistanceToNow(new Date(vStats.recentHits[0].timestamp), { addSuffix: true })
                    : "Just now"}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground truncate">
                {vStats?.recentHits?.[0]?.path ? `Hit: ${vStats.recentHits[0].path}` : "Awaiting requests"}
              </p>
            </div>
          </div>

          {/* Visitor Hits Table */}
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="flex items-center justify-between border-b px-4 py-2.5 bg-muted/30">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Activity className="size-3.5 text-primary" />
                Live Website Hits & Visitor Activity Log
              </span>
              <span className="text-[11px] text-muted-foreground">
                Showing latest {Math.min(vStats?.recentHits?.length ?? 0, 15)} hits
              </span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-muted/60 text-muted-foreground backdrop-blur-sm border-b">
                  <tr>
                    <th className="px-3.5 py-2 text-left font-medium">Time</th>
                    <th className="px-3.5 py-2 text-left font-medium">Path Hit</th>
                    <th className="px-3.5 py-2 text-left font-medium">Visitor</th>
                    <th className="px-3.5 py-2 text-left font-medium">Role</th>
                    <th className="px-3.5 py-2 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(vStats?.recentHits?.slice(0, 15) ?? []).map((hit) => {
                    const hitTime = new Date(hit.timestamp).getTime();
                    const isOnline = !isNaN(hitTime) && Date.now() - hitTime < 5 * 60 * 1000;
                    return (
                      <tr key={hit.id} className="hover:bg-accent/40 transition-colors">
                        <td className="px-3.5 py-2 text-muted-foreground whitespace-nowrap">
                          {hit.timestamp ? formatDistanceToNow(new Date(hit.timestamp), { addSuffix: true }) : "Just now"}
                        </td>
                        <td className="px-3.5 py-2 font-mono text-[11px] text-primary truncate max-w-[200px]">
                          {hit.path || "/"}
                        </td>
                        <td className="px-3.5 py-2 font-medium text-foreground truncate max-w-[150px]">
                          {hit.user_name || "Guest Visitor"}
                        </td>
                        <td className="px-3.5 py-2">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium capitalize ${
                              hit.role === "admin"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                                : hit.role === "agent"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                                : hit.role === "customer"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {hit.role || "visitor"}
                          </span>
                        </td>
                        <td className="px-3.5 py-2 text-right">
                          {isOnline ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Online
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">Recent</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {!vStats?.recentHits?.length && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-xs text-muted-foreground">
                        No visitor hit logs recorded yet. Browse any page to trigger records!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <SectionTitle>Ticket statistics</SectionTitle>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Tickets" value={s?.total} search={{}} loading={L} />
        {STATUSES.map((st) => (
          <StatCard key={st.value} label={st.label} value={s?.by_status[st.value]} search={{ status: st.value }} accent={st.color} loading={L} />
        ))}
        <StatCard label="Urgent" value={s?.urgent_open} search={{ priority: "urgent" }} accent="var(--pr-urgent)" loading={L} tone="alert" />
        <StatCard label="Unassigned" value={s?.unassigned} search={{ unassigned: true }} loading={L} tone="alert" />
      </div>

      <SectionTitle>Quick actions</SectionTitle>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <QuickAction to="/tickets" label="View All Tickets" icon={Ticket} />
        <QuickAction to="/tickets/new" label="Create Ticket" icon={PlusCircle} />
        {can("customers.view") && <QuickAction to="/customers" label="Manage Customers" icon={Users} />}
        {can("agents.view") && <QuickAction to="/agents" label="Manage Agents" icon={Headset} />}
        <QuickAction to="/knowledge-base/articles" label="Manage Articles" icon={BookOpen} />
        <QuickAction to="/faqs" label="Manage FAQs" icon={HelpCircle} />
        {can("departments.manage") && <QuickAction to="/departments" label="Manage Departments" icon={Building2} />}
        {can("categories.manage") && <QuickAction to="/categories" label="Manage Categories" icon={Tags} />}
        {can("reports.view") && <QuickAction to="/reports" label="Reports" icon={BarChart3} />}
        {can("activity_logs.view") && <QuickAction to="/activity-logs" label="Activity Logs" icon={ScrollText} />}
        {can("settings.manage") && <QuickAction to="/settings" label="Settings" icon={Settings} />}
      </div>

      <SectionTitle>Queues</SectionTitle>
      <div className="grid gap-4 lg:grid-cols-3">
        <TicketListCard title="Recent Tickets" icon={Inbox} rows={recent.data} loading={recent.isLoading} empty="No tickets yet." viewAll={{}} showCustomer />
        <TicketListCard title="Unanswered Tickets" icon={Clock} rows={unanswered.data} loading={unanswered.isLoading} empty="Every ticket has a reply." viewAll={{ status: "unanswered" }} showCustomer />
        <TicketListCard title="Urgent Tickets" icon={AlertTriangle} rows={urgent.data} loading={urgent.isLoading} empty="No open urgent tickets." viewAll={{ priority: "urgent" }} showCustomer />
        <TicketListCard title="Reopened Tickets" icon={RotateCcw} rows={reopened.data} loading={reopened.isLoading} empty="No reopened tickets." viewAll={{ status: "reopened" }} showCustomer />
        <TicketListCard title="Unassigned Tickets" icon={UserX} rows={unassigned.data} loading={unassigned.isLoading} empty="All open tickets are assigned." viewAll={{ unassigned: true }} showCustomer />

        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm"><Headset className="size-4 text-muted-foreground" />Agent Workload</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="px-4 py-2 text-left font-medium">Agent</th>
                  <th className="px-2 py-2 text-right font-medium">Open</th>
                  <th className="px-2 py-2 text-right font-medium">Solved</th>
                  <th className="px-4 py-2 text-right font-medium">1st resp.</th>
                </tr>
              </thead>
              <tbody>
                {s?.agents.map((a) => (
                  <tr key={a.id} className="border-b last:border-0">
                    <td className="truncate px-4 py-2">
                      <Link to="/tickets" search={{ agent: a.id } as never} className="hover:text-primary">{a.name}</Link>
                    </td>
                    <td className="px-2 py-2 text-right tabular-nums">{a.open}</td>
                    <td className="px-2 py-2 text-right tabular-nums">{a.solved}</td>
                    <td className="px-4 py-2 text-right tabular-nums">{formatDuration(a.avg_first_response_ms)}</td>
                  </tr>
                ))}
                {!L && !s?.agents.length && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-xs text-muted-foreground">No tickets assigned to agents yet.</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <SectionTitle
        action={
          <Tabs value={days} onValueChange={setDays}>
            <TabsList className="h-8">
              {([["1", "Today"], ["7", "7d"], ["30", "30d"], ["90", "90d"]] as const).map(([v, l]) => (
                <TabsTrigger key={v} value={v} className="px-2 text-xs">{l}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
      >
        Analytics
      </SectionTitle>
      <AdminCharts stats={s} loading={L} />
    </div>
  );
}

export function AdminCharts({ stats: s, loading: L }: { stats?: Stats | undefined; loading: boolean }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="shadow-card lg:col-span-2">
        <CardHeader><CardTitle className="text-sm">Ticket Trends</CardTitle></CardHeader>
        <CardContent className="h-64">
          {L ? <Skeleton className="h-full w-full" /> : (
            <ResponsiveContainer>
              <AreaChart data={(s?.trend ?? []).map((t) => ({ ...t, label: format(new Date(t.day), "MMM d") }))}>
                <defs>
                  <linearGradient id="admin-trend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} width={28} />
                <Tooltip />
                <Area type="monotone" dataKey="count" name="Tickets" stroke="var(--chart-1)" fill="url(#admin-trend)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card lg:row-span-2">
        <CardHeader><CardTitle className="text-sm">Ticket Status</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {L ? <Skeleton className="h-96 w-full" /> : (
            <>
              <div className="h-36" aria-label="Tickets over time">
                <ResponsiveContainer>
                  <LineChart data={(s?.trend ?? []).map((t) => ({ ...t, label: format(new Date(t.day), "MMM d") }))} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="label" fontSize={10} tickLine={false} axisLine={false} minTickGap={16} />
                    <YAxis allowDecimals={false} fontSize={10} tickLine={false} axisLine={false} width={24} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" name="Tickets" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-56 border-t pt-3">
                <DonutChart data={STATUSES.map((st) => ({ name: st.label, value: s?.by_status[st.value] ?? 0, color: st.color }))} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-sm">Priority</CardTitle></CardHeader>
        <CardContent className="h-56">
          {L ? <Skeleton className="h-full w-full" /> : (
            <ResponsiveContainer>
              <BarChart data={PRIORITIES.map((p) => ({ name: p.label, value: s?.by_priority[p.value] ?? 0 }))}>
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} width={28} />
                <Tooltip cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="value" name="Tickets" radius={[4, 4, 0, 0]}>
                  {PRIORITIES.map((p) => <Cell key={p.value} fill={p.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card lg:col-span-2">
        <CardHeader><CardTitle className="text-sm">Department Statistics</CardTitle></CardHeader>
        <CardContent className="h-56">
          {L ? <Skeleton className="h-full w-full" /> : !s?.by_department.length ? (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No tickets yet</div>
          ) : (
            <ResponsiveContainer>
              <BarChart data={s.by_department} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" allowDecimals={false} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" fontSize={11} tickLine={false} axisLine={false} width={120} />
                <Tooltip cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="count" name="Tickets" fill="var(--chart-2)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
