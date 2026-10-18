import { Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, Plus, X, ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useCustomFields } from "@/lib/kb";
import { friendlyError } from "@/lib/constants";
import type { Json } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function show(v: unknown) {
  if (v === true) return "Yes";
  if (v === false) return "No";
  if (v == null || v === "") return "—";
  return String(v);
}

/** Custom field values and CC emails for a ticket. */
export function TicketExtras({ ticketId, values }: { ticketId: string; values: Json }) {
  const { isStaff } = useAuth();
  const qc = useQueryClient();
  const fields = useCustomFields(false);
  const vals = (values && typeof values === "object" && !Array.isArray(values) ? values : {}) as Record<string, unknown>;
  const used = (fields.data ?? []).filter((f) => f.is_active || vals[f.id] != null);
  const cc = useQuery({
    queryKey: ["cc-emails", ticketId],
    queryFn: async () => {
      const { data, error } = await supabase.from("ticket_cc_emails").select("id, email").eq("ticket_id", ticketId).order("created_at");
      if (error) throw error;
      return data;
    },
  });
  return (
    <>
      {!!used.length && (
        <Card className="shadow-card">
          <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm"><ClipboardList className="size-4" /> Additional details</CardTitle></CardHeader>
          <CardContent>
            <dl className="space-y-1.5 text-sm">
              {used.map((f) => (
                <div key={f.id} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{f.label}</dt>
                  <dd className="text-right font-medium">{show(vals[f.id])}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}
      {(isStaff || !!cc.data?.length) && (
        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm"><Mail className="size-4" /> CC emails</CardTitle>
            {isStaff && (
              <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                <Link to="/cc-emails/new" search={{ ticket: ticketId }}><Plus className="size-3" /> Add</Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!cc.data?.length ? <p className="text-xs text-muted-foreground">No one is CC'd.</p> : (
              <ul className="space-y-1 text-sm">
                {cc.data.map((r) => (
                  <li key={r.id} className="flex items-center gap-2">
                    <span className="flex-1 truncate">{r.email}</span>
                    {isStaff && (
                      <button
                        type="button"
                        aria-label={`Remove ${r.email}`}
                        className="text-muted-foreground hover:text-destructive"
                        onClick={async () => {
                          const { error } = await supabase.from("ticket_cc_emails").delete().eq("id", r.id);
                          if (error) return void toast.error(friendlyError(error));
                          qc.invalidateQueries({ queryKey: ["cc-emails"] });
                        }}
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
