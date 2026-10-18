import { createFileRoute } from "@tanstack/react-router";
import { useDepartments, useStaff } from "@/lib/lookups";
import { Guard, meta } from "@/components/guard";
import { LookupManager } from "@/components/lookup-manager";

export const Route = createFileRoute("/_app/departments")({
  head: () => meta("Departments", "Manage support departments."),
  component: () => <Guard perm="departments.manage"><Page /></Guard>,
});

function Page() {
  const q = useDepartments();
  const staff = useStaff();
  return (
    <LookupManager
      table="departments"
      title="Departments"
      singular="Department"
      rows={q.data}
      loading={q.isLoading}
      extraColumn={{
        header: "Agents",
        render: (r) => {
          const list = staff.data?.filter((s) => s.department_id === r.id) ?? [];
          return list.length ? <span className="text-xs">{list.map((s) => s.full_name).join(", ")}</span> : <span className="text-xs text-muted-foreground">None</span>;
        },
      }}
    />
  );
}
