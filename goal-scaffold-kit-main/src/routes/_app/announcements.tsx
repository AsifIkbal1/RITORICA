import { createFileRoute } from "@tanstack/react-router";
import { Guard, meta } from "@/components/guard";
import { CrudManager } from "@/components/crud-manager";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

const AUDIENCE = [
  { value: "all", label: "Everyone" },
  { value: "customers", label: "Customers only" },
  { value: "agents", label: "Support staff only" },
];

export const Route = createFileRoute("/_app/announcements")({
  head: () => meta("Announcement Broadcast", "Broadcast announcements to customers and staff."),
  component: () => <Guard admin><Page /></Guard>,
});

function Page() {
  const { session } = useAuth();
  return (
    <CrudManager
      table="announcements"
      title="Announcement Broadcast"
      description="New active announcements notify the chosen audience instantly and show as a banner until deactivated."
      singular="Announcement"
      extraInsert={() => ({ created_by: session?.user.id })}
      fields={[
        { key: "title", label: "Title", type: "text", required: true, min: 2, max: 150 },
        { key: "body", label: "Message", type: "textarea", required: true, min: 2, max: 5000 },
        { key: "audience", label: "Audience", type: "select", required: true, options: AUDIENCE, default: "all" },
        { key: "is_active", label: "Active (show banner)", type: "switch" },
      ]}
      columns={[
        { header: "Title", render: (r) => <span className="font-medium">{String(r["title"])}</span> },
        { header: "Audience", render: (r) => AUDIENCE.find((a) => a.value === r["audience"])?.label },
        { header: "Status", render: (r) => <Badge variant={r["is_active"] ? "secondary" : "outline"}>{r["is_active"] ? "Active" : "Inactive"}</Badge> },
      ]}
    />
  );
}
