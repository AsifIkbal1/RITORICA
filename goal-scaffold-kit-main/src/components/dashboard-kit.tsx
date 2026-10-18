import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StatusBadge, PriorityBadge, TicketId } from "@/components/badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { getTicketsListFn } from "@/lib/tickets.functions";

export type MiniTicket = {
  id: string; ticket_number: string; subject: string; status: string; priority: string;
  created_at: string; updated_at: string; customer_name: string; assigned_agent_id: string | null;
};
const COLS = "id, ticket_number, subject, status, priority, created_at, updated_at, customer_name, assigned_agent_id";

const baseQuery = () => supabase.from("tickets").select(COLS);
type TicketQuery = ReturnType<typeof baseQuery>;
type Builder = (q: TicketQuery) => TicketQuery;

/** Small ticket list query. Rows are scoped by RLS and merged with persistent local tickets. */
export function useTicketList(key: unknown[], build: Builder, limit = 5) {
  return useQuery({
    queryKey: ["dash-tickets", ...key, limit],
    queryFn: async () => {
      const results: MiniTicket[] = [];
      const seenIds = new Set<string>();

      try {
        const { data, error } = await build(baseQuery()).limit(limit);
        if (!error && data) {
          for (const item of (data as unknown as MiniTicket[])) {
            if (!seenIds.has(item.id)) {
              seenIds.add(item.id);
              results.push(item);
            }
          }
        }
      } catch {}

      try {
        const localList = await getTicketsListFn();
        const actionType = String(key[0] || "");
        const targetId = key[1] ? String(key[1]) : "";

        const filtered = localList.filter((t) => {
          const st = t.status || "unanswered";
          const pr = t.priority || "medium";
          const isOpen = st !== "solved" && st !== "closed";

          if (actionType === "admin-recent") return true;
          if (actionType === "admin-unanswered") return st === "unanswered";
          if (actionType === "admin-urgent") return pr === "urgent" && isOpen;
          if (actionType === "admin-reopened") return st === "reopened";
          if (actionType === "admin-unassigned") return !(t as any).assigned_agent_id && isOpen;

          if (actionType === "customer-recent") {
            return !targetId || t.customer_id === targetId || (t as any).customer_id === targetId;
          }

          if (actionType === "agent-urgent") return pr === "urgent" && isOpen;
          if (actionType === "agent-waiting") return ["unanswered", "reopened", "in_progress"].includes(st);
          if (actionType === "agent-updated") return true;
          if (actionType === "agent-pool") return !(t as any).assigned_agent_id && isOpen;

          return true;
        });

        for (const t of filtered) {
          if (!seenIds.has(t.id)) {
            seenIds.add(t.id);
            results.push({
              id: t.id,
              ticket_number: t.ticket_number,
              subject: t.subject,
              status: t.status,
              priority: t.priority,
              created_at: t.created_at,
              updated_at: t.updated_at,
              customer_name: (t as any).customer_name || "Customer",
              assigned_agent_id: (t as any).assigned_agent_id || null,
            });
          }
        }
      } catch {}

      // Sort by newest created_at / updated_at
      results.sort((a, b) => new Date(b.created_at || b.updated_at).getTime() - new Date(a.created_at || a.updated_at).getTime());
      return results.slice(0, limit);
    },
  });
}

export function StatCard({
  label, value, search, accent, loading, icon: Icon, tone = "default",
}: {
  label: string; value?: number | undefined; search: Record<string, unknown>; accent?: string | undefined;
  loading?: boolean | undefined; icon?: LucideIcon | undefined; tone?: "default" | "alert" | undefined;
}) {
  return (
    <Link
      to="/tickets"
      search={search as never}
      className={cn(
        "group rounded-lg border bg-card p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-elevated",
        tone === "alert" && !!value && "border-destructive/40 bg-destructive/5",
      )}
    >
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {accent && <span className="size-2 rounded-full" style={{ backgroundColor: accent }} />}
        {Icon && <Icon className="size-3.5" />}
        {label}
      </div>
      {loading ? <Skeleton className="mt-2 h-8 w-14" /> : <div className="mt-1.5 font-display text-3xl font-semibold tabular-nums">{value ?? 0}</div>}
    </Link>
  );
}

export function TicketListCard({
  title, rows, loading, empty, viewAll, showCustomer, icon: Icon, className,
}: {
  title: string; rows?: MiniTicket[] | undefined; loading?: boolean | undefined; empty: string;
  viewAll?: Record<string, unknown> | undefined; showCustomer?: boolean | undefined; icon?: LucideIcon | undefined; className?: string | undefined;
}) {
  return (
    <Card className={cn("shadow-card", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">{Icon && <Icon className="size-4 text-muted-foreground" />}{title}</CardTitle>
        {viewAll && (
          <Link to="/tickets" search={viewAll as never} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            View all <ArrowRight className="size-3" />
          </Link>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="space-y-2 p-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
        ) : !rows?.length ? (
          <p className="px-4 py-8 text-center text-xs text-muted-foreground">{empty}</p>
        ) : (
          <ul className="divide-y">
            {rows.map((t) => (
              <li key={t.id}>
                <Link to="/tickets/$id" params={{ id: t.id }} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <TicketId value={t.ticket_number} />
                      <span className="text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(t.updated_at), { addSuffix: true })}</span>
                    </div>
                    <div className="truncate text-sm font-medium">{t.subject}</div>
                    {showCustomer && <div className="truncate text-xs text-muted-foreground">{t.customer_name}</div>}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusBadge status={t.status} />
                    <PriorityBadge priority={t.priority} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export function QuickAction({ to, label, icon: Icon, description, search }: { to: string; label: string; icon: LucideIcon; description?: string; search?: Record<string, unknown> }) {
  return (
    <Link
      to={to as never}
      search={search as never}
      className="flex items-center gap-3 rounded-lg border bg-card p-3 text-sm shadow-card transition hover:border-primary/40 hover:bg-accent/40"
    >
      <span className="rounded-md bg-primary/10 p-2 text-primary"><Icon className="size-4" /></span>
      <span className="min-w-0">
        <span className="block font-medium">{label}</span>
        {description && <span className="block truncate text-xs text-muted-foreground">{description}</span>}
      </span>
    </Link>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-8 flex items-center justify-between">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</h2>
      {action}
    </div>
  );
}

export function PortalHeading({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</div>
        <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
