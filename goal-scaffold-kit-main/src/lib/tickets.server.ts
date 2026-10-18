import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { AiClassificationResult } from "./ai-priority-classifier.server";

export type TicketRecord = {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  category_id: string;
  department_id: string;
  customer_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  status: string;
  priority: string;
  assigned_agent_id?: string | null;
  custom_fields?: Record<string, any>;
  ai_classification?: AiClassificationResult | null;
  created_at: string;
  updated_at: string;
};

const DATA_DIR = path.resolve(process.cwd(), "data");
const TICKETS_FILE = path.join(DATA_DIR, "tickets.json");

export function getLocalTickets(): TicketRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(TICKETS_FILE)) {
      fs.writeFileSync(TICKETS_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const raw = fs.readFileSync(TICKETS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalTickets(tickets: TicketRecord[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(TICKETS_FILE, JSON.stringify(tickets, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local tickets:", err);
  }
}

export function createLocalTicket(params: {
  subject: string;
  description: string;
  category_id: string;
  department_id: string;
  customer_id: string;
  customer_name?: string;
  priority?: string;
  custom_fields?: Record<string, any>;
  ai_classification?: AiClassificationResult | null;
}): TicketRecord {
  const tickets = getLocalTickets();
  const nextNum = 1000 + tickets.length + 1;
  const ticketNumber = `TK-${nextNum}`;
  const now = new Date().toISOString();

  const autoPriority =
    params.priority ||
    (params.ai_classification?.incident_priority !== "UNDETERMINED" ? params.ai_classification?.incident_priority : null) ||
    "medium";

  const newTicket: TicketRecord = {
    id: crypto.randomUUID(),
    ticket_number: ticketNumber,
    subject: params.subject,
    description: params.description,
    category_id: params.category_id,
    department_id: params.department_id,
    customer_id: params.customer_id,
    customer_name: params.customer_name || "Customer",
    status: "unanswered",
    priority: autoPriority,
    custom_fields: params.custom_fields || {},
    ai_classification: params.ai_classification || null,
    created_at: now,
    updated_at: now,
  };

  tickets.unshift(newTicket);
  saveLocalTickets(tickets);
  return newTicket;
}

export function updateLocalTicket(id: string, patch: Partial<TicketRecord>): TicketRecord | null {
  const tickets = getLocalTickets();
  const idx = tickets.findIndex((t) => t.id === id);
  if (idx === -1) return null;

  tickets[idx] = {
    ...tickets[idx],
    ...patch,
    updated_at: new Date().toISOString(),
  };

  saveLocalTickets(tickets);
  return tickets[idx];
}

export function deleteLocalTicket(id: string): boolean {
  const tickets = getLocalTickets();
  const filtered = tickets.filter((t) => t.id !== id);
  if (filtered.length === tickets.length) return false;
  saveLocalTickets(filtered);
  return true;
}

export type TicketMessageRecord = {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_name?: string;
  message: string;
  message_type: "customer_reply" | "agent_reply" | "internal_note" | "system_event";
  created_at: string;
};

const MSGS_FILE = path.join(DATA_DIR, "ticket-messages.json");

export function getLocalTicketMessages(ticketId: string): TicketMessageRecord[] {
  try {
    if (!fs.existsSync(MSGS_FILE)) return [];
    const raw = fs.readFileSync(MSGS_FILE, "utf-8");
    const all = JSON.parse(raw) as TicketMessageRecord[];
    return all.filter((m) => m.ticket_id === ticketId);
  } catch {
    return [];
  }
}

export function getAllLocalTicketMessages(): TicketMessageRecord[] {
  try {
    if (!fs.existsSync(MSGS_FILE)) return [];
    const raw = fs.readFileSync(MSGS_FILE, "utf-8");
    return JSON.parse(raw) as TicketMessageRecord[];
  } catch {
    return [];
  }
}

export function addLocalTicketMessage(params: {
  ticket_id: string;
  sender_id: string;
  sender_name?: string;
  message: string;
  message_type: "customer_reply" | "agent_reply" | "internal_note" | "system_event";
}): TicketMessageRecord {
  const msgs = (() => {
    try {
      if (fs.existsSync(MSGS_FILE)) {
        return JSON.parse(fs.readFileSync(MSGS_FILE, "utf-8")) as TicketMessageRecord[];
      }
    } catch {}
    return [];
  })();

  const newMsg: TicketMessageRecord = {
    id: crypto.randomUUID(),
    ticket_id: params.ticket_id,
    sender_id: params.sender_id,
    sender_name: params.sender_name || "User",
    message: params.message,
    message_type: params.message_type,
    created_at: new Date().toISOString(),
  };

  msgs.push(newMsg);
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(MSGS_FILE, JSON.stringify(msgs, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local ticket message:", err);
  }
  return newMsg;
}
