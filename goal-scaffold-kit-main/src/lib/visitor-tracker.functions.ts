import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { recordVisitorHit, getVisitorStats } from "./visitor-tracker.server";

export const recordHitFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      path: z.string(),
      session_id: z.string().optional(),
      user_name: z.string().optional(),
      role: z.string().optional(),
      user_agent: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    return recordVisitorHit(data);
  });

export const getVisitorStatsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    return getVisitorStats();
  });
