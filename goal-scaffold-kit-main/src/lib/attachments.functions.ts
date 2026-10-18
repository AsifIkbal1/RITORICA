import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getLocalTicketAttachments, deleteLocalTicketAttachment } from "./attachments.server";

const BUCKET = "ticket-attachments";

export const getAttachmentLink = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string(), download: z.boolean().optional() }).parse(d))
  .handler(async ({ data }) => {
    // 1. Check local ticket attachments first
    const locals = getLocalTicketAttachments();
    const localAtt = locals.find((a) => a.id === data.id);
    if (localAtt) {
      return { url: localAtt.storage_path, type: localAtt.file_type, name: localAtt.original_filename };
    }

    // 2. Check Supabase
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: att } = await supabaseAdmin
        .from("ticket_attachments")
        .select("id, ticket_id, storage_path, original_filename, file_type")
        .eq("id", data.id)
        .maybeSingle();

      if (att) {
        if (att.storage_path.startsWith("/uploads/") || att.storage_path.startsWith("http")) {
          return { url: att.storage_path, type: att.file_type, name: att.original_filename };
        }
        const { data: signed, error } = await supabaseAdmin.storage
          .from(BUCKET)
          .createSignedUrl(att.storage_path, 300, data.download ? { download: att.original_filename } : undefined);
        if (!error && signed?.signedUrl) {
          return { url: signed.signedUrl, type: att.file_type, name: att.original_filename };
        }
        return { url: att.storage_path, type: att.file_type, name: att.original_filename };
      }
    } catch {}

    throw new Error("Could not find attachment.");
  });

export const deleteAttachment = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ id: z.string() }).parse(d))
  .handler(async ({ data }) => {
    deleteLocalTicketAttachment(data.id);
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: rows } = await supabaseAdmin.from("ticket_attachments").delete().eq("id", data.id).select("storage_path");
      if (rows?.length) {
        await supabaseAdmin.storage.from(BUCKET).remove(rows.map((r) => r.storage_path));
      }
    } catch {}
    return { ok: true };
  });

export const getTicketAttachmentsFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ ticketId: z.string() }).parse(d))
  .handler(async ({ data }) => {
    return getLocalTicketAttachments(data.ticketId);
  });


