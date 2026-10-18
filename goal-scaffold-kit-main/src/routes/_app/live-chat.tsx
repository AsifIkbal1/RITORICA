import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import { Bot, Headset, MessageCircle, Hand, PhoneOff, ArrowLeftRight, Ticket, ArrowLeft, Mail, Phone, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { friendlyError } from "@/lib/constants";
import { useUnreadChats, CHAT_MODE_LABEL, type ChatConversation, type ChatMode } from "@/lib/chat";
import { getChatConversationsFn, takeOverChatFn, closeChatFn, setChatModeFn } from "@/lib/chat.functions";
import { useStaffAvailability } from "@/lib/presence-list";
import { Guard, meta } from "@/components/guard";
import { ChatThread } from "@/components/chat/chat-thread";
import { PresenceDot } from "@/components/chat/presence-toggle";
import { ChatStatusPill } from "@/components/chat/chat-status-pill";
import { PageHeader, EmptyState, TableSkeleton } from "@/components/states";
import { StatusBadge, PriorityBadge, TicketId } from "@/components/badges";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const search = z.object({ filter: z.string().optional(), c: z.string().optional() });

export const Route = createFileRoute("/_app/live-chat")({
  validateSearch: (s) => search.parse(s),
  head: () => meta("Live Chat", "Answer customer chats, take over AI conversations and manage the chat queue."),
  component: () => <Guard staff><LiveChat /></Guard>,
});

type Filter = { v: string; l: string; apply: (c: ChatConversation, uid: string) => boolean };

const ADMIN_FILTERS: Filter[] = [
  { v: "all", l: "All Chats", apply: () => true },
  { v: "active", l: "Active", apply: (c) => c.status === "active" || c.status === "waiting_for_customer" },
  { v: "waiting", l: "Waiting for Agent", apply: (c) => c.status === "waiting_for_agent" },
  { v: "ai", l: "AI", apply: (c) => c.mode === "ai" && c.status !== "closed" },
  { v: "human", l: "Human", apply: (c) => c.mode !== "ai" && c.status !== "closed" },
  { v: "unassigned", l: "Unassigned", apply: (c) => !c.assigned_agent_id && c.status !== "closed" },
  { v: "assigned", l: "Assigned", apply: (c) => !!c.assigned_agent_id && c.status !== "closed" },
  { v: "closed", l: "Ended", apply: (c) => c.status === "closed" },
];
const AGENT_FILTERS: Filter[] = [
  { v: "mine", l: "My Active Chats", apply: (c, uid) => c.assigned_agent_id === uid && c.status !== "closed" },
  { v: "queue", l: "Queue", apply: (c) => !c.assigned_agent_id && c.status !== "closed" },
  { v: "closed", l: "Ended", apply: (c, uid) => c.status === "closed" && c.assigned_agent_id === uid },
];

function LiveChat() {
  const s = Route.useSearch();
  const nav = useNavigate({ from: "/live-chat" });
  const qc = useQueryClient();
  const { session, isAdmin } = useAuth();
  const uid = session?.user.id ?? "";
  const filters = isAdmin ? ADMIN_FILTERS : AGENT_FILTERS;
  const filter = filters.find((f) => f.v === s.filter) ?? filters[0]!;
  const unread = useUnreadChats().data ?? {};

  const list = useQuery({
    queryKey: ["chat", "inbox"],
    refetchInterval: 3_000,
    queryFn: async () => {
      try {
        const local = await getChatConversationsFn({
          data: {
            userId: uid,
            role: isAdmin ? "admin" : "agent",
            filter: filter.v,
          },
        });
        if (local && local.length > 0) return local as unknown as ChatConversation[];
      } catch {}

      try {
        const { data, error } = await supabase.from("chat_conversations").select("*").order("last_message_at", { ascending: false }).limit(300);
        if (!error && data) return data;
      } catch {}

      try {
        const local = await getChatConversationsFn({
          data: {
            userId: uid,
            role: isAdmin ? "admin" : "agent",
            filter: filter.v,
          },
        });
        return (local || []) as unknown as ChatConversation[];
      } catch {}

      return [];
    },
  });

  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        bc = new BroadcastChannel("supportdesk_chat");
        bc.onmessage = () => {
          void qc.invalidateQueries({ queryKey: ["chat"] });
        };
      }
    } catch {}

    const onStorage = (e: StorageEvent) => {
      if (e.key === "supportdesk_chat_event") {
        void qc.invalidateQueries({ queryKey: ["chat"] });
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", onStorage);
    };
  }, [qc]);

  const all = list.data ?? [];
  const rows = all.filter((c) => filter.apply(c, uid));
  const selected = all.find((c) => c.id === s.c) ?? null;
  const count = (f: Filter) => all.filter((c) => f.apply(c, uid)).length;

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader title="Live Chat" description={isAdmin ? "All customer conversations — human and AI." : "Your chats and the customer queue."} />
      {isAdmin && <AvailabilityStrip />}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.v}
            type="button"
            onClick={() => nav({ search: { filter: f.v, c: s.c } })}
            className={cn("rounded-full border px-3 py-1 text-xs font-medium transition-colors", filter.v === f.v ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}
          >
            {f.l} <span className="ml-1 opacity-70">{count(f)}</span>
          </button>
        ))}
      </div>
      <div className="grid h-[calc(100vh-15rem)] min-h-[520px] gap-3 lg:grid-cols-[320px_1fr]">
        <div className={cn("overflow-hidden rounded-lg border bg-card shadow-card", selected && "hidden lg:block")}>
          <div className="h-full overflow-y-auto">
            {list.isLoading ? <TableSkeleton /> : !rows.length ? (
              <div className="p-3"><EmptyState title="No conversations here" description="New chats appear instantly." icon={<MessageCircle className="size-5" />} /></div>
            ) : rows.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => nav({ search: { filter: filter.v, c: c.id } })}
                className={cn("block w-full border-b px-3 py-2.5 text-left hover:bg-muted", s.c === c.id && "bg-accent")}
              >
                <div className="flex items-center gap-2">
                  {c.mode === "ai" ? <Bot className="size-3.5 shrink-0 text-chat-ai" /> : <Headset className="size-3.5 shrink-0 text-primary" />}
                  <span className="flex-1 truncate text-sm font-medium">{c.customer_name || c.customer_email}</span>
                  {!!unread[c.id] && <span className="rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">{unread[c.id]}</span>}
                </div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">{c.last_message ?? "No messages yet"}</div>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <ChatStatusPill status={c.status} />
                  <span>{c.agent_name ?? (c.mode === "ai" ? "AI" : "Unassigned")}</span>
                  <span className="ml-auto">{formatDistanceToNow(new Date(c.last_message_at), { addSuffix: true })}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        {selected ? (
          <ChatPanel key={selected.id} c={selected} onBack={() => nav({ search: { filter: filter.v } })} />
        ) : (
          <div className="hidden items-center justify-center rounded-lg border bg-card text-sm text-muted-foreground shadow-card lg:flex">Select a conversation</div>
        )}
      </div>
    </div>
  );
}

function AvailabilityStrip() {
  const q = useStaffAvailability();
  const agents = (q.data ?? []).filter((a) => a.roles.includes("agent"));
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg border bg-card px-3 py-2 text-xs shadow-card">
      <span className="font-semibold">Agent availability:</span>
      {!agents.length && <span className="text-muted-foreground">No support agents yet</span>}
      {agents.map((a) => (
        <span key={a.id} className="flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5">
          <PresenceDot status={a.status} /> {a.full_name || a.email} <span className="text-muted-foreground">· {a.active_chats} chats</span>
        </span>
      ))}
    </div>
  );
}

function ChatPanel({ c, onBack }: { c: ChatConversation; onBack: () => void }) {
  const { session, profile, isAdmin, can } = useAuth();
  const uid = session?.user.id;
  const qc = useQueryClient();
  const staff = useStaffAvailability();
  const mine = c.assigned_agent_id === uid;
  const closed = c.status === "closed";
  const canTransfer = isAdmin || (mine && can("tickets.assign"));

  const customer = useQuery({
    queryKey: ["chat", "customer", c.customer_id],
    queryFn: async () => {
      const [p, t] = await Promise.all([
        supabase.from("profiles").select("full_name, email, phone, created_at").eq("id", c.customer_id).maybeSingle(),
        supabase.from("tickets").select("id, ticket_number, subject, status, priority, created_at").eq("customer_id", c.customer_id).order("created_at", { ascending: false }).limit(5),
      ]);
      return { profile: p.data, tickets: t.data ?? [] };
    },
  });

  const handleTakeOver = async () => {
    try {
      await takeOverChatFn({
        data: {
          conversationId: c.id,
          agentId: uid!,
          agentName: profile?.full_name || "Support Agent",
        },
      });
      try {
        await supabase.rpc("take_over_chat", { _conv: c.id });
      } catch {}
      toast.success("You took over this chat");
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel("supportdesk_chat");
          bc.postMessage({ type: "chat_updated", conversation_id: c.id });
          bc.close();
        }
      } catch {}
      qc.invalidateQueries({ queryKey: ["chat"] });
    } catch (err) {
      toast.error(friendlyError(err));
    }
  };

  const handleAssign = async (agentId: string) => {
    try {
      const ag = (staff.data ?? []).find((a) => a.id === agentId);
      await takeOverChatFn({
        data: {
          conversationId: c.id,
          agentId: agentId,
          agentName: ag?.full_name || ag?.email || "Support Agent",
        },
      });
      try {
        await supabase.rpc("assign_chat", { _conv: c.id, _agent: agentId });
      } catch {}
      toast.success("Chat assigned");
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel("supportdesk_chat");
          bc.postMessage({ type: "chat_updated", conversation_id: c.id });
          bc.close();
        }
      } catch {}
      qc.invalidateQueries({ queryKey: ["chat"] });
    } catch (err) {
      toast.error(friendlyError(err));
    }
  };

  const handleSwitchMode = async (v: ChatMode) => {
    try {
      await setChatModeFn({
        data: {
          conversationId: c.id,
          mode: v as "human" | "ai" | "hybrid",
        },
      });
      try {
        await supabase.rpc("set_chat_mode", { _conv: c.id, _mode: v });
      } catch {}
      toast.success("Chat mode switched");
      qc.invalidateQueries({ queryKey: ["chat"] });
    } catch (err) {
      toast.error(friendlyError(err));
    }
  };

  const handleClose = async () => {
    try {
      await closeChatFn({
        data: {
          conversationId: c.id,
          closedBy: uid,
        },
      });
      try {
        await supabase.rpc("close_chat", { _conv: c.id });
      } catch {}
      toast.success("Chat ended");
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel("supportdesk_chat");
          bc.postMessage({ type: "chat_closed", conversation_id: c.id });
          bc.close();
        }
      } catch {}
      qc.invalidateQueries({ queryKey: ["chat"] });
    } catch (err) {
      toast.error(friendlyError(err));
    }
  };

  const createTicket = async () => {
    const msgs = qc.getQueryData<{ sender_type: string; message: string }[]>(["chat", "messages", c.id]) ?? [];
    const first = msgs.find((m) => m.sender_type === "customer" && m.message)?.message ?? "";
    const { data, error } = await supabase.rpc("create_ticket_from_chat", { _conv: c.id, _subject: first ? `Chat: ${first.slice(0, 80)}` : "Live chat follow-up" });
    if (error) return void toast.error(friendlyError(error));
    const t = data as { ticket_number: string; existing: boolean };
    toast.success(t.existing ? `Already linked to ${t.ticket_number}` : `Ticket ${t.ticket_number} created`);
    qc.invalidateQueries({ queryKey: ["chat"] });
  };

  const waitingSince = c.status === "waiting_for_agent" ? formatDistanceToNow(new Date(c.updated_at)) : null;

  return (
    <div className="grid min-h-0 gap-3 xl:grid-cols-[1fr_280px]">
      <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border bg-card shadow-card">
        <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
          <Button size="icon" variant="ghost" className="size-8 lg:hidden" onClick={onBack} aria-label="Back"><ArrowLeft className="size-4" /></Button>
          <div className="min-w-0 basis-full">
            <div className="truncate text-sm font-semibold">{c.customer_name || c.customer_email}</div>
            <div className="flex flex-wrap items-center gap-1.5 whitespace-nowrap text-[11px] text-muted-foreground">
              <ChatStatusPill status={c.status} />
              <Badge variant="outline" className="h-4 px-1 text-[10px]">{CHAT_MODE_LABEL[c.mode]}</Badge>
              <span>{c.agent_name ? `Agent: ${c.agent_name}` : c.mode === "ai" ? "AI Support Assistant" : "Unassigned"}</span>
              {waitingSince && <span className="flex items-center gap-0.5 text-destructive"><Clock className="size-3" /> waiting {waitingSince}</span>}
            </div>
          </div>
          {!closed && !mine && (
            <Button size="sm" onClick={handleTakeOver}>
              <Hand className="size-4" /> Take Over Chat
            </Button>
          )}
          {!closed && canTransfer && (
            <Select onValueChange={handleAssign}>
              <SelectTrigger className="h-8 w-40 text-xs"><ArrowLeftRight className="size-3.5" /><SelectValue placeholder={c.assigned_agent_id ? "Reassign / transfer" : "Assign agent"} /></SelectTrigger>
              <SelectContent>
                {(staff.data ?? []).filter((a) => a.id !== c.assigned_agent_id).map((a) => (
                  <SelectItem key={a.id} value={a.id}><span className="flex items-center gap-1.5"><PresenceDot status={a.status} /> {a.full_name || a.email}</span></SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {!closed && isAdmin && (
            <Select value={c.mode} onValueChange={(v) => handleSwitchMode(v as ChatMode)}>
              <SelectTrigger className="h-8 w-28 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ai">AI mode</SelectItem>
                <SelectItem value="human">Human mode</SelectItem>
              </SelectContent>
            </Select>
          )}
          {!closed && (mine || isAdmin) && (
            <Button size="sm" variant="outline" className="text-destructive" onClick={handleClose}>
              <PhoneOff className="size-4" /> End
            </Button>
          )}
        </div>
        <ChatThread convId={c.id} viewer="staff" className="min-h-0 flex-1" />
      </div>

      <aside className="hidden space-y-3 overflow-y-auto xl:block">
        <div className="rounded-lg border bg-card p-3 text-sm shadow-card">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer</div>
          <Link to="/customers/$id" params={{ id: c.customer_id }} className="font-medium text-primary hover:underline">{customer.data?.profile?.full_name || c.customer_name}</Link>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="size-3" /> {customer.data?.profile?.email ?? c.customer_email}</div>
          {customer.data?.profile?.phone && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="size-3" /> {customer.data.profile.phone}</div>}
          <div className="mt-2 text-xs text-muted-foreground">Chat started {format(new Date(c.created_at), "MMM d, h:mm a")}</div>
        </div>
        <div className="rounded-lg border bg-card p-3 text-sm shadow-card">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Related tickets</span>
            {!c.ticket_id && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={createTicket}><Ticket className="size-3" /> Create Ticket from Chat</Button>}
          </div>
          {!customer.data?.tickets.length ? <p className="text-xs text-muted-foreground">No tickets yet.</p> : (
            <ul className="space-y-2">
              {customer.data.tickets.map((t) => (
                <li key={t.id}>
                  <Link to="/tickets/$id" params={{ id: t.id }} className="block rounded-md border p-2 hover:bg-muted">
                    <div className="flex items-center gap-1.5"><TicketId value={t.ticket_number} />{t.id === c.ticket_id && <Badge className="h-4 px-1 text-[9px]">Linked</Badge>}</div>
                    <div className="truncate text-xs">{t.subject}</div>
                    <div className="mt-1 flex gap-1"><StatusBadge status={t.status} /><PriorityBadge priority={t.priority} /></div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
