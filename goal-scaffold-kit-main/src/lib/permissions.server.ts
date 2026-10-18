import fs from "node:fs";
import path from "node:path";
import { recordActivityLog } from "./activity-logs.server";

export type PermissionItem = {
  key: string;
  description: string;
};

export type RolePermissionRecord = {
  role: "super_admin" | "admin" | "agent" | "customer";
  permission_key: string;
};

export const DEFAULT_PERMISSIONS: PermissionItem[] = [
  { key: "tickets.view", description: "View tickets and conversation history" },
  { key: "tickets.create", description: "Submit new support tickets" },
  { key: "tickets.reply", description: "Reply to customer or agent ticket threads" },
  { key: "tickets.internal_note", description: "Add private staff-only internal notes" },
  { key: "tickets.assign", description: "Assign or reassign tickets to agents" },
  { key: "tickets.change_status", description: "Change ticket status (solved, closed, in progress, etc.)" },
  { key: "tickets.change_priority", description: "Change ticket priority (urgent, high, medium, low)" },
  { key: "tickets.change_department", description: "Reassign ticket department" },
  { key: "tickets.change_category", description: "Reassign ticket category" },
  { key: "tickets.edit", description: "Edit ticket subject and custom metadata" },
  { key: "tickets.delete", description: "Permanently delete tickets" },
  { key: "tickets.ai_draft", description: "Generate and use AI-assisted reply drafts" },
  { key: "customers.view", description: "View customer directory and accounts" },
  { key: "agents.view", description: "View and monitor support agent accounts" },
  { key: "departments.manage", description: "Create, edit, and organize departments" },
  { key: "categories.manage", description: "Create, edit, and organize ticket categories" },
  { key: "reports.view", description: "View analytics, ticket volume reports, and SLA metrics" },
  { key: "activity_logs.view", description: "Access audit trail and activity logs" },
  { key: "settings.manage", description: "Configure global helpdesk settings and custom fields" },
  { key: "users.manage", description: "Manage users, credentials, and access roles" },
  { key: "roles.manage", description: "Configure roles and permission matrices" },
  { key: "chat.manage", description: "Manage live chats, queue routing, and agent takeover" },
];

export const DEFAULT_ROLE_PERMISSIONS: RolePermissionRecord[] = [
  // Admin has ALL permissions
  ...DEFAULT_PERMISSIONS.map((p) => ({ role: "admin" as const, permission_key: p.key })),

  // Support Agent permissions
  { role: "agent", permission_key: "tickets.view" },
  { role: "agent", permission_key: "tickets.create" },
  { role: "agent", permission_key: "tickets.reply" },
  { role: "agent", permission_key: "tickets.internal_note" },
  { role: "agent", permission_key: "tickets.assign" },
  { role: "agent", permission_key: "tickets.change_status" },
  { role: "agent", permission_key: "tickets.change_priority" },
  { role: "agent", permission_key: "tickets.change_department" },
  { role: "agent", permission_key: "tickets.change_category" },
  { role: "agent", permission_key: "tickets.ai_draft" },
  { role: "agent", permission_key: "reports.view" },
  { role: "agent", permission_key: "chat.manage" },

  // Customer permissions
  { role: "customer", permission_key: "tickets.view" },
  { role: "customer", permission_key: "tickets.create" },
  { role: "customer", permission_key: "tickets.reply" },
];

const DATA_DIR = path.resolve(process.cwd(), "data");
const PERMS_FILE = path.join(DATA_DIR, "permissions.json");
const ROLE_PERMS_FILE = path.join(DATA_DIR, "role_permissions.json");

function ensureFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(PERMS_FILE)) {
    fs.writeFileSync(PERMS_FILE, JSON.stringify(DEFAULT_PERMISSIONS, null, 2), "utf-8");
  }
  if (!fs.existsSync(ROLE_PERMS_FILE)) {
    fs.writeFileSync(ROLE_PERMS_FILE, JSON.stringify(DEFAULT_ROLE_PERMISSIONS, null, 2), "utf-8");
  }
}

export function getPermissionsCatalogue(): PermissionItem[] {
  try {
    ensureFiles();
    const raw = fs.readFileSync(PERMS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PERMISSIONS;
  }
}

export function getRolePermissions(): RolePermissionRecord[] {
  try {
    ensureFiles();
    const raw = fs.readFileSync(ROLE_PERMS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ROLE_PERMISSIONS;
  }
}

export function saveRolePermissions(list: RolePermissionRecord[]): void {
  try {
    ensureFiles();
    fs.writeFileSync(ROLE_PERMS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save role permissions:", err);
  }
}

export function toggleRolePermission(
  role: "super_admin" | "admin" | "agent" | "customer",
  permissionKey: string,
  granted: boolean,
  actor?: { id?: string; name?: string },
): void {
  let list = getRolePermissions();
  if (granted) {
    if (!list.some((rp) => rp.role === role && rp.permission_key === permissionKey)) {
      list.push({ role, permission_key: permissionKey });
    }
  } else {
    list = list.filter((rp) => !(rp.role === role && rp.permission_key === permissionKey));
  }
  saveRolePermissions(list);

  recordActivityLog({
    userId: actor?.id ?? "00000000-0000-0000-0000-000000000001",
    userName: actor?.name ?? "Super Admin",
    action: "permissions.changed",
    entityType: "role",
    entityId: role,
    description: `${granted ? "Granted" : "Revoked"} "${permissionKey}" for role ${role}`,
    metadata: { role, permission_key: permissionKey, granted },
  });
}
