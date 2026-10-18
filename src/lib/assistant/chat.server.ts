import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse, streamText, type UIMessage } from "ai";
import { z } from "zod";

import { buildAssistantInstructions } from "./knowledge";
import { generateKnowledgeReply } from "./knowledge-reply";

const MAX_MESSAGES = 30;
const MAX_TEXT = 2000;

const DEFAULT_N8N_TEST_URL = "https://fsgsgsyttryerty.app.n8n.cloud/webhook-test/website-chat";
const DEFAULT_N8N_PROD_URL = "https://fsgsgsyttryerty.app.n8n.cloud/webhook/website-chat";

const partSchema = z.object({ type: z.string() }).passthrough();
const bodySchema = z.object({
  lang: z.enum(["en", "bn"]).default("en"),
  messages: z
    .array(
      z
        .object({
          id: z.string().max(100),
          role: z.enum(["user", "assistant"]),
          parts: z.array(partSchema).max(40),
        })
        .passthrough(),
    )
    .min(1)
    .max(MAX_MESSAGES),
});

function json(status: number, message: string) {
  return Response.json({ error: message }, { status });
}

function pickN8nReply(body: unknown): string {
  let b: unknown = body;
  if (Array.isArray(b)) b = b[0];
  if (b && typeof b === "object" && "json" in b && typeof (b as { json: unknown }).json === "object") {
    b = (b as { json: unknown }).json;
  }
  if (typeof b === "string") return b.trim();
  if (!b || typeof b !== "object") return "";
  const o = b as Record<string, unknown>;
  const keys = ["reply", "message", "output", "text", "response", "answer", "content", "data", "result", "bot"];
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const nested = v as Record<string, unknown>;
      for (const nk of ["text", "content", "value", "message", "output"]) {
        if (typeof nested[nk] === "string" && (nested[nk] as string).trim()) {
          return (nested[nk] as string).trim();
        }
      }
    }
  }
  return "";
}

async function tryCallN8n(url: string, payload: Record<string, unknown>): Promise<string | null> {
  const tryFetch = async (targetUrl: string) => {
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json, text/plain" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(6000),
    });
    const text = await res.text();
    return { res, text };
  };

  try {
    let { res, text } = await tryFetch(url);

    // If test URL returns 404/500, smart fallback to production URL
    if ((res.status === 404 || res.status === 500) && url.includes("/webhook-test/")) {
      const prodUrl = url.replace("/webhook-test/", "/webhook/");
      try {
        const fallback = await tryFetch(prodUrl);
        if (fallback.res.ok) {
          res = fallback.res;
          text = fallback.text;
        }
      } catch {}
    } else if ((res.status === 404 || res.status === 500) && url.includes("/webhook/")) {
      const testUrl = url.replace("/webhook/", "/webhook-test/");
      try {
        const fallback = await tryFetch(testUrl);
        if (fallback.res.ok) {
          res = fallback.res;
          text = fallback.text;
        }
      } catch {}
    }

    if (!res.ok) return null;

    try {
      const data = JSON.parse(text);
      const reply = pickN8nReply(data);
      if (reply) return reply;
    } catch {
      if (text.trim() && !text.includes("<html") && !text.includes("Error in workflow")) {
        return text.trim();
      }
    }
  } catch (err) {
    console.warn("n8n chat webhook call failed:", err);
  }
  return null;
}

function streamReplyText(replyText: string, originalMessages: UIMessage[]) {
  const stream = createUIMessageStream({
    originalMessages,
    async execute({ writer }) {
      const textId = crypto.randomUUID();
      writer.write({ type: "text-start", id: textId });
      // Progressive streaming pacing for natural UI experience
      const words = replyText.split(" ");
      for (let i = 0; i < words.length; i += 3) {
        const slice = words.slice(i, i + 3).join(" ") + (i + 3 < words.length ? " " : "");
        writer.write({ type: "text-delta", id: textId, delta: slice });
        await new Promise((r) => setTimeout(r, 15));
      }
      writer.write({ type: "text-end", id: textId });
    },
  });

  return createUIMessageStreamResponse({ stream });
}

export async function handleChat(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json(400, "Invalid request.");
  }
  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) return json(400, "Invalid request.");

  const messages = parsed.data.messages as unknown as UIMessage[];
  const last = messages[messages.length - 1];
  if (last?.role !== "user") return json(400, "Invalid request.");
  for (const m of messages) {
    for (const p of m.parts) {
      if (p.type === "text" && p.text.length > MAX_TEXT) return json(400, "Message is too long.");
      if (m.role === "user" && p.type !== "text") return json(400, "Only text messages are supported.");
    }
  }

  const userText = last.parts.find((p) => p.type === "text")?.text ?? "";
  const lang = parsed.data.lang;

  // 1. Try n8n workflow webhook first
  const n8nUrl = process.env["N8N_CHAT_WEBHOOK_URL"] || DEFAULT_N8N_TEST_URL;
  const n8nPayload = {
    message: userText,
    chatInput: userText,
    text: userText,
    query: userText,
    prompt: userText,
    input: userText,
    lang,
    messages: messages.map((m) => ({
      role: m.role,
      text: m.parts.filter((p) => p.type === "text").map((p) => p.text).join(" "),
    })),
  };

  const n8nReply = await tryCallN8n(n8nUrl, n8nPayload);
  if (n8nReply) {
    return streamReplyText(n8nReply, messages);
  }

  // 2. Try Groq or OpenAI if keys configured
  const groqApiKey = process.env["GROQ_API_KEY"];
  if (groqApiKey) {
    try {
      const groqProvider = createOpenAI({
        baseURL: "https://api.groq.com/openai/v1",
        apiKey: groqApiKey,
      });
      const result = streamText({
        model: groqProvider.chat("llama-3.3-70b-versatile"),
        instructions: buildAssistantInstructions(lang),
        messages: await convertToModelMessages(messages),
        abortSignal: request.signal,
        maxRetries: 1,
      });
      return result.toUIMessageStreamResponse({
        originalMessages: messages,
        sendReasoning: false,
      });
    } catch (e) {
      console.warn("Groq fallback error:", e);
    }
  }

  const openAiApiKey = process.env["OPENAI_API_KEY"];
  if (openAiApiKey) {
    try {
      const openaiProvider = createOpenAI({ apiKey: openAiApiKey });
      const result = streamText({
        model: openaiProvider.chat("gpt-4o-mini"),
        instructions: buildAssistantInstructions(lang),
        messages: await convertToModelMessages(messages),
        abortSignal: request.signal,
        maxRetries: 1,
      });
      return result.toUIMessageStreamResponse({
        originalMessages: messages,
        sendReasoning: false,
      });
    } catch (e) {
      console.warn("OpenAI fallback error:", e);
    }
  }

  // 3. High-Quality Ritorica Knowledge Base Response (Guaranteed zero downtime and accurate pricing/info)
  const fallbackReply = generateKnowledgeReply(userText, lang);
  return streamReplyText(fallbackReply, messages);
}
