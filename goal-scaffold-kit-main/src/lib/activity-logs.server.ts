import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type ActivityLogRecord = {
  id: string;
  user_id: string | null;
  user_name?: string | null;
  user_email?: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  description: string;
  metadata: Record<string, any>;
  created_at: string;
};

const DATA_DIR = path.resolve(process.cwd(), "data");
const LOGS_FILE = path.join(DATA_DIR, "activity_logs.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOGS_FILE)) {
    const now = new Date();
    const ago = (min: number) => new Date(now.getTime() - min * 60_000).toISOString();

    // Initial realistic logs if starting fresh
    const seed: ActivityLogRecord[] = [
      {
        id: crypto.randomUUID(),
        user_id: "00000000-0000-0000-0000-000000000001",
        user_name: "asif.ikbal",
        user_email: "asif.ikbal@ritorica.com.bd",
        action: "auth.login_success",
        entity_type: "auth",
        entity_id: "00000000-0000-0000-0000-000000000001",
        description: "Super Admin signed in successfully",
        metadata: { status: "success", username: "asif.ikbal", ip: "127.0.0.1" },
        created_at: ago(5),
      },
      {
        id: crypto.randomUUID(),
        user_id: "00000000-0000-0000-0000-000000000001",
        user_name: "asif.ikbal",
        user_email: "asif.ikbal@ritorica.com.bd",
        action: "email.sent",
        entity_type: "auth",
        entity_id: "00000000-0000-0000-0000-000000000001",
        description: "Password reset code sent to company email",
        metadata: { status: "success", username: "asif.ikbal", provider: "SMTP" },
        created_at: ago(25),
      },
      {
        id: crypto.randomUUID(),
        user_id: "00000000-0000-0000-0000-000000000001",
        user_name: "asif.ikbal",
        user_email: "asif.ikbal@ritorica.com.bd",
        action: "auth.setup_completed",
        entity_type: "auth",
        entity_id: "00000000-0000-0000-0000-000000000001",
        description: "System first-time setup completed",
        metadata: { status: "success", username: "asif.ikbal" },
        created_at: ago(45),
      },
      {
        id: crypto.randomUUID(),
        user_id: "00000000-0000-0000-0000-000000000002",
        user_name: "demo_test",
        user_email: "client@example.com",
        action: "auth.login_success",
        entity_type: "auth",
        entity_id: "00000000-0000-0000-0000-000000000002",
        description: "Customer signed in successfully",
        metadata: { status: "success", username: "demo_test", ip: "127.0.0.1" },
        created_at: ago(50),
      },
      {
        id: crypto.randomUUID(),
        user_id: "00000000-0000-0000-0000-000000000002",
        user_name: "demo_test",
        user_email: "client@example.com",
        action: "ticket.created",
        entity_type: "ticket",
        entity_id: "4aca7789-f61f-49d9-847b-7a633ee41b01",
        description: "Submitted new ticket: TK-1001",
        metadata: { ticket_number: "TK-1001", subject: "OTP is not comming" },
        created_at: ago(55),
      },
      {
        id: crypto.randomUUID(),
        user_id: "00000000-0000-0000-0000-000000000001",
        user_name: "asif.ikbal",
        user_email: "asif.ikbal@ritorica.com.bd",
        action: "ticket.replied",
        entity_type: "ticket",
        entity_id: "4aca7789-f61f-49d9-847b-7a633ee41b01",
        description: "Replied to ticket TK-1001",
        metadata: { ticket_number: "TK-1001" },
        created_at: ago(60),
      },
      {
        id: crypto.randomUUID(),
        user_id: "00000000-0000-0000-0000-000000000002",
        user_name: "demo_test",
        user_email: "client@example.com",
        action: "chat.started",
        entity_type: "chat",
        entity_id: "chat-001",
        description: "Customer initiated live support chat",
        metadata: { customer_name: "demo_test" },
        created_at: ago(65),
      },
    ];

    fs.writeFileSync(LOGS_FILE, JSON.stringify(seed, null, 2), "utf-8");
  }
}

export function getAllActivityLogs(): ActivityLogRecord[] {
  try {
    ensureFile();
    const raw = fs.readFileSync(LOGS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAllActivityLogs(logs: ActivityLogRecord[]): void {
  try {
    ensureFile();
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save activity logs:", err);
  }
}

export function recordActivityLog(params: {
  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  action: string;
  entityType?: string | null;
  entityId?: string | null;
  description: string;
  metadata?: Record<string, any>;
}): ActivityLogRecord {
  const all = getAllActivityLogs();
  const newLog: ActivityLogRecord = {
    id: crypto.randomUUID(),
    user_id: params.userId ?? null,
    user_name: params.userName ?? null,
    user_email: params.userEmail ?? null,
    action: params.action,
    entity_type: params.entityType ?? null,
    entity_id: params.entityId ?? null,
    description: params.description,
    metadata: params.metadata ?? {},
    created_at: new Date().toISOString(),
  };

  all.unshift(newLog);
  // Cap at 2000 logs to prevent unbounded file growth
  if (all.length > 2000) all.length = 2000;
  saveAllActivityLogs(all);
  return newLog;
}

export function filterActivityLogs(options: {
  tab?: "customer" | "staff" | "security";
  search?: string;
  person?: string;
  event?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}): { rows: ActivityLogRecord[]; count: number } {
  let list = getAllActivityLogs();

  const { tab, search, person, event, status, from, to, page = 1, size = 50 } = options;

  if (tab === "security") {
    // Only auth & email events
    list = list.filter((l) => l.entity_type === "auth" || l.action.startsWith("auth.") || l.action.startsWith("email."));
  } else if (tab === "customer") {
    // Show customer actions or logs for customer user_ids
    list = list.filter((l) => {
      const isStaffAction = l.action.startsWith("admin.") || l.action.startsWith("agent.") || l.metadata?.role === "admin" || l.metadata?.role === "super_admin";
      if (person) return l.user_id === person;
      return !isStaffAction && l.user_name !== "asif.ikbal";
    });
  } else if (tab === "staff") {
    // Show staff/admin actions
    list = list.filter((l) => {
      if (person) return l.user_id === person;
      const isStaff = l.user_name === "asif.ikbal" || l.action.startsWith("admin.") || l.metadata?.role === "admin" || l.metadata?.role === "super_admin" || l.metadata?.role === "agent";
      return isStaff || l.entity_type === "auth" || l.entity_type === "settings" || l.entity_type === "role";
    });
  }

  if (event) {
    list = list.filter((l) => l.action === event);
  }

  if (status) {
    list = list.filter((l) => l.metadata?.status === status);
  }

  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    list = list.filter(
      (l) =>
        l.description.toLowerCase().includes(s) ||
        l.action.toLowerCase().includes(s) ||
        (l.user_name && l.user_name.toLowerCase().includes(s)) ||
        (l.metadata?.username && String(l.metadata.username).toLowerCase().includes(s)),
    );
  }

  if (from) {
    const fromTime = new Date(from).getTime();
    list = list.filter((l) => new Date(l.created_at).getTime() >= fromTime);
  }

  if (to) {
    const toTime = new Date(to).getTime() + 86400000;
    list = list.filter((l) => new Date(l.created_at).getTime() < toTime);
  }

  const count = list.length;
  const startIndex = (page - 1) * size;
  const rows = list.slice(startIndex, startIndex + size);

  return { rows, count };
}
