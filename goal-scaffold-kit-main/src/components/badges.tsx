import { STATUSES, PRIORITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const s = STATUSES.find((x) => x.value === status);
  if (!s) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
        className,
      )}
      style={{
        color: s.color,
        borderColor: `color-mix(in oklch, ${s.color} 30%, transparent)`,
        backgroundColor: `color-mix(in oklch, ${s.color} 9%, transparent)`,
      }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {s.label}
    </span>
  );
}

export function PriorityBadge({ priority, className }: { priority: string; className?: string }) {
  const p = PRIORITIES.find((x) => x.value === priority);
  if (!p) return null;
  const urgent = p.value === "urgent";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        className,
      )}
      style={
        urgent
          ? { backgroundColor: p.color, color: "var(--primary-foreground)" }
          : { color: p.color, backgroundColor: `color-mix(in oklch, ${p.color} 10%, transparent)` }
      }
    >
      {urgent && <AlertTriangle className="size-3" />}
      {p.label}
    </span>
  );
}

export function TicketId({ value }: { value: string }) {
  return <span className="font-mono text-xs font-medium text-primary">{value}</span>;
}
