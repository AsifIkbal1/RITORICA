import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ROLES, friendlyError, type AppRole } from "@/lib/constants";
import { Guard, meta } from "@/components/guard";
import { PageHeader, TableSkeleton } from "@/components/states";
import { Checkbox } from "@/components/ui/checkbox";
import { getPermissionsMatrixFn, toggleRolePermissionFn } from "@/lib/permissions.functions";

export const Route = createFileRoute("/_app/admin/permissions")({
  head: () => meta("Permissions", "Permission matrix for each role."),
  component: () => <Guard superAdmin><Page /></Guard>,
});

function Page() {
  const qc = useQueryClient();
  const { session, profile } = useAuth();
  const q = useQuery({
    queryKey: ["perm-matrix"],
    queryFn: async () => {
      try {
        const local = await getPermissionsMatrixFn();
        if (local && local.perms && local.perms.length > 0) {
          return { perms: local.perms, set: new Set(local.set) };
        }
      } catch {}

      try {
        const [p, rp] = await Promise.all([
          supabase.from("permissions").select("*").order("key"),
          supabase.from("role_permissions").select("*"),
        ]);
        if (p.data && p.data.length > 0) {
          return { perms: p.data, set: new Set((rp.data ?? []).map((x) => `${x.role}:${x.permission_key}`)) };
        }
      } catch {}

      const local = await getPermissionsMatrixFn();
      return { perms: local.perms, set: new Set(local.set) };
    },
  });

  async function toggle(role: AppRole, key: string, on: boolean) {
    try {
      await toggleRolePermissionFn({
        data: {
          role,
          key,
          on,
          actorId: session?.user?.id,
          actorName: profile?.full_name || "Super Admin",
        },
      });
      toast.success(`${on ? "Granted" : "Revoked"} ${key} for ${role}`);
      qc.invalidateQueries({ queryKey: ["perm-matrix"] });
      qc.invalidateQueries({ queryKey: ["activity-logs"] });
      qc.invalidateQueries({ queryKey: ["roles-overview"] });
    } catch (error) {
      toast.error(friendlyError(error));
    }
  }
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Permissions" description="Grant or revoke permissions per role. Super Admin always has every permission." />
      <div className="overflow-hidden rounded-lg border bg-card shadow-card">
        {q.isLoading ? <TableSkeleton /> : (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr className="border-b">
              <th className="py-2.5 pl-4 pr-3 text-left font-medium">Permission</th>
              {ROLES.map((r) => (
                <th key={r.value} className="w-32 px-3 py-2.5 text-center font-medium">
                  <div className="text-sm text-foreground">{r.label}</div>
                  <div className="text-[11px] font-normal">{r.value === "super_admin" ? "Always all" : "Tick to allow"}</div>
                </th>
              ))}
            </tr></thead>
            <tbody>{q.data?.perms.map((p) => (
              <tr key={p.key} className="border-b last:border-0 hover:bg-muted/30">
                <td className="py-2 pl-4 pr-3"><div className="font-mono text-xs">{p.key}</div><div className="text-xs text-muted-foreground">{p.description}</div></td>
                {ROLES.map((r) => (
                  <td key={r.value} className="w-32 px-3 py-2">
                    <div className="flex justify-center">
                      <Checkbox
                        checked={r.value === "super_admin" || q.data.set.has(`${r.value}:${p.key}`)}
                        disabled={r.value === "super_admin"}
                        onCheckedChange={(v) => toggle(r.value, p.key, !!v)}
                        aria-label={`${p.key} for ${r.label}`}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>
    </div>
  );
}
