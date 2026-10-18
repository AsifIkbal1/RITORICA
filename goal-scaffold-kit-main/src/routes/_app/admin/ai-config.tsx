import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Loader2, PlugZap, Save, CheckCircle2, XCircle, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { saveChatConfig, testN8nConnection, getChatConfigFn, getChatAiLogsFn } from "@/lib/chat.functions";
import { useStaffAvailability } from "@/lib/presence-list";
import { meta } from "@/components/guard";
import { Forbidden, PageHeader, TableSkeleton } from "@/components/states";
import { PresenceDot } from "@/components/chat/presence-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_app/admin/ai-config")({
  head: () => meta("AI / n8n Configuration", "Connect the AI chat assistant to your n8n workflow."),
  component: Page,
});

function Page() {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Forbidden />;
  return <AiConfig />;
}

function AiConfig() {
  const qc = useQueryClient();
  const save = useServerFn(saveChatConfig);
  const test = useServerFn(testN8nConnection);
  const getConfig = useServerFn(getChatConfigFn);
  const getLogs = useServerFn(getChatAiLogsFn);

  const cfg = useQuery({
    queryKey: ["chat-config"],
    queryFn: async () => {
      try {
        const local = await getConfig();
        if (local) return local;
      } catch {}
      try {
        const { data } = await supabase.from("chat_config").select("*").eq("id", 1).maybeSingle();
        if (data) return data;
      } catch {}
      return { id: 1, n8n_webhook_url: "https://fsgsgsyttryerty.app.n8n.cloud/webhook-test/website-chat", ai_enabled: true };
    },
  });
  const logs = useQuery({
    queryKey: ["chat-config", "logs"],
    queryFn: async () => {
      try {
        const local = await getLogs();
        if (local && local.length) return local;
      } catch {}
      try {
        const { data } = await supabase.from("chat_ai_logs").select("*").order("created_at", { ascending: false }).limit(50);
        if (data) return data;
      } catch {}
      return [];
    },
  });
  const staff = useStaffAvailability();
  const [url, setUrl] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState<"save" | "test" | null>(null);
  const [testResult, setTestResult] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => {
    if (cfg.data) {
      setUrl(cfg.data.n8n_webhook_url ?? "");
      setEnabled(cfg.data.ai_enabled);
    }
  }, [cfg.data]);

  if (cfg.isLoading) return <TableSkeleton />;
  const c = cfg.data;
  const active = !!c?.ai_enabled && !!c?.n8n_webhook_url;
  const dirty = (c?.n8n_webhook_url ?? "") !== url.trim() || c?.ai_enabled !== enabled;

  async function onSave() {
    setBusy("save");
    try {
      await save({ data: { n8n_webhook_url: url.trim(), ai_enabled: enabled } });
      toast.success("Configuration saved");
      await qc.invalidateQueries({ queryKey: ["chat-config"] });
      qc.invalidateQueries({ queryKey: ["chat", "availability"] });
    } catch (e) {
      toast.error((e as Error).message.replace(/^Not allowed: /, "") || "Could not save");
    } finally {
      setBusy(null);
    }
  }
  async function onTest() {
    setBusy("test");
    setTestResult(null);
    try {
      const r = await test();
      setTestResult(r.ok ? { ok: true, text: `Connected in ${r.ms} ms. Reply: “${(r.reply ?? "").slice(0, 160)}”` } : { ok: false, text: r.error ?? "Connection failed" });
      await qc.invalidateQueries({ queryKey: ["chat-config"] });
    } catch {
      setTestResult({ ok: false, text: "Test could not run. Please try again." });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <PageHeader title="AI Chat / n8n Configuration" description="When no Support Agent is online, customer chats are answered by your n8n workflow. Pick any AI provider inside n8n." />
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Bot className="size-4" /> n8n workflow</CardTitle>
          <CardDescription>Only Admins and Super Admins can see or change this. The URL is never shown to agents or customers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-medium">Status:</span>
            <Badge variant={active ? "default" : "outline"}>{active ? "Active" : "Inactive"}</Badge>
            <span className="text-muted-foreground">Last successful connection: {c?.last_success_at ? `${formatDistanceToNow(new Date(c.last_success_at), { addSuffix: true })}` : "N/A"}</span>
          </div>
          {c?.last_error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2 text-xs">
              <span className="font-semibold text-destructive">Last error</span>
              {c.last_error_at && <span className="text-muted-foreground"> · {format(new Date(c.last_error_at), "MMM d, h:mm a")}</span>}
              <div className="mt-0.5 break-all">{c.last_error}</div>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="n8n-url">n8n Webhook URL</Label>
            <Input id="n8n-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://n8n.example.com/webhook/supportdesk-chat" autoComplete="off" />
            <p className="text-xs text-muted-foreground">
              SupportDesk sends JSON: conversation_id, customer_id, customer_name, customer_email, message, timestamp, source, mode and recent history.
              Reply with {"{"} "reply": "…" {"}"} (or "message"). Add "escalate": true to hand the chat to a human agent.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="ai-enabled" checked={enabled} onCheckedChange={setEnabled} />
            <Label htmlFor="ai-enabled">Enable AI Chat</Label>
          </div>
          <div className="flex flex-wrap gap-2 border-t pt-4">
            <Button onClick={onSave} disabled={busy !== null || !dirty}>{busy === "save" ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save Configuration</Button>
            <Button variant="outline" onClick={onTest} disabled={busy !== null || !c?.n8n_webhook_url || dirty}>
              {busy === "test" ? <Loader2 className="size-4 animate-spin" /> : <PlugZap className="size-4" />} Test Connection
            </Button>
            {dirty && <span className="self-center text-xs text-muted-foreground">Save before testing.</span>}
          </div>
          {testResult && (
            <div className={`flex items-start gap-2 rounded-md border p-2 text-sm ${testResult.ok ? "border-online/40 bg-online/5" : "border-destructive/30 bg-destructive/5"}`}>
              {testResult.ok ? <CheckCircle2 className="mt-0.5 size-4 text-online" /> : <XCircle className="mt-0.5 size-4 text-destructive" />}
              <span className="break-all">{testResult.text}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Agent availability</CardTitle><CardDescription>Only agents set to Online (and active in the last 3 minutes) receive new chats.</CardDescription></CardHeader>
        <CardContent>
          {!staff.data?.length ? <p className="text-sm text-muted-foreground">No staff accounts.</p> : (
            <ul className="divide-y text-sm">
              {staff.data.map((a) => (
                <li key={a.id} className="flex items-center gap-2 py-2">
                  <PresenceDot status={a.status} />
                  <span className="flex-1">{a.full_name || a.email} <span className="text-xs text-muted-foreground">({a.roles.join(", ").replace("super_admin", "super admin")})</span></span>
                  <span className="text-xs capitalize text-muted-foreground">{a.status}</span>
                  <span className="w-20 text-right text-xs text-muted-foreground">{a.active_chats} chats</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">AI / n8n logs</CardTitle><CardDescription>Latest 50 events. Technical details are only visible here.</CardDescription></CardHeader>
        <CardContent>
          {!logs.data?.length ? <p className="text-sm text-muted-foreground">No events yet.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-muted-foreground"><tr className="border-b"><th className="py-1.5 text-left">Time</th><th className="text-left">Event</th><th className="text-left">HTTP</th><th className="text-left">Duration</th><th className="text-left">Detail</th></tr></thead>
                <tbody>
                  {logs.data.map((l) => (
                    <tr key={l.id} className="border-b align-top last:border-0">
                      <td className="whitespace-nowrap py-1.5 pr-2">{format(new Date(l.created_at), "MMM d, HH:mm:ss")}</td>
                      <td className="pr-2"><span className={l.level === "error" ? "font-semibold text-destructive" : ""}>{l.event}</span></td>
                      <td className="pr-2">{l.http_status ?? "—"}</td>
                      <td className="pr-2">{l.duration_ms != null ? `${l.duration_ms} ms` : "—"}</td>
                      <td className="max-w-md break-all">{l.detail ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
