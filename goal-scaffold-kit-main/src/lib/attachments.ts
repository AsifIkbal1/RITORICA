import { supabase } from "@/integrations/supabase/client";
import { ALLOWED_EXT, MAX_FILE_MB } from "./constants";

export const BUCKET = "ticket-attachments";

/** Quick client-side pre-check for friendly feedback. The server re-validates contents. */
export function validateFile(f: File): string | null {
  const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXT.includes(ext)) return `${f.name}: This file type or size is not supported.`;
  if (f.size > MAX_FILE_MB * 1024 * 1024) return `${f.name}: This file type or size is not supported (max ${MAX_FILE_MB} MB).`;
  if (f.size === 0) return `${f.name}: file is empty.`;
  return null;
}

export type UploadState = { pct: number; status: "uploading" | "done" | "error"; error?: string };

/** Uploads one file through the secure server endpoint, reporting progress. */
export async function uploadOne(ticketId: string, messageId: string | null, file: File, onProgress?: (pct: number) => void) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Please sign in again.");
  const form = new FormData();
  form.append("ticket_id", ticketId);
  if (messageId) form.append("message_id", messageId);
  form.append("file", file);
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/attachments/upload");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      let msg = "Upload failed. Please try again.";
      try { msg = JSON.parse(xhr.responseText).error ?? msg; } catch { /* keep default */ }
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(msg));
    };
    xhr.onerror = () => reject(new Error("Upload failed. Please try again."));
    xhr.send(form);
  });
}

/**
 * Uploads files one by one; returns per-file results so the UI can show success/error
 * for each. Never throws for individual file failures.
 */
export async function uploadAttachments(
  ticketId: string,
  messageId: string | null,
  files: File[],
  onState?: (index: number, s: UploadState) => void,
) {
  let failed = 0;
  for (const [i, f] of files.entries()) {
    onState?.(i, { pct: 0, status: "uploading" });
    try {
      await uploadOne(ticketId, messageId, f, (pct) => onState?.(i, { pct, status: "uploading" }));
      onState?.(i, { pct: 100, status: "done" });
    } catch (e) {
      failed++;
      onState?.(i, { pct: 0, status: "error", error: e instanceof Error ? e.message : "Upload failed. Please try again." });
    }
  }
  return { failed };
}
