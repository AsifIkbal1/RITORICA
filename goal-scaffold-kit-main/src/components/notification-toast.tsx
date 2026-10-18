import { toast } from "sonner";
import { Bell, KeyRound, Mail, MessageCircle, Ticket, X, ArrowRight } from "lucide-react";
import { notificationCategory, type NotificationItem, type NotificationCategory } from "@/lib/notifications";
import { cn } from "@/lib/utils";

const STYLE: Record<NotificationCategory, { icon: typeof Bell; label: string; tone: string; bar: string }> = {
  all: { icon: Bell, label: "Notification", tone: "bg-primary/10 text-primary", bar: "bg-primary" },
  ticket: { icon: Ticket, label: "Ticket", tone: "bg-chart-1/15 text-chart-1", bar: "bg-chart-1" },
  chat: { icon: MessageCircle, label: "Chat", tone: "bg-chart-2/15 text-chart-2", bar: "bg-chart-2" },
  email: { icon: Mail, label: "Email", tone: "bg-chart-3/20 text-chart-3", bar: "bg-chart-3" },
  account: { icon: KeyRound, label: "Account", tone: "bg-chart-5/15 text-chart-5", bar: "bg-chart-5" },
};

const DURATION = 7000;

function NotificationToast({ n, onView, onClose }: { n: NotificationItem; onView: () => void; onClose: () => void }) {
  const s = STYLE[notificationCategory(n)];
  const Icon = s.icon;
  return (
    <div
      role="status"
      className="notif-toast group relative w-[min(92vw,380px)] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xl"
    >
      <div className={cn("absolute inset-y-0 left-0 w-1", s.bar)} />
      <button
        type="button"
        onClick={onView}
        className="flex w-full items-start gap-3 py-3.5 pl-4 pr-10 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
      >
        <span className={cn("mt-0.5 grid size-9 shrink-0 place-items-center rounded-full", s.tone)}>
          <Icon className="size-[18px]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {s.label}
            <span className="size-1 rounded-full bg-muted-foreground/50" />
            Just now
          </span>
          <span className="mt-0.5 block truncate font-display text-sm font-semibold">{n.title}</span>
          {n.message && <span className="mt-0.5 line-clamp-2 block text-[13px] leading-snug text-muted-foreground">{n.message}</span>}
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
            View <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </span>
        </span>
      </button>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onClose}
        className="absolute right-2 top-2 grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X className="size-4" />
      </button>
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-muted">
        <div className={cn("notif-toast-progress h-full", s.bar)} style={{ animationDuration: `${DURATION}ms` }} />
      </div>
    </div>
  );
}

/** Shows a branded popup for a newly arrived notification. */
export function showNotificationToast(n: NotificationItem, open: (n: NotificationItem) => void | Promise<void>) {
  toast.custom(
    (id) => (
      <NotificationToast
        n={n}
        onView={() => { toast.dismiss(id); void open(n); }}
        onClose={() => toast.dismiss(id)}
      />
    ),
    { duration: DURATION, id: `notif-${n.id}` },
  );
}
