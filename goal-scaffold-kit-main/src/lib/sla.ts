import { useState, useEffect } from "react";
import type { TicketPriority, TicketStatus } from "./constants";

export type SlaTargetConfig = {
  responseMinutes: number;
  resolutionMinutes: number;
  label: string;
};

export const SLA_TARGETS: Record<TicketPriority, SlaTargetConfig> = {
  urgent: { responseMinutes: 30, resolutionMinutes: 120, label: "P1 · Critical (30m / 2h)" },
  high: { responseMinutes: 60, resolutionMinutes: 240, label: "P2 · High (60m / 4h)" },
  medium: { responseMinutes: 90, resolutionMinutes: 480, label: "P3 · Medium (90m / 8h)" },
  low: { responseMinutes: 120, resolutionMinutes: 4320, label: "P4 · Low (2h / 3 days)" },
};

export type SlaStatusResult = {
  stage: "response" | "resolution" | "completed";
  targetMinutes: number;
  dueAt: Date;
  isBreached: boolean;
  isWarning: boolean;
  remainingMs: number;
  remainingFormatted: string;
  percentUsed: number;
  slaConfig: SlaTargetConfig;
};

export function getTicketSla(ticket: {
  priority?: string | null;
  status?: string | null;
  created_at: string;
  response_due_at?: string | null;
  updated_at?: string;
}, nowMs: number = Date.now()): SlaStatusResult {
  const priority = (ticket.priority as TicketPriority) || "medium";
  const cfg = SLA_TARGETS[priority] || SLA_TARGETS.medium;
  const createdMs = new Date(ticket.created_at).getTime();
  const status = ticket.status as TicketStatus;

  const isCompleted = status === "solved" || status === "closed";
  const isResponsePending = status === "unanswered";

  let stage: "response" | "resolution" | "completed" = "resolution";
  let targetMinutes = cfg.resolutionMinutes;

  if (isCompleted) {
    stage = "completed";
    targetMinutes = cfg.resolutionMinutes;
  } else if (isResponsePending) {
    stage = "response";
    targetMinutes = cfg.responseMinutes;
  }

  const targetMs = targetMinutes * 60 * 1000;
  const dueMs = createdMs + targetMs;
  const dueAt = new Date(dueMs);
  const remainingMs = dueMs - nowMs;
  const isBreached = remainingMs < 0;
  const isWarning = !isBreached && remainingMs <= 15 * 60 * 1000;

  const elapsedMs = Math.max(0, nowMs - createdMs);
  const percentUsed = Math.min(100, Math.max(0, Math.round((elapsedMs / targetMs) * 100)));

  // Format remaining time
  const absRemaining = Math.abs(remainingMs);
  const totalSecs = Math.floor(absRemaining / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  let remainingFormatted = "";
  if (isCompleted) {
    remainingFormatted = "SLA Met";
  } else if (hours > 0) {
    remainingFormatted = `${hours}h ${minutes}m ${seconds}s`;
  } else {
    remainingFormatted = `${minutes}m ${seconds}s`;
  }

  if (!isCompleted && isBreached) {
    remainingFormatted = `Breached by ${remainingFormatted}`;
  } else if (!isCompleted) {
    remainingFormatted = `${remainingFormatted} left`;
  }

  return {
    stage,
    targetMinutes,
    dueAt,
    isBreached: !isCompleted && isBreached,
    isWarning: !isCompleted && isWarning,
    remainingMs,
    remainingFormatted,
    percentUsed: isCompleted ? 100 : percentUsed,
    slaConfig: cfg,
  };
}

export function useSlaTimer(ticket?: {
  priority?: string | null;
  status?: string | null;
  created_at: string;
  response_due_at?: string | null;
} | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!ticket) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [ticket?.created_at, ticket?.priority, ticket?.status]);

  if (!ticket) return null;
  return getTicketSla(ticket, now);
}
