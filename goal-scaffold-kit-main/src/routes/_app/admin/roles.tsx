import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ROLES } from "@/lib/constants";
import { Guard, meta } from "@/components/guard";
import { PageHeader } from "@/components/states";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getRolesOverviewFn } from "@/lib/permissions.functions";

export const Route = createFileRoute("/_app/admin/roles")({
  head: () => meta("Roles", "Application roles and their members."),
  component: () => <Guard superAdmin><Page /></Guard>,
});

const DESC: Record<string, string> = {
  super_admin: "Full access to everything, including system settings, users, roles and permissions.",
  admin: "Administrative access to tickets, people, departments, categories, reports and logs.",
  agent: "Handles assigned, department and unassigned tickets. Replies, notes, status and priority.",
  customer: "Customer portal: create, view and reply to their own tickets only.",
};

function Page() {
  const getRolesOverview = useServerFn(getRolesOverviewFn);

  const q = useQuery({
    queryKey: ["roles-overview"],
    queryFn: async () => {
      try {
        const res = await getRolesOverview();
        if (res && Array.isArray(res) && res.length > 0) {
          return res;
        }
      } catch (err) {
        console.warn("Failed to fetch roles overview via server function:", err);
      }

      try {
        const [r, rp] = await Promise.all([
          supabase.from("user_roles").select("role"),
          supabase.from("role_permissions").select("role"),
        ]);
        const count = (arr: { role: string }[] | null, role: string) => (arr ?? []).filter((x) => x.role === role).length;
        return ROLES.map((x) => ({ ...x, members: count(r.data, x.value), perms: count(rp.data, x.value) }));
      } catch {}

      return ROLES.map((x) => ({ ...x, members: 0, perms: 0 }));
    },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Roles"
        description="Assign roles from the Users page; tune what each role can do under Permissions."
        actions={
          <>
            <Button asChild variant="outline">
              <Link to="/admin/users">Users</Link>
            </Button>
            <Button asChild>
              <Link to="/admin/permissions">Permissions</Link>
            </Button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {(q.data ?? ROLES.map((x) => ({ ...x, members: 0, perms: 0 }))).map((r) => (
          <Card key={r.value} className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{r.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{DESC[r.value]}</p>
              <div className="mt-3 flex gap-4 text-xs">
                <span>
                  <b className="tabular-nums text-foreground">{r.members}</b> member{r.members === 1 ? "" : "s"}
                </span>
                <span>
                  <b className="tabular-nums text-foreground">{r.perms}</b> permission{r.perms === 1 ? "" : "s"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
