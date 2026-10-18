import { createFileRoute } from "@tanstack/react-router";
import { Guard, meta } from "@/components/guard";
import { CrudManager } from "@/components/crud-manager";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/faqs")({
  head: () => meta("FAQs", "Manage frequently asked questions."),
  component: () => (
    <Guard admin>
      <CrudManager
        table="faqs"
        title="FAQs"
        description="Published FAQs appear in the Help Center for customers and agents."
        singular="FAQ"
        orderBy="sort_order"
        ascending
        fields={[
          { key: "question", label: "Question", type: "text", required: true, min: 3, max: 300 },
          { key: "answer", label: "Answer", type: "textarea", required: true, max: 10000 },
          { key: "sort_order", label: "Sort order", type: "number" },
          { key: "is_published", label: "Published", type: "switch" },
        ]}
        columns={[
          { header: "Question", render: (r) => <span className="font-medium">{String(r["question"])}</span> },
          { header: "Answer", className: "hidden md:table-cell", render: (r) => <span className="line-clamp-2 text-muted-foreground">{String(r["answer"])}</span> },
          { header: "Status", render: (r) => <Badge variant={r["is_published"] ? "secondary" : "outline"}>{r["is_published"] ? "Published" : "Hidden"}</Badge> },
        ]}
      />
    </Guard>
  ),
});
