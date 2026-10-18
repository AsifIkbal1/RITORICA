import { createFileRoute } from "@tanstack/react-router";
import { site } from "@/config/site";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { richPages, richPagePath } from "@/content/pages";

const staticPaths = ["/", "/about", "/solutions", "/services", "/platform", "/developers", "/industries", "/security", "/pricing", "/contact", "/request-demo", "/privacy", "/terms", "/refund-policy", "/document-acceptance-policy", "/help-desk/open-ticket", "/help-desk/faq", "/help-desk/noticeboard"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const paths = [...staticPaths, ...services.map((s) => `/services/${s.slug}`), ...industries.map((i) => `/industries/${i.slug}`), ...richPages.map(richPagePath)];
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
          .map((p) => `  <url><loc>${site.url}${p === "/" ? "" : p}</loc></url>`)
          .join("\n")}\n</urlset>`;
        return new Response(body, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
