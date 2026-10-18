import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import { isOnline, type PresenceStatus } from "./chat";

export type StaffAvailability = { id: string; full_name: string; email: string; roles: string[]; status: PresenceStatus; last_seen_at: string | null; active_chats: number };

/** Availability of every staff member (staff-only; RLS enforced). */
export function useStaffAvailability() {
  const { isStaff } = useAuth();
  return useQuery({
    queryKey: ["presence", "all"],
    enabled: isStaff,
    refetchInterval: 60_000,
    queryFn: async (): Promise<StaffAvailability[]> => {
      const { data: roles, error } = await supabase.from("user_roles").select("user_id, role").in("role", ["agent", "admin", "super_admin"]);
      if (error) throw error;
      const ids = [...new Set(roles.map((r) => r.user_id))];
      if (!ids.length) return [];
      const [profiles, presence, chats] = await Promise.all([
        supabase.from("profiles").select("id, full_name, email, is_active").in("id", ids),
        supabase.from("agent_presence").select("user_id, status, last_seen_at").in("user_id", ids),
        supabase.from("chat_conversations").select("assigned_agent_id").neq("status", "closed").in("assigned_agent_id", ids),
      ]);
      return (profiles.data ?? [])
        .filter((p) => p.is_active)
        .map((p) => {
          const pr = presence.data?.find((x) => x.user_id === p.id);
          const effective: PresenceStatus = pr ? (pr.status === "online" && !isOnline(pr) ? "offline" : pr.status) : "offline";
          return {
            id: p.id,
            full_name: p.full_name,
            email: p.email,
            roles: roles.filter((r) => r.user_id === p.id).map((r) => r.role),
            status: effective,
            last_seen_at: pr?.last_seen_at ?? null,
            active_chats: (chats.data ?? []).filter((c) => c.assigned_agent_id === p.id).length,
          };
        })
        .sort((a, b) => (a.status === b.status ? a.full_name.localeCompare(b.full_name) : a.status === "online" ? -1 : b.status === "online" ? 1 : 0));
    },
  });
}
