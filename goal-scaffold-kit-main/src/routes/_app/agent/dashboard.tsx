import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Ticket, Search, Bell, AlertTriangle, RotateCcw, Clock, Inbox, Hourglass, Wrench, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useNotifications } from "@/lib/notifications";
import { meta } from "@/components/guard";
import { ErrorState } from "@/components/states";
import { PortalGate } from "@/components/portal-gate";
import { StatCard, TicketListCard, QuickAction, SectionTitle, PortalHeading, useTicketList } from "@/components/dashboard-kit";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/agent/dashboard")({
  head: () => meta("Agent Dashboard", "Your assigned support tickets and workload."),
  component: () => <PortalGate portal="agent"><AgentDashboard /></PortalGate>,
});

import { getTicketsListFn } from "@/lib/tickets.functions";

const CLOSED = "(solved,closed)";

function AgentDashboard() {
  const { session, profile } = useAuth();
  const uid = session!.user.id;
  const notif = useNotifications(1);

  const mine = useQuery({
    queryKey: ["agent-assigned", uid],
    queryFn: async () => {
      let results: { status: string; priority: string }[] = [];
      try {
        const { data, error } = await supabase.from("tickets").select("status, priority").eq("assigned_agent_id", uid).limit(5000);
        if (!error && data) results = [...data];
      } catch {}

      try {
        const localList = await getTicketsListFn();
        const myLocal = localList.filter((t) => (t as any).assigned_agent_id === uid);
        for (const lt of myLocal) {
          results.push({ status: lt.status, priority: lt.priority });
        }
      } catch {}

      return results;
    },
  });
  const rows = mine.data ?? [];
  const count = (st: string) => rows.filter((r) => r.status === st).length;
  const open = rows.filter((r) => r.status !== "solved" && r.status !== "closed");
  const L = mine.isLoading;
  const mineSearch = { agent: uid };

  const urgent = useTicketList(["agent-urgent", uid], (x) => x.eq("assigned_agent_id", uid).eq("priority", "urgent").not("status", "in", CLOSED).order("created_at", { ascending: false }));
  const waiting = useTicketList(["agent-waiting", uid], (x) => x.eq("assigned_agent_id", uid).in("status", ["unanswered", "reopened", "in_progress"]).order("updated_at", { ascending: true }));
  const updated = useTicketList(["agent-updated", uid], (x) => x.eq("assigned_agent_id", uid).order("updated_at", { ascending: false }), 8);
  const pool = useTicketList(["agent-pool", uid], (x) => x.is("assigned_agent_id", null).not("status", "in", CLOSED).order("created_at", { ascending: true }));

  return (
    <div className="mx-auto max-w-6xl">
      <PortalHeading
        eyebrow="Support Agent Portal"
        title="Agent Dashboard"
        description={`Hi ${profile?.full_name?.split(" ")[0] ?? "there"} — here's your workload. Reply to customers and move tickets to resolution.`}
        actions={<Button asChild><Link to="/tickets" search={mineSearch as never}><UserCheck className="size-4" /> My assigned tickets</Link></Button>}
      />
      {mine.isError && <ErrorState onRetry={() => mine.refetch()} />}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <StatCard label="My Assigned (open)" value={open.length} search={mineSearch} loading={L} icon={Inbox} />
        <StatCard label="Unanswered" value={count("unanswered")} search={{ ...mineSearch, status: "unanswered" }} accent="var(--st-unanswered)" loading={L} tone="alert" />
        <StatCard label="Awaiting User Reply" value={count("awaiting_user_reply")} search={{ ...mineSearch, status: "awaiting_user_reply" }} accent="var(--st-awaiting)" loading={L} icon={Hourglass} />
        <StatCard label="In Progress" value={count("in_progress")} search={{ ...mineSearch, status: "in_progress" }} accent="var(--st-progress)" loading={L} icon={Wrench} />
        <StatCard label="Reopened" value={count("reopened")} search={{ ...mineSearch, status: "reopened" }} accent="var(--st-reopened)" loading={L} tone="alert" />
        <StatCard label="Urgent" value={open.filter((r) => r.priority === "urgent").length} search={{ ...mineSearch, priority: "urgent" }} accent="var(--pr-urgent)" loading={L} tone="alert" />
        <StatCard label="Solved by me" value={count("solved") + count("closed")} search={{ ...mineSearch, status: "solved" }} accent="var(--st-solved)" loading={L} />
      </div>

      <SectionTitle>Quick actions</SectionTitle>
      <div className="grid gap-3 sm:grid-cols-3">
        <QuickAction to="/tickets" search={mineSearch} label="My Tickets" description="Tickets assigned to you" icon={Ticket} />
        <QuickAction to="/tickets" label="Search Tickets" description="Search the queue you can access" icon={Search} />
        <QuickAction to="/notifications" label="Notifications" description={notif.data ? `${notif.data.unread} unread` : "Your updates"} icon={Bell} />
      </div>

      <SectionTitle>My work</SectionTitle>
      <div className="grid gap-4 lg:grid-cols-2">
        <TicketListCard title="Waiting for my reply" icon={Clock} rows={waiting.data} loading={waiting.isLoading} empty="Nothing waiting on you. Nice work." viewAll={{ ...mineSearch, status: "unanswered" }} showCustomer />
        <TicketListCard title="Urgent Tickets" icon={AlertTriangle} rows={urgent.data} loading={urgent.isLoading} empty="No urgent tickets assigned to you." viewAll={{ ...mineSearch, priority: "urgent" }} showCustomer />
        <TicketListCard title="Recently Updated Tickets" icon={RotateCcw} rows={updated.data} loading={updated.isLoading} empty="No tickets assigned to you yet." viewAll={mineSearch} showCustomer />
        <TicketListCard title="Unassigned in my queue" icon={Inbox} rows={pool.data} loading={pool.isLoading} empty="No unassigned tickets you can pick up." viewAll={{ unassigned: true }} showCustomer />
      </div>
    </div>
  );
}
