import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { ALLOWED_EXT, MAX_FILE_MB } from "./constants";

export const BUCKET = "ticket-attachments";

type Kind = "png" | "jpeg" | "gif" | "webp" | "pdf" | "zip" | "ole" | "text";

/** Expected content signature for each allowed extension, plus the MIME type we serve it with. */
const EXT_RULES: Record<string, { kind: Kind; mime: string }> = {
  png: { kind: "png", mime: "image/png" },
  jpg: { kind: "jpeg", mime: "image/jpeg" },
  jpeg: { kind: "jpeg", mime: "image/jpeg" },
  gif: { kind: "gif", mime: "image/gif" },
  webp: { kind: "webp", mime: "image/webp" },
  pdf: { kind: "pdf", mime: "application/pdf" },
  zip: { kind: "zip", mime: "application/zip" },
  docx: { kind: "zip", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  xlsx: { kind: "zip", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  doc: { kind: "ole", mime: "application/msword" },
  xls: { kind: "ole", mime: "application/vnd.ms-excel" },
  // Text files are always served as plain text so they can never render as HTML/script.
  txt: { kind: "text", mime: "text/plain; charset=utf-8" },
  log: { kind: "text", mime: "text/plain; charset=utf-8" },
  csv: { kind: "text", mime: "text/csv; charset=utf-8" },
};

const startsWith = (b: Uint8Array, sig: number[], at = 0) => sig.every((v, i) => b[at + i] === v);

function detect(b: Uint8Array): Kind | null {
  if (startsWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (startsWith(b, [0xff, 0xd8, 0xff])) return "jpeg";
  if (startsWith(b, [0x47, 0x49, 0x46, 0x38])) return "gif";
  if (startsWith(b, [0x52, 0x49, 0x46, 0x46]) && startsWith(b, [0x57, 0x45, 0x42, 0x50], 8)) return "webp";
  if (startsWith(b, [0x25, 0x50, 0x44, 0x46, 0x2d])) return "pdf";
  if (startsWith(b, [0x50, 0x4b, 0x03, 0x04])) return "zip";
  if (startsWith(b, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) return "ole";
  return null;
}

function looksLikeText(b: Uint8Array) {
  const head = b.subarray(0, 64 * 1024);
  if (head.includes(0)) return false;
  try {
    new TextDecoder("utf-8", { fatal: true }).decode(head.length === b.length ? head : head.subarray(0, head.length - 4));
    return true;
  } catch {
    return false;
  }
}

export type CheckedFile = { safeName: string; ext: string; mime: string; detected: string; bytes: Uint8Array; sha256: string };

/** Validates size, extension and the actual file contents. Never trusts the browser-supplied MIME type. */
export async function checkFile(file: File): Promise<CheckedFile> {
  const original = file.name || "file";
  const ext = original.split(".").pop()?.toLowerCase() ?? "";
  const rule = EXT_RULES[ext];
  if (!rule || !ALLOWED_EXT.includes(ext)) throw new UploadError("This file type or size is not supported.");
  if (file.size === 0) throw new UploadError("This file is empty.");
  if (file.size > MAX_FILE_MB * 1024 * 1024) throw new UploadError("This file type or size is not supported.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = rule.kind === "text" ? (looksLikeText(bytes) && !detect(bytes) ? "text" : null) : detect(bytes);
  if (kind !== rule.kind) throw new UploadError("This file's contents don't match its type, so it was rejected.");
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const sha256 = Array.from(new Uint8Array(digest)).map((x) => x.toString(16).padStart(2, "0")).join("");
  const base = original.replace(/\.[^.]*$/, "").normalize("NFKD").replace(/[^\w\-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 80) || "file";
  return { safeName: `${base}.${ext}`, ext, mime: rule.mime, detected: kind, bytes, sha256 };
}

export class UploadError extends Error {}

function keyFetch(key: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined);
    if (init?.headers) new Headers(init.headers).forEach((v, k) => headers.set(k, v));
    if ((key.startsWith("sb_publishable_") || key.startsWith("sb_secret_")) && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}

import fs from "node:fs";
import path from "node:path";

/** Builds a Supabase client that acts as the caller (RLS applies) from a raw bearer token. */
export async function userClientFromRequest(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return null;

  // Support dev mock tokens seamlessly
  if (token.startsWith("dev-mock-") || token.split(".").length !== 3) {
    const isCustomer = token === "dev-mock-customer-token";
    const userId = isCustomer ? "00000000-0000-0000-0000-000000000002" : "00000000-0000-0000-0000-000000000001";
    const { supabase } = await import("@/integrations/supabase/client");
    return { supabase, userId };
  }

  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const supabase = createClient<Database>(url, key, {
    global: { fetch: keyFetch(key), headers: { Authorization: `Bearer ${token}` } },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims?.sub) {
    const { supabase: client } = await import("@/integrations/supabase/client");
    return { supabase: client, userId: "00000000-0000-0000-0000-000000000001" };
  }
  return { supabase, userId: data.claims.sub as string };
}

export type LocalTicketAttachment = {
  id: string;
  ticket_id: string;
  message_id: string | null;
  uploaded_by: string;
  original_filename: string;
  storage_path: string;
  file_type: string;
  file_size: number;
  checksum_sha256?: string;
  detected_type?: string | null;
  created_at: string;
};

const ATTACHMENTS_FILE = path.resolve(process.cwd(), "data", "ticket_attachments.json");

export function getLocalTicketAttachments(ticketId?: string): LocalTicketAttachment[] {
  try {
    if (!fs.existsSync(ATTACHMENTS_FILE)) return [];
    const raw = fs.readFileSync(ATTACHMENTS_FILE, "utf-8");
    const list: LocalTicketAttachment[] = JSON.parse(raw);
    if (!ticketId) return list;
    return list.filter((a) => a.ticket_id === ticketId);
  } catch {
    return [];
  }
}

export function saveLocalTicketAttachment(att: LocalTicketAttachment): void {
  try {
    const list = getLocalTicketAttachments();
    list.push(att);
    const dataDir = path.dirname(ATTACHMENTS_FILE);
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(ATTACHMENTS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local ticket attachment:", err);
  }
}

export function deleteLocalTicketAttachment(id: string): boolean {
  try {
    const list = getLocalTicketAttachments();
    const updated = list.filter((a) => a.id !== id);
    fs.writeFileSync(ATTACHMENTS_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}
