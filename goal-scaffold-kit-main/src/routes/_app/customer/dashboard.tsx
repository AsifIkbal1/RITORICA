import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { PlusCircle, Ticket, MessageSquare, History, Bell, LifeBuoy, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { STATUSES } from "@/lib/constants";
import { useNotifications } from "@/lib/notifications";
import { useOpenNotification } from "@/components/notification-bell";
import { meta } from "@/components/guard";
import { ErrorState } from "@/components/states";
import { TicketId } from "@/components/badges";
import { PortalGate } from "@/components/portal-gate";
import { TicketListCard, useTicketList } from "@/components/dashboard-kit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/customer/dashboard")({
  head: () => meta("My Support Dashboard", "Submit and track your support requests."),
  component: () => <PortalGate portal="customer"><CustomerDashboard /></PortalGate>,
});

import { getTicketsListFn } from "@/lib/tickets.functions";

type Reply = { id: string; message: string; created_at: string; ticket_id: string; ticket: { ticket_number: string; subject: string } | null };
type Change = { id: string; description: string; created_at: string; ticket_id: string; ticket: { ticket_number: string; subject: string } | null };

function CustomerDashboard() {
  const { session, profile } = useAuth();
  const targetUid = profile?.id || session?.user?.id;
  const username = profile?.username;

  // Every query below is explicitly limited to the customer's own tickets AND merged with local storage.
  const mine = useQuery({
    queryKey: ["customer-mine", targetUid, username],
    queryFn: async () => {
      const results: { id: string; status: string }[] = [];
      const seen = new Set<string>();

      try {
        if (targetUid) {
          const { data, error } = await supabase.from("tickets").select("id, status").eq("customer_id", targetUid).limit(5000);
          if (!error && data) {
            for (const r of data) {
              if (!seen.has(r.id)) {
                seen.add(r.id);
                results.push({ id: r.id, status: r.status });
              }
            }
          }
        }
      } catch {}

      try {
        const localList = await getTicketsListFn();
        const myLocal = localList.filter((t) =>
          !targetUid ||
          t.customer_id === targetUid ||
          (t as any).customer_id === targetUid ||
          (username && ((t as any).customer_name === username || (t as any).username === username))
        );
        for (const t of myLocal) {
          if (!seen.has(t.id)) {
            seen.add(t.id);
            results.push({ id: t.id, status: t.status });
          }
        }
      } catch {}

      return results;
    },
  });

  const recent = useTicketList(["customer-recent", targetUid], (x) => x.eq("customer_id", targetUid || "").order("updated_at", { ascending: false }), 6);

  const replies = useQuery({
    queryKey: ["customer-replies", targetUid],
    queryFn: async () => {
      try {
        if (!targetUid) return [];
        const { data, error } = await supabase
          .from("ticket_messages")
          .select("id, message, created_at, ticket_id, ticket:tickets!inner(ticket_number, subject, customer_id)")
          .eq("message_type", "agent_reply")
          .eq("ticket.customer_id", targetUid)
          .order("created_at", { ascending: false })
          .limit(5);
        if (!error && data) return (data ?? []) as unknown as Reply[];
      } catch {}
      return [] as Reply[];
    },
  });

  const changes = useQuery({
    queryKey: ["customer-changes", targetUid],
    queryFn: async () => {
      try {
        if (!targetUid) return [];
        const { data, error } = await supabase
          .from("ticket_activity")
          .select("id, description, created_at, ticket_id, ticket:tickets!inner(ticket_number, subject, customer_id)")
          .eq("action", "status.changed")
          .eq("is_internal", false)
          .eq("ticket.customer_id", targetUid)
          .order("created_at", { ascending: false })
          .limit(5);
        if (!error && data) return (data ?? []) as unknown as Change[];
      } catch {}
      return [] as Change[];
    },
  });

  const notif = useNotifications(5);
  const openN = useOpenNotification();

  const rows = mine.data ?? [];
  const count = (st: string) => rows.filter((r) => r.status === st).length;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Welcome hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-accent/60 to-card p-6 shadow-card md:p-8">
        <LifeBuoy className="pointer-events-none absolute -right-6 -top-6 size-40 text-primary/10" />
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">Customer Portal · My Support Dashboard</div>
        <h1 className="mt-2 text-3xl font-semibold">Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!</h1>
        <p className="mt-1 text-base text-muted-foreground">Need help? Create a new support ticket and our team will get back to you.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button size="lg" asChild className="h-12 px-6 text-base">
            <Link to="/tickets/new"><PlusCircle className="size-5" /> Create New Ticket</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-12 bg-card px-6 text-base">
            <Link to="/tickets"><Ticket className="size-5" /> View My Tickets</Link>
          </Button>
        </div>
      </section>

      {mine.isError && <div className="mt-4"><ErrorState onRetry={() => mine.refetch()} /></div>}

      {/* My ticket status */}
      <h2 className="mb-3 mt-8 text-lg font-semibold">My Ticket Status</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatusTile label="All my tickets" value={rows.length} loading={mine.isLoading} search={{}} />
        {STATUSES.map((s) => (
          <StatusTile key={s.value} label={s.label} value={count(s.value)} loading={mine.isLoading} search={{ status: s.value }} color={s.color} />
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="mb-3 text-lg font-semibold">My Recent Tickets</h2>
          <TicketListCard title="Latest updates on my requests" icon={Ticket} rows={recent.data} loading={recent.isLoading}
            empty="You haven't created any tickets yet. Click “Create New Ticket” to get help." viewAll={{}} />
        </div>
        <div className="space-y-4 lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold">Recent Activity</h2>
          <Feed title="Latest replies from support" icon={MessageSquare} loading={replies.isLoading} empty="No replies yet."
            items={(replies.data ?? []).map((r) => ({ id: r.id, ticketId: r.ticket_id, num: r.ticket?.ticket_number, text: r.message, at: r.created_at }))} />
          <Feed title="Recent status changes" icon={History} loading={changes.isLoading} empty="No status changes yet."
            items={(changes.data ?? []).map((c) => ({ id: c.id, ticketId: c.ticket_id, num: c.ticket?.ticket_number, text: c.description, at: c.created_at }))} />
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center gap-2 text-sm"><Bell className="size-4 text-muted-foreground" />My notifications</CardTitle>
              <Link to="/notifications" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">View all <ArrowRight className="size-3" /></Link>
            </CardHeader>
            <CardContent className="p-0">
              {notif.isLoading ? <div className="p-4"><Skeleton className="h-10 w-full" /></div> : !notif.data?.items.length ? (
                <p className="px-4 py-6 text-center text-xs text-muted-foreground">No notifications yet.</p>
              ) : (
                <ul className="divide-y">
                  {notif.data.items.map((n) => (
                    <li key={n.id}>
                      <button type="button" onClick={() => void openN(n)} className={cn("w-full px-4 py-2.5 text-left hover:bg-muted/50", !n.is_read && "bg-accent/40")}>
                        <div className={cn("text-sm", !n.is_read ? "font-semibold" : "font-medium")}>{n.title}</div>
                        <div className="truncate text-xs text-muted-foreground">{n.message}</div>
                        <div className="text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusTile({ label, value, loading, search, color }: { label: string; value: number; loading: boolean; search: Record<string, unknown>; color?: string }) {
  return (
    <Link to="/tickets" search={search as never} className="rounded-xl border bg-card p-3 text-center shadow-card transition hover:border-primary/40">
      {loading ? <Skeleton className="mx-auto h-7 w-10" /> : <div className="font-display text-2xl font-semibold tabular-nums" style={color ? { color } : undefined}>{value}</div>}
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </Link>
  );
}

function Feed({ title, icon: Icon, items, loading, empty }: {
  title: string; icon: typeof Bell; loading: boolean; empty: string;
  items: { id: string; ticketId: string; num?: string | undefined; text: string; at: string }[];
}) {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm"><Icon className="size-4 text-muted-foreground" />{title}</CardTitle></CardHeader>
      <CardContent className="p-0">
        {loading ? <div className="p-4"><Skeleton className="h-10 w-full" /></div> : !items.length ? (
          <p className="px-4 py-6 text-center text-xs text-muted-foreground">{empty}</p>
        ) : (
          <ul className="divide-y">
            {items.map((i) => (
              <li key={i.id}>
                <Link to="/tickets/$id" params={{ id: i.ticketId }} className="block px-4 py-2.5 hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    {i.num && <TicketId value={i.num} />}
                    <span className="text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(i.at), { addSuffix: true })}</span>
                  </div>
                  <div className="line-clamp-2 text-sm">{i.text}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
