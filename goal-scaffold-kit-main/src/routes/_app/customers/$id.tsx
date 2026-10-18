import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Guard, meta } from "@/components/guard";
import { EmptyState, ErrorState } from "@/components/states";
import { MiniTicketTable, StatTile } from "@/components/person-tickets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/customers/$id")({
  head: () => meta("Customer", "Customer profile and ticket history."),
  component: () => <Guard perm="customers.view"><Customer /></Guard>,
});

import { getCustomerDetailsFn } from "@/lib/tickets.functions";

function Customer() {
  const { id } = Route.useParams();
  const q = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      try {
        const local = await getCustomerDetailsFn({ data: { id } });
        if (local?.profile) return local;
      } catch {}
      const [p, t, a] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
        supabase.from("tickets").select("id, ticket_number, subject, status, priority, created_at").eq("customer_id", id).order("created_at", { ascending: false }),
        supabase.from("ticket_activity").select("id, description, created_at, ticket_id").eq("user_id", id).order("created_at", { ascending: false }).limit(20),
      ]);
      if (p.error) throw p.error;
      return { profile: p.data, tickets: t.data ?? [], activity: a.data ?? [] };
    },
  });
  if (q.isLoading) return <Skeleton className="mx-auto h-96 max-w-6xl" />;
  if (q.isError) return <ErrorState onRetry={() => q.refetch()} />;
  if (!q.data?.profile) return <EmptyState title="Customer not found" />;
  const { profile: p, tickets, activity } = q.data;
  const open = tickets.filter((t) => !["solved", "closed"].includes(t.status));
  const solved = tickets.filter((t) => t.status === "solved");
  const closed = tickets.filter((t) => t.status === "closed");
  return (
    <div className="mx-auto max-w-6xl">
      <Link to="/customers" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Customers</Link>
      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <Card className="h-fit shadow-card">
          <CardHeader><CardTitle>{p.full_name}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><Mail className="size-4" /> {p.email}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Phone className="size-4" /> {p.phone ?? "—"}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="size-4" /> Joined {format(new Date(p.created_at), "MMM d, yyyy")}</div>
            <div className="text-xs text-muted-foreground">Last login: {p.last_login_at ? formatDistanceToNow(new Date(p.last_login_at), { addSuffix: true }) : "Never"}</div>
            <div className="text-xs">{p.is_active ? "Active account" : <span className="text-destructive">Disabled account</span>}</div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Total tickets" value={tickets.length} />
            <StatTile label="Open" value={open.length} />
            <StatTile label="Solved" value={solved.length} />
            <StatTile label="Closed" value={closed.length} />
          </div>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="solved">Solved</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="all"><MiniTicketTable rows={tickets} /></TabsContent>
            <TabsContent value="open"><MiniTicketTable rows={open} /></TabsContent>
            <TabsContent value="solved"><MiniTicketTable rows={solved} /></TabsContent>
            <TabsContent value="closed"><MiniTicketTable rows={closed} /></TabsContent>
            <TabsContent value="activity">
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
