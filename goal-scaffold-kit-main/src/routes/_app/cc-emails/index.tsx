import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Plus, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError } from "@/lib/constants";
import { Guard, meta } from "@/components/guard";
import { PageHeader, TableSkeleton, EmptyState } from "@/components/states";
import { TicketId } from "@/components/badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_app/cc-emails/")({
  head: () => meta("Manage CC Emails", "Review and remove CC'd email addresses on tickets."),
  component: () => <Guard staff><Page /></Guard>,
});

function Page() {
  const qc = useQueryClient();
  const [term, setTerm] = useState("");
  const q = useQuery({
    queryKey: ["cc-emails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ticket_cc_emails")
        .select("id, email, created_at, ticket:tickets(id, ticket_number, subject)")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data;
    },
  });
  const t = term.trim().toLowerCase();
  const rows = (q.data ?? []).filter((r) => !t || r.email.includes(t) || r.ticket?.ticket_number.toLowerCase().includes(t) || r.ticket?.subject.toLowerCase().includes(t));

  async function remove(id: string) {
    const { error } = await supabase.from("ticket_cc_emails").delete().eq("id", id);
    if (error) return void toast.error(friendlyError(error));
    toast.success("CC email removed");
    qc.invalidateQueries({ queryKey: ["cc-emails"] });
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Manage CC Emails" actions={<Button asChild><Link to="/cc-emails/new"><Plus className="size-4" /> Add CC emails</Link></Button>} />
      <div className="relative mb-3 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
        <Input className="pl-8" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search email or ticket…" />
      </div>
      <div className="overflow-hidden rounded-lg border bg-card shadow-card">
        {q.isLoading ? <TableSkeleton /> : !rows.length ? <div className="p-4"><EmptyState title="No CC emails" description="Add CC addresses to keep extra people informed about a ticket." /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr className="border-b"><th className="py-2.5 pl-4 pr-3 text-left font-medium">Email</th><th className="px-3 text-left font-medium">Ticket</th><th className="hidden px-3 text-left font-medium sm:table-cell">Added</th><th /></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-2.5 pl-4 pr-3 font-medium">{r.email}</td>
                  <td className="px-3">
                    {r.ticket && <Link to="/tickets/$id" params={{ id: r.ticket.id }} className="flex flex-col hover:underline"><TicketId value={r.ticket.ticket_number} /><span className="truncate text-xs text-muted-foreground">{r.ticket.subject}</span></Link>}
                  </td>
                  <td className="hidden px-3 text-xs text-muted-foreground sm:table-cell">{format(new Date(r.created_at), "MMM d, yyyy")}</td>
                  <td className="px-3 text-right"><Button size="icon" variant="ghost" className="size-8 text-destructive" aria-label="Remove" onClick={() => remove(r.id)}><Trash2 className="size-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
