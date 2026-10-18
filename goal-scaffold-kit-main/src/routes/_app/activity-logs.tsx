import { createFileRoute } from "@tanstack/react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Guard, meta } from "@/components/guard";
import { PageHeader, TableSkeleton, EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/activity-logs")({
  validateSearch: (s: Record<string, unknown>): { tab?: "security" } => (s["tab"] === "security" ? { tab: "security" } : {}),
  head: () => meta("Activity logs", "Append-only audit trail of system activity."),
  component: () => <Guard perm="activity_logs.view"><Logs /></Guard>,
});

const SIZE = 50;
function Logs() {
  const { tab } = Route.useSearch();
  const [security, setSecurity] = useState(tab === "security");
  return security ? <SecurityLog onBack={() => setSecurity(false)} /> : <Page onSecurity={() => setSecurity(true)} />;
}

const EVENT_TYPES: [string, string][] = [
  ["user.created", "User created"],
  ["auth.first_login", "First login"],
  ["auth.setup_completed", "First-time setup completed"],
  ["auth.company_email_submitted", "Company email submitted"],
  ["auth.company_email_verified", "Company email verified"],
  ["auth.reset_requested", "Password reset requested"],
  ["auth.otp_verified", "OTP verification success"],
  ["auth.otp_failed", "OTP verification failure"],
  ["auth.password_changed", "Password changed"],
  ["auth.login_success", "Successful login"],
  ["auth.login_failed", "Failed login"],
  ["email.sent", "Email sent"],
  ["email.failed", "Email failed"],
];
const EVENT_LABEL = new Map(EVENT_TYPES);
type LogMeta = { status?: string; username?: string; error?: string };

import { getActivityLogsFn } from "@/lib/activity-logs.functions";

function SecurityLog({ onBack }: { onBack: () => void }) {
  const [page, setPage] = useState(1);
  const [username, setUsername] = useState("");
  const [event, setEvent] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const res = useQuery({
    queryKey: ["security-logs", page, username, event, status, from, to],
    placeholderData: keepPreviousData,
    refetchInterval: 5000,
    queryFn: async () => {
      try {
        const local = await getActivityLogsFn({
          data: {
            tab: "security",
            event: event || undefined,
            status: status || undefined,
            search: username || undefined,
            from: from || undefined,
            to: to || undefined,
            page,
            size: SIZE,
          },
        });
        if (local && local.rows && local.rows.length > 0) {
          return local;
        }
      } catch {}

      try {
        let query = supabase.from("activity_logs").select("*", { count: "exact" })
          .in("action", EVENT_TYPES.map(([k]) => k))
          .order("created_at", { ascending: false }).range((page - 1) * SIZE, page * SIZE - 1);
        if (event) query = query.eq("action", event);
        if (status) query = query.eq("metadata->>status", status);
        if (username.trim()) query = query.ilike("metadata->>username", `%${username.trim().replace(/[,()%]/g, "")}%`);
        if (from) query = query.gte("created_at", new Date(from).toISOString());
        if (to) query = query.lt("created_at", new Date(new Date(to).getTime() + 86400000).toISOString());
        const { data, count, error } = await query;
        if (!error && data?.length) return { rows: data ?? [], count: count ?? 0 };
      } catch {}

      try {
        const local = await getActivityLogsFn({
          data: {
            tab: "security",
            event: event || undefined,
            status: status || undefined,
            search: username || undefined,
            from: from || undefined,
            to: to || undefined,
            page,
            size: SIZE,
          },
        });
        return local || { rows: [], count: 0 };
      } catch {}

      return { rows: [], count: 0 };
    },
  });
  const pages = Math.max(1, Math.ceil((res.data?.count ?? 0) / SIZE));
  const reset = () => setPage(1);
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Sign-in & email audit log" description="Account setup, sign-ins, password resets and email delivery. Passwords and codes are never stored here." />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={onBack}>Back to activity logs</Button>
        <Input className="w-44 bg-card" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value); reset(); }} />
        <select aria-label="Event type" className="h-9 rounded-md border bg-card px-2 text-sm" value={event} onChange={(e) => { setEvent(e.target.value); reset(); }}>
          <option value="">All events</option>
          {EVENT_TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <select aria-label="Status" className="h-9 rounded-md border bg-card px-2 text-sm" value={status} onChange={(e) => { setStatus(e.target.value); reset(); }}>
          <option value="">Any status</option><option value="success">Success</option><option value="failure">Failure</option>
        </select>
        <Input type="date" aria-label="From date" className="w-40 bg-card" value={from} onChange={(e) => { setFrom(e.target.value); reset(); }} />
        <Input type="date" aria-label="To date" className="w-40 bg-card" value={to} onChange={(e) => { setTo(e.target.value); reset(); }} />
      </div>
      <div className="overflow-hidden rounded-lg border bg-card shadow-card">
        {res.isLoading ? <TableSkeleton /> : !res.data?.rows.length ? <div className="p-4"><EmptyState title="No events found" /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr className="border-b">{["Date", "Time", "Username", "User ID", "Event", "Status", "Details"].map((h) => <th key={h} className="px-3 py-2.5 text-left font-medium first:pl-4">{h}</th>)}</tr>
              </thead>
              <tbody>
                {res.data.rows.map((r) => {
                  const m = (r.metadata ?? {}) as LogMeta;
                  return (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs">{format(new Date(r.created_at), "MMM d, yyyy")}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">{format(new Date(r.created_at), "HH:mm:ss")}</td>
                      <td className="px-3 py-2">{m.username ?? "—"}</td>
                      <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">{r.user_id ? r.user_id.slice(0, 8) : "—"}</td>
                      <td className="px-3 py-2">{EVENT_LABEL.get(r.action) ?? r.action}</td>
                      <td className="px-3 py-2"><Badge variant={m.status === "failure" ? "destructive" : "secondary"} className="text-[11px]">{m.status === "failure" ? "Failure" : "Success"}</Badge></td>
                      <td className="px-3 py-2 text-xs">{r.description}{m.error ? <span className="text-destructive"> — {m.error}</span> : null}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-end gap-2 border-t px-4 py-2.5 text-sm">
          <span className="text-muted-foreground">Page {page} of {pages}</span>
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="size-4" /></Button>
          <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage(page + 1)}><ChevronRight className="size-4" /></Button>
        </div>
      </div>
    </div>
  );
}

function Page({ onSecurity }: { onSecurity: () => void }) {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"customer" | "staff">("customer");
  const [person, setPerson] = useState("");
  const roleUsers = useQuery({
    queryKey: ["log-role-users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id, role");
      if (error) throw error;
      const customers = new Set<string>(), staff = new Set<string>();
      for (const r of data ?? []) (r.role === "customer" ? customers : staff).add(r.user_id);
      for (const s of staff) customers.delete(s);
      const { data: people } = await supabase.from("profiles").select("id, full_name, email").in("id", [...customers]);
      return { customers: [...customers], staff: [...staff], customerPeople: people ?? [] };
    },
  });
  const ids = person ? [person] : tab === "customer" ? roleUsers.data?.customers : roleUsers.data?.staff;
  const res = useQuery({
    queryKey: ["activity-logs", page, q, tab, person, ids?.length],
    placeholderData: keepPreviousData,
    refetchInterval: 5000,
    queryFn: async () => {
      try {
        const local = await getActivityLogsFn({
          data: {
            tab,
            search: q || undefined,
            person: person || undefined,
            page,
            size: SIZE,
          },
        });
        if (local && local.rows && local.rows.length > 0) {
          const peopleMap = new Map();
          for (const r of local.rows) {
            if (r.user_id) {
              peopleMap.set(r.user_id, {
                id: r.user_id,
                full_name: r.user_name || "User",
                email: r.user_email || "",
              });
            }
          }
          return { rows: local.rows, count: local.count, people: peopleMap };
        }
      } catch {}

      try {
        let query = supabase.from("activity_logs").select("*", { count: "exact" }).order("created_at", { ascending: false }).range((page - 1) * SIZE, page * SIZE - 1);
        if (ids?.length) query = query.in("user_id", ids);
        if (q.trim()) query = query.or(`description.ilike.%${q.trim().replace(/[,()%]/g, "")}%,action.ilike.%${q.trim().replace(/[,()%]/g, "")}%`);
        const { data, count, error } = await query;
        if (!error && data?.length) {
          const uids = [...new Set((data ?? []).map((d) => d.user_id).filter(Boolean) as string[])];
          const { data: people } = uids.length ? await supabase.from("profiles").select("id, full_name, email").in("id", uids) : { data: [] };
          return { rows: data ?? [], count: count ?? 0, people: new Map((people ?? []).map((p) => [p.id, p])) };
        }
      } catch {}

      try {
        const local = await getActivityLogsFn({
          data: {
            tab,
            search: q || undefined,
            person: person || undefined,
            page,
            size: SIZE,
          },
        });
        const peopleMap = new Map();
        for (const r of (local?.rows || [])) {
          if (r.user_id) {
            peopleMap.set(r.user_id, {
              id: r.user_id,
              full_name: r.user_name || "User",
              email: r.user_email || "",
            });
          }
        }
        return { rows: local?.rows || [], count: local?.count || 0, people: peopleMap };
      } catch {}

      return { rows: [], count: 0, people: new Map() };
    },
  });
  const pages = Math.max(1, Math.ceil((res.data?.count ?? 0) / SIZE));
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Activity logs" description="Audit trail of sign-ins, ticket and user events. Entries can't be edited or deleted." />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["customer", "staff"] as const).map((t) => (
          <Button key={t} size="sm" variant={tab === t ? "default" : "outline"} onClick={() => { setTab(t); setPerson(""); setPage(1); }}>
            {t === "customer" ? "Customer logs" : "Admin & agent logs"}
          </Button>
        ))}
        <Button size="sm" variant="outline" onClick={onSecurity}>Sign-in & email audit</Button>
        {tab === "customer" && (
          <select className="h-9 rounded-md border bg-card px-2 text-sm" value={person} onChange={(e) => { setPerson(e.target.value); setPage(1); }}>
            <option value="">All customers</option>
            {roleUsers.data?.customerPeople.map((p) => <option key={p.id} value={p.id}>{p.full_name || p.email}</option>)}
          </select>
        )}
        <Input className="max-w-sm bg-card" placeholder="Filter by action or description…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
      </div>
      <div className="overflow-hidden rounded-lg border bg-card shadow-card">
        {res.isLoading ? <TableSkeleton /> : !res.data?.rows.length ? <div className="p-4"><EmptyState title="No activity found" /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr className="border-b">{["Time", "User", "Action", "Entity", "Description"].map((h) => <th key={h} className="px-3 py-2.5 text-left font-medium first:pl-4">{h}</th>)}</tr>
              </thead>
              <tbody>
                {res.data.rows.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-xs text-muted-foreground">{format(new Date(r.created_at), "MMM d, HH:mm:ss")}</td>
                    <td className="px-3 py-2">{r.user_id ? res.data.people.get(r.user_id)?.full_name ?? "—" : "System"}</td>
                    <td className="px-3 py-2"><Badge variant="outline" className="font-mono text-[11px]">{r.action}</Badge></td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{r.entity_type}</td>
                    <td className="px-3 py-2">{r.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-end gap-2 border-t px-4 py-2.5 text-sm">
          <span className="text-muted-foreground">Page {page} of {pages}</span>
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="size-4" /></Button>
          <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => setPage(page + 1)}><ChevronRight className="size-4" /></Button>
        </div>
      </div>
    </div>
  );
}
