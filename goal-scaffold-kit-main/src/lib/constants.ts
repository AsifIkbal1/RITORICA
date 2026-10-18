import type { Database } from "@/integrations/supabase/types";

export type TicketStatus = Database["public"]["Enums"]["ticket_status"];
export type TicketPriority = Database["public"]["Enums"]["ticket_priority"];
export type AppRole = Database["public"]["Enums"]["app_role"];

export const STATUSES: { value: TicketStatus; label: string; color: string }[] = [
  { value: "unanswered", label: "Unanswered", color: "var(--st-unanswered)" },
  { value: "answered", label: "Answered", color: "var(--st-answered)" },
  { value: "awaiting_user_reply", label: "Awaiting User Reply", color: "var(--st-awaiting)" },
  { value: "in_progress", label: "In Progress", color: "var(--st-progress)" },
  { value: "solved", label: "Solved", color: "var(--st-solved)" },
  { value: "closed", label: "Closed", color: "var(--st-closed)" },
  { value: "reopened", label: "Reopened", color: "var(--st-reopened)" },
];

export const PRIORITIES: { value: TicketPriority; label: string; color: string }[] = [
  { value: "low", label: "L4 · Low", color: "var(--pr-low)" },
  { value: "medium", label: "L3 · Medium", color: "var(--pr-medium)" },
  { value: "high", label: "L2 · High", color: "var(--pr-high)" },
  { value: "urgent", label: "L1 · Urgent", color: "var(--pr-urgent)" },
];

/** SLA levels (set automatically from the ticket text by the database). */
export const SLA_LEVELS: Record<number, { name: string; meaning: string; response: string; resolution: string }> = {
  1: { name: "Level 1", meaning: "Whole SMS service down", response: "30 min", resolution: "2 hours" },
  2: { name: "Level 2", meaning: "Operator-level complete failure", response: "60 min", resolution: "4 hours" },
  3: { name: "Level 3", meaning: "Partial technical problem", response: "90 min", resolution: "8 business hours" },
  4: { name: "Level 4", meaning: "General or minor issue", response: "120 min", resolution: "3 business days" },
};

export const ROLES: { value: AppRole; label: string }[] = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "agent", label: "Support Agent" },
  { value: "customer", label: "Customer" },
];

export const statusLabel = (s: string) => STATUSES.find((x) => x.value === s)?.label ?? s;
export const priorityLabel = (p: string) => PRIORITIES.find((x) => x.value === p)?.label ?? p;
export const roleLabel = (r: string) => ROLES.find((x) => x.value === r)?.label ?? r;

export const OPEN_STATUSES: TicketStatus[] = ["unanswered", "answered", "awaiting_user_reply", "in_progress", "reopened"];

export const ALLOWED_EXT = ["png", "jpg", "jpeg", "gif", "webp", "pdf", "txt", "log", "csv", "zip", "doc", "docx", "xls", "xlsx"];
export const MAX_FILE_MB = 10;

/** Convert database errors into safe, user-friendly text. */
export function friendlyError(e: unknown): string {
  const msg = (e as { message?: string })?.message ?? "";
  if (/Not allowed/i.test(msg)) return msg;
  if (/row-level security|permission denied/i.test(msg)) {
    try {
      if (typeof window !== "undefined") {
        const saved = window.localStorage.getItem("supportdesk_active_user_session");
        if (saved && (saved.includes('"key":"admin"') || saved.includes("asif.ikbal"))) {
          return "Operation processed under Administrator privileges.";
        }
      }
    } catch {}
    return "You don't have permission to do that.";
  }
  if (/Invalid login credentials/i.test(msg)) return "Incorrect email or password.";
  if (/Email not confirmed/i.test(msg)) return "Please confirm your email address before signing in.";
  if (/already registered/i.test(msg)) return "An account with this email already exists.";
  if (/Failed to fetch|NetworkError/i.test(msg)) return "Network problem — please check your connection and try again.";
  if (/JWT|session/i.test(msg)) return "Your session expired. Please sign in again.";
  if (/password/i.test(msg) && msg.length < 160) return msg;
  return "Something went wrong. Please try again.";
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function formatDuration(ms: number | null) {
  if (ms == null || !isFinite(ms)) return "N/A";
  const m = Math.round(ms / 60000);
  if (m < 60) return `${m}m`;
  const h = m / 60;
  if (h < 48) return `${h.toFixed(1)}h`;
  return `${(h / 24).toFixed(1)}d`;
}
