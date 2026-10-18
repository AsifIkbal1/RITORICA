import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type NotificationRecord = {
  id: string;
  user_id: string;
  target_role?: "admin" | "agent" | "customer" | "all";
  type: string;
  title: string;
  message: string;
  ticket_id: string | null;
  chat_id: string | null;
  is_read: boolean;
  created_at: string;
  ticket: { ticket_number: string; subject: string } | null;
};

const DATA_DIR = path.resolve(process.cwd(), "data");
const NOTIFS_FILE = path.join(DATA_DIR, "notifications.json");

export function getLocalNotifications(userId?: string, role?: string): NotificationRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(NOTIFS_FILE)) {
      fs.writeFileSync(NOTIFS_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const raw = fs.readFileSync(NOTIFS_FILE, "utf-8");
    const all = JSON.parse(raw) as NotificationRecord[];

    return all.filter((n) => {
      // 1. All-broadcast notifications
      if (n.target_role === "all") return true;

      // 2. Direct user ID match
      if (userId && (n.user_id === userId || (n as any).recipient_id === userId)) {
        return true;
      }

      // 3. Admin / super_admin role
      if (role === "admin" || role === "super_admin" || userId === "00000000-0000-0000-0000-000000000001") {
        return n.target_role === "admin" || n.target_role === "staff" || n.user_id === "00000000-0000-0000-0000-000000000001" || n.user_id === "admin";
      }

      // 4. Agent role
      if (role === "agent") {
        return n.target_role === "agent" || n.target_role === "staff";
      }

      // 5. Customer role
      if (role === "customer") {
        return n.target_role === "customer" || (userId && n.user_id === userId);
      }

      return false;
    });
  } catch {
    return [];
  }
}

export function saveLocalNotifications(notifications: NotificationRecord[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(NOTIFS_FILE, JSON.stringify(notifications, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local notifications:", err);
  }
}

export function createLocalNotification(params: {
  user_id?: string;
  target_role?: "admin" | "agent" | "customer" | "all";
  type: string;
  title: string;
  message: string;
  ticket_id?: string | null;
  chat_id?: string | null;
  ticket?: { ticket_number: string; subject: string } | null;
}): NotificationRecord {
  const notifs = (() => {
    try {
      if (fs.existsSync(NOTIFS_FILE)) {
        return JSON.parse(fs.readFileSync(NOTIFS_FILE, "utf-8")) as NotificationRecord[];
      }
    } catch {}
    return [];
  })();

  const newNotif: NotificationRecord = {
    id: crypto.randomUUID(),
    user_id: params.user_id || "00000000-0000-0000-0000-000000000001",
    target_role: params.target_role || "admin",
    type: params.type,
    title: params.title,
    message: params.message,
    ticket_id: params.ticket_id || null,
    chat_id: params.chat_id || null,
    is_read: false,
    created_at: new Date().toISOString(),
    ticket: params.ticket || null,
  };

  notifs.unshift(newNotif);
  // Cap at 200 notifications
  if (notifs.length > 200) notifs.length = 200;
  saveLocalNotifications(notifs);
  return newNotif;
}

export function markLocalNotificationRead(id?: string, userId?: string): void {
  try {
    if (!fs.existsSync(NOTIFS_FILE)) return;
    const notifs = JSON.parse(fs.readFileSync(NOTIFS_FILE, "utf-8")) as NotificationRecord[];
    for (const n of notifs) {
      if (!id || n.id === id) {
        if (!userId || n.user_id === userId || userId === "00000000-0000-0000-0000-000000000001" || n.target_role === "admin") {
          n.is_read = true;
        }
      }
    }
    saveLocalNotifications(notifs);
  } catch (err) {
    console.error("Failed to mark notifications read:", err);
  }
}
