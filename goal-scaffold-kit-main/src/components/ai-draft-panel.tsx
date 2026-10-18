import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, Loader2, RefreshCw, Search, Sparkles, Trash2, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { draftReplyWithAi } from "@/lib/ai-draft.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type Article = { id: string; title: string; snippet: string; category_name: string | null; rank: number };

function useKbSearch(q: string) {
  return useQuery({
    queryKey: ["kb-search", q],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("kb_search", { _q: q, _limit: 8 });
      if (error) throw error;
      return (data ?? []) as Article[];
    },
    staleTime: 60_000,
  });
}

const relevance = (rank: number, max: number) => {
  if (!rank || !max) return { label: "—", cls: "text-muted-foreground" };
  const r = rank / max;
  return r > 0.66 ? { label: "High", cls: "text-online" } : r > 0.33 ? { label: "Medium", cls: "text-away" } : { label: "Low", cls: "text-muted-foreground" };
};

/**
 * Staff-only AI drafting panel. Generates a grounded draft from the ticket conversation and
 * selected KB articles. It never sends anything — "Use Draft" only fills the reply composer.
 */
export function AiDraftPanel({ ticketId, seedQuery, onUse, onClose }: {
  ticketId: string;
  seedQuery: string;
  onUse: (d: { id: string; content: string }) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(seedQuery);
  const suggested = useKbSearch(query);
  const [selected, setSelected] = useState<Map<string, Article>>(new Map());
  const [seeded, setSeeded] = useState(false);
  const [guidance, setGuidance] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ id: string; content: string } | null>(null);
  const [text, setText] = useState("");
  const generate = useServerFn(draftReplyWithAi);

  // Preselect the top relevant suggestions once.
  useEffect(() => {
    if (seeded || !suggested.data) return;
    setSeeded(true);
    setSelected(new Map(suggested.data.filter((a) => a.rank > 0).slice(0, 3).map((a) => [a.id, a])));
  }, [suggested.data, seeded]);

  const max = useMemo(() => Math.max(0, ...(suggested.data ?? []).map((a) => a.rank)), [suggested.data]);
  const list = useMemo(() => {
    const shown = new Map((suggested.data ?? []).map((a) => [a.id, a]));
    for (const [id, a] of selected) if (!shown.has(id)) shown.set(id, a);
    return [...shown.values()];
  }, [suggested.data, selected]);

  const toggle = (a: Article) =>
    setSelected((s) => {
      const n = new Map(s);
      if (n.has(a.id)) n.delete(a.id);
      else if (n.size < 5) n.set(a.id, a);
      return n;
    });

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const r = await generate({ data: { ticket_id: ticketId, article_ids: [...selected.keys()], guidance: guidance.trim() || undefined } });
      if (!r.ok) setError(r.error);
      else {
        setDraft({ id: r.draft_id, content: r.content });
        setText(r.content);
      }
    } catch {
      setError("Unable to generate a draft right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-chat-ai/30 bg-chat-ai/5 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4 text-chat-ai" /> AI Reply Assistant</div>
        <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
      </div>

      <div className="rounded-md border bg-card p-2.5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><BookOpen className="size-3.5" /> Relevant Knowledge Base Articles</span>
          <span className="text-[11px] text-muted-foreground">{selected.size}/5 selected</span>
        </div>
        <form className="mb-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); setQuery(search.trim() || seedQuery); }}>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Knowledge Base…" className="h-8 pl-7 text-xs" />
          </div>
          <Button type="submit" size="sm" variant="outline" className="h-8">Search</Button>
        </form>
        {suggested.isLoading ? (
          <p className="py-3 text-center text-xs text-muted-foreground"><Loader2 className="mr-1 inline size-3 animate-spin" /> Finding articles…</p>
        ) : suggested.isError ? (
          <p className="py-3 text-center text-xs text-destructive">Couldn't search the Knowledge Base. <button className="underline" onClick={() => suggested.refetch()}>Retry</button></p>
        ) : !list.length ? (
          <p className="py-3 text-center text-xs text-muted-foreground">No relevant articles found.</p>
        ) : (
          <ul className="max-h-56 space-y-1 overflow-y-auto">
            {list.map((a) => {
              const rel = relevance(a.rank, max);
              return (
                <li key={a.id}>
                  <label className={cn("flex cursor-pointer gap-2 rounded px-2 py-1.5 hover:bg-muted", selected.has(a.id) && "bg-muted")}>
                    <Checkbox className="mt-0.5" checked={selected.has(a.id)} onCheckedChange={() => toggle(a)} aria-label={`Use ${a.title}`} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-xs font-medium">{a.title}</span>
                        <span className={cn("ml-auto shrink-0 text-[10px] font-semibold", rel.cls)}>{rel.label}</span>
                      </span>
                      <span className="line-clamp-1 text-[11px] text-muted-foreground">{a.category_name ? `${a.category_name} · ` : ""}{a.snippet}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Input value={guidance} onChange={(e) => setGuidance(e.target.value)} maxLength={500} placeholder="Optional guidance, e.g. “apologise for the delay”" className="h-8 text-xs" />

      {error && <p className="flex items-center gap-1.5 rounded-md bg-destructive/10 px-2.5 py-2 text-xs text-destructive"><AlertCircle className="size-3.5" /> {error}</p>}

      {draft ? (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-chat-ai">AI Draft — review and edit before using</div>
          <Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} className="bg-card" aria-label="AI draft" />
          <div className="flex flex-wrap justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => { setDraft(null); setText(""); }}><Trash2 className="size-4" /> Discard</Button>
            <Button size="sm" variant="outline" disabled={busy} onClick={run}>{busy ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Regenerate</Button>
            <Button size="sm" disabled={!text.trim()} onClick={() => onUse({ id: draft.id, content: text.trim() === draft.content.trim() ? draft.content : text })}><Check className="size-4" /> Use Draft</Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button size="sm" disabled={busy} onClick={run} className="bg-chat-ai text-primary-foreground hover:bg-chat-ai/90">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} {busy ? "Drafting…" : "Generate draft"}
          </Button>
        </div>
      )}
      <p className="text-[11px] text-muted-foreground">Drafts are never sent automatically. Internal notes are not shared with the AI.</p>
    </div>
  );
}
