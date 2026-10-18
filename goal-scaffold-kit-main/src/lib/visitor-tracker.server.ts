import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type VisitorHit = {
  id: string;
  session_id: string;
  path: string;
  ip?: string;
  user_agent?: string;
  user_name?: string;
  role?: string;
  timestamp: string;
};

const DATA_DIR = path.resolve(process.cwd(), "data");
const HITS_FILE = path.join(DATA_DIR, "visitor_hits.json");

function getStoredHits(): VisitorHit[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(HITS_FILE)) {
      fs.writeFileSync(HITS_FILE, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    const raw = fs.readFileSync(HITS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredHits(hits: VisitorHit[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Retain up to 1000 most recent hits
    const trimmed = hits.slice(0, 1000);
    fs.writeFileSync(HITS_FILE, JSON.stringify(trimmed, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save visitor hits:", err);
  }
}

const VALID_ROLES = new Set(["super_admin", "admin", "agent", "customer", "visitor"]);

function sanitizeString(str: unknown, maxLen = 100): string {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>?/gm, "").replace(/[\r\n\t]/g, " ").trim().slice(0, maxLen);
}

export function recordVisitorHit(params: {
  path: string;
  session_id?: string;
  user_name?: string;
  role?: string;
  ip?: string;
  user_agent?: string;
}): VisitorHit {
  const hits = getStoredHits();
  const sessionId = sanitizeString(params.session_id, 50) || `sess_${crypto.randomUUID().slice(0, 8)}`;
  const safePath = sanitizeString(params.path, 150) || "/";
  const safeUserName = sanitizeString(params.user_name, 50) || "Guest Visitor";
  const rawRole = (params.role || "").toLowerCase().trim();
  const safeRole = VALID_ROLES.has(rawRole) ? rawRole : "visitor";
  const safeIp = sanitizeString(params.ip, 45) || "127.0.0.1";
  const safeUa = sanitizeString(params.user_agent, 200) || "Browser Client";

  // Debounce/Flood protection: if identical hit arrived from same session in last 1.5 seconds, don't duplicate
  const nowMs = Date.now();
  const recentSameHit = hits.find((h) => h.session_id === sessionId && Math.abs(nowMs - new Date(h.timestamp).getTime()) < 1500);
  if (recentSameHit) {
    recentSameHit.timestamp = new Date().toISOString();
    saveStoredHits(hits);
    return recentSameHit;
  }

  const newHit: VisitorHit = {
    id: crypto.randomUUID(),
    session_id: sessionId,
    path: safePath,
    ip: safeIp,
    user_agent: safeUa,
    user_name: safeUserName,
    role: safeRole,
    timestamp: new Date().toISOString(),
  };

  hits.unshift(newHit);
  saveStoredHits(hits);
  return newHit;
}

export function getVisitorStats(): {
  activeVisitorsNow: number;
  todayHits: number;
  totalHits: number;
  recentHits: VisitorHit[];
} {
  const hits = getStoredHits();
  const now = Date.now();
  const fiveMinAgo = now - 5 * 60 * 1000;
  const todayStr = new Date().toISOString().slice(0, 10);

  // Filter hits in the last 5 minutes to calculate real-time concurrent active visitors
  const recentWindowHits = hits.filter((h) => {
    const t = new Date(h.timestamp).getTime();
    return !isNaN(t) && t >= fiveMinAgo;
  });

  const distinctSessions = new Set<string>();
  for (const h of recentWindowHits) {
    const key = h.session_id || `${h.ip}_${h.user_name}`;
    distinctSessions.add(key);
  }

  // Active visitors is at least 1 if any hit occurred in window
  const activeVisitorsNow = Math.max(distinctSessions.size, recentWindowHits.length > 0 ? 1 : 0);

  const todayHits = hits.filter((h) => h.timestamp.startsWith(todayStr)).length;
  const totalHits = hits.length;
  const recentHits = hits.slice(0, 50);

  return {
    activeVisitorsNow,
    todayHits,
    totalHits,
    recentHits,
  };
}
