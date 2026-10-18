import { createFileRoute } from "@tanstack/react-router";
import { Guard, meta } from "@/components/guard";
import { CrudManager } from "@/components/crud-manager";
import { Badge } from "@/components/ui/badge";

const TYPES = [
  { value: "text", label: "Short text" },
  { value: "textarea", label: "Long text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "select", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
];

export const Route = createFileRoute("/_app/custom-fields")({
  head: () => meta("Custom Fields", "Extra fields customers fill in when creating tickets."),
  component: () => (
    <Guard admin>
      <CrudManager
        table="ticket_custom_fields"
        title="Custom Fields"
        description="Active fields appear on the Create Ticket form and on every ticket page."
        singular="Field"
        orderBy="sort_order"
        ascending
        fields={[
          { key: "label", label: "Label", type: "text", required: true, min: 2, max: 80 },
          { key: "field_type", label: "Field type", type: "select", required: true, options: TYPES, default: "text" },
          { key: "options", label: "Dropdown options", type: "tags", hint: "Comma separated, e.g. Bronze, Silver, Gold", showIf: (r) => r["field_type"] === "select" },
          { key: "is_required", label: "Required", type: "switch", default: false },
          { key: "sort_order", label: "Sort order", type: "number" },
          { key: "is_active", label: "Active", type: "switch" },
        ]}
        columns={[
          { header: "Label", render: (r) => <span className="font-medium">{String(r["label"])}</span> },
          { header: "Type", render: (r) => TYPES.find((t) => t.value === r["field_type"])?.label ?? String(r["field_type"]) },
          { header: "Required", render: (r) => (r["is_required"] ? "Yes" : "No") },
          { header: "Status", render: (r) => <Badge variant={r["is_active"] ? "secondary" : "outline"}>{r["is_active"] ? "Active" : "Inactive"}</Badge> },
        ]}
      />
    </Guard>
  ),
});
