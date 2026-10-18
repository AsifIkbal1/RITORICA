import { site } from "@/config/site";

/** Builds a route head() payload with unique title, description, OG and canonical. */
export function seo(title: string, description: string, path: string) {
  const fullTitle = path === "/" ? title : `${title} | ${site.name}`;
  const url = `${site.url}${path === "/" ? "" : path}`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
