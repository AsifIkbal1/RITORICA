import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  filterActivityLogs,
  getAllActivityLogs,
  recordActivityLog,
  type ActivityLogRecord,
} from "./activity-logs.server";

export const getActivityLogsFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      tab: z.enum(["customer", "staff", "security"]).optional(),
      search: z.string().optional(),
      person: z.string().optional(),
      event: z.string().optional(),
      status: z.string().optional(),
      from: z.string().optional(),
      to: z.string().optional(),
      page: z.number().optional().default(1),
      size: z.number().optional().default(50),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<{ rows: ActivityLogRecord[]; count: number }> => {
    return filterActivityLogs(data);
  });

export const getSecurityLogsRecentFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ limit: z.number().optional().default(6) }).parse(d))
  .handler(async ({ data }): Promise<ActivityLogRecord[]> => {
    const res = filterActivityLogs({ tab: "security", size: data.limit, page: 1 });
    return res.rows;
  });

export const recordActivityLogFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      userId: z.string().nullable().optional(),
      userName: z.string().nullable().optional(),
      action: z.string(),
      entityType: z.string().nullable().optional(),
      entityId: z.string().nullable().optional(),
      description: z.string(),
      metadata: z.record(z.any()).optional(),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<ActivityLogRecord> => {
    return recordActivityLog({
      userId: data.userId,
      userName: data.userName,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      description: data.description,
      metadata: data.metadata,
    });
  });
