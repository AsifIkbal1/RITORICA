import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Guard, meta } from "@/components/guard";
import { PageHeader, TableSkeleton, EmptyState, ErrorState } from "@/components/states";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/customers/")({
  head: () => meta("Customers", "Customer directory with ticket history."),
  component: () => <Guard perm="customers.view"><Customers /></Guard>,
});

import { getCustomersListFn } from "@/lib/tickets.functions";

const SIZE = 25;
function Customers() {
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);
  const res = useQuery({
    queryKey: ["customers", term, page],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const local = await getCustomersListFn({ data: { q: term || undefined, page, size: SIZE } });
        if (local && local.length > 0) return local;
      } catch {}
      const { data, error } = await supabase.rpc("customer_list", ({ _q: term || undefined, _limit: SIZE, _offset: (page - 1) * SIZE } as never));
      if (error) throw error;
      return data;
    },
  });
  const rows = res.data ?? [];
  const total = Number(rows[0]?.total_count ?? 0);
  const pages = Math.max(1, Math.ceil(total / SIZE));
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Customers" description={`${total} customers`} />
      <form className="relative mb-4 max-w-md" onSubmit={(e) => { e.preventDefault(); setTerm(q.trim()); setPage(1); }}>
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="bg-card pl-8" placeholder="Search name, email or phone…" value={q} onChange={(e) => setQ(e.target.value)} />
      </form>
      <div className="overflow-hidden rounded-lg border bg-card shadow-card">
        {res.isLoading ? <TableSkeleton /> : res.isError ? <div className="p-4"><ErrorState onRetry={() => res.refetch()} /></div> : !rows.length ? (
          <div className="p-4"><EmptyState title="No customers found" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr className="border-b">
                  {["Name", "Email", "Phone", "Total", "Open", "Solved", "Last activity", "Registered", "Status", ""].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-left font-medium first:pl-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/40">
                    <td className="py-2.5 pl-4 pr-3 font-medium"><Link to="/customers/$id" params={{ id: c.id }} className="hover:text-primary">{c.full_name}</Link></td>
                    <td className="px-3 py-2.5 text-muted-foreground">{c.email}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{c.phone ?? "—"}</td>
                    <td className="px-3 py-2.5 tabular-nums">{c.total}</td>
                    <td className="px-3 py-2.5 tabular-nums">{c.open}</td>
                    <td className="px-3 py-2.5 tabular-nums">{c.solved}</td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{c.last_activity ? formatDistanceToNow(new Date(c.last_activity), { addSuffix: true }) : "—"}</td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{format(new Date(c.created_at), "MMM d, yyyy")}</td>
                    <td className="px-3 py-2.5"><Badge variant={c.is_active ? "secondary" : "destructive"}>{c.is_active ? "Active" : "Disabled"}</Badge></td>
                    <td className="px-3 py-2.5 text-right"><Button asChild size="sm" variant="ghost"><Link to="/customers/$id" params={{ id: c.id }}>View</Link></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-end gap-2 border-t px-4 py-2.5 text-sm">
          <span className="text-muted-foreground">Page {page} of {pages}</span>
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="size-4" /></Button>
          <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage(page + 1)}><ChevronRight className="size-4" /></Button>
        </div>
      </div>
    </div>
  );
}
