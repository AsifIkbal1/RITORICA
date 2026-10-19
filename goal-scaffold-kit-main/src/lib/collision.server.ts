export type ViewerPresence = {
  userId: string;
  userName: string;
  role: string;
  action: "viewing" | "typing";
  lastSeen: number;
};

// Map of ticketId -> (Map of userId -> ViewerPresence)
const presenceStore = new Map<string, Map<string, ViewerPresence>>();

const TTL_MS = 12_000; // 12 seconds inactivity threshold

export function pingTicketPresence(
  ticketId: string,
  params: {
    userId: string;
    userName: string;
    role: string;
    action?: "viewing" | "typing";
  }
): void {
  if (!presenceStore.has(ticketId)) {
    presenceStore.set(ticketId, new Map());
  }

  const viewers = presenceStore.get(ticketId)!;
  viewers.set(params.userId, {
    userId: params.userId,
    userName: params.userName || "Agent",
    role: params.role || "staff",
    action: params.action || "viewing",
    lastSeen: Date.now(),
  });
}

export function leaveTicketPresence(ticketId: string, userId: string): void {
  const viewers = presenceStore.get(ticketId);
  if (viewers) {
    viewers.delete(userId);
    if (viewers.size === 0) {
      presenceStore.delete(ticketId);
    }
  }
}

export function getTicketActiveViewers(
  ticketId: string,
  excludeUserId?: string
): ViewerPresence[] {
  const viewers = presenceStore.get(ticketId);
  if (!viewers) return [];

  const now = Date.now();
  const active: ViewerPresence[] = [];

  for (const [uid, v] of viewers.entries()) {
    if (now - v.lastSeen > TTL_MS) {
      viewers.delete(uid);
    } else if (uid !== excludeUserId) {
      active.push(v);
    }
  }

  return active;
}
