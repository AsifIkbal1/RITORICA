import { useEffect, useRef, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "./auth";
import { ALLOWED_EXT, MAX_FILE_MB } from "./constants";

export type ChatConversation = Database["public"]["Tables"]["chat_conversations"]["Row"];
export type ChatMessage = Database["public"]["Tables"]["chat_messages"]["Row"];
export type ChatMode = Database["public"]["Enums"]["chat_mode"];
export type ChatStatus = Database["public"]["Enums"]["chat_status"];
export type PresenceStatus = Database["public"]["Enums"]["presence_status"];

export const CHAT_BUCKET = "chat-attachments";

export const CHAT_STATUS_LABEL: Record<ChatStatus, string> = {
  active: "Active",
  waiting_for_agent: "Waiting for Agent",
  waiting_for_customer: "Waiting for Customer",
  closed: "Closed",
};
export const CHAT_MODE_LABEL: Record<ChatMode, string> = { human: "Human", ai: "AI", hybrid: "Hybrid" };

export const FRIENDLY_CHAT_ERROR = "Sorry, we're having trouble connecting right now. Please try again or create a support ticket.";
export const UNAVAILABLE_TEXT = "Our support team is currently unavailable. Please create a support ticket and we will get back to you.";

/* ------------------------------------------------------------------ */
/* Realtime: one channel per conversation per browser, ref-counted.    */
/* Handlers are attached before subscribe(), never after, and the same */
/* topic is never re-created while a previous one is still alive.      */
/* ------------------------------------------------------------------ */
type TypingPayload = { conversation_id: string; user_id: string; name: string; role: "customer" | "agent"; typing: boolean };
type Listener = { onChange?: () => void; onTyping?: (p: TypingPayload) => void };
type Entry = { ch: RealtimeChannel; listeners: Set<Listener>; timer?: ReturnType<typeof setTimeout> | undefined };
const rooms = new Map<string, Entry>();

function acquireRoom(convId: string, l: Listener) {
  let e = rooms.get(convId);
  if (e) {
    if (e.timer) clearTimeout(e.timer);
    e.timer = undefined;
    e.listeners.add(l);
  } else {
    const listeners = new Set<Listener>([l]);
    const ch = supabase
      .channel(`chat-room:${convId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${convId}` }, () =>
        listeners.forEach((x) => x.onChange?.()),
      )
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "chat_conversations", filter: `id=eq.${convId}` }, () =>
        listeners.forEach((x) => x.onChange?.()),
      )
      .on("broadcast", { event: "typing" }, ({ payload }) => listeners.forEach((x) => x.onTyping?.(payload as TypingPayload)))
      .subscribe();
    e = { ch, listeners };
    rooms.set(convId, e);
  }
  const entry = e;
  return {
    channel: entry.ch,
    release: () => {
      entry.listeners.delete(l);
      if (entry.listeners.size === 0) {
        // Delay removal so quick remounts (StrictMode, tab switches) reuse the channel.
        entry.timer = setTimeout(() => {
          if (entry.listeners.size === 0 && rooms.get(convId) === entry) {
            rooms.delete(convId);
            void supabase.removeChannel(entry.ch);
          }
        }, 30_000);
      }
    },
  };
}

import { getChatRoomFn, getChatAvailabilityFn } from "./chat.functions";

/** Live messages for one conversation, with realtime + polling fallback. */
export function useChatRoom(convId: string | null | undefined) {
  const qc = useQueryClient();
  const { session, profile, isStaff } = useAuth();
  const uid = session?.user.id;
  const [typing, setTyping] = useState<TypingPayload | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const chRef = useRef<RealtimeChannel | null>(null);
  const lastSent = useRef(0);

  const conv = useQuery({
    queryKey: ["chat", "conversation", convId],
    enabled: !!convId,
    refetchInterval: 3_000,
    queryFn: async () => {
      try {
        const res = await getChatRoomFn({ data: { conversationId: convId! } });
        if (res?.conv) return res.conv as unknown as ChatConversation;
      } catch {}

      try {
        const { data, error } = await supabase.from("chat_conversations").select("*").eq("id", convId!).maybeSingle();
        if (!error && data) return data;
      } catch {}

      return null;
    },
  });

  const messages = useQuery({
    queryKey: ["chat", "messages", convId],
    enabled: !!convId,
    refetchInterval: 2_500,
    queryFn: async () => {
      try {
        const res = await getChatRoomFn({ data: { conversationId: convId! } });
        if (res?.messages) return res.messages as unknown as ChatMessage[];
      } catch {}

      try {
        const { data, error } = await supabase.from("chat_messages").select("*").eq("conversation_id", convId!).order("created_at").limit(500);
        if (!error && data) return data;
      } catch {}

      return [];
    },
  });

  useEffect(() => {
    if (!convId) return;

    // Cross-tab / cross-frame BroadcastChannel for instant message delivery
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        bc = new BroadcastChannel("supportdesk_chat");
        bc.onmessage = (event) => {
          if (event.data?.conversation_id === convId) {
            void qc.invalidateQueries({ queryKey: ["chat"] });
          }
        };
      }
    } catch {}

    const onStorage = (e: StorageEvent) => {
      if (e.key === "supportdesk_chat_event" && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          if (payload?.conversation_id === convId) {
            void qc.invalidateQueries({ queryKey: ["chat"] });
          }
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", onStorage);
    };
  }, [convId, qc]);

  useEffect(() => {
    if (!convId || !uid) return;
    const { channel, release } = acquireRoom(convId, {
      onChange: () => {
        void qc.invalidateQueries({ queryKey: ["chat"] });
      },
      onTyping: (p) => {
        if (p.conversation_id !== convId || p.user_id === uid) return;
        setTyping(p.typing ? p : null);
        if (typingTimer.current) clearTimeout(typingTimer.current);
        if (p.typing) typingTimer.current = setTimeout(() => setTyping(null), 6000);
      },
    });
    chRef.current = channel;
    return () => {
      chRef.current = null;
      if (typingTimer.current) clearTimeout(typingTimer.current);
      release();
    };
  }, [convId, uid, qc]);

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      const ch = chRef.current;
      if (!ch || !convId || !uid) return;
      const now = Date.now();
      if (isTyping && now - lastSent.current < 2500) return;
      lastSent.current = isTyping ? now : 0;
      void ch.send({
        type: "broadcast",
        event: "typing",
        payload: { conversation_id: convId, user_id: uid, name: profile?.full_name ?? "", role: isStaff ? "agent" : "customer", typing: isTyping },
      });
    },
    [convId, uid, profile?.full_name, isStaff],
  );

  return { conv, messages, typing, sendTyping };
}

/** List-level realtime: mount once in the app shell. Unique topic per mount. */
export function useChatListRealtime() {
  const { session, isStaff } = useAuth();
  const uid = session?.user.id;
  const qc = useQueryClient();
  useEffect(() => {
    if (!uid) return;
    const topic = `chat-list:${uid}:${Math.random().toString(36).slice(2)}`;
    let ch = supabase
      .channel(topic)
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_conversations" }, () => {
        void qc.invalidateQueries({ queryKey: ["chat"] });
      });
    if (isStaff)
      ch = ch.on("postgres_changes", { event: "*", schema: "public", table: "agent_presence" }, () => {
        void qc.invalidateQueries({ queryKey: ["presence"] });
      });
    ch.subscribe();

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
      void supabase.removeChannel(ch);
    };
  }, [uid, isStaff, qc]);
}

export function useChatAvailability(enabled = true) {
  return useQuery({
    queryKey: ["chat", "availability"],
    enabled,
    refetchInterval: 30_000,
    queryFn: async () => {
      try {
        const res = await getChatAvailabilityFn();
        if (res) return res;
      } catch {}
      try {
        const { data, error } = await supabase.rpc("chat_availability");
        if (!error && data) return data as { human_online: boolean; ai_available: boolean };
      } catch {}
      return { human_online: true, ai_available: false };
    },
  });
}

export function useUnreadChats() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ["chat", "unread", session?.user.id],
    enabled: !!session,
    refetchInterval: 15_000,
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc("chat_unread_counts");
        if (!error && data) {
          return Object.fromEntries((data ?? []).map((r) => [r.conversation_id, Number(r.unread)])) as Record<string, number>;
        }
      } catch {}
      return {};
    },
  });
}

export function validateChatFile(f: File): string | null {
  const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXT.includes(ext)) return `File type .${ext} isn't allowed.`;
  if (f.size > MAX_FILE_MB * 1024 * 1024) return `File is larger than ${MAX_FILE_MB} MB.`;
  return null;
}

export async function uploadChatFile(convId: string, f: File): Promise<{ path: string; name: string; type: string }> {
  // 1. Try local upload API endpoint
  try {
    const form = new FormData();
    form.append("convId", convId);
    form.append("file", f);

    const res = await fetch("/api/chat/upload", {
      method: "POST",
      body: form,
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.path) {
        return {
          path: data.path,
          name: data.name || f.name,
          type: data.type || f.type || "application/octet-stream",
        };
      }
    }
  } catch (err) {
    console.warn("Local chat upload failed, trying storage fallback", err);
  }

  // 2. Try Supabase Storage fallback
  try {
    const safe = f.name.replace(/[^\w.\-]+/g, "_").slice(-120);
    const path = `${convId}/${crypto.randomUUID()}-${safe}`;
    const { error } = await supabase.storage.from(CHAT_BUCKET).upload(path, f, { contentType: f.type || "application/octet-stream" });
    if (!error) {
      return { path, name: f.name, type: f.type || "application/octet-stream" };
    }
  } catch {}

  // 3. Fallback to in-memory Base64 data URL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(f);
  });
  return { path: dataUrl, name: f.name, type: f.type || "application/octet-stream" };
}

export async function chatFileUrl(path: string, download?: string): Promise<string> {
  if (!path) return "";
  if (path.startsWith("/uploads/") || path.startsWith("data:") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  try {
    const { data, error } = await supabase.storage.from(CHAT_BUCKET).createSignedUrl(path, 300, download ? { download } : undefined);
    if (!error && data?.signedUrl) return data.signedUrl;
  } catch {}
  return path;
}

/* ------------------------------ Presence ------------------------------ */
export function usePresence() {
  const { session, isStaff } = useAuth();
  const uid = session?.user.id;
  return useQuery({
    queryKey: ["presence", "me", uid],
    enabled: !!uid && isStaff,
    queryFn: async () => {
      let current: PresenceStatus = "offline";
      try {
        if (typeof window !== "undefined") {
          const stored = window.localStorage.getItem(`supportdesk_presence_${uid}`) || window.localStorage.getItem("supportdesk_presence_current");
          if (stored) current = stored as PresenceStatus;
        }
      } catch {}

      try {
        const { data } = await supabase.from("agent_presence").select("status, last_seen_at").eq("user_id", uid!).maybeSingle();
        if (data?.status) return data.status as PresenceStatus;
      } catch {}

      return current;
    },
  });
}

export async function setPresence(uid: string, status: PresenceStatus) {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`supportdesk_presence_${uid}`, status);
      window.localStorage.setItem("supportdesk_presence_current", status);
    }
  } catch {}

  try {
    const { setPresenceFn } = await import("./chat.functions");
    await setPresenceFn({ data: { userId: uid, status } });
  } catch {}

  try {
    await supabase
      .from("agent_presence")
      .upsert({ user_id: uid, status, last_seen_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  } catch {}
}

/** Keeps an online/away agent's heartbeat fresh so routing only uses agents who are really here. */
export function usePresenceHeartbeat() {
  const { session, isStaff } = useAuth();
  const uid = session?.user.id;
  const status = usePresence().data;
  useEffect(() => {
    if (!uid || !isStaff || !status || status === "offline") return;
    const beat = () => {
      void supabase.from("agent_presence").update({ last_seen_at: new Date().toISOString() }).eq("user_id", uid);
    };
    beat();
    const t = setInterval(beat, 60_000);
    return () => clearInterval(t);
  }, [uid, isStaff, status]);
}

export function isOnline(p: { status: string; last_seen_at: string } | undefined | null) {
  if (!p || p.status !== "online") return false;
  return Date.now() - new Date(p.last_seen_at).getTime() < 3 * 60_000;
}
