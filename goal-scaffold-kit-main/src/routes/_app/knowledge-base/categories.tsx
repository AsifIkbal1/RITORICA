import { createFileRoute } from "@tanstack/react-router";
import { Guard, meta } from "@/components/guard";
import { CrudManager } from "@/components/crud-manager";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/knowledge-base/categories")({
  head: () => meta("Knowledge Base Categories", "Organise help articles into categories."),
  component: () => (
    <Guard admin>
      <CrudManager
        table="kb_categories"
        title="Knowledge Base Categories"
        description="Top-level groups shown in the Help Center."
        singular="Category"
        orderBy="sort_order"
        ascending
        deleteWarning="Subcategories inside it are deleted too; articles stay but lose this category."
        fields={[
          { key: "name", label: "Name", type: "text", required: true, min: 2, max: 80 },
          { key: "description", label: "Description", type: "textarea", max: 500 },
          { key: "sort_order", label: "Sort order", type: "number" },
          { key: "is_active", label: "Active", type: "switch" },
        ]}
        columns={[
          { header: "Name", render: (r) => <span className="font-medium">{String(r["name"])}</span> },
          { header: "Description", className: "hidden md:table-cell", render: (r) => <span className="text-muted-foreground">{String(r["description"] ?? "—")}</span> },
          { header: "Status", render: (r) => <Badge variant={r["is_active"] ? "secondary" : "outline"}>{r["is_active"] ? "Active" : "Inactive"}</Badge> },
        ]}
      />
    </Guard>
  ),
});
