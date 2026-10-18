import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useNotifications, useMarkRead, NOTIFICATION_CATEGORIES, type NotificationItem, type NotificationCategory } from "@/lib/notifications";
import { friendlyError } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useChatWidget } from "./chat/chat-widget";

export function useOpenNotification() {
  const nav = useNavigate();
  const { isStaff } = useAuth();
  const widget = useChatWidget();
  const markRead = useMarkRead();
  return async (n: NotificationItem) => {
    try {
      if (!n.is_read) await markRead(n.id);
    } catch (e) {
      toast.error(friendlyError(e));
    }
    if (n.ticket_id) nav({ to: "/tickets/$id", params: { id: n.ticket_id } });
    else if (n.chat_id) {
      if (isStaff) nav({ to: "/live-chat", search: { c: n.chat_id } });
      else widget.open(n.chat_id);
    } else if (n.type === "mail_reply") nav({ to: "/mail" });
    else if (n.type === "password_reset_code") nav({ to: "/admin/dashboard" });
  };
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState<NotificationCategory>("all");
  const q = useNotifications(8, cat);
  const totalUnread = useNotifications(1).data?.unread ?? 0;
  const markRead = useMarkRead();
  const openN = useOpenNotification();
  const data = q.data;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications${totalUnread ? ` (${totalUnread} unread)` : ""}`}>
          <Bell className="size-5" />
          {!!totalUnread && (
            <span className="absolute right-1 top-1 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
              {totalUnread > 99 ? "99+" : totalUnread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <span className="text-sm font-semibold">
            Notifications {!!data?.unread && <span className="ml-1 text-xs font-normal text-muted-foreground">{data.unread} unread</span>}
          </span>
          <button
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-40"
            disabled={!data?.unread}
            onClick={() => markRead().catch((e) => toast.error(friendlyError(e)))}
          >
            <CheckCheck className="size-3.5" /> Mark all as read
          </button>
        </div>
        <div className="flex gap-1 border-b px-2 py-1.5" role="tablist" aria-label="Filter notifications">
          {NOTIFICATION_CATEGORIES.map((c) => (
            <button key={c.value} type="button" role="tab" aria-selected={cat === c.value} onClick={() => setCat(c.value)}
              className={cn("rounded-full px-2.5 py-0.5 text-xs transition-colors", cat === c.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
              {c.label}
            </button>
          ))}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {q.isError && (
            <div className="p-6 text-center text-sm">
              <p className="text-muted-foreground">Couldn't load notifications.</p>
              <button className="mt-2 text-xs font-medium text-primary hover:underline" onClick={() => q.refetch()}>Try again</button>
            </div>
          )}
          {q.isLoading && <p className="p-6 text-center text-sm text-muted-foreground">Loading…</p>}
          {q.isSuccess && !data?.items.length && <p className="p-6 text-center text-sm text-muted-foreground">You're all caught up.</p>}
          {data?.items.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => { setOpen(false); void openN(n); }}
              className={cn("block w-full border-b px-3 py-2.5 text-left text-sm last:border-0 hover:bg-muted", !n.is_read && "bg-accent/50")}
            >
              <div className="flex items-start gap-2">
                <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.is_read ? "bg-transparent" : "bg-primary")} />
                <div className="min-w-0 flex-1">
                  <div className={cn("text-sm", !n.is_read ? "font-semibold" : "font-medium")}>{n.title}</div>
                  <div className="truncate text-xs text-muted-foreground">{n.message}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    {n.ticket && <span className="font-mono text-primary">{n.ticket.ticket_number}</span>}
                    {n.chat_id && <span className="font-medium text-primary">Live chat</span>}
                    <span>{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <Link to="/notifications" onClick={() => setOpen(false)} className="block border-t px-3 py-2 text-center text-xs font-medium text-primary hover:bg-muted">
          View all notifications
        </Link>
      </PopoverContent>
    </Popover>
  );
}
