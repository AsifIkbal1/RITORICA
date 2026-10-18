import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { friendlyError } from "@/lib/constants";
import { Guard, meta } from "@/components/guard";
import { PageHeader } from "@/components/states";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_app/cc-emails/new")({
  validateSearch: (s) => z.object({ ticket: z.string().optional() }).parse(s),
  head: () => meta("Add CC Emails", "Copy extra people on a support ticket."),
  component: () => <Guard staff><Page /></Guard>,
});

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function Page() {
  const { ticket } = Route.useSearch();
  const { session } = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();
  const [num, setNum] = useState(ticket ?? "");
  const [emails, setEmails] = useState("");
  const [busy, setBusy] = useState(false);
  const term = num.trim().toUpperCase();
  const found = useQuery({
    queryKey: ["cc-ticket", term],
    enabled: term.length >= 4,
    queryFn: async () => {
      const q = /^[0-9a-f-]{36}$/i.test(num.trim())
        ? supabase.from("tickets").select("id, ticket_number, subject, customer_name").eq("id", num.trim())
        : supabase.from("tickets").select("id, ticket_number, subject, customer_name").ilike("ticket_number", `%${term}%`);
      const { data } = await q.limit(5);
      return data ?? [];
    },
  });
  const [picked, setPicked] = useState<string | null>(ticket ?? null);
  const pickedRow = found.data?.find((t) => t.id === picked);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!picked || !session) return void toast.error("Choose a ticket first.");
    const list = [...new Set(emails.split(/[\s,;]+/).map((s) => s.trim().toLowerCase()).filter(Boolean))];
    if (!list.length) return void toast.error("Enter at least one email address.");
    const bad = list.filter((x) => !emailRe.test(x) || x.length > 255);
    if (bad.length) return void toast.error(`Invalid email: ${bad.join(", ")}`);
    setBusy(true);
    let added = 0;
    for (const email of list) {
      const { error } = await supabase.from("ticket_cc_emails").insert({ ticket_id: picked, email, added_by: session.user.id });
      if (!error) added++;
      else if (error.code !== "23505") {
        setBusy(false);
        return void toast.error(friendlyError(error));
      }
    }
    setBusy(false);
    toast.success(`${added} CC email${added === 1 ? "" : "s"} added${added < list.length ? " (duplicates skipped)" : ""}`);
    qc.invalidateQueries({ queryKey: ["cc-emails"] });
    nav({ to: "/cc-emails" });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Add CC Emails" description="CC'd addresses are stored on the ticket so everyone involved stays informed." />
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <form className="space-y-4" onSubmit={submit}>
            <div className="space-y-1.5">
              <Label htmlFor="tk">Ticket number</Label>
              <Input id="tk" value={num} onChange={(e) => { setNum(e.target.value); setPicked(null); }} placeholder="TKT-000123" />
              {term.length >= 4 && !picked && (
                <div className="rounded-md border">
                  {!found.data?.length ? <p className="p-2 text-xs text-muted-foreground">{found.isLoading ? "Searching…" : "No matching ticket you can access."}</p> : found.data.map((t) => (
                    <button key={t.id} type="button" onClick={() => { setPicked(t.id); setNum(t.ticket_number); }} className="block w-full border-b px-2 py-1.5 text-left text-sm last:border-0 hover:bg-muted">
                      <span className="font-mono text-primary">{t.ticket_number}</span> · {t.subject} <span className="text-xs text-muted-foreground">({t.customer_name})</span>
                    </button>
                  ))}
                </div>
              )}
              {picked && pickedRow && <p className="text-xs text-muted-foreground">Selected: {pickedRow.subject}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="em">Email addresses</Label>
              <Textarea id="em" rows={4} value={emails} onChange={(e) => setEmails(e.target.value)} placeholder="manager@company.com, it@company.com" />
              <p className="text-xs text-muted-foreground">Separate multiple addresses with commas or new lines.</p>
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button type="button" variant="ghost" onClick={() => nav({ to: "/cc-emails" })}>Cancel</Button>
              <Button type="submit" disabled={busy || !picked}>{busy && <Loader2 className="size-4 animate-spin" />} Add CC emails</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
