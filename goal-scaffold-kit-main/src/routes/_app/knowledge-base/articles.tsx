import { createFileRoute } from "@tanstack/react-router";
import { Guard, meta } from "@/components/guard";
import { CrudManager } from "@/components/crud-manager";
import { useKbCategories, useKbSubcategories } from "@/lib/kb";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/knowledge-base/articles")({
  head: () => meta("Knowledge Base Articles", "Write and publish help articles."),
  component: () => <Guard admin><Page /></Guard>,
});

function Page() {
  const { session } = useAuth();
  const cats = useKbCategories();
  const subs = useKbSubcategories();
  const catName = (id: unknown) => cats.data?.find((c) => c.id === id)?.name ?? "—";
  const subName = (id: unknown) => subs.data?.find((c) => c.id === id)?.name;
  return (
    <CrudManager
      table="kb_articles"
      title="Knowledge Base Articles"
      description="Published articles are visible to everyone in the Help Center."
      singular="Article"
      orderBy="updated_at"
      extraInsert={() => ({ created_by: session?.user.id })}
      fields={[
        { key: "title", label: "Title", type: "text", required: true, min: 3, max: 200 },
        { key: "category_id", label: "Category", type: "select", options: (cats.data ?? []).map((c) => ({ value: c.id, label: c.name })) },
        {
          key: "subcategory_id", label: "Subcategory", type: "select",
          options: (subs.data ?? []).map((s) => ({ value: s.id, label: `${catName(s.category_id)} › ${s.name}` })),
        },
        { key: "body", label: "Article", type: "textarea", required: true, max: 50000 },
        { key: "is_published", label: "Published", type: "switch", default: false },
      ]}
      columns={[
        { header: "Title", render: (r) => <span className="font-medium">{String(r["title"])}</span> },
        { header: "Category", className: "hidden md:table-cell", render: (r) => <span className="text-muted-foreground">{catName(r["category_id"])}{subName(r["subcategory_id"]) ? ` › ${subName(r["subcategory_id"])}` : ""}</span> },
        { header: "Status", render: (r) => <Badge variant={r["is_published"] ? "secondary" : "outline"}>{r["is_published"] ? "Published" : "Draft"}</Badge> },
      ]}
    />
  );
}
