/** Calls the admin-configured n8n webhook and normalises its reply. Server-only. */

export type N8nResult =
  | { ok: true; reply: string; escalate: boolean; status: number; ms: number }
  | { ok: false; error: string; status?: number; ms: number };

const TIMEOUT_MS = 25_000;

function pickReply(body: unknown): { reply: string; escalate: boolean } {
  let b: unknown = body;
  if (Array.isArray(b)) b = b[0];
  if (b && typeof b === "object" && "json" in b && typeof (b as { json: unknown }).json === "object") b = (b as { json: unknown }).json;
  if (typeof b === "string") return { reply: b.trim(), escalate: false };
  if (!b || typeof b !== "object") return { reply: "", escalate: false };
  const o = b as Record<string, unknown>;
  const keys = ["reply", "message", "output", "text", "response", "answer", "content", "data", "result", "bot"];
  let reply = "";
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) { reply = v.trim(); break; }
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const nested = v as Record<string, unknown>;
      for (const nk of ["text", "content", "value", "message", "output"]) {
        if (typeof nested[nk] === "string" && (nested[nk] as string).trim()) {
          reply = (nested[nk] as string).trim();
          break;
        }
      }
      if (reply) break;
    }
  }

  // Fallback: check first string field in object
  if (!reply) {
    for (const val of Object.values(o)) {
      if (typeof val === "string" && val.trim() && val.length > 1) {
        reply = val.trim();
        break;
      }
    }
  }

  const e = o["escalate"];
  const escalate = e === true || e === "true" || e === 1;
  return { reply, escalate };
}

export function isValidWebhookUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export async function callN8n(url: string, payload: Record<string, unknown>): Promise<N8nResult> {
  const started = Date.now();
  if (!isValidWebhookUrl(url)) return { ok: false, error: "Invalid webhook URL", ms: 0 };

  const tryFetch = async (targetUrl: string) => {
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json, text/plain" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const text = await res.text();
    return { res, text };
  };

  try {
    let { res, text } = await tryFetch(url);

    // If test URL returns 404, try production URL as smart fallback
    if (res.status === 404 && url.includes("/webhook-test/")) {
      const prodUrl = url.replace("/webhook-test/", "/webhook/");
      try {
        const fallback = await tryFetch(prodUrl);
        if (fallback.res.ok) {
          res = fallback.res;
          text = fallback.text;
        }
      } catch {}
    } else if (res.status === 404 && url.includes("/webhook/")) {
      const testUrl = url.replace("/webhook/", "/webhook-test/");
      try {
        const fallback = await tryFetch(testUrl);
        if (fallback.res.ok) {
          res = fallback.res;
          text = fallback.text;
        }
      } catch {}
    }

    const ms = Date.now() - started;

    if (!res.ok) {
      let errorMsg = `n8n returned HTTP ${res.status}`;
      try {
        const parsed = JSON.parse(text);
        if (parsed.hint) errorMsg = `${parsed.message} (${parsed.hint})`;
        else if (parsed.message) errorMsg = parsed.message;
      } catch {
        if (text) errorMsg += `: ${text.slice(0, 150)}`;
      }
      return { ok: false, error: errorMsg, status: res.status, ms };
    }

    let body: unknown = text;
    try {
      body = text ? JSON.parse(text) : "";
    } catch {
      // plain-text replies are allowed
    }
    const { reply, escalate } = pickReply(body);
    if (!reply && !escalate) return { ok: false, error: `Empty or unrecognised response from n8n: ${text.slice(0, 200) || "(empty)"}`, status: res.status, ms };
    return { ok: true, reply: reply.slice(0, 5000), escalate, status: res.status, ms };
  } catch (err) {
    const ms = Date.now() - started;
    const name = (err as { name?: string })?.name;
    if (name === "TimeoutError" || name === "AbortError") return { ok: false, error: `n8n did not respond within ${TIMEOUT_MS / 1000}s`, ms };
    return { ok: false, error: `Could not reach n8n: ${(err as Error)?.message ?? "network error"}`, ms };
  }
}
