import { createFileRoute } from "@tanstack/react-router";
import { Guard, meta } from "@/components/guard";
import { CrudManager } from "@/components/crud-manager";
import { useKbCategories } from "@/lib/kb";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/knowledge-base/subcategories")({
  head: () => meta("Knowledge Base Subcategories", "Second-level groups for help articles."),
  component: () => <Guard admin><Page /></Guard>,
});

function Page() {
  const cats = useKbCategories();
  const name = (id: unknown) => cats.data?.find((c) => c.id === id)?.name ?? "—";
  return (
    <CrudManager
      table="kb_subcategories"
      title="Knowledge Base Subcategories"
      singular="Subcategory"
      orderBy="sort_order"
      ascending
      fields={[
        { key: "category_id", label: "Category", type: "select", required: true, options: (cats.data ?? []).map((c) => ({ value: c.id, label: c.name })), hint: cats.data?.length ? undefined : "Create a category first." },
        { key: "name", label: "Name", type: "text", required: true, min: 2, max: 80 },
        { key: "description", label: "Description", type: "textarea", max: 500 },
        { key: "sort_order", label: "Sort order", type: "number" },
        { key: "is_active", label: "Active", type: "switch" },
      ]}
      columns={[
        { header: "Name", render: (r) => <span className="font-medium">{String(r["name"])}</span> },
        { header: "Category", render: (r) => name(r["category_id"]) },
        { header: "Status", render: (r) => <Badge variant={r["is_active"] ? "secondary" : "outline"}>{r["is_active"] ? "Active" : "Inactive"}</Badge> },
      ]}
    />
  );
}
