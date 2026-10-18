import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type ChatConversationRecord = {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  assigned_agent_id: string | null;
  agent_name: string | null;
  status: "active" | "waiting_for_agent" | "waiting_for_customer" | "closed";
  mode: "human" | "ai" | "hybrid";
  ticket_id: string | null;
  last_message: string | null;
  last_message_at: string;
  customer_last_read_at: string;
  staff_last_read_at: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  closed_by: string | null;
};

export type ChatMessageRecord = {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  sender_name: string;
  sender_type: "customer" | "agent" | "ai" | "system";
  message: string;
  client_id: string | null;
  is_ai: boolean;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_type: string | null;
  created_at: string;
};

const DATA_DIR = path.resolve(process.cwd(), "data");
const CONV_FILE = path.join(DATA_DIR, "chat_conversations.json");
const MSG_FILE = path.join(DATA_DIR, "chat_messages.json");
const CONFIG_FILE = path.join(DATA_DIR, "chat_config.json");
const AI_LOGS_FILE = path.join(DATA_DIR, "chat_ai_logs.json");

export type ChatConfigRecord = {
  id: number;
  n8n_webhook_url: string | null;
  ai_enabled: boolean;
  updated_at: string;
};

export type ChatAiLogRecord = {
  id: string;
  conversation_id: string | null;
  status: "success" | "error" | "escalated";
  customer_message?: string;
  ai_reply?: string;
  error?: string;
  latency_ms?: number;
  created_at: string;
};

const DEFAULT_CHAT_CONFIG: ChatConfigRecord = {
  id: 1,
  n8n_webhook_url: "https://fsgsgsyttryerty.app.n8n.cloud/webhook-test/website-chat",
  ai_enabled: true,
  updated_at: new Date().toISOString(),
};

function ensureFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CONV_FILE)) {
    fs.writeFileSync(CONV_FILE, JSON.stringify([], null, 2), "utf-8");
  }
  if (!fs.existsSync(MSG_FILE)) {
    fs.writeFileSync(MSG_FILE, JSON.stringify([], null, 2), "utf-8");
  }
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CHAT_CONFIG, null, 2), "utf-8");
  }
  if (!fs.existsSync(AI_LOGS_FILE)) {
    fs.writeFileSync(AI_LOGS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export function getAllConversations(): ChatConversationRecord[] {
  try {
    ensureFiles();
    const raw = fs.readFileSync(CONV_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAllConversations(conversations: ChatConversationRecord[]): void {
  try {
    ensureFiles();
    fs.writeFileSync(CONV_FILE, JSON.stringify(conversations, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save chat conversations:", err);
  }
}

export function getAllMessages(): ChatMessageRecord[] {
  try {
    ensureFiles();
    const raw = fs.readFileSync(MSG_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAllMessages(messages: ChatMessageRecord[]): void {
  try {
    ensureFiles();
    fs.writeFileSync(MSG_FILE, JSON.stringify(messages, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save chat messages:", err);
  }
}

export function getLocalConversations(userId?: string, role?: string, filter?: string): ChatConversationRecord[] {
  const all = getAllConversations();
  all.sort((a, b) => new Date(b.last_message_at || b.created_at).getTime() - new Date(a.last_message_at || a.created_at).getTime());

  if (role === "customer" || (userId && role !== "admin" && role !== "agent" && role !== "super_admin")) {
    return all.filter((c) => c.customer_id === userId);
  }

  // Staff / Admin filters
  if (!filter || filter === "all") return all;
  if (filter === "active") return all.filter((c) => c.status === "active" || c.status === "waiting_for_customer");
  if (filter === "waiting" || filter === "queue") return all.filter((c) => c.status === "waiting_for_agent");
  if (filter === "closed") return all.filter((c) => c.status === "closed");
  if (filter === "assigned") return all.filter((c) => !!c.assigned_agent_id && c.status !== "closed");
  if (filter === "unassigned") return all.filter((c) => !c.assigned_agent_id && c.status !== "closed");
  if (filter === "mine" && userId) return all.filter((c) => c.assigned_agent_id === userId && c.status !== "closed");

  return all;
}

export function getLocalConversationById(id: string): ChatConversationRecord | null {
  const all = getAllConversations();
  return all.find((c) => c.id === id) || null;
}

export function createOrGetActiveConversation(params: {
  customerId: string;
  customerName?: string;
  customerEmail?: string;
}): ChatConversationRecord {
  const all = getAllConversations();
  const existing = all.find((c) => c.customer_id === params.customerId && c.status !== "closed");
  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();
  const newConv: ChatConversationRecord = {
    id: crypto.randomUUID(),
    customer_id: params.customerId,
    customer_name: params.customerName || "Customer",
    customer_email: params.customerEmail || `${params.customerName || "customer"}@ritorica.invalid`,
    assigned_agent_id: null,
    agent_name: null,
    status: "waiting_for_agent",
    mode: "human",
    ticket_id: null,
    last_message: null,
    last_message_at: now,
    customer_last_read_at: now,
    staff_last_read_at: now,
    created_at: now,
    updated_at: now,
    closed_at: null,
    closed_by: null,
  };

  all.unshift(newConv);
  saveAllConversations(all);
  return newConv;
}

export function getLocalChatMessages(convId: string): ChatMessageRecord[] {
  const all = getAllMessages();
  return all
    .filter((m) => m.conversation_id === convId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function addLocalChatMessage(params: {
  conversationId: string;
  senderId: string | null;
  senderName: string;
  senderType: "customer" | "agent" | "ai" | "system";
  message: string;
  clientId?: string | null;
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  attachmentType?: string | null;
}): ChatMessageRecord {
  const allMessages = getAllMessages();
  const now = new Date().toISOString();

  const newMsg: ChatMessageRecord = {
    id: crypto.randomUUID(),
    conversation_id: params.conversationId,
    sender_id: params.senderId,
    sender_name: params.senderName,
    sender_type: params.senderType,
    message: params.message,
    client_id: params.clientId || null,
    is_ai: params.senderType === "ai",
    attachment_url: params.attachmentUrl || null,
    attachment_name: params.attachmentName || null,
    attachment_type: params.attachmentType || null,
    created_at: now,
  };

  allMessages.push(newMsg);
  saveAllMessages(allMessages);

  // Update conversation record
  const allConvs = getAllConversations();
  const conv = allConvs.find((c) => c.id === params.conversationId);
  if (conv) {
    conv.last_message = params.message;
    conv.last_message_at = now;
    conv.updated_at = now;
    if (params.senderType === "customer") {
      conv.status = conv.assigned_agent_id ? "active" : "waiting_for_agent";
      conv.customer_last_read_at = now;
    } else if (params.senderType === "agent") {
      conv.status = "waiting_for_customer";
      conv.staff_last_read_at = now;
    }
    saveAllConversations(allConvs);
  }

  return newMsg;
}

export function closeLocalConversation(convId: string, closedBy?: string): ChatConversationRecord | null {
  const all = getAllConversations();
  const conv = all.find((c) => c.id === convId);
  if (!conv) return null;

  const now = new Date().toISOString();
  conv.status = "closed";
  conv.closed_at = now;
  conv.closed_by = closedBy || null;
  conv.updated_at = now;

  saveAllConversations(all);
  return conv;
}

export function assignLocalConversation(convId: string, agentId: string, agentName: string): ChatConversationRecord | null {
  const all = getAllConversations();
  const conv = all.find((c) => c.id === convId);
  if (!conv) return null;

  const now = new Date().toISOString();
  conv.assigned_agent_id = agentId;
  conv.agent_name = agentName;
  conv.status = "active";
  conv.updated_at = now;

  saveAllConversations(all);
  return conv;
}

export function requestHumanConversation(convId: string): ChatConversationRecord | null {
  const all = getAllConversations();
  const conv = all.find((c) => c.id === convId);
  if (!conv) return null;

  const now = new Date().toISOString();
  conv.status = "waiting_for_agent";
  conv.mode = "human";
  conv.updated_at = now;

  saveAllConversations(all);
  return conv;
}

export function setLocalConversationMode(convId: string, mode: "human" | "ai" | "hybrid"): ChatConversationRecord | null {
  const all = getAllConversations();
  const conv = all.find((c) => c.id === convId);
  if (!conv) return null;

  const now = new Date().toISOString();
  conv.mode = mode;
  conv.updated_at = now;

  saveAllConversations(all);
  return conv;
}

export function getChatConfig(): ChatConfigRecord {
  try {
    ensureFiles();
    const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CHAT_CONFIG;
  }
}

export function saveChatConfigRecord(cfg: Partial<ChatConfigRecord>): ChatConfigRecord {
  try {
    ensureFiles();
    const current = getChatConfig();
    const updated: ChatConfigRecord = {
      ...current,
      ...cfg,
      updated_at: new Date().toISOString(),
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return updated;
  } catch {
    return DEFAULT_CHAT_CONFIG;
  }
}

export function getAiLogs(): ChatAiLogRecord[] {
  try {
    ensureFiles();
    const raw = fs.readFileSync(AI_LOGS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addAiLogRecord(entry: Omit<ChatAiLogRecord, "id" | "created_at">): ChatAiLogRecord {
  try {
    ensureFiles();
    const logs = getAiLogs();
    const newLog: ChatAiLogRecord = {
      id: crypto.randomUUID(),
      ...entry,
      created_at: new Date().toISOString(),
    };
    logs.unshift(newLog);
    // Keep last 100 entries
    fs.writeFileSync(AI_LOGS_FILE, JSON.stringify(logs.slice(0, 100), null, 2), "utf-8");
    return newLog;
  } catch (err) {
    console.error("Failed to add AI log:", err);
    return {
      id: crypto.randomUUID(),
      ...entry,
      created_at: new Date().toISOString(),
    };
  }
}

