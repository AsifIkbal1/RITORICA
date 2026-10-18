import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { BUCKET, UploadError, checkFile, userClientFromRequest } from "@/lib/attachments.server";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

const fields = z.object({ ticket_id: z.string().uuid(), message_id: z.string().uuid().nullable() });

/**
 * Secure ticket attachment upload. Raw HTTP (not a server function) so the browser can
 * report upload progress. The caller must be signed in, able to see the ticket, and (for
 * reply attachments) the author of the message. File contents are verified server-side.
 */
export const Route = createFileRoute("/api/attachments/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const caller = await userClientFromRequest(request);
        if (!caller) return json({ error: "Please sign in again." }, 401);
        const { supabase, userId } = caller;

        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return json({ error: "Upload failed. Please try again." }, 400);
        }
        const parsed = fields.safeParse({ ticket_id: form.get("ticket_id"), message_id: form.get("message_id") || null });
        const file = form.get("file");
        if (!parsed.success || !(file instanceof File)) return json({ error: "Upload failed. Please try again." }, 400);
        const { ticket_id, message_id } = parsed.data;

        // Authorization runs as the caller, so RLS decides what they can see.
        const { data: ticket } = await supabase.from("tickets").select("id, customer_id").eq("id", ticket_id).maybeSingle();
        if (!ticket) return json({ error: "You don't have access to this ticket." }, 403);
        if (message_id) {
          const { data: msg } = await supabase.from("ticket_messages").select("id, sender_id, ticket_id").eq("id", message_id).maybeSingle();
          if (!msg || msg.ticket_id !== ticket_id || msg.sender_id !== userId) return json({ error: "You can only attach files to your own message." }, 403);
        } else if (ticket.customer_id !== userId) {
          const { data: staff } = await supabase.rpc("is_staff", { _user_id: userId });
          if (!staff) return json({ error: "You don't have access to this ticket." }, 403);
        }
        const { count } = await supabase.from("ticket_attachments").select("id", { count: "exact", head: true }).eq("ticket_id", ticket_id);
        if ((count ?? 0) >= 100) return json({ error: "This ticket has reached its attachment limit." }, 400);

        let checked;
        try {
          checked = await checkFile(file);
        } catch (e) {
          return json({ error: e instanceof UploadError ? e.message : "This file type or size is not supported." }, 415);
        }

        // 1. Always save file locally in public/uploads/tickets/{ticket_id}/
        const fs = (await import("node:fs")).default;
        const pathModule = (await import("node:path")).default;
        const uploadDir = pathModule.resolve(process.cwd(), "public", "uploads", "tickets", ticket_id);
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileId = crypto.randomUUID();
        const localFileName = `${fileId}-${checked.safeName}`;
        const localFilePath = pathModule.join(uploadDir, localFileName);
        fs.writeFileSync(localFilePath, Buffer.from(checked.bytes));

        const publicUrlPath = `/uploads/tickets/${ticket_id}/${localFileName}`;

        let storagePath = publicUrlPath;
        let createdAttachment: any = null;

        // 2. Try Supabase storage upload if available
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const cloudPath = `${ticket_id}/${localFileName}`;
          const up = await supabaseAdmin.storage.from(BUCKET).upload(cloudPath, checked.bytes, { contentType: checked.mime, upsert: false });
          if (!up.error) {
            storagePath = cloudPath;
          }

          const { data: row, error } = await supabaseAdmin
            .from("ticket_attachments")
            .insert({
              id: fileId,
              ticket_id,
              message_id,
              uploaded_by: userId,
              original_filename: file.name.slice(0, 255),
              storage_path: storagePath,
              file_type: checked.mime.split(";")[0]!,
              file_size: checked.bytes.byteLength,
              checksum_sha256: checked.sha256,
              detected_type: checked.detected,
            })
            .select("id, original_filename, file_type, file_size")
            .single();

          if (!error && row) {
            createdAttachment = row;
          }
        } catch (err) {
          console.warn("Supabase ticket attachment failed, saving locally:", err);
        }

        if (!createdAttachment) {
          createdAttachment = {
            id: fileId,
            ticket_id,
            message_id,
            uploaded_by: userId,
            original_filename: file.name.slice(0, 255),
            storage_path: publicUrlPath,
            file_type: checked.mime.split(";")[0]!,
            file_size: checked.bytes.byteLength,
          };
        }

        // 3. Save locally in data/ticket_attachments.json
        try {
          const { saveLocalTicketAttachment } = await import("@/lib/attachments.server");
          saveLocalTicketAttachment({
            id: createdAttachment.id,
            ticket_id,
            message_id: message_id || null,
            uploaded_by: userId,
            original_filename: file.name.slice(0, 255),
            storage_path: publicUrlPath,
            file_type: checked.mime.split(";")[0]!,
            file_size: checked.bytes.byteLength,
            checksum_sha256: checked.sha256,
            detected_type: checked.detected,
            created_at: new Date().toISOString(),
          });
        } catch {}

        return json({ attachment: createdAttachment });
      },
    },
  },
});
