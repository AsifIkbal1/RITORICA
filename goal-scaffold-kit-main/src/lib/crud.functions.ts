import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getLocalCrudRows,
  createLocalCrudRow,
  updateLocalCrudRow,
  deleteLocalCrudRow,
} from "./crud.server";

export const listCrudItemsFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      table: z.string(),
      select: z.string().default("*"),
      orderBy: z.string().default("created_at"),
      ascending: z.boolean().default(false),
      publishedOnly: z.boolean().default(false),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    let remoteData: any[] = [];
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      let q = supabaseAdmin.from(data.table as any).select(data.select);
      if (data.publishedOnly) {
        q = q.eq("is_published", true);
      }
      const { data: rows, error } = await q.order(data.orderBy, { ascending: data.ascending }).limit(500);
      if (!error && Array.isArray(rows)) {
        remoteData = rows;
      }
    } catch {}

    const localRows = getLocalCrudRows(data.table);
    let filteredLocal = localRows;
    if (data.publishedOnly) {
      filteredLocal = filteredLocal.filter((r) => r.is_published === true);
    }

    // Sort localRows
    filteredLocal.sort((a, b) => {
      const va = a[data.orderBy];
      const vb = b[data.orderBy];
      if (va == null && vb == null) return 0;
      if (va == null) return data.ascending ? -1 : 1;
      if (vb == null) return data.ascending ? 1 : -1;
      if (va < vb) return data.ascending ? -1 : 1;
      if (va > vb) return data.ascending ? 1 : -1;
      return 0;
    });

    const existingIds = new Set(remoteData.map((r) => r.id));
    const combined = [...remoteData];
    for (const item of filteredLocal) {
      if (!existingIds.has(item.id)) {
        combined.push(item);
      }
    }

    return combined;
  });

export const saveCrudItemFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      table: z.string(),
      id: z.string().optional().nullable(),
      payload: z.record(z.any()),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    let savedRow: any = null;
    if (data.id) {
      savedRow = updateLocalCrudRow(data.table, data.id, data.payload);
      if (!savedRow) {
        savedRow = createLocalCrudRow(data.table, { id: data.id, ...data.payload });
      }
    } else {
      savedRow = createLocalCrudRow(data.table, data.payload);
    }

    // Best-effort remote Supabase sync with service role
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      if (data.id) {
        await supabaseAdmin.from(data.table as any).update(data.payload as never).eq("id", data.id);
      } else {
        await supabaseAdmin.from(data.table as any).insert({ id: savedRow.id, ...data.payload } as never);
      }
    } catch {}

    return { success: true, item: savedRow };
  });

export const deleteCrudItemFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      table: z.string(),
      id: z.string(),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    deleteLocalCrudRow(data.table, data.id);

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from(data.table as any).delete().eq("id", data.id);
    } catch {}

    return { success: true };
  });
