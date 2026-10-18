import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

/** Shows active announcements for the viewer's audience (RLS decides which). */
export function AnnouncementBanner() {
  const { session } = useAuth();
  const [hidden, setHidden] = useState<string[]>([]);
  const q = useQuery({
    queryKey: ["announcements", "active", session?.user.id],
    enabled: !!session,
    refetchInterval: 120_000,
    queryFn: async () => {
      const { data, error } = await supabase.from("announcements").select("id, title, body").eq("is_active", true).order("created_at", { ascending: false }).limit(3);
      if (error) throw error;
      return data;
    },
  });
  const rows = (q.data ?? []).filter((r) => !hidden.includes(r.id));
  if (!rows.length) return null;
  return (
    <div className="mb-4 space-y-2">
      {rows.map((r) => (
        <div key={r.id} className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
          <Megaphone className="mt-0.5 size-4 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <span className="font-semibold">{r.title}</span> <span className="text-muted-foreground">— {r.body}</span>
          </div>
          <button type="button" aria-label="Dismiss" onClick={() => setHidden((h) => [...h, r.id])} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
        </div>
      ))}
    </div>
  );
}
