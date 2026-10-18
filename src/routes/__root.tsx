import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LanguageProvider, useT } from "@/i18n/language";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ChatWidget } from "@/components/site/ChatWidget";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

function NotFoundComponent() {
  const t = useT();
  return (
    <div className="container-site flex min-h-[60vh] items-center justify-center py-20">
      <div className="max-w-md text-center">
        <h1 className="heading-brand text-7xl">404</h1>
        <h2 className="mt-4 text-xl font-semibold">{t({ en: "Page not found", bn: "পেজটি পাওয়া যায়নি" })}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t({ en: "The page you're looking for doesn't exist or has been moved.", bn: "আপনি যে পেজটি খুঁজছেন সেটি নেই বা সরানো হয়েছে।" })}
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            {t({ en: "Go home", bn: "হোমে ফিরুন" })}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end. You can try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Ritorica" },
      { name: "theme-color", content: "#4072D6" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&family=Hind+Siliguri:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useScrollReveal(pathname);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      let sid = window.sessionStorage.getItem("ritorica_visitor_sid");
      if (!sid) {
        sid = "pub_" + Math.random().toString(36).slice(2, 10);
        window.sessionStorage.setItem("ritorica_visitor_sid", sid);
      }
      fetch("http://localhost:8081/api/track-hit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          session_id: sid,
          user_name: "Website Visitor",
          role: "visitor",
        }),
      }).catch(() => {});
    } catch {}
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <SiteHeader />
        <main id="main">
          <div key={pathname} className="page-enter">
            <Outlet />
          </div>
        </main>
        <SiteFooter />
        <ChatWidget />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
