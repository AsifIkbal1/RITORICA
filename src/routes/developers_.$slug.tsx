import { createFileRoute, notFound } from "@tanstack/react-router";
import { getRichPage, richPagePath } from "@/content/pages";
import { RichPageView } from "@/components/site/RichPageView";
import { seo } from "@/lib/seo";

// Trailing underscore: /developers/<slug> is its own page, not nested inside the /developers page.
export const Route = createFileRoute("/developers_/$slug")({
  loader: ({ params }) => {
    if (!getRichPage("developers", params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const p = getRichPage("developers", params.slug);
    return p ? seo(p.name.en, p.description, richPagePath(p)) : {};
  },
  component: () => <RichPageView page={getRichPage("developers", Route.useLoaderData().slug)!} />,
});
