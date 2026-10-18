import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  getNotificationsListFn,
  markNotificationReadFn,
  sendNotificationFn,
} from "./notifications.functions";

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  ticket_id: string | null;
  chat_id: string | null;
  target_role?: string;
  is_read: boolean;
  created_at: string;
  ticket: { ticket_number: string; subject: string } | null;
};

export type NotificationCategory = "all" | "ticket" | "chat" | "email" | "account";

export const NOTIFICATION_CATEGORIES: { value: NotificationCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ticket", label: "Tickets" },
  { value: "chat", label: "Chats" },
  { value: "email", label: "Email" },
  { value: "account", label: "Account" },
];

const EMAIL_TYPES = ["mail_reply", "ticket_confirmation", "email"];

export function notificationCategory(n: { type: string; ticket_id: string | null; chat_id: string | null }): NotificationCategory {
  if (EMAIL_TYPES.includes(n.type)) return "email";
  if (n.chat_id || n.type.startsWith("chat")) return "chat";
  if (n.ticket_id || n.type === "ticket") return "ticket";
  return "account";
}

/** Reads the signed-in user's notifications with automatic fallback to persistent server storage. */
export function useNotifications(limit = 10, category: NotificationCategory = "all") {
  const { session, portal } = useAuth();
  const uid = session?.user.id;
  return useQuery({
    queryKey: ["notifications", uid, portal, limit, category],
    enabled: !!uid,
    placeholderData: (prev) => prev,
    // Automatically poll every 4 seconds so admin gets live count and list updates
    refetchInterval: 4_000,
    queryFn: async () => {
      try {
        const res = await getNotificationsListFn({
          data: {
            userId: uid,
            role: portal,
            category: category === "all" ? undefined : category,
            limit,
          },
        });
        return {
          items: res.items as NotificationItem[],
          unread: res.unread,
          hasMore: res.items.length === limit,
        };
      } catch {
        return { items: [], unread: 0, hasMore: false };
      }
    },
  });
}

/**
 * Subscribes to live notification changes across tabs, WebSockets, and background polling.
 * Triggers onNew popup and notification sound when a new notification arrives.
 */
export function useNotificationsRealtime(onNew?: (n: NotificationItem) => void) {
  const { session, portal } = useAuth();
  const uid = session?.user.id;
  const qc = useQueryClient();
  const onNewRef = useRef(onNew);
  onNewRef.current = onNew;

  // Track seen notification IDs so page refresh never re-plays past notifications
  const seenIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!uid) return;

    // 1. Pre-populate seen IDs on mount
    void getNotificationsListFn({ data: { userId: uid, role: portal, limit: 100 } })
      .then((res) => {
        if (res?.items) {
          res.items.forEach((item) => seenIdsRef.current.add(item.id));
        }
        initializedRef.current = true;
      })
      .catch(() => {
        initializedRef.current = true;
      });

    const handleIncoming = (notif: NotificationItem, targetRole?: string) => {
      const effectiveRole = targetRole || notif.target_role;
      // Role matching:
      // If portal is customer, accept notifications for "customer", "all", or matching portal
      // If portal is admin, accept notifications for "admin", "staff", "all"
      // If portal is agent, accept notifications for "agent", "staff", "all"
      const matchesRole =
        !effectiveRole ||
        effectiveRole === "all" ||
        effectiveRole === portal ||
        (portal === "admin" && (effectiveRole === "admin" || effectiveRole === "staff")) ||
        (portal === "agent" && (effectiveRole === "agent" || effectiveRole === "staff"));

      if (!matchesRole) return;

      if (!seenIdsRef.current.has(notif.id)) {
        seenIdsRef.current.add(notif.id);
        playNotificationSound();
        if (onNewRef.current) {
          onNewRef.current(notif);
        } else {
          toast(notif.title, { description: notif.message.slice(0, 160) });
        }
        qc.invalidateQueries({ queryKey: ["notifications"] });
        qc.invalidateQueries({ queryKey: ["dashboard"] });
        qc.invalidateQueries({ queryKey: ["dash-tickets"] });
        qc.invalidateQueries({ queryKey: ["tickets"] });
        qc.invalidateQueries({ queryKey: ["customer-mine"] });
      }
    };

    // 2. BroadcastChannel for instant cross-tab delivery
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== "undefined") {
        bc = new BroadcastChannel("supportdesk_notifications");
        bc.onmessage = (event) => {
          if (event.data?.notification) {
            handleIncoming(event.data.notification, event.data.target_role);
          }
        };
      }
    } catch {}

    // 3. Storage event fallback for older/restricted browser tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === "supportdesk_broadcast_notification" && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          if (payload?.notification) {
            handleIncoming(payload.notification, payload.target_role);
          }
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);

    // 4. Background polling loop (every 2 seconds) for server-side events across iframes/origins
    const pollInterval = setInterval(async () => {
      if (!initializedRef.current) return;
      try {
        const res = await getNotificationsListFn({
          data: { userId: uid, role: portal, limit: 10 },
        });
        if (res?.items) {
          for (const item of res.items) {
            if (!seenIdsRef.current.has(item.id) && !item.is_read) {
              handleIncoming(item as NotificationItem, (item as any).target_role || portal);
              break;
            }
          }
        }
      } catch {}
    }, 2000);

    // 5. Supabase Realtime channel if available
    const topic = `notifications:${uid}:${Math.random().toString(36).slice(2)}`;
    const ch = supabase
      .channel(topic)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload) => {
        const r = payload.new as Partial<NotificationItem>;
        if (r && r.id) {
          const item: NotificationItem = {
            id: r.id,
            type: r.type ?? "ticket",
            title: r.title ?? "New notification",
            message: (r.message ?? "").slice(0, 200),
            ticket_id: r.ticket_id ?? null,
            chat_id: r.chat_id ?? null,
            target_role: (r as any).target_role || portal,
            is_read: false,
            created_at: r.created_at ?? new Date().toISOString(),
            ticket: null,
          };
          handleIncoming(item, item.target_role || portal);
        }
      })
      .subscribe();

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", onStorage);
      clearInterval(pollInterval);
      void supabase.removeChannel(ch);
    };
  }, [uid, portal, qc]);
}

/** Broadcast and save a notification from anywhere in the application */
export function publishNotification(params: {
  id?: string;
  type: string;
  title: string;
  message: string;
  ticket_id?: string | null;
  chat_id?: string | null;
  target_role?: "admin" | "agent" | "customer" | "all";
  user_id?: string;
  ticket?: { ticket_number: string; subject: string } | null;
}) {
  const targetRole = params.target_role || "admin";
  const notif: NotificationItem = {
    id: params.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `notif_${Date.now()}`),
    type: params.type,
    title: params.title,
    message: params.message,
    ticket_id: params.ticket_id || null,
    chat_id: params.chat_id || null,
    target_role: targetRole,
    is_read: false,
    created_at: new Date().toISOString(),
    ticket: params.ticket || null,
  };

  // 1. Cross-tab BroadcastChannel
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel("supportdesk_notifications");
      bc.postMessage({ notification: notif, target_role: targetRole });
      setTimeout(() => bc.close(), 100);
    }
  } catch {}

  // 2. Cross-tab localStorage event
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(
        "supportdesk_broadcast_notification",
        JSON.stringify({ notification: notif, target_role: targetRole, timestamp: Date.now() }),
      );
    }
  } catch {}

  // 3. Persist to server
  try {
    void sendNotificationFn({
      data: {
        user_id: params.user_id || (targetRole === "customer" ? "00000000-0000-0000-0000-000000000003" : "00000000-0000-0000-0000-000000000001"),
        target_role: targetRole,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        ticket_id: notif.ticket_id,
        chat_id: notif.chat_id,
        ticket: notif.ticket,
      },
    });
  } catch {}
}

export function useMarkRead() {
  const { session } = useAuth();
  const uid = session?.user.id;
  const qc = useQueryClient();
  return async (id?: string) => {
    if (!uid) return;
    try {
      await markNotificationReadFn({ data: { id, userId: uid } });
    } catch {}
    try {
      let q = supabase.from("notifications").update({ is_read: true }).eq("user_id", uid);
      q = id ? q.eq("id", id) : q.eq("is_read", false);
      await q;
    } catch {}
    await qc.invalidateQueries({ queryKey: ["notifications"] });
  };
}

const SOUND_KEY = "supportdesk:notification-sound";

export function isNotificationSoundOn() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(SOUND_KEY) !== "off";
}

export function setNotificationSound(on: boolean) {
  window.localStorage.setItem(SOUND_KEY, on ? "on" : "off");
}

let sharedAudioCtx: AudioContext | null = null;
let cachedWavUri: string | null = null;

function getChimeWavDataUri(): string {
  if (cachedWavUri) return cachedWavUri;
  try {
    const sampleRate = 22050;
    const duration = 0.75;
    const numSamples = Math.floor(sampleRate * duration);
    const wavBuffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(wavBuffer);

    // RIFF chunk
    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 36 + numSamples * 2, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // ByteRate
    view.setUint16(32, 2, true); // BlockAlign
    view.setUint16(34, 16, true); // BitsPerSample
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, numSamples * 2, true);

    const notes = [
      { freq: 784, start: 0.0, dur: 0.22 },
      { freq: 1046.5, start: 0.12, dur: 0.28 },
      { freq: 1318.5, start: 0.24, dur: 0.45 },
    ];

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;
      for (const n of notes) {
        if (t >= n.start && t < n.start + n.dur) {
          const dt = t - n.start;
          const env = Math.sin((Math.PI * dt) / n.dur) * Math.exp(-dt * 3.5);
          sample += Math.sin(2 * Math.PI * n.freq * dt) * env * 0.45;
        }
      }
      const intVal = Math.max(-32767, Math.min(32767, Math.floor(sample * 32767)));
      view.setInt16(44 + i * 2, intVal, true);
    }

    const bytes = new Uint8Array(wavBuffer);
    let binary = "";
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    cachedWavUri = `data:audio/wav;base64,${btoa(binary)}`;
    return cachedWavUri;
  } catch {
    return "";
  }
}

// Unlock audio on any interaction in window or message from parent frame
if (typeof window !== "undefined") {
  const unlock = () => {
    try {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (Ctx) {
        sharedAudioCtx ??= new Ctx();
        if (sharedAudioCtx.state === "suspended") {
          void sharedAudioCtx.resume();
        }
      }
    } catch {}
  };
  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("click", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });
  window.addEventListener("touchstart", unlock, { passive: true });
  window.addEventListener("message", (e) => {
    if (e.data?.type === "UNLOCK_AUDIO") unlock();
  });
}

function playHarmonicNotes(ctx: AudioContext) {
  try {
    const now = ctx.currentTime;
    const notes = [
      { freq: 783.99, delay: 0.0, dur: 0.22, vol: 0.35 },
      { freq: 1046.5, delay: 0.12, dur: 0.28, vol: 0.4 },
      { freq: 1318.51, delay: 0.24, dur: 0.45, vol: 0.35 },
    ];

    notes.forEach(({ freq, delay, dur, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + delay);

      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(vol, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + dur + 0.05);
    });
  } catch {}
}

/** Clear, rich 3-note harmonic chime (G5 -> C6 -> E6) with dual-layer fallback */
export function playNotificationSound() {
  if (typeof window === "undefined" || !isNotificationSoundOn()) return;

  // 1. Web Audio API synthesized harmonic chime
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (Ctx) {
      if (!sharedAudioCtx || sharedAudioCtx.state === "closed") {
        sharedAudioCtx = new Ctx();
      }
      const ctx = sharedAudioCtx;
      if (ctx.state === "suspended") {
        ctx.resume().then(() => {
          if (ctx.state === "running") {
            playHarmonicNotes(ctx);
          }
        }).catch(() => {});
      } else if (ctx.state === "running") {
        playHarmonicNotes(ctx);
      }
    }
  } catch {}

  // 2. HTML5 Audio element fallback (works seamlessly even when AudioContext is suspended)
  try {
    const uri = getChimeWavDataUri();
    if (uri) {
      const audio = new Audio(uri);
      audio.volume = 0.7;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  } catch {}
}
