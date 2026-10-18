import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { navLinks, navTrailingGroups } from "@/content/navigation";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("every Help Desk, Company and top link opens a real page", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const paths = [...navLinks.map((l) => l.to), ...navTrailingGroups.flatMap((g) => g.items.map((i) => i.to))];
    for (const p of paths) {
      const leaf = router.matchRoutes(p).at(-1)?.routeId;
      expect(leaf, p).not.toBe(rootRouteId);
      expect(leaf, p).not.toBe("/$");
    }
  });
});
