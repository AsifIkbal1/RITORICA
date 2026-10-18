import { createFileRoute } from "@tanstack/react-router";
import { useCategories } from "@/lib/lookups";
import { Guard, meta } from "@/components/guard";
import { LookupManager } from "@/components/lookup-manager";

export const Route = createFileRoute("/_app/categories")({
  head: () => meta("Categories", "Manage ticket categories."),
  component: () => <Guard perm="categories.manage"><Page /></Guard>,
});

function Page() {
  const q = useCategories();
  return <LookupManager table="categories" title="Categories" singular="Category" rows={q.data} loading={q.isLoading} />;
}
