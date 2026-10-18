import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CheckCheck, ExternalLink, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import {
  useNotifications, useMarkRead, NOTIFICATION_CATEGORIES, notificationCategory, isNotificationSoundOn, setNotificationSound, playNotificationSound, publishNotification,
  type NotificationCategory,
} from "@/lib/notifications";
import { useOpenNotification } from "@/components/notification-bell";
import { friendlyError } from "@/lib/constants";
import { meta } from "@/components/guard";
import { PageHeader, TableSkeleton, EmptyState, ErrorState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/notifications")({
  head: () => meta("Notifications", "Your notification history, filtered by tickets, chats and email."),
  component: Page,
});

const CATEGORY_LABEL: Record<NotificationCategory, string> = { all: "All", ticket: "Ticket", chat: "Chat", email: "Email", account: "Account" };

function Page() {
  const [limit, setLimit] = useState(20);
  const [cat, setCat] = useState<NotificationCategory>("all");
  const [sound, setSound] = useState(true);
  useEffect(() => setSound(isNotificationSoundOn()), []);
  const q = useNotifications(limit, cat);
  const markRead = useMarkRead();
  const openN = useOpenNotification();
  const run = (p: Promise<unknown>) => p.catch((e) => toast.error(friendlyError(e)));
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Notifications"
        description={`${q.data?.unread ?? 0} unread${cat === "all" ? "" : ` in ${CATEGORY_LABEL[cat]}`}`}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                publishNotification({
                  type: "ticket",
                  title: "Test Alert",
                  message: "Pop-up notification and chime sound tested successfully!",
                  target_role: "all",
                });
              }}
            >
              Test Alert & Sound
            </Button>
            <Button variant="outline" onClick={() => {
              const next = !sound; setNotificationSound(next); setSound(next);
              if (next) playNotificationSound();
            }}>
              {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />} Sound {sound ? "on" : "off"}
            </Button>
            <Button variant="outline" disabled={!q.data?.unread} onClick={() => run(markRead())}><CheckCheck className="size-4" /> Mark all as read</Button>
          </>
        }
      />
      <Tabs value={cat} onValueChange={(v) => { setCat(v as NotificationCategory); setLimit(20); }} className="mb-3">
        <TabsList>
          {NOTIFICATION_CATEGORIES.map((c) => <TabsTrigger key={c.value} value={c.value}>{c.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>
      {q.isError ? <ErrorState onRetry={() => q.refetch()} /> : (
        <div className="overflow-hidden rounded-lg border bg-card shadow-card">
          {q.isLoading ? <TableSkeleton /> : !q.data?.items.length ? <div className="p-4"><EmptyState title="You're all caught up." description="New ticket, chat and email updates will appear here." /></div> : (
            <ul className="divide-y">
              {q.data.items.map((n) => (
                <li key={n.id} className={cn("flex items-start gap-3 px-4 py-3", !n.is_read && "bg-accent/40")}>
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.is_read ? "bg-transparent" : "bg-primary")} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm", !n.is_read ? "font-semibold" : "font-medium")}>{n.title}</span>
                      <Badge variant="outline" className="text-[10px]">{CATEGORY_LABEL[notificationCategory(n)]}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{n.message}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      {n.ticket && <span className="font-mono text-primary">{n.ticket.ticket_number}</span>}
                      <span>{format(new Date(n.created_at), "MMM d, yyyy HH:mm")}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {(n.ticket_id || n.chat_id) && <Button size="sm" variant="outline" onClick={() => run(openN(n))}><ExternalLink className="size-3.5" /> Open</Button>}
                    {!n.is_read && <Button size="sm" variant="ghost" onClick={() => run(markRead(n.id))}>Mark read</Button>}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {q.data?.hasMore && (
            <div className="border-t p-3 text-center">
              <Button variant="outline" size="sm" disabled={q.isFetching} onClick={() => setLimit((l) => l + 20)}>{q.isFetching ? "Loading…" : "Load older notifications"}</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
