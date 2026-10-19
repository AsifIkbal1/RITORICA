import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";
import { format, formatDistanceToNow } from "date-fns";
import { PlusCircle, Search, X, ChevronLeft, ChevronRight, Eye, Settings2, Download, Moon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { STATUSES, PRIORITIES, type TicketStatus, type TicketPriority } from "@/lib/constants";
import { useCategories, useDepartments, useStaff } from "@/lib/lookups";
import { getTicketsListFn } from "@/lib/tickets.functions";
import { exportTicketsToCsv } from "@/lib/export-tickets";
import { PageHeader, EmptyState, ErrorState, TableSkeleton } from "@/components/states";
import { StatusBadge, PriorityBadge, TicketId } from "@/components/badges";
import { CompactSlaBadge } from "@/components/sla-indicator";
import { CompactCsatScore } from "@/components/csat-survey";
import { CompactSentimentBadge } from "@/components/sentiment-card";
import { getTagColor } from "@/components/ticket-tags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  category: z.string().optional(),
  department: z.string().optional(),
  agent: z.string().optional(),
  customer: z.string().optional(),
  unassigned: z.boolean().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  updated: z.string().optional(),
  sort: z.enum(["newest", "oldest", "updated", "priority", "status"]).optional(),
  page: z.number().int().min(1).optional(),
  size: z.number().int().optional(),
});
type S = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/_app/tickets/")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Tickets — SupportDesk" },
      { name: "description", content: "Search, filter and manage support tickets." },
      { property: "og:title", content: "Tickets — SupportDesk" },
      { property: "og:description", content: "Search, filter and manage support tickets." },
    ],
  }),
  component: TicketsPage,
});

const ALL = "__all";
const dateRanges = [
  { v: "1", l: "Today" }, { v: "7", l: "Last 7 days" }, { v: "30", l: "Last 30 days" }, { v: "90", l: "Last 90 days" },
];
function daysAgo(n: string) {
  const d = new Date();
  if (n === "1") d.setHours(0, 0, 0, 0);
  else d.setDate(d.getDate() - Number(n));
  return d.toISOString();
}

function TicketsPage() {
  const s = Route.useSearch();
  const nav = useNavigate({ from: "/tickets/" });
  const { isStaff, can } = useAuth();
  const cats = useCategories();
  const deps = useDepartments();
  const staff = useStaff();
  const [qInput, setQInput] = useState(s.q ?? "");
  useEffect(() => setQInput(s.q ?? ""), [s.q]);

  const page = s.page ?? 1;
  const size = s.size ?? 25;
  const set = (patch: Partial<S>) => nav({ search: (prev: S) => ({ ...prev, ...patch, page: patch.page ?? 1 }) as S });

  const q = useQuery({
    queryKey: ["tickets", s],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      let rpcData: any[] = [];
      try {
        const { data } = await supabase.rpc("search_tickets", ({
          _q: s.q || undefined,
          _status: s.status ? (s.status.split(",") as TicketStatus[]) : undefined,
          _priority: s.priority ? (s.priority.split(",") as TicketPriority[]) : undefined,
          _category: s.category,
          _department: s.department,
          _agent: s.agent,
          _customer: s.customer,
          _unassigned: s.unassigned ?? false,
          _from: s.from,
          _to: s.to,
          _updated_from: s.updated,
          _sort: s.sort ?? "newest",
          _limit: size,
          _offset: (page - 1) * size,
        } as never));
        if (data) rpcData = data;
      } catch {}

      try {
        const localList = await getTicketsListFn();
        if (localList.length > 0) {
          const catMap = new Map((cats.data ?? []).map((c) => [c.id, c.name]));
          const depMap = new Map((deps.data ?? []).map((d) => [d.id, d.name]));
          const mappedLocal = localList.map((l) => ({
            id: l.id,
            ticket_number: l.ticket_number,
            subject: l.subject,
            status: l.status as TicketStatus,
            priority: l.priority as TicketPriority,
            customer_id: l.customer_id,
            customer_name: l.customer_name || "Customer",
            customer_email: l.customer_email || "",
            customer_phone: l.customer_phone || "",
            category_id: l.category_id,
            category_name: catMap.get(l.category_id) || "General",
            department_id: l.department_id,
            department_name: depMap.get(l.department_id) || "Support",
            assigned_agent_id: l.assigned_agent_id || "",
            agent_name: l.assigned_agent_id ? "Assigned Agent" : "",
            created_at: l.created_at,
            updated_at: l.updated_at,
            last_activity_at: l.updated_at,
            csat_rating: l.csat_rating,
            tags: l.tags || [],
            snoozed_until: l.snoozed_until,
            sentiment: l.sentiment,
            total_count: rpcData.length + localList.length,
          }));
          const existingIds = new Set(rpcData.map((r) => r.id));
          for (const m of mappedLocal) {
            if (!existingIds.has(m.id)) {
              rpcData.push(m);
            }
          }
        }
      } catch {}

      return rpcData;
    },
  });
  const rows = q.data ?? [];
  const total = Number(rows[0]?.total_count ?? 0);
  const pages = Math.max(1, Math.ceil(total / size));
  const hasFilters = Object.entries(s).some(([k, v]) => !["page", "size", "sort"].includes(k) && v !== undefined && v !== "");

  const FilterSelect = ({ value, onChange, placeholder, options, manage }: { value?: string | undefined; onChange: (v?: string) => void; placeholder: string; options: { v: string; l: string }[]; manage?: { to: "/categories" | "/departments"; label: string } | undefined }) => (
    <Select value={value ?? ALL} onValueChange={(v) => onChange(v === ALL ? undefined : v)}>
      <SelectTrigger className="h-9 w-full bg-card sm:w-40"><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{placeholder}</SelectItem>
        {options.map((o) => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}
        {manage && (
          <>
            {options.length === 0 && <p className="px-2 py-1.5 text-xs text-muted-foreground">Nothing added yet.</p>}
            <SelectSeparator />
            <Link to={manage.to} className="flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm font-medium text-primary hover:bg-accent">
              <Settings2 className="size-3.5" /> {manage.label}
            </Link>
          </>
        )}
      </SelectContent>
    </Select>
  );

  const createdRange = dateRanges.find((r) => s.from && Math.abs(new Date(daysAgo(r.v)).getTime() - new Date(s.from).getTime()) < 86400000)?.v;

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title={isStaff ? "Tickets" : "My Tickets"}
        description={q.isFetched ? `${total} ticket${total === 1 ? "" : "s"}` : " "}
        actions={<Button asChild><Link to="/tickets/new"><PlusCircle className="size-4" /> New ticket</Link></Button>}
      />

      <div className="mb-4 space-y-3 rounded-lg border bg-card p-3 shadow-card">
        <form
          className="relative"
          onSubmit={(e) => { e.preventDefault(); set({ q: qInput.trim() || undefined }); }}
        >
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder={isStaff ? "Search ticket ID, subject, customer, email, phone, agent or message…" : "Search ticket ID, subject or message…"}
            className="pl-8"
          />
        </form>
        <div className="flex flex-wrap gap-2">
          <FilterSelect
            value={s.status}
            onChange={(v) => set({ status: v })}
            placeholder="All statuses"
            options={[
              // Grouped values used by the "Opened" / "Closed" menu links, so the box never shows blank.
              { v: "unanswered,answered,awaiting_user_reply,in_progress,reopened", l: "All open" },
              { v: "solved,closed", l: "Solved & closed" },
              ...(s.status?.includes(",") && !["unanswered,answered,awaiting_user_reply,in_progress,reopened", "solved,closed"].includes(s.status)
                ? [{ v: s.status, l: "Several statuses" }]
                : []),
              ...STATUSES.map((x) => ({ v: x.value, l: x.label })),
            ]}
          />
          <FilterSelect value={s.priority} onChange={(v) => set({ priority: v })} placeholder="All priorities" options={PRIORITIES.map((x) => ({ v: x.value, l: x.label }))} />
          <FilterSelect value={s.category} onChange={(v) => set({ category: v })} placeholder="All categories" options={(cats.data ?? []).map((c) => ({ v: c.id, l: c.name }))} manage={can("categories.manage") ? { to: "/categories", label: "Add / edit categories" } : undefined} />
          <FilterSelect value={s.department} onChange={(v) => set({ department: v })} placeholder="All departments" options={(deps.data ?? []).map((c) => ({ v: c.id, l: c.name }))} manage={can("departments.manage") ? { to: "/departments", label: "Add / edit departments" } : undefined} />
          {isStaff && (
            <FilterSelect
              value={s.unassigned ? "unassigned" : s.agent}
              onChange={(v) => set(v === "unassigned" ? { unassigned: true, agent: undefined } : { agent: v, unassigned: undefined })}
              placeholder="Any agent"
              options={[{ v: "unassigned", l: "Unassigned" }, ...(staff.data ?? []).map((a) => ({ v: a.id, l: a.full_name }))]}
            />
          )}
          <FilterSelect value={createdRange} onChange={(v) => set({ from: v ? daysAgo(v) : undefined, to: undefined })} placeholder="Created: any time" options={dateRanges} />
          <FilterSelect value={s.updated ? dateRanges.find((r) => Math.abs(new Date(daysAgo(r.v)).getTime() - new Date(s.updated!).getTime()) < 86400000)?.v : undefined}
            onChange={(v) => set({ updated: v ? daysAgo(v) : undefined })} placeholder="Updated: any time" options={dateRanges} />
          <div className="flex items-center gap-1">
            <Input type="date" className="h-9 w-36 bg-card" aria-label="Created from"
              value={s.from && !createdRange ? s.from.slice(0, 10) : ""}
              onChange={(e) => set({ from: e.target.value ? new Date(e.target.value).toISOString() : undefined })} />
            <span className="text-xs text-muted-foreground">to</span>
            <Input type="date" className="h-9 w-36 bg-card" aria-label="Created to"
              value={s.to ? s.to.slice(0, 10) : ""}
              onChange={(e) => { if (!e.target.value) return void set({ to: undefined }); const d = new Date(e.target.value); d.setDate(d.getDate() + 1); set({ to: d.toISOString() }); }} />
          </div>
          <Select value={s.sort ?? "newest"} onValueChange={(v) => set({ sort: v as S["sort"] })}>
            <SelectTrigger className="h-9 w-full bg-card sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="updated">Recently updated</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" className="h-9" onClick={() => nav({ search: { size: s.size, sort: s.sort } })}>
              <X className="size-4" /> Clear filters
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs font-semibold ml-auto"
            onClick={() => {
              if (!rows.length) return void toast.info("No tickets to export.");
              exportTicketsToCsv(rows);
              toast.success(`Exported ${rows.length} tickets to CSV.`);
            }}
          >
            <Download className="size-3.5" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card shadow-card">
        {q.isLoading ? <TableSkeleton /> : q.isError ? <div className="p-4"><ErrorState onRetry={() => q.refetch()} /></div> : !rows.length ? (
          <div className="p-4">
            <EmptyState
              title={hasFilters ? "No tickets match your filters" : "No tickets yet"}
              description={hasFilters ? "Try different search terms or clear the filters." : "When tickets are created they'll appear here."}
              action={hasFilters ? <Button variant="outline" size="sm" onClick={() => nav({ search: {} })}>Clear filters</Button> : <Button asChild size="sm"><Link to="/tickets/new">Create a ticket</Link></Button>}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr className="border-b">
                  <th className="px-4 py-2.5 text-left font-medium">Ticket</th>
                  <th className="px-3 py-2.5 text-left font-medium">Subject</th>
                  {isStaff && <th className="px-3 py-2.5 text-left font-medium">Customer</th>}
                  {isStaff && <th className="hidden px-3 py-2.5 text-left font-medium xl:table-cell">Phone</th>}
                  <th className="hidden px-3 py-2.5 text-left font-medium md:table-cell">Category</th>
                  <th className="hidden px-3 py-2.5 text-left font-medium lg:table-cell">Department</th>
                  {isStaff && <th className="hidden px-3 py-2.5 text-left font-medium lg:table-cell">Agent</th>}
                  <th className="px-3 py-2.5 text-left font-medium">Status</th>
                  <th className="px-3 py-2.5 text-left font-medium">Priority</th>
                  <th className="px-3 py-2.5 text-left font-medium">SLA Target</th>
                  <th className="hidden px-3 py-2.5 text-left font-medium md:table-cell">Created</th>
                  <th className="hidden px-3 py-2.5 text-left font-medium xl:table-cell">Updated</th>
                  <th className="hidden px-3 py-2.5 text-left font-medium lg:table-cell">Last activity</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody className={q.isFetching ? "opacity-60" : ""}>
                {rows.map((t) => (
                  <tr key={t.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-2.5"><Link to="/tickets/$id" params={{ id: t.id }}><TicketId value={t.ticket_number} /></Link></td>
                    <td className="max-w-72 px-3 py-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link to="/tickets/$id" params={{ id: t.id }} className="line-clamp-1 font-medium hover:text-primary">
                          {t.subject}
                        </Link>
                        {t.snoozed_until && new Date(t.snoozed_until).getTime() > Date.now() && (
                          <span className="inline-flex items-center gap-0.5 rounded bg-indigo-500/15 px-1 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                            <Moon className="size-2.5" /> Snoozed
                          </span>
                        )}
                      </div>
                      {t.tags && t.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {t.tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className={cn("text-[10px] rounded px-1 py-0.2 border font-medium", getTagColor(tag))}>
                              #{tag}
                            </span>
                          ))}
                          {t.tags.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{t.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </td>
                    {isStaff && (
                      <td className="px-3 py-2.5">
                        <div className="max-w-44 truncate">{t.customer_name}</div>
                        <div className="max-w-44 truncate text-xs text-muted-foreground">{t.customer_email}</div>
                      </td>
                    )}
                    {isStaff && <td className="hidden whitespace-nowrap px-3 py-2.5 text-xs text-muted-foreground xl:table-cell">{t.customer_phone ?? "—"}</td>}
                    <td className="hidden px-3 py-2.5 text-muted-foreground md:table-cell">{t.category_name ?? "—"}</td>
                    <td className="hidden px-3 py-2.5 text-muted-foreground lg:table-cell">{t.department_name ?? "—"}</td>
                    {isStaff && <td className="hidden px-3 py-2.5 lg:table-cell">{t.agent_name ?? <span className="text-xs text-muted-foreground">Unassigned</span>}</td>}
                    <td className="px-3 py-2.5"><StatusBadge status={t.status} /></td>
                    <td className="px-3 py-2.5"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <CompactSlaBadge ticket={t} />
                        {t.csat_rating && <CompactCsatScore rating={t.csat_rating} />}
                        <CompactSentimentBadge sentiment={t.sentiment} />
                      </div>
                    </td>
                    <td className="hidden whitespace-nowrap px-3 py-2.5 text-xs text-muted-foreground md:table-cell">{format(new Date(t.created_at), "MMM d, yyyy")}</td>
                    <td className="hidden whitespace-nowrap px-3 py-2.5 text-xs text-muted-foreground xl:table-cell">{format(new Date(t.updated_at), "MMM d, HH:mm")}</td>
                    <td className="hidden whitespace-nowrap px-3 py-2.5 text-xs text-muted-foreground lg:table-cell">{formatDistanceToNow(new Date(t.last_activity_at), { addSuffix: true })}</td>
                    <td className="px-3 py-2.5 text-right">
                      <Button asChild variant="ghost" size="icon" className="size-8" aria-label="Open ticket">
                        <Link to="/tickets/$id" params={{ id: t.id }}><Eye className="size-4" /></Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-2.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            Rows per page
            <Select value={String(size)} onValueChange={(v) => set({ size: Number(v) })}>
              <SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger>
              <SelectContent>{[10, 25, 50, 100].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Page {page} of {pages}</span>
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => set({ page: page - 1 })}><ChevronLeft className="size-4" /> Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => set({ page: page + 1 })}>Next <ChevronRight className="size-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
