import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getLocalConversations,
  getLocalConversationById,
  createOrGetActiveConversation,
  getLocalChatMessages,
  addLocalChatMessage,
  closeLocalConversation,
  assignLocalConversation,
  requestHumanConversation,
  setLocalConversationMode,
  getChatConfig,
  saveChatConfigRecord,
  addAiLogRecord,
  getAiLogs,
  type ChatConversationRecord,
  type ChatMessageRecord,
  type ChatConfigRecord,
  type ChatAiLogRecord,
} from "./chat.server";
import { callN8n, isValidWebhookUrl } from "./n8n.server";

export type SendResult = { ok: boolean; ai: "none" | "replied" | "escalated" | "error" | "unavailable"; error?: string };

async function triggerN8nReply(conversationId: string, messageText: string, customerId?: string | null, customerName?: string) {
  const cfg = getChatConfig();
  if (!cfg.ai_enabled || !cfg.n8n_webhook_url) return null;

  try {
    const res = await callN8n(cfg.n8n_webhook_url, {
      message: messageText,
      text: messageText,
      query: messageText,
      action: "sendMessage",
      conversation_id: conversationId,
      chat_id: conversationId,
      customer_id: customerId || null,
      customer_name: customerName || "Customer",
      sessionId: conversationId,
      timestamp: new Date().toISOString(),
    });

    if (res.ok && res.reply) {
      const aiMsg = addLocalChatMessage({
        conversationId,
        senderId: null,
        senderName: "AI Assistant",
        senderType: "ai",
        message: res.reply,
        isAi: true,
      });

      addAiLogRecord({
        conversation_id: conversationId,
        status: res.escalate ? "escalated" : "success",
        customer_message: messageText,
        ai_reply: res.reply,
        latency_ms: res.ms,
      });

      if (res.escalate) {
        requestHumanConversation(conversationId);
      }

      try {
        const { recordActivityLog } = await import("./activity-logs.server");
        recordActivityLog({
          user_id: null,
          user_name: "AI Assistant",
          action: "chat.ai_reply",
          entity_type: "chat",
          entity_id: conversationId,
          description: `AI answered customer message via n8n (${res.ms}ms)`,
        });
      } catch {}

      return aiMsg;
    } else if (!res.ok) {
      addAiLogRecord({
        conversation_id: conversationId,
        status: "error",
        customer_message: messageText,
        error: res.error,
        latency_ms: res.ms,
      });
    }
  } catch (err) {
    console.error("n8n AI reply execution failed:", err);
  }
  return null;
}

export const startChatFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      customerId: z.string(),
      customerName: z.string().optional(),
      customerEmail: z.string().optional(),
      firstMessage: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<{ conversation_id: string; unavailable: boolean }> => {
    let conv = createOrGetActiveConversation({
      customerId: data.customerId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
    });

    if (data.firstMessage && data.firstMessage.trim()) {
      addLocalChatMessage({
        conversationId: conv.id,
        senderId: data.customerId,
        senderName: data.customerName || "Customer",
        senderType: "customer",
        message: data.firstMessage.trim(),
      });

      // Trigger automated AI reply via n8n
      void triggerN8nReply(conv.id, data.firstMessage.trim(), data.customerId, data.customerName);
    }

    try {
      const { createLocalNotification } = await import("./notifications.server");
      createLocalNotification({
        user_id: "00000000-0000-0000-0000-000000000001",
        target_role: "admin",
        type: "chat",
        title: "New Live Chat Started",
        message: `${data.customerName || "Customer"} started a chat: "${(data.firstMessage || "Hello").slice(0, 80)}"`,
        chat_id: conv.id,
      });
    } catch {}

    return { conversation_id: conv.id, unavailable: false };
  });

export const sendChatMessageFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      conversationId: z.string(),
      senderId: z.string().nullable().optional(),
      senderName: z.string(),
      senderType: z.enum(["customer", "agent", "ai", "system"]),
      message: z.string().max(5000),
      clientId: z.string().nullable().optional(),
      attachmentUrl: z.string().nullable().optional(),
      attachmentName: z.string().nullable().optional(),
      attachmentType: z.string().nullable().optional(),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<{ ok: boolean; message: ChatMessageRecord }> => {
    const msg = addLocalChatMessage({
      conversationId: data.conversationId,
      senderId: data.senderId || null,
      senderName: data.senderName,
      senderType: data.senderType,
      message: data.message,
      clientId: data.clientId,
      attachmentUrl: data.attachmentUrl,
      attachmentName: data.attachmentName,
      attachmentType: data.attachmentType,
    });

    try {
      const { createLocalNotification } = await import("./notifications.server");
      if (data.senderType === "customer") {
        createLocalNotification({
          user_id: "00000000-0000-0000-0000-000000000001",
          target_role: "admin",
          type: "chat",
          title: "New Live Chat Message",
          message: `${data.senderName}: "${data.message.slice(0, 80)}"`,
          chat_id: data.conversationId,
        });

        // Trigger automated AI reply via n8n
        void triggerN8nReply(data.conversationId, data.message, data.senderId, data.senderName);
      } else if (data.senderType === "agent") {
        createLocalNotification({
          target_role: "customer",
          type: "chat",
          title: "Support Replied to Chat",
          message: `${data.senderName}: "${data.message.slice(0, 80)}"`,
          chat_id: data.conversationId,
        });
      }
    } catch {}

    return { ok: true, message: msg };
  });

export const getChatConversationsFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      userId: z.string().optional(),
      role: z.string().optional(),
      filter: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<ChatConversationRecord[]> => {
    return getLocalConversations(data.userId, data.role, data.filter);
  });

export const getChatRoomFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ conversationId: z.string() }).parse(d))
  .handler(async ({ data }): Promise<{ conv: ChatConversationRecord | null; messages: ChatMessageRecord[] }> => {
    const conv = getLocalConversationById(data.conversationId);
    const messages = getLocalChatMessages(data.conversationId);
    return { conv, messages };
  });

export const closeChatFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      conversationId: z.string(),
      closedBy: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<{ ok: boolean; conv: ChatConversationRecord | null }> => {
    const conv = closeLocalConversation(data.conversationId, data.closedBy);
    return { ok: true, conv };
  });

export const takeOverChatFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      conversationId: z.string(),
      agentId: z.string(),
      agentName: z.string(),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<{ ok: boolean; conv: ChatConversationRecord | null }> => {
    const conv = assignLocalConversation(data.conversationId, data.agentId, data.agentName);
    return { ok: true, conv };
  });

export const requestHumanChatFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ conversationId: z.string() }).parse(d))
  .handler(async ({ data }): Promise<{ ok: boolean; conv: ChatConversationRecord | null }> => {
    const conv = requestHumanConversation(data.conversationId);
    return { ok: true, conv };
  });

export const setChatModeFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      conversationId: z.string(),
      mode: z.enum(["human", "ai", "hybrid"]),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<{ ok: boolean; conv: ChatConversationRecord | null }> => {
    const conv = setLocalConversationMode(data.conversationId, data.mode);
    return { ok: true, conv };
  });

export const getChatAvailabilityFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<{ human_online: boolean; ai_available: boolean }> => {
    const cfg = getChatConfig();
    return { human_online: true, ai_available: !!cfg.ai_enabled && !!cfg.n8n_webhook_url };
  });

export const getChatConfigFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<ChatConfigRecord> => {
    return getChatConfig();
  });

export const getChatAiLogsFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<ChatAiLogRecord[]> => {
    return getAiLogs();
  });

export const setPresenceFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      userId: z.string(),
      status: z.enum(["online", "away", "offline"]),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("agent_presence").upsert({
        user_id: data.userId,
        status: data.status,
        last_seen_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch {}
    return { ok: true, status: data.status };
  });


const sendInput = z.object({
  conversation_id: z.string(),
  client_id: z.string(),
  message: z.string().max(5000).default(""),
  attachment: z.object({ path: z.string().max(400), name: z.string().max(255), type: z.string().max(120) }).nullable().optional(),
  retry: z.boolean().optional(),
});

export const sendCustomerChatMessage = createServerFn({ method: "POST" })
  .validator((d: unknown) => sendInput.parse(d))
  .handler(async ({ data }): Promise<SendResult> => {
    const text = data.message.trim();
    addLocalChatMessage({
      conversationId: data.conversation_id,
      senderId: null,
      senderName: "Customer",
      senderType: "customer",
      message: text,
      clientId: data.client_id,
    });

    // Trigger automated AI reply via n8n
    void triggerN8nReply(data.conversation_id, text, null, "Customer");

    return { ok: true, ai: "replied" };
  });

const configInput = z.object({
  n8n_webhook_url: z.string().trim().max(1000),
  ai_enabled: z.boolean(),
});

export const saveChatConfig = createServerFn({ method: "POST" })
  .validator((d: unknown) => configInput.parse(d))
  .handler(async ({ data }) => {
    const updated = saveChatConfigRecord({
      n8n_webhook_url: data.n8n_webhook_url || null,
      ai_enabled: data.ai_enabled,
    });
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin
        .from("chat_config")
        .upsert({ id: 1, n8n_webhook_url: data.n8n_webhook_url || null, ai_enabled: data.ai_enabled });
    } catch {}
    return { ok: true, config: updated };
  });

export const testN8nConnection = createServerFn({ method: "POST" })
  .handler(async () => {
    const cfg = getChatConfig();
    if (!cfg.n8n_webhook_url) {
      return { ok: false, error: "No webhook URL configured yet.", reply: null, ms: 0 };
    }
    const res = await callN8n(cfg.n8n_webhook_url, {
      message: "Hello! This is a test message from SupportDesk AI chat assistant.",
      text: "Hello! This is a test message from SupportDesk AI chat assistant.",
      action: "test",
      timestamp: new Date().toISOString(),
    });
    if (res.ok) {
      addAiLogRecord({
        conversation_id: null,
        status: "success",
        customer_message: "Test connection",
        ai_reply: res.reply,
        latency_ms: res.ms,
      });
      return { ok: true, reply: res.reply, ms: res.ms };
    } else {
      addAiLogRecord({
        conversation_id: null,
        status: "error",
        customer_message: "Test connection",
        error: res.error,
        latency_ms: res.ms,
      });
      return { ok: false, error: res.error, reply: null, ms: res.ms };
    }
  });
