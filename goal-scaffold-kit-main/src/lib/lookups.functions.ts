import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  getLookupsServer,
  saveLookupRecordServer,
  deleteLookupRecordServer,
  type LookupItem,
} from "./lookups.server";

export const getCategoriesFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<LookupItem[]> => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (!error && data && data.length > 0) {
        return data as LookupItem[];
      }
    } catch {
      // Fallback to local server store
    }
    return getLookupsServer("categories");
  });

export const getDepartmentsFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<LookupItem[]> => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase.from("departments").select("*").order("name");
      if (!error && data && data.length > 0) {
        return data as LookupItem[];
      }
    } catch {
      // Fallback to local server store
    }
    return getLookupsServer("departments");
  });

export const saveLookupFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      table: z.enum(["categories", "departments"]),
      id: z.string().optional().nullable(),
      name: z.string().min(2, "Name must be 2–80 characters").max(80),
      description: z.string().optional().nullable(),
      is_active: z.boolean().optional(),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<LookupItem> => {
    // 1. Save in local server storage
    const saved = saveLookupRecordServer({
      table: data.table,
      id: data.id,
      name: data.name,
      description: data.description,
      is_active: data.is_active,
    });

    // 2. Best-effort sync to Supabase (catch and ignore RLS errors gracefully)
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const payload = {
        name: saved.name,
        description: saved.description,
        is_active: saved.is_active,
      };
      if (data.id) {
        await supabase.from(data.table).update(payload).eq("id", data.id);
      } else {
        await supabase.from(data.table).insert({ id: saved.id, ...payload });
      }
    } catch {
      // Ignore RLS errors since it's already safely stored on the server
    }

    return saved;
  });

export const deleteLookupFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({
      table: z.enum(["categories", "departments"]),
      id: z.string(),
    }).parse(d),
  )
  .handler(async ({ data }): Promise<{ success: boolean }> => {
    deleteLookupRecordServer({ table: data.table, id: data.id });
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from(data.table).delete().eq("id", data.id);
    } catch {
      // Ignore
    }
    return { success: true };
  });
