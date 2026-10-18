import { createFileRoute, notFound } from "@tanstack/react-router";
import { getRichPage, richPagePath } from "@/content/pages";
import { RichPageView } from "@/components/site/RichPageView";
import { seo } from "@/lib/seo";

// Trailing underscore: /solutions/<slug> is its own page, not nested inside the /solutions page.
export const Route = createFileRoute("/solutions_/$slug")({
  loader: ({ params }) => {
    if (!getRichPage("solutions", params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const p = getRichPage("solutions", params.slug);
    return p ? seo(p.name.en, p.description, richPagePath(p)) : {};
  },
  component: () => <RichPageView page={getRichPage("solutions", Route.useLoaderData().slug)!} />,
});
