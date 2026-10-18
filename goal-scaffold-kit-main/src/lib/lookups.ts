import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import { getCategoriesFn, getDepartmentsFn } from "./lookups.functions";
import { DEFAULT_CATEGORIES, DEFAULT_DEPARTMENTS, type LookupItem } from "./lookups.shared";

export function useCategories() {
  return useQuery<LookupItem[]>({
    queryKey: ["categories"],
    initialData: DEFAULT_CATEGORIES,
    queryFn: async () => {
      try {
        const data = await getCategoriesFn();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      } catch {
        // Fallback to Supabase direct query or default
        try {
          const { data } = await supabase.from("categories").select("*").order("name");
          if (data && data.length > 0) return data as LookupItem[];
        } catch {}
      }
      return DEFAULT_CATEGORIES;
    },
  });
}

export function useDepartments() {
  return useQuery<LookupItem[]>({
    queryKey: ["departments"],
    initialData: DEFAULT_DEPARTMENTS,
    queryFn: async () => {
      try {
        const data = await getDepartmentsFn();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      } catch {
        // Fallback to Supabase direct query or default
        try {
          const { data } = await supabase.from("departments").select("*").order("name");
          if (data && data.length > 0) return data as LookupItem[];
        } catch {}
      }
      return DEFAULT_DEPARTMENTS;
    },
  });
}

/** Staff members (agents/admins) — only readable by staff. */
export function useStaff() {
  const { isStaff } = useAuth();
  return useQuery({
    queryKey: ["staff"],
    enabled: isStaff,
    queryFn: async () => {
      try {
        const { data: roles, error } = await supabase.from("user_roles").select("user_id, role").in("role", ["agent", "admin", "super_admin"]);
        if (!error && roles && roles.length > 0) {
          const ids = [...new Set(roles.map((r) => r.user_id))];
          if (ids.length > 0) {
            const { data: profiles } = await supabase.from("profiles").select("id, full_name, email, department_id, is_active").in("id", ids).order("full_name");
            if (profiles && profiles.length > 0) {
              return profiles.map((p) => ({ ...p, roles: roles.filter((r) => r.user_id === p.id).map((r) => r.role) }));
            }
          }
        }
      } catch {}
      return [
        {
          id: "00000000-0000-0000-0000-000000000001",
          full_name: "Asif Ikbal (Admin)",
          email: "admin@ritorica.com.bd",
          department_id: null,
          is_active: true,
          roles: ["admin", "super_admin"],
        },
        {
          id: "00000000-0000-0000-0000-000000000002",
          full_name: "Support Agent",
          email: "support.agent@ritorica.com.bd",
          department_id: null,
          is_active: true,
          roles: ["agent"],
        },
      ];
    },
  });
}

