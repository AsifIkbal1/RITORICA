import { createFileRoute } from "@tanstack/react-router";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ALLOWED_EXT = ["jpg", "jpeg", "png", "gif", "webp", "pdf", "txt", "doc", "docx", "xls", "xlsx", "zip", "csv"];
const MAX_FILE_MB = 15;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const Route = createFileRoute("/api/chat/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const form = await request.formData();
          const rawConvId = (form.get("convId") as string) || "general";
          const convId = rawConvId.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) || "general";

          if (!(file instanceof File)) {
            return json({ error: "No file provided" }, 400);
          }

          const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
          if (!ALLOWED_EXT.includes(ext)) {
            return json({ error: `File type .${ext} is not allowed.` }, 400);
          }

          if (file.size > MAX_FILE_MB * 1024 * 1024) {
            return json({ error: `File is larger than ${MAX_FILE_MB} MB.` }, 400);
          }

          const bytes = Buffer.from(await file.arrayBuffer());
          const cleanExt = ext.replace(/[^a-zA-Z0-9]/g, "");
          const baseRaw = path.basename(file.name, "." + ext);
          const safeBase = baseRaw.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50) || "attachment";
          const filename = `${crypto.randomUUID()}-${safeBase}.${cleanExt}`;

          // Save to public/uploads/chat/{convId}/ with path traversal validation
          const publicChatRoot = path.resolve(process.cwd(), "public", "uploads", "chat");
          const uploadsDir = path.resolve(publicChatRoot, convId);
          if (!uploadsDir.startsWith(publicChatRoot)) {
            return json({ error: "Invalid upload destination" }, 400);
          }
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }

          const filePath = path.join(uploadsDir, filename);
          fs.writeFileSync(filePath, bytes);

          // Also save backup in data/uploads/chat/{convId}/
          const dataChatRoot = path.resolve(process.cwd(), "data", "uploads", "chat");
          const dataDir = path.resolve(dataChatRoot, convId);
          if (dataDir.startsWith(dataChatRoot)) {
            if (!fs.existsSync(dataDir)) {
              fs.mkdirSync(dataDir, { recursive: true });
            }
            fs.writeFileSync(path.join(dataDir, filename), bytes);
          }

          const urlPath = `/uploads/chat/${convId}/${filename}`;

          return json({
            path: urlPath,
            name: file.name,
            type: file.type || "application/octet-stream",
            size: file.size,
          });
        } catch (err: any) {
          console.error("Chat file upload error:", err);
          return json({ error: err.message || "Upload failed. Please try again." }, 500);
        }
      },
    },
  },
});
