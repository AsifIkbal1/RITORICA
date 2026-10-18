import { createFileRoute, notFound } from "@tanstack/react-router";
import { getRichPage, richPagePath } from "@/content/pages";
import { RichPageView } from "@/components/site/RichPageView";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/channels/$slug")({
  loader: ({ params }) => {
    if (!getRichPage("channels", params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const p = getRichPage("channels", params.slug);
    return p ? seo(p.name.en, p.description, richPagePath(p)) : {};
  },
  component: () => <RichPageView page={getRichPage("channels", Route.useLoaderData().slug)!} />,
});
