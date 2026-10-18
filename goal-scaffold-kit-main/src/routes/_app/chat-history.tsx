import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { format } from "date-fns";
import { Bot, Headset, MessageCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { CHAT_MODE_LABEL, type ChatConversation } from "@/lib/chat";
import { getChatConversationsFn } from "@/lib/chat.functions";
import { meta } from "@/components/guard";
import { ChatThread } from "@/components/chat/chat-thread";
import { useChatWidget } from "@/components/chat/chat-widget";
import { ChatStatusPill } from "@/components/chat/chat-status-pill";
import { PageHeader, EmptyState, TableSkeleton } from "@/components/states";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/chat-history")({
  validateSearch: (s) => z.object({ c: z.string().optional() }).parse(s),
  head: () => meta("Chat History", "Your previous support chat conversations."),
  component: ChatHistory,
});

function ChatHistory() {
  const { c } = Route.useSearch();
  const nav = useNavigate({ from: "/chat-history" });
  const qc = useQueryClient();
  const { session } = useAuth();
  const uid = session?.user.id;
  const widget = useChatWidget();
  const q = useQuery({
    queryKey: ["chat", "history", uid],
    enabled: !!uid,
    refetchInterval: 3_000,
    queryFn: async () => {
      try {
        const local = await getChatConversationsFn({
          data: {
            userId: uid,
            role: "customer",
          },
        });
        if (local && local.length > 0) return local as unknown as ChatConversation[];
      } catch {}

      try {
        const { data, error } = await supabase.from("chat_conversations").select("*").eq("customer_id", uid!).order("created_at", { ascending: false }).limit(200);
        if (!error && data) return data;
      } catch {}

      try {
        const local = await getChatConversationsFn({
          data: {
            userId: uid,
            role: "customer",
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

  const rows = q.data ?? [];
  const sel = rows.find((r) => r.id === c);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Chat History" description="All your conversations with our support team and AI assistant." actions={<Button onClick={() => widget.open()}><MessageCircle className="size-4" /> Chat with Support</Button>} />
      <div className="grid h-[calc(100vh-13rem)] min-h-[480px] gap-3 md:grid-cols-[300px_1fr]">
        <div className={cn("overflow-y-auto rounded-lg border bg-card shadow-card", sel && "hidden md:block")}>
          {q.isLoading ? <TableSkeleton /> : !rows.length ? (
            <div className="p-3"><EmptyState title="No chats yet" description="Start a chat with the button at the bottom-right." icon={<MessageCircle className="size-5" />} /></div>
          ) : rows.map((r) => (
            <button key={r.id} type="button" onClick={() => nav({ search: { c: r.id } })} className={cn("block w-full border-b px-3 py-2.5 text-left hover:bg-muted", c === r.id && "bg-accent")}>
              <div className="flex items-center gap-1.5 text-sm font-medium">
                {r.mode === "ai" ? <Bot className="size-3.5 text-chat-ai" /> : <Headset className="size-3.5 text-primary" />}
                {format(new Date(r.created_at), "MMM d, yyyy · h:mm a")}
              </div>
              <div className="mt-0.5 truncate text-xs text-muted-foreground">{r.last_message ?? "No messages"}</div>
              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <ChatStatusPill status={r.status} />
                <span>{CHAT_MODE_LABEL[r.mode]} chat</span>
                {r.agent_name && <span>· {r.agent_name}</span>}
              </div>
            </button>
          ))}
        </div>
        {sel ? (
          <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border bg-card shadow-card">
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <Button size="icon" variant="ghost" className="size-8 md:hidden" onClick={() => nav({ search: {} })} aria-label="Back"><ArrowLeft className="size-4" /></Button>
              <div className="flex-1 text-sm">
                <div className="font-semibold">{format(new Date(sel.created_at), "EEEE, MMM d, yyyy")}</div>
                <div className="text-xs text-muted-foreground">{CHAT_MODE_LABEL[sel.mode]} conversation{sel.agent_name ? ` with ${sel.agent_name}` : ""}</div>
              </div>
              <ChatStatusPill status={sel.status} />
              {sel.status !== "closed" && <Button size="sm" variant="outline" onClick={() => widget.open(sel.id)}>Continue in chat</Button>}
            </div>
            <ChatThread convId={sel.id} viewer="customer" className="min-h-0 flex-1" />
          </div>
        ) : (
          <div className="hidden items-center justify-center rounded-lg border bg-card text-sm text-muted-foreground shadow-card md:flex">Select a conversation</div>
        )}
      </div>
    </div>
  );
}
