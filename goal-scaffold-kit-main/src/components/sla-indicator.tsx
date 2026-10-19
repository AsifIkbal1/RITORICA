import { useSlaTimer, getTicketSla } from "@/lib/sla";
import { format } from "date-fns";
import { Clock, AlertTriangle, CheckCircle2, Flame, ShieldAlert, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SlaCountdownBar({
  ticket,
  onEscalate,
  isStaff,
}: {
  ticket: {
    id: string;
    priority?: string | null;
    status?: string | null;
    created_at: string;
    ticket_number?: string;
  };
  onEscalate?: () => void;
  isStaff?: boolean;
}) {
  const sla = useSlaTimer(ticket);
  if (!sla) return null;

  const isCompleted = sla.stage === "completed";

  return (
    <div
      className={cn(
        "rounded-lg border p-3.5 transition-all",
        isCompleted
          ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-950 dark:text-emerald-100"
          : sla.isBreached
          ? "border-destructive/30 bg-destructive/5 text-destructive-foreground dark:bg-destructive/10"
          : sla.isWarning
          ? "border-amber-500/30 bg-amber-500/5 text-amber-950 dark:text-amber-100"
          : "border-primary/20 bg-primary/5 text-foreground"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <div className="flex size-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          ) : sla.isBreached ? (
            <div className="flex size-7 items-center justify-center rounded-full bg-destructive/15 text-destructive animate-pulse">
              <ShieldAlert className="size-4" />
            </div>
          ) : sla.isWarning ? (
            <div className="flex size-7 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 animate-pulse">
              <AlertTriangle className="size-4" />
            </div>
          ) : (
            <div className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Clock className="size-4" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span>
                {sla.stage === "response"
                  ? "SLA First Response Target"
                  : sla.stage === "resolution"
                  ? "SLA Resolution Target"
                  : "SLA Completed"}
              </span>
              <span className="text-muted-foreground font-normal">
                ({sla.slaConfig.label})
              </span>
            </div>
            <div className="text-sm font-bold tracking-tight">
              {sla.remainingFormatted}
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                (Target due by {format(sla.dueAt, "hh:mm a, MMM d")})
              </span>
            </div>
          </div>
        </div>

        {/* Action button if SLA breached or staff wants to escalate */}
        {isStaff && !isCompleted && onEscalate && (
          <Button
            size="sm"
            variant={sla.isBreached ? "destructive" : "outline"}
            className="h-7 text-xs gap-1 font-semibold shadow-xs"
            onClick={onEscalate}
          >
            <Flame className="size-3.5 text-amber-400" />
            {sla.isBreached ? "Auto-Escalate Ticket" : "Escalate to Super Admin"}
          </Button>
        )}
      </div>

      {/* SLA Progress Bar */}
      {!isCompleted && (
        <div className="mt-2.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
            <div
              className={cn(
                "h-full transition-all duration-500",
                sla.isBreached
                  ? "bg-destructive w-full"
                  : sla.isWarning
                  ? "bg-amber-500"
                  : "bg-primary"
              )}
              style={{ width: `${sla.percentUsed}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function CompactSlaBadge({
  ticket,
}: {
  ticket: {
    priority?: string | null;
    status?: string | null;
    created_at: string;
  };
}) {
  const sla = useSlaTimer(ticket);
  if (!sla) return null;

  if (sla.stage === "completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="size-3" /> Met
      </span>
    );
  }

  if (sla.isBreached) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-destructive/15 px-1.5 py-0.5 text-[10px] font-bold text-destructive animate-pulse">
        <ShieldAlert className="size-3" /> SLA Breached
      </span>
    );
  }

  if (sla.isWarning) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
        <AlertTriangle className="size-3" /> {sla.remainingFormatted}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      <Clock className="size-3 text-primary" /> {sla.remainingFormatted}
    </span>
  );
}
