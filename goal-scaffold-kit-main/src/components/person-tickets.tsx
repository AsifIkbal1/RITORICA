import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { StatusBadge, PriorityBadge, TicketId } from "./badges";
import { EmptyState } from "./states";

type Row = { id: string; ticket_number: string; subject: string; status: string; priority: string; created_at: string };

export function MiniTicketTable({ rows }: { rows: Row[] }) {
  if (!rows.length) return <EmptyState title="No tickets" />;
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((t) => (
            <tr key={t.id} className="border-b last:border-0 hover:bg-muted/40">
              <td className="py-2 pl-4 pr-3"><TicketId value={t.ticket_number} /></td>
              <td className="px-3 py-2"><Link to="/tickets/$id" params={{ id: t.id }} className="line-clamp-1 font-medium hover:text-primary">{t.subject}</Link></td>
              <td className="px-3 py-2"><StatusBadge status={t.status} /></td>
              <td className="px-3 py-2"><PriorityBadge priority={t.priority} /></td>
              <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">{format(new Date(t.created_at), "MMM d, yyyy")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatTile({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-card">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
