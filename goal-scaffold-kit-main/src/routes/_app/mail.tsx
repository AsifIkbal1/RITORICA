import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Inbox, Link2, Loader2, Mail, Paperclip, PenSquare, Reply, Send, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { friendlyError, formatBytes, MAX_FILE_MB } from "@/lib/constants";
import {
  MAIL_FROM, MAIL_TO, techSupportReplies, formatMinutes, FAST_MINUTES, ON_TIME_MINUTES,
  type MailAttachment, type MailMessage, type ReplySpeed,
} from "@/lib/mail";
import { meta } from "@/components/guard";
import { PortalGate } from "@/components/portal-gate";
import { PageHeader, EmptyState, TableSkeleton } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/mail")({
  head: () => meta("Mail", "Write to tech support, attach files and track how fast they reply."),
  component: () => <PortalGate portal="admin"><MailPage /></PortalGate>,
});

type Thread = { id: string; subject: string; from_address: string; to_address: string; created_at: string; last_message_at: string };

function SpeedBadge({ s }: { s: ReplySpeed | null | undefined }) {
  if (!s) return <Badge variant="outline" className="text-[10px] text-muted-foreground">Waiting</Badge>;
  return (
    <Badge
      variant="outline"
      className={cn("text-[10px]",
        s.label === "Fast" && "border-[color:var(--st-solved)] text-[color:var(--st-solved)]",
        s.label === "On time" && "border-[color:var(--st-awaiting)] text-[color:var(--st-awaiting)]",
        s.label === "Late" && "border-destructive text-destructive")}
    >
      {s.label} · {formatMinutes(s.minutes)}
    </Badge>
  );
}

function useThreads() {
  return useQuery({
    queryKey: ["mail-threads"],
    queryFn: async () => {
      const [t, m] = await Promise.all([
        supabase.from("mail_threads").select("id, subject, from_address, to_address, created_at, last_message_at").order("last_message_at", { ascending: false }).limit(200),
        supabase.from("mail_messages").select("id, thread_id, from_address, created_at").order("created_at").limit(5000),
      ]);
      if (t.error) throw t.error;
      if (m.error) throw m.error;
      const byThread = new Map<string, { id: string; from_address: string; created_at: string }[]>();
      for (const x of m.data ?? []) byThread.set(x.thread_id, [...(byThread.get(x.thread_id) ?? []), x]);
      return (t.data as Thread[]).map((th) => {
        const replies = techSupportReplies(byThread.get(th.id) ?? []);
        return { ...th, count: byThread.get(th.id)?.length ?? 0, lastSpeed: replies.at(-1) ?? null };
      });
    },
  });
}

function useMessages(threadId: string | null) {
  return useQuery({
    queryKey: ["mail-messages", threadId],
    enabled: !!threadId,
    queryFn: async () => {
      const { data, error } = await supabase.from("mail_messages").select("*").eq("thread_id", threadId!).order("created_at");
      if (error) throw error;
      return data as unknown as MailMessage[];
    },
  });
}

async function uploadFiles(threadId: string, files: File[]): Promise<MailAttachment[]> {
  const out: MailAttachment[] = [];
  for (const f of files) {
    const safe = f.name.replace(/[^\w.-]+/g, "_").slice(-120);
    const path = `${threadId}/${crypto.randomUUID()}-${safe}`;
    const { error } = await supabase.storage.from("mail-attachments").upload(path, f, { contentType: f.type || "application/octet-stream" });
    if (error) throw error;
    out.push({ path, name: f.name, size: f.size, type: f.type });
  }
  return out;
}

function parseLinks(raw: string) {
  return raw.split(/\s+/).map((s) => s.trim()).filter(Boolean);
}

function validLinks(links: string[]) {
  return links.every((l) => /^https:\/\/[^\s]+$/i.test(l) && l.length <= 1000);
}

function Composer({ onSend, busy, submitLabel }: { onSend: (body: string, files: File[], links: string[]) => Promise<void>; busy: boolean; submitLabel: string }) {
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState("");
  const input = useRef<HTMLInputElement>(null);
  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        const l = parseLinks(links);
        if (!body.trim() && !files.length && !l.length) return void toast.error("Write a message or attach something.");
        if (!validLinks(l)) return void toast.error("Links must start with https://");
        if (files.some((f) => f.size > MAX_FILE_MB * 1024 * 1024)) return void toast.error(`Each file must be under ${MAX_FILE_MB} MB.`);
        try {
          await onSend(body.trim(), files, l);
        } catch {
          return; // keep what was typed so it can be retried
        }
        setBody(""); setFiles([]); setLinks("");
      }}
    >
      <Textarea rows={6} maxLength={20000} placeholder="Write your message…" value={body} onChange={(e) => setBody(e.target.value)} />
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs"><Link2 className="size-3.5" /> Google Drive or other links (optional, one per line)</Label>
        <Textarea rows={2} placeholder="https://drive.google.com/…" value={links} onChange={(e) => setLinks(e.target.value)} />
      </div>
      {!!files.length && (
        <ul className="flex flex-wrap gap-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1 text-xs">
              <Paperclip className="size-3" /> {f.name} <span className="text-muted-foreground">{formatBytes(f.size)}</span>
              <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles(files.filter((_, j) => j !== i))}><X className="size-3" /></button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center justify-between gap-2">
        <input ref={input} type="file" multiple hidden onChange={(e) => { setFiles([...files, ...Array.from(e.target.files ?? [])].slice(0, 10)); e.target.value = ""; }} />
        <Button type="button" variant="outline" size="sm" onClick={() => input.current?.click()}><Paperclip className="size-4" /> Attach images or files</Button>
        <Button type="submit" disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} {submitLabel}</Button>
      </div>
    </form>
  );
}

function AttachmentLink({ a }: { a: MailAttachment }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-xs hover:bg-muted"
      onClick={async () => {
        const { data, error } = await supabase.storage.from("mail-attachments").createSignedUrl(a.path, 120);
        if (error || !data) return void toast.error("Could not open the file.");
        window.open(data.signedUrl, "_blank", "noopener");
      }}
    >
      <Paperclip className="size-3" /> {a.name} <span className="text-muted-foreground">{formatBytes(a.size)}</span>
    </button>
  );
}

function MailPage() {
  const qc = useQueryClient();
  const { session } = useAuth();
  const threads = useThreads();
  const [selected, setSelected] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [busy, setBusy] = useState(false);
  const [replyAs, setReplyAs] = useState<"tech" | "other">("tech");
  const messages = useMessages(selected);
  const thread = threads.data?.find((t) => t.id === selected) ?? null;
  const replies = useMemo(() => techSupportReplies(messages.data ?? []), [messages.data]);
  const speedById = useMemo(() => new Map(replies.map((r) => [r.messageId, r])), [replies]);

  useEffect(() => {
    const first = threads.data?.[0];
    if (!selected && first) setSelected(first.id);
  }, [threads.data, selected]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["mail-threads"] });
    qc.invalidateQueries({ queryKey: ["mail-messages"] });
  };

  async function addMessage(threadId: string, fromTech: boolean, body: string, files: File[], links: string[]) {
    const attachments = files.length ? await uploadFiles(threadId, files) : [];
    const { error } = await supabase.from("mail_messages").insert({
      thread_id: threadId,
      direction: fromTech ? "outbound" : "inbound",
      from_address: fromTech ? MAIL_FROM : MAIL_TO,
      to_address: fromTech ? MAIL_TO : MAIL_FROM,
      body,
      links,
      attachments,
      delivery_status: fromTech ? "recorded" : "received",
      created_by: session?.user.id ?? null,
    });
    if (error) throw error;
  }

  const stats = useMemo(() => {
    const all = (threads.data ?? []).map((t) => t.lastSpeed).filter(Boolean) as ReplySpeed[];
    return { fast: all.filter((s) => s.label === "Fast").length, onTime: all.filter((s) => s.label === "On time").length, late: all.filter((s) => s.label === "Late").length };
  }, [threads.data]);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Mail"
        description={`From ${MAIL_FROM} to ${MAIL_TO}. Replies show here, with how fast tech.support answered.`}
        actions={<Button onClick={() => { setSubject(""); setComposeOpen(true); }}><PenSquare className="size-4" /> New mail</Button>}
      />
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <Badge variant="outline">Fast (≤ {FAST_MINUTES} min): {stats.fast}</Badge>
        <Badge variant="outline">On time (≤ {ON_TIME_MINUTES / 60} h): {stats.onTime}</Badge>
        <Badge variant="outline">Late (&gt; {ON_TIME_MINUTES / 60} h): {stats.late}</Badge>
      </div>
      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <div className="overflow-hidden rounded-lg border bg-card shadow-card">
          <div className="flex items-center gap-2 border-b px-3 py-2 text-sm font-semibold"><Inbox className="size-4" /> Conversations</div>
          {threads.isLoading ? <TableSkeleton /> : !threads.data?.length ? (
            <div className="p-4"><EmptyState title="No mail yet" description="Write your first mail with the New mail button." /></div>
          ) : (
            <ul className="max-h-[70vh] divide-y overflow-y-auto">
              {threads.data.map((t) => (
                <li key={t.id}>
                  <button type="button" onClick={() => setSelected(t.id)}
                    className={cn("block w-full px-3 py-2.5 text-left transition-colors hover:bg-muted", selected === t.id && "bg-accent/60")}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">{t.subject}</span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(t.last_message_at), { addSuffix: true })}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">{t.count} message{t.count === 1 ? "" : "s"}</span>
                      <SpeedBadge s={t.lastSpeed} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="min-w-0 rounded-lg border bg-card shadow-card">
          {!thread ? (
            <div className="p-8"><EmptyState title="Select a conversation" description="Pick a mail on the left, or write a new one." /></div>
          ) : (
            <div className="flex flex-col">
              <div className="border-b px-4 py-3">
                <h2 className="text-base font-semibold">{thread.subject}</h2>
                <p className="text-xs text-muted-foreground">From {thread.from_address} · To {thread.to_address}</p>
              </div>
              <div className="max-h-[55vh] space-y-3 overflow-y-auto p-4">
                {messages.isLoading ? <TableSkeleton /> : messages.data?.map((m) => {
                  const fromTech = m.from_address.toLowerCase() === MAIL_FROM;
                  const sp = speedById.get(m.id);
                  return (
                    <article key={m.id} className={cn("rounded-lg border p-3", fromTech ? "bg-accent/40" : "bg-background")}>
                      <header className="mb-1.5 flex flex-wrap items-center gap-2 text-xs">
                        <Mail className="size-3.5 text-muted-foreground" />
                        <span className="font-medium">{m.from_address}</span>
                        <span className="text-muted-foreground">→ {m.to_address}</span>
                        <span className="ml-auto text-muted-foreground">{format(new Date(m.created_at), "MMM d, yyyy HH:mm")}</span>
                      </header>
                      {m.body && <p className="whitespace-pre-wrap text-sm">{m.body}</p>}
                      {!!m.links.length && (
                        <ul className="mt-2 space-y-1">
                          {m.links.map((l) => <li key={l}><a href={l} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 break-all text-xs text-primary hover:underline"><Link2 className="size-3" />{l}</a></li>)}
                        </ul>
                      )}
                      {!!m.attachments.length && <div className="mt-2 flex flex-wrap gap-2">{m.attachments.map((a) => <AttachmentLink key={a.path} a={a} />)}</div>}
                      <footer className="mt-2 flex flex-wrap items-center gap-2">
                        {sp && <SpeedBadge s={sp} />}
                        {m.delivery_status === "recorded" && <span className="text-[11px] text-muted-foreground">Saved here — will be emailed once the mailbox is connected</span>}
                        {m.delivery_status === "failed" && <span className="text-[11px] text-destructive">Sending failed</span>}
                      </footer>
                    </article>
                  );
                })}
              </div>
              <div className="border-t p-4">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                  <Reply className="size-3.5" />
                  <span className="text-muted-foreground">Add a message from</span>
                  {([["tech", MAIL_FROM], ["other", MAIL_TO]] as const).map(([k, addr]) => (
                    <button key={k} type="button" onClick={() => setReplyAs(k)}
                      className={cn("rounded-full border px-2.5 py-0.5", replyAs === k ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted")}>
                      {addr}
                    </button>
                  ))}
                </div>
                <Composer
                  busy={busy}
                  submitLabel={replyAs === "tech" ? "Send reply" : "Save received reply"}
                  onSend={async (body, files, links) => {
                    setBusy(true);
                    try {
                      await addMessage(thread.id, replyAs === "tech", body, files, links);
                      refresh();
                      toast.success(replyAs === "tech" ? "Reply saved" : "Received reply saved");
                    } catch (e) {
                      toast.error(friendlyError(e));
                      throw e;
                    } finally { setBusy(false); }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>New mail</DialogTitle></DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>From</Label><Input value={MAIL_FROM} readOnly disabled /></div>
            <div className="space-y-1.5"><Label>To</Label><Input value={MAIL_TO} readOnly disabled /></div>
          </div>
          <div className="space-y-1.5"><Label htmlFor="mail-subject">Subject</Label><Input id="mail-subject" maxLength={300} value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
          <Composer
            busy={busy}
            submitLabel="Send"
            onSend={async (body, files, links) => {
              if (subject.trim().length < 2) { toast.error("Write a subject."); throw new Error("subject"); }
              setBusy(true);
              try {
                const { data: th, error } = await supabase.from("mail_threads")
                  .insert({ subject: subject.trim(), from_address: MAIL_FROM, to_address: MAIL_TO, created_by: session?.user.id ?? null })
                  .select("id").single();
                if (error) throw error;
                await addMessage(th.id, true, body, files, links);
                refresh();
                setSelected(th.id);
                setComposeOpen(false);
                toast.success("Mail saved");
              } catch (e) {
                if ((e as Error).message !== "subject") toast.error(friendlyError(e));
                throw e;
              } finally { setBusy(false); }
            }}
          />
          <DialogFooter className="text-xs text-muted-foreground sm:justify-start">
            Mail is saved here now. Real email delivery starts once the mailbox is connected.
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
