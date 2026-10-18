import { createFileRoute } from "@tanstack/react-router";
import { recordVisitorHit, getVisitorStats } from "@/lib/visitor-tracker.server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "content-type": "application/json",
};

export const Route = createFileRoute("/api/track-hit")({
  server: {
    handlers: {
      OPTIONS: async () => {
        return new Response(null, { status: 204, headers: corsHeaders });
      },
      GET: async () => {
        const stats = getVisitorStats();
        return new Response(JSON.stringify(stats), { status: 200, headers: corsHeaders });
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
          const ua = request.headers.get("user-agent") || undefined;
          const hit = recordVisitorHit({
            path: body.path || "/",
            session_id: body.session_id,
            user_name: body.user_name || "Guest Visitor",
            role: body.role || "visitor",
            ip: Array.isArray(ip) ? ip[0] : ip,
            user_agent: ua,
          });
          return new Response(JSON.stringify({ success: true, hit }), { status: 200, headers: corsHeaders });
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e.message }), { status: 400, headers: corsHeaders });
        }
      },
    },
  },
});
