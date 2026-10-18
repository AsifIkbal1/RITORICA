import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/ticket-server")({
  server: {
    handlers: {
      GET: async () => {
        const { isTicketServerRunning } = await import("@/lib/ticket-server.server");
        const running = await isTicketServerRunning();
        return new Response(JSON.stringify({ running, url: "http://localhost:8081" }), {
          headers: { "Content-Type": "application/json" },
        });
      },
      POST: async () => {
        const { ensureTicketServer } = await import("@/lib/ticket-server.server");
        const result = await ensureTicketServer();
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
