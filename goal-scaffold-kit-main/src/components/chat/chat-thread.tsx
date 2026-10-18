import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { format, isToday, isYesterday } from "date-fns";
import { toast } from "sonner";
import { Bot, Headset, Paperclip, SendHorizontal, Loader2, FileText, X, RotateCw, UserRound, Ticket, ArrowDown, CheckCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { friendlyError } from "@/lib/constants";
import {
  useChatRoom, uploadChatFile, validateChatFile, chatFileUrl, FRIENDLY_CHAT_ERROR, UNAVAILABLE_TEXT,
  type ChatMessage, type ChatConversation,
} from "@/lib/chat";
import { sendChatMessageFn, requestHumanChatFn, takeOverChatFn } from "@/lib/chat.functions";
import { publishNotification } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Pending = { client_id: string; message: string; attachment_name?: string | undefined; created_at: string };

function when(d: string) {
  return format(new Date(d), "h:mm a");
}
function dayLabel(d: string) {
  const dt = new Date(d);
  return isToday(dt) ? "Today" : isYesterday(dt) ? "Yesterday" : format(dt, "EEEE, MMM d");
}
function DaySep({ d }: { d: string }) {
  return (
    <div className="sticky top-0 z-10 my-3 flex justify-center">
      <span className="rounded-full border bg-card/90 px-3 py-0.5 text-[11px] font-medium text-muted-foreground shadow-card backdrop-blur">{dayLabel(d)}</span>
    </div>
  );
}

function Attachment({ m }: { m: Pick<ChatMessage, "attachment_url" | "attachment_name" | "attachment_type"> }) {
  const [url, setUrl] = useState<string | null>(null);
  const name = m.attachment_name ?? "";
  const isImg = (m.attachment_type ?? "").startsWith("image/") || /\.(jpe?g|png|gif|webp)$/i.test(name) || /\.(jpe?g|png|gif|webp)$/i.test(m.attachment_url ?? "");

  useEffect(() => {
    if (!m.attachment_url) return;
    if (m.attachment_url.startsWith("/uploads/") || m.attachment_url.startsWith("data:") || m.attachment_url.startsWith("http")) {
      setUrl(m.attachment_url);
      return;
    }
    chatFileUrl(m.attachment_url).then(setUrl).catch(() => setUrl(null));
  }, [m.attachment_url]);

  if (!m.attachment_url) return null;
  const open = async () => {
    try {
      const target = await chatFileUrl(m.attachment_url!, m.attachment_name ?? undefined);
      if (target) window.open(target, "_blank", "noopener");
    } catch (e) {
      if (m.attachment_url) window.open(m.attachment_url, "_blank", "noopener");
    }
  };

  return isImg && (url || m.attachment_url) ? (
    <button type="button" onClick={open} className="mt-1 block overflow-hidden rounded-md border bg-black/5 hover:opacity-90">
      <img src={url || m.attachment_url} alt={m.attachment_name ?? "attachment"} className="max-h-56 max-w-full rounded object-contain" />
    </button>
  ) : (
    <button type="button" onClick={open} className="mt-1 flex items-center gap-1.5 rounded-md border bg-background/80 px-2.5 py-1.5 text-xs font-medium underline-offset-2 hover:underline">
      <FileText className="size-4 text-primary shrink-0" />
      <span className="truncate max-w-[200px]">{m.attachment_name ?? "Attachment"}</span>
    </button>
  );
}

function Bubble({ m, mine, pending }: { m: Pick<ChatMessage, "sender_type" | "sender_name" | "message" | "created_at" | "attachment_url" | "attachment_name" | "attachment_type">; mine: boolean; pending?: boolean }) {
  if (m.sender_type === "system")
    return (
      <div className="my-2 flex justify-center">
        <span className="max-w-[90%] rounded-full bg-muted px-3 py-1 text-center text-[11px] text-muted-foreground">{m.message}</span>
      </div>
    );
  const isAi = m.sender_type === "ai";
  const isAgent = m.sender_type === "agent";
  return (
    <div className={cn("flex gap-2", mine ? "justify-end" : "justify-start")}>
      {!mine && (
        <div className={cn("mt-5 flex size-7 shrink-0 items-center justify-center rounded-full", isAi ? "bg-chat-ai/15 text-chat-ai" : isAgent ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
          {isAi ? <Bot className="size-4" /> : isAgent ? <Headset className="size-4" /> : <UserRound className="size-4" />}
        </div>
      )}
      <div className={cn("max-w-[78%]", mine && "text-right")}>
        <div className="mb-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground" style={{ justifyContent: mine ? "flex-end" : "flex-start" }}>
          <span className="font-medium">{mine ? "You" : isAi ? "AI Support Assistant" : m.sender_name}</span>
          {isAi && <span className="rounded bg-chat-ai/15 px-1 text-[9px] font-bold uppercase tracking-wide text-chat-ai">AI</span>}
          {isAgent && !mine && <span className="rounded bg-primary/10 px-1 text-[9px] font-bold uppercase tracking-wide text-primary">Agent</span>}
        </div>
        <div
          className={cn(
            "inline-block whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-left text-sm shadow-card animate-in fade-in slide-in-from-bottom-1 duration-200",
            mine ? "rounded-br-sm bg-primary text-primary-foreground" : isAi ? "rounded-bl-sm border border-chat-ai/30 bg-chat-ai/5" : "rounded-bl-sm bg-muted",
            pending && "opacity-60",
          )}
        >
          {m.message}
          <Attachment m={m} />
        </div>
        <div className={cn("mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground", mine && "justify-end")}>{pending ? "Sending…" : when(m.created_at)}{mine && !pending && <CheckCheck className="size-3 text-primary" />}</div>
      </div>
    </div>
  );
}

export function ChatThread({
  convId, viewer, className, onCreateTicket,
}: {
  convId: string;
  viewer: "customer" | "staff";
  className?: string;
  onCreateTicket?: () => void;
}) {
  const { session, profile, isAdmin } = useAuth();
  const uid = session?.user.id;
  const qc = useQueryClient();
  const { conv, messages, typing, sendTyping } = useChatRoom(convId);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiProblem, setAiProblem] = useState<null | "error" | "unavailable">(null);
  const [pending, setPending] = useState<Pending[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const c = conv.data as ChatConversation | null | undefined;
  const list = messages.data ?? [];
  const known = new Set(list.map((m) => m.client_id).filter(Boolean));
  const shownPending = pending.filter((p) => !known.has(p.client_id));
  const closed = c?.status === "closed";
  const canWrite = !!c && !closed && (viewer === "customer" || isAdmin || c.assigned_agent_id === uid || !c.assigned_agent_id);

  const scrollRef = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const [newCount, setNewCount] = useState(0);
  const lastLen = useRef(0);
  const scrollDown = (smooth = true) => {
    endRef.current?.scrollIntoView({ block: "end", behavior: smooth ? "smooth" : "auto" });
    setNewCount(0);
  };
  useEffect(() => {
    const added = list.length - lastLen.current;
    const first = lastLen.current === 0;
    lastLen.current = list.length;
    const lastMine = list[list.length - 1]?.sender_id === uid;
    if (first || atBottom.current || lastMine || shownPending.length) scrollDown(!first);
    else if (added > 0) setNewCount((n) => n + added);
  }, [list.length, shownPending.length, typing, aiThinking]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mark as read whenever new messages arrive while this thread is open.
  useEffect(() => {
    if (!convId || !list.length) return;
    try {
      void supabase.rpc("mark_chat_read", { _conv: convId }).catch(() => {});
    } catch {}
    void qc.invalidateQueries({ queryKey: ["chat", "unread"] });
  }, [convId, list.length, qc]);

  async function runSend(retry = false) {
    if (!uid || !c) return;
    const msg = text.trim();
    if (!retry && !msg && !file) return;
    const client_id = crypto.randomUUID();
    setBusy(true);
    setAiProblem(null);
    try {
      let attachment: { path: string; name: string; type: string } | null = null;
      if (!retry && file) {
        const err = validateChatFile(file);
        if (err) {
          toast.error(err);
          setBusy(false);
          return;
        }
        attachment = await uploadChatFile(convId, file);
      }
      if (!retry) {
        setPending((p) => [...p, { client_id, message: msg, attachment_name: attachment?.name, created_at: new Date().toISOString() }]);
        setText("");
        setFile(null);
        sendTyping(false);
      }

      const senderType = viewer === "staff" ? "agent" : "customer";
      const senderName = profile?.full_name || (viewer === "staff" ? "Support Agent" : "Customer");

      // If staff is replying and not yet assigned to them, auto-assign
      if (viewer === "staff" && (!c.assigned_agent_id || c.assigned_agent_id !== uid)) {
        try {
          await takeOverChatFn({
            data: {
              conversationId: convId,
              agentId: uid,
              agentName: senderName,
            },
          });
        } catch {}
      }

      // Send through server function (persists locally and notifies)
      await sendChatMessageFn({
        data: {
          conversationId: convId,
          senderId: uid,
          senderName,
          senderType,
          message: msg,
          clientId: client_id,
          attachmentUrl: attachment?.path ?? null,
          attachmentName: attachment?.name ?? null,
          attachmentType: attachment?.type ?? null,
        },
      });

      // Also try Supabase insertion for cloud sync if available
      try {
        await supabase.from("chat_messages").insert({
          conversation_id: convId,
          sender_id: uid,
          sender_type: senderType,
          message: msg,
          client_id,
          attachment_url: attachment?.path ?? null,
          attachment_name: attachment?.name ?? null,
          attachment_type: attachment?.type ?? null,
        });
      } catch {}

      // Cross-tab broadcast & localStorage event so all tabs update instantly
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel("supportdesk_chat");
          bc.postMessage({ type: "new_message", conversation_id: convId, sender_type: senderType });
          bc.close();
        }
      } catch {}
      try {
        localStorage.setItem("supportdesk_chat_event", JSON.stringify({
          type: "new_message",
          conversation_id: convId,
          sender_type: senderType,
          timestamp: Date.now(),
        }));
      } catch {}

      // In-app notifications
      if (viewer === "customer") {
        publishNotification({
          type: "chat",
          title: "New Live Chat Message",
          message: `${senderName}: "${msg.slice(0, 80)}"`,
          chat_id: convId,
          target_role: "admin",
        });
      } else {
        publishNotification({
          type: "chat",
          title: "Support Agent Replied",
          message: `${senderName}: "${msg.slice(0, 80)}"`,
          chat_id: convId,
          target_role: "customer",
        });
      }

      await qc.invalidateQueries({ queryKey: ["chat"] });
    } catch (e) {
      setPending((p) => p.filter((x) => x.client_id !== client_id));
      if (!retry && msg) setText(msg);
      toast.error(viewer === "customer" ? FRIENDLY_CHAT_ERROR : friendlyError(e));
    } finally {
      setBusy(false);
      setAiThinking(false);
    }
  }

  async function requestHuman() {
    try {
      await requestHumanChatFn({ data: { conversationId: convId } });
      try {
        await supabase.rpc("request_human", { _conv: convId });
      } catch {}
      setAiProblem(null);
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const bc = new BroadcastChannel("supportdesk_chat");
          bc.postMessage({ type: "human_requested", conversation_id: convId });
          bc.close();
        }
      } catch {}
      qc.invalidateQueries({ queryKey: ["chat"] });
      toast.success("Connecting you with a support agent...");
    } catch {
      toast.error(FRIENDLY_CHAT_ERROR);
    }
  }

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      {c?.ticket_id && (
        <div className="flex items-center gap-1.5 border-b bg-accent/40 px-3 py-1.5 text-xs">
          <Ticket className="size-3.5 text-primary" /> Related Ticket:
          <RelatedTicket id={c.ticket_id} />
        </div>
      )}
      <div className="relative min-h-0 flex-1">
      <div
        ref={scrollRef}
        className="h-full space-y-2 overflow-y-auto bg-muted/30 px-3 py-3"
        aria-live="polite"
        onScroll={(e) => {
          const el = e.currentTarget;
          atBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
          if (atBottom.current && newCount) setNewCount(0);
        }}
      >
        {messages.isLoading && <div className="flex justify-center py-6"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>}
        {list.map((m, i) => (
          <div key={m.id}>
            {(i === 0 || dayLabel(list[i - 1]!.created_at) !== dayLabel(m.created_at)) && <DaySep d={m.created_at} />}
            <Bubble m={m} mine={viewer === "customer" ? m.sender_type === "customer" : m.sender_id === uid && m.sender_type === "agent"} />
          </div>
        ))}
        {shownPending.map((p) => (
          <Bubble
            key={p.client_id}
            pending
            mine
            m={{ sender_type: viewer === "customer" ? "customer" : "agent", sender_name: "You", message: p.message, created_at: p.created_at, attachment_url: null, attachment_name: p.attachment_name ?? null, attachment_type: null }}
          />
        ))}
        {(aiThinking || typing) && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex gap-0.5">
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
            </span>
            {aiThinking ? "AI Support Assistant is typing…" : `${typing?.name || (typing?.role === "agent" ? "Support Agent" : "Customer")} is typing…`}
          </div>
        )}
        <div ref={endRef} />
      </div>
        {newCount > 0 && (
          <button type="button" onClick={() => scrollDown()} className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-elevated hover:scale-105">
            <ArrowDown className="size-3.5" /> {newCount} new message{newCount > 1 ? "s" : ""}
          </button>
        )}
      </div>

      {viewer === "customer" && aiProblem && !closed && (
        <div className="space-y-2 border-t bg-destructive/5 px-3 py-2 text-xs">
          <p>{aiProblem === "error" ? FRIENDLY_CHAT_ERROR : UNAVAILABLE_TEXT}</p>
          <div className="flex flex-wrap gap-1.5">
            {aiProblem === "error" && (
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => runSend(true)} disabled={busy}>
                <RotateCw className="size-3" /> Try again
              </Button>
            )}
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={requestHuman}><Headset className="size-3" /> Talk to a human</Button>
            {onCreateTicket && <Button size="sm" className="h-7 text-xs" onClick={onCreateTicket}><Ticket className="size-3" /> Create Support Ticket</Button>}
          </div>
        </div>
      )}

      {closed ? (
        <div className="border-t px-3 py-3 text-center text-xs text-muted-foreground">This conversation has ended.</div>
      ) : viewer === "staff" && c && c.assigned_agent_id && c.assigned_agent_id !== uid && !isAdmin ? (
        <div className="border-t px-3 py-3 text-center text-xs text-muted-foreground">This chat is assigned to another agent. Take over this chat to reply.</div>
      ) : (
        <form
          className="border-t p-2"
          onSubmit={(e) => {
            e.preventDefault();
            void runSend();
          }}
        >
          {file && (
            <div className="mb-1.5 flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs">
              <Paperclip className="size-3" /> <span className="flex-1 truncate">{file.name}</span>
              <button type="button" aria-label="Remove attachment" onClick={() => setFile(null)}><X className="size-3" /></button>
            </div>
          )}
          <div className="flex items-end gap-1.5">
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (!f) return;
                const err = validateChatFile(f);
                if (err) return void toast.error(err);
                setFile(f);
              }}
            />
            <Button type="button" size="icon" variant="ghost" className="size-9 shrink-0" aria-label="Attach file" onClick={() => fileRef.current?.click()} disabled={!canWrite || busy}>
              <Paperclip className="size-4" />
            </Button>
            <Textarea
              rows={1}
              value={text}
              maxLength={5000}
              disabled={!canWrite}
              placeholder="Type your message…"
              className="max-h-28 min-h-9 resize-none rounded-2xl bg-muted/40 py-2 text-sm"
              onChange={(e) => {
                setText(e.target.value);
                sendTyping(e.target.value.length > 0);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void runSend();
                }
              }}
            />
            <Button type="submit" size="icon" className="size-9 shrink-0 rounded-full" aria-label="Send" disabled={!canWrite || busy || (!text.trim() && !file)}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : <SendHorizontal className="size-4" />}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function RelatedTicket({ id }: { id: string }) {
  const [num, setNum] = useState<string | null>(null);
  useEffect(() => {
    supabase.from("tickets").select("ticket_number").eq("id", id).maybeSingle().then(({ data }) => setNum(data?.ticket_number ?? null));
  }, [id]);
  return (
    <Link to="/tickets/$id" params={{ id }} className="font-mono font-semibold text-primary hover:underline">
      #{num ?? "…"}
    </Link>
  );
}
