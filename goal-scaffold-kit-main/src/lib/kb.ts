import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { listCrudItemsFn } from "./crud.functions";

export function useKbCategories() {
  return useQuery({
    queryKey: ["kb_categories"],
    queryFn: async () => {
      try {
        const local = await listCrudItemsFn({ data: { table: "kb_categories", orderBy: "sort_order", ascending: true } });
        if (local && local.length > 0) return local;
      } catch {}
      const { data, error } = await supabase.from("kb_categories").select("*").order("sort_order").order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useKbSubcategories() {
  return useQuery({
    queryKey: ["kb_subcategories"],
    queryFn: async () => {
      try {
        const local = await listCrudItemsFn({ data: { table: "kb_subcategories", orderBy: "sort_order", ascending: true } });
        if (local && local.length > 0) return local;
      } catch {}
      const { data, error } = await supabase.from("kb_subcategories").select("*").order("sort_order").order("name");
      if (error) throw error;
      return data;
    },
  });
}

export function useCustomFields(activeOnly = true) {
  return useQuery({
    queryKey: ["ticket_custom_fields", activeOnly],
    queryFn: async () => {
      let q = supabase.from("ticket_custom_fields").select("*");
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q.order("sort_order").order("created_at");
      if (error) throw error;
      return data;
    },
  });
}
