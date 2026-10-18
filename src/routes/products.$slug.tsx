import { createFileRoute, notFound } from "@tanstack/react-router";
import { getRichPage, richPagePath } from "@/content/pages";
import { RichPageView } from "@/components/site/RichPageView";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    if (!getRichPage("products", params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const p = getRichPage("products", params.slug);
    return p ? seo(p.name.en, p.description, richPagePath(p)) : {};
  },
  component: () => <RichPageView page={getRichPage("products", Route.useLoaderData().slug)!} />,
});
