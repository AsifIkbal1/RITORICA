import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { sendCustomerChatMessage, startChatFn, closeChatFn, getChatConversationsFn } from "@/lib/chat.functions";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { SendHorizontal, MessageCircle, Minus, X, LifeBuoy, Loader2, Bot, Headset, Ticket, History, MoreVertical, PhoneOff, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useChatAvailability, useUnreadChats, CHAT_STATUS_LABEL, UNAVAILABLE_TEXT, FRIENDLY_CHAT_ERROR, type ChatConversation } from "@/lib/chat";
import { ChatThread } from "./chat-thread";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Ctx = { open: (convId?: string) => void };
const ChatWidgetContext = createContext<Ctx>({ open: () => undefined });
export const useChatWidget = () => useContext(ChatWidgetContext);

/** Customer-only floating chat. Mount once inside the app shell. */
export function ChatWidgetProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const [state, setState] = useState<"closed" | "open" | "min">("closed");
  const [focusId, setFocusId] = useState<string | null>(null);
  const open = useCallback((convId?: string) => {
    setFocusId(convId ?? null);
    setState("open");
  }, []);
  return (
    <ChatWidgetContext.Provider value={{ open }}>
      {children}
      {enabled && <ChatWidget state={state} setState={setState} focusId={focusId} setFocusId={setFocusId} />}
    </ChatWidgetContext.Provider>
  );
}

function ChatWidget({
  state, setState, focusId, setFocusId,
}: {
  state: "closed" | "open" | "min";
  setState: (s: "closed" | "open" | "min") => void;
  focusId: string | null;
  setFocusId: (id: string | null) => void;
}) {
  const { session, profile } = useAuth();
  const uid = session?.user.id;
  const qc = useQueryClient();
  const nav = useNavigate();
  const avail = useChatAvailability(true);
  const unread = useUnreadChats().data ?? {};
  const [starting, setStarting] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [firstMsg, setFirstMsg] = useState("");
  const send = useServerFn(sendCustomerChatMessage);

  const current = useQuery({
    queryKey: ["chat", "my-open", uid, focusId],
    enabled: !!uid,
    refetchInterval: 3_000,
    queryFn: async () => {
      try {
        const list = await getChatConversationsFn({ data: { userId: uid, role: "customer" } });
        if (list && list.length > 0) {
          const match = focusId ? list.find((c) => c.id === focusId) : list.find((c) => c.status !== "closed");
          if (match) return match as unknown as ChatConversation;
        }
      } catch {}

      try {
        let q = supabase.from("chat_conversations").select("*").eq("customer_id", uid!);
        q = focusId ? q.eq("id", focusId) : q.neq("status", "closed");
        const { data, error } = await q.order("created_at", { ascending: false }).limit(1).maybeSingle();
        if (!error && data) return data as ChatConversation;
      } catch {}

      return null;
    },
  });
  const c = current.data;
  const unreadTotal = Object.values(unread).reduce((a, b) => a + b, 0);
  const humanOnline = !!avail.data?.human_online;
  const aiAvailable = !!avail.data?.ai_available;

  async function start(text?: string) {
    if (!uid) return;
    setStarting(true);
    setUnavailable(false);
    try {
      const res = await startChatFn({
        data: {
          customerId: uid,
          customerName: profile?.full_name || profile?.username || "Customer",
          customerEmail: profile?.email || `${profile?.username || "customer"}@ritorica.invalid`,
          firstMessage: text?.trim(),
        },
      });

      // Broadcast across tabs and frames
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel("supportdesk_chat");
          bc.postMessage({ conversation_id: res.conversation_id, action: "start" });
          setTimeout(() => bc.close(), 100);
        }
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem("supportdesk_chat_event", JSON.stringify({ conversation_id: res.conversation_id, time: Date.now() }));
        }
      } catch {}

      setFirstMsg("");
      setStarting(false);
      setFocusId(null);
      await qc.invalidateQueries({ queryKey: ["chat"] });
    } catch {
      setStarting(false);
      toast.error(FRIENDLY_CHAT_ERROR);
    }
  }

  async function endChat() {
    if (!c) return;
    try {
      await closeChatFn({ data: { conversationId: c.id, closedBy: uid } });
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel("supportdesk_chat");
          bc.postMessage({ conversation_id: c.id, action: "close" });
          setTimeout(() => bc.close(), 100);
        }
      } catch {}
      toast.success("Chat ended — you can find it in Chat History.");
      qc.invalidateQueries({ queryKey: ["chat"] });
    } catch {
      toast.error(FRIENDLY_CHAT_ERROR);
    }
  }

  async function createTicket() {
    if (!c) return void nav({ to: "/tickets/new" });
    const msgs = qc.getQueryData<{ sender_type: string; message: string }[]>(["chat", "messages", c.id]) ?? [];
    const first = msgs.find((m) => m.sender_type === "customer" && m.message)?.message ?? "";
    const subject = first ? `Chat: ${first.slice(0, 80)}` : "Live chat follow-up";
    const { data, error } = await supabase.rpc("create_ticket_from_chat", { _conv: c.id, _subject: subject });
    if (error) return void toast.error(FRIENDLY_CHAT_ERROR);
    const t = data as { ticket_id: string; ticket_number: string; existing: boolean };
    toast.success(t.existing ? `This chat is already linked to ${t.ticket_number}` : `Ticket ${t.ticket_number} created from this chat`);
    qc.invalidateQueries({ queryKey: ["chat"] });
    qc.invalidateQueries({ queryKey: ["tickets"] });
  }

  if (state === "closed")
    return (
      <button
        type="button"
        onClick={() => setState("open")}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-elevated transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Chat with Support"
      >
        <MessageCircle className="size-5" />
        <span className="hidden sm:inline">Chat with Support</span>
        {unreadTotal > 0 && (
          <span className="absolute -right-1 -top-1 rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">{unreadTotal}</span>
        )}
      </button>
    );

  const headerStatus = c && c.status !== "closed"
    ? c.status === "waiting_for_agent"
      ? { icon: Clock, text: "Waiting for a Support Agent" }
      : c.mode === "ai"
        ? { icon: Bot, text: "AI Support Assistant" }
        : { icon: Headset, text: `Connected to Support Agent${c.agent_name ? ` · ${c.agent_name}` : ""}` }
    : null;

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col overflow-hidden border bg-card shadow-elevated",
        state === "min" ? "bottom-5 right-5 w-72 rounded-xl" : "inset-0 sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(620px,calc(100vh-2.5rem))] sm:w-[380px] sm:rounded-xl",
      )}
      role="dialog"
      aria-label="Support chat"
    >
      <div className="flex items-center gap-2 bg-sidebar px-3 py-2.5 text-sidebar-accent-foreground">
        <div className="rounded-md bg-sidebar-primary p-1 text-sidebar-primary-foreground"><LifeBuoy className="size-4" /></div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm font-semibold leading-tight">SupportDesk</div>
          <div className="flex items-center gap-1.5 text-[11px] opacity-80">
            <span className={cn("size-2 rounded-full", humanOnline ? "bg-online" : aiAvailable ? "bg-away" : "bg-muted-foreground")} />
            {humanOnline ? "Online" : aiAvailable ? "AI assistant online" : "We usually reply soon"}
          </div>
        </div>
        {c && c.status !== "closed" && state === "open" && (
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded p-1 hover:bg-sidebar-accent" aria-label="Chat options"><MoreVertical className="size-4" /></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[60]">
              <DropdownMenuItem onClick={createTicket}><Ticket className="size-4" /> Create Ticket from Chat</DropdownMenuItem>
              {c.mode === "ai" && (
                <DropdownMenuItem onClick={async () => {
                  const { error } = await supabase.rpc("request_human", { _conv: c.id });
                  if (error) toast.error(FRIENDLY_CHAT_ERROR);
                  qc.invalidateQueries({ queryKey: ["chat"] });
                }}><Headset className="size-4" /> Talk to a human</DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => { setState("closed"); nav({ to: "/chat-history" }); }}><History className="size-4" /> Chat History</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={endChat}><PhoneOff className="size-4" /> End chat</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <button type="button" className="rounded p-1 hover:bg-sidebar-accent" aria-label={state === "min" ? "Expand chat" : "Minimize chat"} onClick={() => setState(state === "min" ? "open" : "min")}>
          <Minus className="size-4" />
        </button>
        <button type="button" className="rounded p-1 hover:bg-sidebar-accent" aria-label="Close chat" onClick={() => { setState("closed"); setFocusId(null); }}>
          <X className="size-4" />
        </button>
      </div>

      {state === "open" && (
        <>
          {headerStatus && (
            <div className={cn("flex items-center gap-1.5 border-b px-3 py-1.5 text-xs font-medium", c?.mode === "ai" && c.status !== "waiting_for_agent" ? "bg-chat-ai/10 text-chat-ai" : "bg-primary/5 text-primary")}>
              <headerStatus.icon className="size-3.5" /> {headerStatus.text}
              <span className="ml-auto text-[10px] font-normal text-muted-foreground">{c ? CHAT_STATUS_LABEL[c.status] : ""}</span>
            </div>
          )}
          {current.isLoading ? (
            <div className="flex flex-1 items-center justify-center"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
          ) : c ? (
            <>
              <ChatThread convId={c.id} viewer="customer" className="flex-1" onCreateTicket={createTicket} />
              {c.status === "closed" && (
                <div className="border-t p-2"><Button className="w-full" size="sm" onClick={() => { setFocusId(null); void start(); }} disabled={starting}>Start a new chat</Button></div>
              )}
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3 text-primary"><MessageCircle className="size-6" /></div>
              {unavailable ? (
                <>
                  <p className="text-sm">{UNAVAILABLE_TEXT}</p>
                  <Button onClick={() => { setState("closed"); nav({ to: "/tickets/new" }); }}><Ticket className="size-4" /> Create Support Ticket</Button>
                  <Button variant="ghost" size="sm" onClick={() => void start()} disabled={starting}>Check again</Button>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-display font-semibold">Hi! How can we help?</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {humanOnline ? "A Support Agent is online and ready to chat." : aiAvailable ? "Our AI Support Assistant can help right away, and a human agent can join when needed." : "Send us a message — our team will reply right here as soon as someone is available."}
                    </p>
                  </div>
                  <form
                    className="flex w-full items-end gap-1.5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (firstMsg.trim()) void start(firstMsg);
                    }}
                  >
                    <Textarea
                      autoFocus
                      rows={1}
                      value={firstMsg}
                      maxLength={5000}
                      placeholder="Type your message…"
                      className="max-h-28 min-h-9 resize-none rounded-2xl bg-muted/40 py-2 text-left text-sm"
                      onChange={(e) => setFirstMsg(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (firstMsg.trim()) void start(firstMsg);
                        }
                      }}
                    />
                    <Button type="submit" size="icon" className="size-9 shrink-0 rounded-full" aria-label="Send" disabled={starting || !firstMsg.trim()}>
                      {starting ? <Loader2 className="size-4 animate-spin" /> : <SendHorizontal className="size-4" />}
                    </Button>
                  </form>
                </>
              )}
              <button type="button" className="text-xs text-primary hover:underline" onClick={() => { setState("closed"); nav({ to: "/chat-history" }); }}>View chat history</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
