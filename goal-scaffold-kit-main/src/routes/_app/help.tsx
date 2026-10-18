import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { BookOpen, Search, ArrowLeft, HelpCircle, Folder, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useKbCategories, useKbSubcategories } from "@/lib/kb";
import { meta } from "@/components/guard";
import { PageHeader, EmptyState, TableSkeleton } from "@/components/states";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

import { useAuth } from "@/lib/auth";
import { listCrudItemsFn } from "@/lib/crud.functions";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_app/help")({
  validateSearch: (s) => z.object({ a: z.string().optional(), cat: z.string().optional() }).parse(s),
  head: () => meta("Help Center", "Knowledge base articles and frequently asked questions."),
  component: Help,
});

function Help() {
  const { a, cat } = Route.useSearch();
  const nav = Route.useNavigate();
  const { isAdmin } = useAuth();
  const [term, setTerm] = useState("");
  const cats = useKbCategories();
  const subs = useKbSubcategories();
  const articles = useQuery({
    queryKey: ["kb_articles", "published"],
    queryFn: async () => {
      try {
        const local = await listCrudItemsFn({ data: { table: "kb_articles", orderBy: "title", ascending: true, publishedOnly: true } });
        if (local && local.length > 0) return local;
      } catch {}
      const { data, error } = await supabase.from("kb_articles").select("*").eq("is_published", true).order("title");
      if (error) throw error;
      return data;
    },
  });
  const faqs = useQuery({
    queryKey: ["faqs", "published"],
    queryFn: async () => {
      try {
        const local = await listCrudItemsFn({ data: { table: "faqs", orderBy: "sort_order", ascending: true, publishedOnly: true } });
        if (local && local.length > 0) return local;
      } catch {}
      const { data, error } = await supabase.from("faqs").select("*").eq("is_published", true).order("sort_order");
      if (error) throw error;
      return data;
    },
  });
  const open = articles.data?.find((x) => x.id === a);
  const t = term.trim().toLowerCase();
  const list = (articles.data ?? []).filter((x) => (!cat || x.category_id === cat) && (!t || x.title.toLowerCase().includes(t) || x.body.toLowerCase().includes(t)));
  const activeCats = (cats.data ?? []).filter((c) => c.is_active);

  if (open)
    return (
      <div className="mx-auto max-w-3xl">
        <Button variant="ghost" size="sm" className="mb-3" onClick={() => nav({ search: { cat } })}><ArrowLeft className="size-4" /> Back to Help Center</Button>
        <article className="rounded-lg border bg-card p-6 shadow-card">
          <div className="mb-1 text-xs text-muted-foreground">
            {cats.data?.find((c) => c.id === open.category_id)?.name}
            {subs.data?.find((s) => s.id === open.subcategory_id) && ` › ${subs.data.find((s) => s.id === open.subcategory_id)!.name}`}
          </div>
          <h1 className="text-2xl font-semibold">{open.title}</h1>
          <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{open.body}</div>
        </article>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <PageHeader
        title="Help Center"
        description="Find answers in our knowledge base before opening a ticket."
        actions={
          isAdmin ? (
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/knowledge-base/articles"><Plus className="size-3.5 mr-1" /> Manage Articles</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/faqs"><Plus className="size-3.5 mr-1" /> Manage FAQs</Link>
              </Button>
            </div>
          ) : undefined
        }
      />
      <a href="tel:+8801805991950" className="hover-lift mb-5 flex items-center gap-3 rounded-lg border bg-card p-4 shadow-card">
        <Phone className="size-5 text-primary" />
        <div>
          <div className="text-xs text-muted-foreground">Help line</div>
          <div className="font-semibold">+880 (180) 599-1950</div>
        </div>
      </a>
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input className="pl-9" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search articles…" />
      </div>
      {!!activeCats.length && (
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => nav({ search: {} })} className={cn("rounded-full border px-3 py-1 text-xs", !cat ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}>All</button>
          {activeCats.map((c) => (
            <button key={c.id} type="button" onClick={() => nav({ search: { cat: c.id } })} className={cn("flex items-center gap-1 rounded-full border px-3 py-1 text-xs", cat === c.id ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}>
              <Folder className="size-3" /> {c.name}
            </button>
          ))}
        </div>
      )}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold"><BookOpen className="size-4" /> Articles</h2>
          {isAdmin && (
            <Link to="/knowledge-base/articles" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              <Plus className="size-3" /> Add / Edit Articles
            </Link>
          )}
        </div>
        {articles.isLoading ? <TableSkeleton rows={3} /> : !list.length ? <EmptyState title="No articles found" description="Try another search, or contact support." /> : (
          <div className="grid gap-2 sm:grid-cols-2">
            {list.map((x) => (
              <button key={x.id} type="button" onClick={() => nav({ search: { a: x.id, cat } })} className="rounded-lg border bg-card p-3 text-left shadow-card hover:border-primary">
                <div className="font-medium">{x.title}</div>
                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{x.body}</div>
              </button>
            ))}
          </div>
        )}
      </section>
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-semibold"><HelpCircle className="size-4" /> Frequently asked questions</h2>
          {isAdmin && (
            <Link to="/faqs" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
              <Plus className="size-3" /> Add / Edit FAQs
            </Link>
          )}
        </div>
        {faqs.isLoading ? <TableSkeleton rows={3} /> : !faqs.data?.length ? <EmptyState title="No FAQs yet" /> : (
          <Accordion type="single" collapsible className="rounded-lg border bg-card px-4 shadow-card">
            {faqs.data.map((f) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger className="text-left text-sm">{f.question}</AccordionTrigger>
                <AccordionContent className="whitespace-pre-wrap text-sm text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </section>
    </div>
  );
}
