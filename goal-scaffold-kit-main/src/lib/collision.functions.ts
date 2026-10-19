import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  pingTicketPresence,
  leaveTicketPresence,
  getTicketActiveViewers,
  type ViewerPresence,
} from "./collision.server";

export const pingPresenceFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      ticket_id: z.string(),
      user_id: z.string(),
      user_name: z.string(),
      role: z.string(),
      action: z.enum(["viewing", "typing"]).optional(),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<{ activeViewers: ViewerPresence[] }> => {
    pingTicketPresence(data.ticket_id, {
      userId: data.user_id,
      userName: data.user_name,
      role: data.role,
      action: data.action || "viewing",
    });

    const activeViewers = getTicketActiveViewers(data.ticket_id, data.user_id);
    return { activeViewers };
  });

export const leavePresenceFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      ticket_id: z.string(),
      user_id: z.string(),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    leaveTicketPresence(data.ticket_id, data.user_id);
    return { success: true };
  });
