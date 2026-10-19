import { Check, Clock, UserCheck, Wrench, MessageSquare, CheckCircle2 } from "lucide-react";
import type { TicketStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Step = {
  id: number;
  label: string;
  description: string;
  icon: typeof Check;
};

const STEPS: Step[] = [
  { id: 1, label: "Submitted", description: "Queued & AI Classified", icon: Clock },
  { id: 2, label: "Assigned", description: "Support Staff Reviewing", icon: UserCheck },
  { id: 3, label: "Investigating", description: "Engineering / NOC Analysis", icon: Wrench },
  { id: 4, label: "Action & Reply", description: "Solution / Verification", icon: MessageSquare },
  { id: 5, label: "Resolved", description: "Issue Solved & Closed", icon: CheckCircle2 },
];

export function TicketProgressTracker({
  status,
  isAssigned,
  isCustomer,
}: {
  status: TicketStatus;
  isAssigned: boolean;
  isCustomer?: boolean;
}) {
  let activeStep = 1;

  if (status === "solved" || status === "closed") {
    activeStep = 5;
  } else if (status === "awaiting_user_reply" || status === "answered") {
    activeStep = 4;
  } else if (status === "in_progress" || status === "reopened") {
    activeStep = 3;
  } else if (isAssigned) {
    activeStep = 2;
  } else {
    activeStep = 1;
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-card">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {isCustomer ? "Ticket Resolution Progress" : "Workflow Stage"}
        </span>
        <span className="text-xs font-medium text-primary">
          Step {activeStep} of {STEPS.length} · {STEPS[activeStep - 1]?.label}
        </span>
      </div>

      {/* Stepper Bar */}
      <div className="relative mt-4">
        {/* Connector Line */}
        <div className="absolute left-4 top-4 -translate-y-1/2 w-[calc(100%-32px)] h-0.5 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((activeStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {STEPS.map((s) => {
            const isCompleted = s.id < activeStep || activeStep === 5;
            const isCurrent = s.id === activeStep && activeStep !== 5;
            const Icon = s.icon;

            return (
              <div key={s.id} className="flex flex-col items-center group">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all z-10",
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white dark:text-emerald-950"
                      : isCurrent
                      ? "border-primary bg-background text-primary ring-4 ring-primary/20 animate-pulse"
                      : "border-muted-foreground/30 bg-muted/60 text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="size-4 stroke-[3]" /> : <Icon className="size-3.5" />}
                </div>

                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-xs font-semibold whitespace-nowrap",
                      isCurrent
                        ? "text-primary"
                        : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </p>
                  <p className="hidden sm:block text-[10px] text-muted-foreground mt-0.5 max-w-[100px] truncate">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
