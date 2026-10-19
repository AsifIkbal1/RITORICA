import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  ArrowLeft, Download, Eye, FileText, Loader2, Lock, Mail, Phone, Send, StickyNote, Trash2, User, History, Sparkles, X, ChevronUp, Bot, RotateCcw, Printer,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { STATUSES, PRIORITIES, SLA_LEVELS, friendlyError, formatBytes, roleLabel, type TicketStatus, type TicketPriority } from "@/lib/constants";
import { publishNotification } from "@/lib/notifications";
import { useCategories, useDepartments, useStaff } from "@/lib/lookups";
import { uploadAttachments, BUCKET, type UploadState } from "@/lib/attachments";
import { getAttachmentLink, deleteAttachment, getTicketAttachmentsFn } from "@/lib/attachments.functions";
import {
  getTicketByIdFn,
  updateTicketFn,
  sendTicketMessageFn,
  deleteTicketFn,
  getTicketMessagesFn,
  reclassifyTicketPriorityFn,
  escalateTicketFn,
} from "@/lib/tickets.functions";
import type { AiClassificationResult } from "@/lib/ai-priority-classifier.server";
import { AiDraftPanel } from "@/components/ai-draft-panel";
import { SlaCountdownBar } from "@/components/sla-indicator";
import { CannedResponsePicker } from "@/components/canned-response-picker";
import { CsatSurveyCard, CompactCsatScore } from "@/components/csat-survey";
import { CollisionBanner } from "@/components/collision-banner";
import { TicketProgressTracker } from "@/components/ticket-progress-tracker";
import { MergeTicketDialog } from "@/components/merge-ticket-dialog";
import { SentimentCard, CompactSentimentBadge } from "@/components/sentiment-card";
import { TicketTags } from "@/components/ticket-tags";
import { TicketSnoozeDialog } from "@/components/ticket-snooze-dialog";
import { TicketExtras } from "@/components/ticket-extras";
import { StatusBadge, PriorityBadge, TicketId } from "@/components/badges";
import { ErrorState, EmptyState } from "@/components/states";
import { FilePicker } from "@/components/file-picker";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Database } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/tickets/$id")({
  head: () => ({
    meta: [
      { title: "Ticket — SupportDesk" },
      { name: "description", content: "Ticket conversation and details." },
      { property: "og:title", content: "Ticket — SupportDesk" },
      { property: "og:description", content: "Ticket conversation and details." },
    ],
  }),
  component: TicketPage,
});

type Attachment = { id: string; message_id: string | null; original_filename: string; storage_path: string; file_type: string; file_size: number; uploaded_by: string | null };

const PAGE = 30;

function useTicket(id: string, limit: number) {
  return useQuery({
    queryKey: ["ticket", id, limit],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      let ticketData: any = null;
      try {
        ticketData = await getTicketByIdFn({ data: { id } });
      } catch {}

      if (!ticketData) {
        try {
          const t = await supabase
            .from("tickets")
            .select("*, category:categories(name), department:departments(name)")
            .eq("id", id)
            .maybeSingle();
          if (t.data) ticketData = t.data;
        } catch {}
      }

      if (!ticketData) return null;

      let msgsList: any[] = [];
      let msgsCount = 0;
      let actList: any[] = [];
      try {
        const [msgs, act] = await Promise.all([
          supabase.from("ticket_messages").select("*", { count: "exact" }).eq("ticket_id", id).order("created_at", { ascending: false }).limit(limit),
          supabase.from("ticket_activity").select("*").eq("ticket_id", id).order("created_at", { ascending: false }).limit(50),
        ]);
        if (msgs.data) {
          msgsList = [...msgs.data];
          msgsCount = msgs.count ?? msgs.data.length;
        }
        if (act.data) actList = act.data;
      } catch {}

      try {
        const localMsgs = await getTicketMessagesFn({ data: { ticket_id: id } });
        for (const lm of localMsgs) {
          if (!msgsList.some((m) => m.id === lm.id)) {
            msgsList.push(lm);
            msgsCount++;
          }
        }
      } catch {}

      msgsList.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      let attsData: any[] = [];
      try {
        const locals = await getTicketAttachmentsFn({ data: { ticketId: id } });
        if (locals && locals.length) attsData.push(...locals);
      } catch {}

      try {
        const ids = msgsList.map((m) => m.id);
        const atts = await supabase
          .from("ticket_attachments")
          .select("id, message_id, original_filename, storage_path, file_type, file_size, uploaded_by")
          .eq("ticket_id", id)
          .or(ids.length ? `message_id.is.null,message_id.in.(${ids.join(",")})` : "message_id.is.null")
          .order("created_at");
        if (atts.data) {
          for (const a of atts.data) {
            if (!attsData.some((x) => x.id === a.id)) {
              attsData.push(a);
            }
          }
        }
      } catch {}

      const userIds = [
        ...new Set([ticketData.customer_id, ticketData.assigned_agent_id, ...msgsList.map((m) => m.sender_id), ...actList.map((a) => a.user_id)].filter(Boolean) as string[]),
      ];

      let people = new Map();
      let roleMap = new Map();
      try {
        const [profiles, roles] = await Promise.all([
          supabase.from("profiles").select("id, full_name, email, phone, avatar_url").in("id", userIds),
          supabase.from("user_roles").select("user_id, role").in("user_id", userIds),
        ]);
        people = new Map((profiles.data ?? []).map((p) => [p.id, p]));
        roleMap = new Map((roles.data ?? []).map((r) => [r.user_id, r.role]));
      } catch {}

      if (ticketData.customer_id && !people.has(ticketData.customer_id)) {
        people.set(ticketData.customer_id, {
          id: ticketData.customer_id,
          full_name: ticketData.customer_name || "demo_test",
          email: ticketData.customer_email || `${ticketData.customer_name || "demo_test"}@ritorica.invalid`,
          phone: ticketData.customer_phone || "",
          avatar_url: null,
        });
      }
      if (!people.has("00000000-0000-0000-0000-000000000001")) {
        people.set("00000000-0000-0000-0000-000000000001", {
          id: "00000000-0000-0000-0000-000000000001",
          full_name: "Asif Ikbal (Admin)",
          email: "admin@ritorica.com.bd",
          phone: "+8801805991950",
          avatar_url: null,
        });
      }
      if (!people.has("00000000-0000-0000-0000-000000000002")) {
        people.set("00000000-0000-0000-0000-000000000002", {
          id: "00000000-0000-0000-0000-000000000002",
          full_name: "Support Agent",
          email: "support.agent@ritorica.com.bd",
          phone: "+8801805991951",
          avatar_url: null,
        });
      }

      const roleOf = (uid: string | null) => {
        if (!uid) return "customer" as const;
        if (uid === "00000000-0000-0000-0000-000000000001") return "admin" as const;
        if (uid === "00000000-0000-0000-0000-000000000002") return "agent" as const;
        if (uid === ticketData.customer_id) return "customer" as const;
        const r = roleMap.get(uid);
        if (r) return r as any;
        return "customer" as const;
      };

      return { ticket: ticketData, messages: msgsList, hasMore: msgsCount > msgsList.length, attachments: attsData as Attachment[], activity: actList, people, roleOf };
    },
  });
}

function TicketPage() {
  const { id } = Route.useParams();
  const [limit, setLimit] = useState(PAGE);
  const q = useTicket(id, limit);
  const { isStaff } = useAuth();

  if (q.isLoading)
    return (
      <div className="mx-auto max-w-7xl space-y-4">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]"><Skeleton className="h-96" /><Skeleton className="h-96" /></div>
      </div>
    );
  if (q.isError) return <ErrorState onRetry={() => q.refetch()} />;
  if (!q.data)
    return (
      <EmptyState
        title="Ticket not found"
        description="This ticket doesn't exist or you don't have access to it."
        action={<Button asChild variant="outline"><Link to="/tickets">Back to tickets</Link></Button>}
      />
    );

  const { ticket: t, messages, hasMore, attachments, activity, people, roleOf } = q.data;
  const agent = t.assigned_agent_id ? people.get(t.assigned_agent_id) : null;
  const { profile } = useAuth();

  async function handleEscalate() {
    if (!confirm(`Are you sure you want to escalate ticket #${t.ticket_number} to L1 Urgent priority?`)) return;
    try {
      await escalateTicketFn({
        data: {
          ticket_id: t.id,
          reason: "Manual SLA Escalation to L1 Urgent",
          escalated_by: profile?.full_name || "Support Staff",
        },
      });
      toast.success(`Ticket #${t.ticket_number} escalated to L1 Urgent!`);
      q.refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to escalate ticket.");
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <Link to="/tickets" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> All tickets
      </Link>

      {/* Collision Detection Banner (Staff only) */}
      {isStaff && <CollisionBanner ticketId={t.id} />}

      <div className="rounded-lg border bg-card p-5 shadow-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <TicketId value={t.ticket_number} />
            <StatusBadge status={t.status} />
            <PriorityBadge priority={t.priority} />
            <CompactCsatScore rating={t.csat_rating} />
            <CompactSentimentBadge sentiment={t.sentiment} />
          </div>

          <div className="flex items-center gap-2">
            {isStaff && <TicketSnoozeDialog ticket={t} onSnoozed={() => q.refetch()} />}
            {isStaff && (
              <MergeTicketDialog
                currentTicket={{
                  id: t.id,
                  ticket_number: t.ticket_number,
                  subject: t.subject,
                  customer_id: t.customer_id,
                  customer_name: t.customer_name,
                }}
                onMerged={() => q.refetch()}
              />
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => window.print()}
            >
              <Printer className="size-3.5" />
              <span>Print / PDF</span>
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-xl font-semibold sm:text-2xl">{t.subject}</h1>
          <TicketTags ticketId={t.id} tags={t.tags || []} isStaff={isStaff} onChange={() => q.refetch()} />
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-3 lg:grid-cols-6 border-y py-3">
          {[
            ["Customer", t.customer_name],
            ["Assigned agent", agent?.full_name ?? (t.assigned_agent_id ? "Support Team" : "Unassigned")],
            ["Department", t.department?.name ?? "—"],
            ["Category", t.category?.name ?? "—"],
            ["Created", format(new Date(t.created_at), "MMM d, yyyy HH:mm")],
            ["Updated", format(new Date(t.updated_at), "MMM d, yyyy HH:mm")],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="mt-0.5 truncate font-medium">{v}</dd>
            </div>
          ))}
        </dl>

        {/* Live SLA Countdown & Auto-Escalation Bar */}
        <SlaCountdownBar
          ticket={{
            id: t.id,
            priority: t.priority,
            status: t.status,
            created_at: t.created_at,
            ticket_number: t.ticket_number,
          }}
          isStaff={isStaff}
          onEscalate={handleEscalate}
        />

        {/* Visual Customer Workflow Progress Tracker */}
        <TicketProgressTracker
          status={t.status}
          isAssigned={!!t.assigned_agent_id}
          isCustomer={!isStaff}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-4">
          {/* Customer Satisfaction Feedback Prompt / Score */}
          <CsatSurveyCard ticket={t} isStaff={isStaff} onRated={() => q.refetch()} />

          <Conversation t={t} messages={messages} attachments={attachments} people={people} roleOf={roleOf} onChange={() => q.refetch()}
            hasMore={hasMore} loadingMore={q.isFetching} onLoadMore={() => setLimit((l) => l + PAGE)} />
          <ReplyBox ticket={t} ticketId={t.id} status={t.status} seedQuery={`${t.subject}\n${t.description}`.slice(0, 1000)} onSent={() => q.refetch()} />
        </div>
        <aside className="space-y-4">
          {isStaff && <SentimentCard sentiment={t.sentiment} />}
          {isStaff && <AiClassificationCard ticket={t} onClassified={() => q.refetch()} />}
          {isStaff && <TicketControls t={t} onChange={() => q.refetch()} />}
          {isStaff && (
            <Card className="shadow-card">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Customer</CardTitle></CardHeader>
              <CardContent className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2"><User className="size-4 text-muted-foreground" />
                  <Link to="/customers/$id" params={{ id: t.customer_id }} className="font-medium hover:text-primary">{t.customer_name}</Link>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="size-4" /> <span className="truncate">{t.customer_email}</span></div>
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="size-4" /> {t.customer_phone ?? "—"}</div>
              </CardContent>
            </Card>
          )}
          <TicketExtras ticketId={t.id} values={t.custom_fields} />
          <Card className="shadow-card">
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm"><History className="size-4" /> History</CardTitle></CardHeader>
            <CardContent>
              <ol className="relative space-y-3 border-l pl-4">
                {activity.map((a) => (
                  <li key={a.id} className="text-xs">
                    <span className={cn("absolute -left-[5px] mt-1 size-2.5 rounded-full border-2 border-card", a.is_internal ? "bg-note-foreground" : "bg-primary")} />
                    <div className="font-medium">{a.description}</div>
                    <div className="text-muted-foreground">
                      {a.user_id ? people.get(a.user_id)?.full_name ?? "System" : "System"} · {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                      {a.is_internal && <span className="ml-1 text-note-foreground">· internal</span>}
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

type People = Map<string, { id: string; full_name: string; email: string; avatar_url: string | null }>;

function Conversation({ t, messages, attachments, people, roleOf, onChange, hasMore, loadingMore, onLoadMore }: {
  t: { id: string; customer_id: string; customer_name: string; description: string; created_at: string };
  messages: { id: string; sender_id: string | null; message: string; message_type: string; created_at: string }[];
  attachments: Attachment[];
  people: People;
  roleOf: (u: string | null) => string | undefined;
  onChange: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}) {
  const items = [
    { id: "initial", sender_id: t.customer_id, message: t.description, message_type: "customer_reply", created_at: t.created_at, attKey: null as string | null },
    ...messages.map((m) => ({ ...m, attKey: m.id })),
  ];
  return (
    <div className="space-y-3">
      {items.map((m, idx) => {
        const note = m.message_type === "internal_note";
        const staff = m.message_type === "agent_reply" || note;
        const who = m.sender_id ? people.get(m.sender_id) : null;
        const role = roleOf(m.sender_id);
        const files = attachments.filter((a) => a.message_id === m.attKey);
        return (
          <div key={m.id} className="space-y-3">
          <article
            className={cn(
              "rounded-lg border p-4 shadow-card",
              note ? "border-dashed bg-note" : staff ? "border-l-4 border-l-primary bg-bubble-staff" : "bg-bubble-customer",
            )}
          >
            <header className="mb-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-sm font-semibold">{who?.full_name ?? (m.sender_id === t.customer_id ? t.customer_name : staff ? "Support Team" : "Unknown")}</span>
              <span className={cn("rounded px-1.5 py-0.5 font-medium", staff ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                {role ? roleLabel(role) : staff ? "Support" : "Customer"}
              </span>
              {note && <span className="inline-flex items-center gap-1 rounded bg-note-foreground/15 px-1.5 py-0.5 font-semibold text-note-foreground"><Lock className="size-3" /> Internal Note</span>}
              <time className="ml-auto text-muted-foreground" title={format(new Date(m.created_at), "PPpp")}>{format(new Date(m.created_at), "MMM d, yyyy · HH:mm")}</time>
            </header>
            <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">{m.message}</div>
            {!!files.length && <AttachmentList files={files} onChange={onChange} />}
          </article>
          {idx === 0 && hasMore && (
            <div className="flex justify-center">
              <Button variant="outline" size="sm" disabled={loadingMore} onClick={onLoadMore}>
                {loadingMore ? <Loader2 className="size-4 animate-spin" /> : <ChevronUp className="size-4" />} Load earlier messages
              </Button>
            </div>
          )}
          </div>
        );
      })}
    </div>
  );
}

const isText = (t: string) => t.startsWith("text/");
const canPreview = (t: string) => t.startsWith("image/") || t === "application/pdf" || isText(t);

function AttachmentList({ files, onChange }: { files: Attachment[]; onChange: () => void }) {
  const { session, isAdmin } = useAuth();
  const getLink = useServerFn(getAttachmentLink);
  const remove = useServerFn(deleteAttachment);
  const [preview, setPreview] = useState<{ id: string; url: string | null; name: string; type: string; text?: string; loading: boolean } | null>(null);

  async function openPreview(f: Attachment) {
    setPreview({ id: f.id, url: null, name: f.original_filename, type: f.file_type, loading: canPreview(f.file_type) });
    if (!canPreview(f.file_type)) return;
    try {
      const r = await getLink({ data: { id: f.id, download: false } });
      let text: string | undefined;
      if (isText(f.file_type)) {
        const res = await fetch(r.url);
        text = (await res.text()).slice(0, 200_000);
      }
      setPreview((p) => (p?.id === f.id ? { ...p, url: r.url, loading: false, ...(text !== undefined ? { text } : {}) } : p));
    } catch {
      setPreview(null);
      toast.error("Could not open file.");
    }
  }
  async function download(f: Attachment) {
    try {
      const r = await getLink({ data: { id: f.id, download: true } });
      window.location.assign(r.url);
    } catch {
      toast.error("Could not download file.");
    }
  }

  return (
    <>
      <ul className="mt-3 flex flex-wrap gap-2">
        {files.map((f) => (
          <li key={f.id} className="flex items-center gap-2 rounded-md border bg-card px-2.5 py-1.5 text-xs">
            <FileText className="size-4 text-muted-foreground" />
            <span className="max-w-44 truncate font-medium" title={f.original_filename}>{f.original_filename}</span>
            <span className="text-muted-foreground">{formatBytes(f.file_size)}</span>
            <button className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline" onClick={() => openPreview(f)}><Eye className="size-3.5" /> Preview</button>
            <span className="text-muted-foreground">|</span>
            <button className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline" onClick={() => download(f)}><Download className="size-3.5" /> Download</button>
            {(f.uploaded_by === session?.user.id || isAdmin) && (
              <button aria-label={`Remove ${f.original_filename}`} className="text-muted-foreground hover:text-destructive" onClick={async () => {
                if (!confirm(`Remove ${f.original_filename}?`)) return;
                try {
                  await remove({ data: { id: f.id } });
                  toast.success("Attachment removed");
                  onChange();
                } catch (e) {
                  toast.error(friendlyError(e));
                }
              }}><Trash2 className="size-3.5" /></button>
            )}
          </li>
        ))}
      </ul>
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-4xl">
          <DialogTitle className="truncate pr-6 text-sm">{preview?.name}</DialogTitle>
          {!preview ? null : preview.loading ? (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 size-4 animate-spin" /> Loading preview…</div>
          ) : !canPreview(preview.type) ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 text-sm">
              <p className="text-muted-foreground">Preview not available</p>
              <Button size="sm" onClick={() => { const f = files.find((x) => x.id === preview.id); if (f) void download(f); }}><Download className="size-4" /> Download</Button>
            </div>
          ) : preview.type.startsWith("image/") && preview.url ? (
            <img src={preview.url} alt={preview.name} className="max-h-[75vh] w-full object-contain" />
          ) : preview.text !== undefined ? (
            <pre className="max-h-[75vh] overflow-auto whitespace-pre-wrap break-words rounded border bg-muted p-3 font-mono text-xs">{preview.text}</pre>
          ) : preview.url ? (
            <iframe src={preview.url} title={preview.name} className="h-[75vh] w-full rounded border" />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ReplyBox({ ticket, ticketId, status, seedQuery, onSent }: { ticket?: any; ticketId: string; status: TicketStatus; seedQuery: string; onSent: () => void }) {
  const { session, isStaff, can } = useAuth();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [after, setAfter] = useState<string>("auto");
  const [busy, setBusy] = useState<null | "reply" | "note">(null);
  const [uploads, setUploads] = useState<Record<number, UploadState>>({});
  const [aiOpen, setAiOpen] = useState(false);
  const [aiDraft, setAiDraft] = useState<{ id: string; content: string } | null>(null);
  const canAi = isStaff && can("tickets.ai_draft");
  const isTyping = text.trim().length > 0;

  async function send(kind: "reply" | "note") {
    if (!session) return;
    const body = text.trim();
    if (!body) return void toast.error("Write a message first.");
    if (body.length > 20000) return void toast.error("Message is too long.");
    setBusy(kind);
    try {
      const type = kind === "note" ? "internal_note" : isStaff ? "agent_reply" : "customer_reply";
      const senderName = isStaff ? ((session.user.user_metadata as any)?.full_name || "Support") : "Customer";
      
      const res = await sendTicketMessageFn({
        data: {
          ticket_id: ticketId,
          sender_id: session.user.id,
          sender_name: senderName,
          message: body,
          message_type: type,
          after_status: isStaff && kind === "reply" && after !== "auto" ? after : undefined,
        },
      });

      if (files.length) {
        try {
          const { failed } = await uploadAttachments(ticketId, res.id, files, (i, st) => setUploads((u) => ({ ...u, [i]: st })));
          if (failed) toast.error(`Message sent, but ${failed} attachment${failed > 1 ? "s" : ""} failed to upload.`);
        } catch {}
      }

      if (aiDraft && kind === "reply") {
        try {
          await supabase.from("ai_reply_drafts").update({
            used: true, edited: body !== aiDraft.content.trim(), sent_message_id: res.id, used_at: new Date().toISOString(),
          }).eq("id", aiDraft.id);
        } catch {}
      }

      setText(""); setFiles([]); setUploads({}); setAfter("auto"); if (kind === "reply") setAiDraft(null);
      toast.success(kind === "note" ? "Internal note added" : "Reply sent");

      if (!isStaff && kind === "reply") {
        publishNotification({
          type: "ticket",
          title: "New Customer Reply",
          message: `Customer replied: "${body.slice(0, 100)}"`,
          ticket_id: ticketId,
          target_role: "admin",
        });
      } else if (isStaff && kind === "reply") {
        publishNotification({
          type: "ticket",
          title: "Support Reply",
          message: `Support replied: "${body.slice(0, 100)}"`,
          ticket_id: ticketId,
          target_role: "customer",
        });
      }

      qc.invalidateQueries({ queryKey: ["ticket", ticketId] });
      qc.invalidateQueries({ queryKey: ["tickets"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["dash-tickets"] });
      onSent();
    } catch (e) {
      toast.error((e as Error)?.message || friendlyError(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <Card className="shadow-card">
      <CardContent className="space-y-3 pt-5">
        {/* Dynamic Collision Indicator when typing */}
        {isStaff && isTyping && (
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 italic">
            <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
            Your draft is active. Other team members are notified that you are currently replying.
          </div>
        )}
        {!isStaff && (status === "solved" || status === "closed") && (
          <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">This ticket is {status}. Replying will reopen it.</p>
        )}
        {canAi && aiOpen && (
          <AiDraftPanel
            ticketId={ticketId}
            seedQuery={seedQuery}
            onClose={() => setAiOpen(false)}
            onUse={(d) => { setAiDraft(d); setText(d.content); setAiOpen(false); toast.success("Draft added to your reply — review it, then click Send Reply."); }}
          />
        )}
        {aiDraft && (
          <div className="flex items-center gap-2 rounded-md bg-chat-ai/10 px-2.5 py-1.5 text-xs text-chat-ai">
            <Sparkles className="size-3.5" /> <span className="font-semibold">AI Draft</span>
            <span className="text-muted-foreground">Edit freely. Nothing is sent until you click Send Reply.</span>
            <button className="ml-auto inline-flex items-center gap-1 text-muted-foreground hover:text-destructive" onClick={() => { setAiDraft(null); setText(""); }}><X className="size-3.5" /> Discard</button>
          </div>
        )}
        <Textarea rows={aiDraft ? 10 : 5} value={text} onChange={(e) => setText(e.target.value)} placeholder={isStaff ? "Write a reply to the customer, or an internal note for the team… (use Quick Replies for instant macros)" : "Write a reply…"} />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <FilePicker files={files} onChange={setFiles} states={uploads} disabled={!!busy} />
          <div className="flex flex-wrap items-center gap-2">
            {isStaff && (
              <CannedResponsePicker
                ticket={{
                  ticket_number: ticket?.ticket_number,
                  subject: ticket?.subject,
                  customer_name: ticket?.customer_name,
                }}
                agentName={(session?.user.user_metadata as any)?.full_name || "Support Staff"}
                onSelect={(inserted) =>
                  setText((prev) => (prev ? `${prev}\n\n${inserted}` : inserted))
                }
              />
            )}
            {canAi && !aiOpen && (
              <Button variant="outline" className="border-chat-ai/40 text-chat-ai hover:text-chat-ai" onClick={() => setAiOpen(true)}>
                <Sparkles className="size-4" /> Draft Reply with AI
              </Button>
            )}
            {isStaff && can("tickets.change_status") && (
              <Select value={after} onValueChange={setAfter}>
                <SelectTrigger className="h-9 w-52"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Status: automatic</SelectItem>
                  <SelectItem value="awaiting_user_reply">Then: Awaiting User Reply</SelectItem>
                  <SelectItem value="in_progress">Then: In Progress</SelectItem>
                  <SelectItem value="solved">Then: Solved</SelectItem>
                </SelectContent>
              </Select>
            )}
            {isStaff && can("tickets.internal_note") && (
              <Button variant="outline" disabled={!!busy} onClick={() => send("note")}>
                {busy === "note" ? <Loader2 className="size-4 animate-spin" /> : <StickyNote className="size-4" />} Add Internal Note
              </Button>
            )}
            <Button disabled={!!busy} onClick={() => send("reply")}>
              {busy === "reply" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Send Reply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AiClassificationCard({ ticket, onClassified }: { ticket: any; onClassified?: () => void }) {
  const [reclassifying, setReclassifying] = useState(false);
  const qc = useQueryClient();
  const ai: AiClassificationResult | null =
    ticket.ai_classification || ticket.custom_fields?._ai_classification || null;

  async function handleReclassify() {
    setReclassifying(true);
    try {
      const res = await reclassifyTicketPriorityFn({ data: { ticket_id: ticket.id } });
      toast.success(`AI SLA Classification: ${res.ai_classification.sla_code} (${res.priority.toUpperCase()})`);
      qc.invalidateQueries({ queryKey: ["ticket", ticket.id] });
      qc.invalidateQueries({ queryKey: ["tickets"] });
      onClassified?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze ticket");
    } finally {
      setReclassifying(false);
    }
  }

  if (!ai) {
    return (
      <Card className="border-primary/20 bg-primary/5 shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 font-semibold text-primary">
              <Bot className="size-4" /> AI Priority Engine
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-xs"
              onClick={handleReclassify}
              disabled={reclassifying}
            >
              {reclassifying ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3 text-primary" />}
              Classify SLA
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            No AI SLA classification recorded yet. Click to evaluate against PMBOK & Ritorica SLA standards.
          </p>
        </CardContent>
      </Card>
    );
  }

  const slaColor =
    ai.sla_code === "P1"
      ? "bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400"
      : ai.sla_code === "P2"
      ? "bg-orange-500/10 text-orange-600 border-orange-500/30 dark:text-orange-400"
      : ai.sla_code === "P3"
      ? "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400"
      : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400";

  return (
    <Card className="border-primary/20 shadow-card bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <Bot className="size-4 text-primary" /> AI SLA Classification
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-bold ${slaColor}`}>
              {ai.sla_code} · {ai.incident_priority.toUpperCase()}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={handleReclassify}
              disabled={reclassifying}
              title="Re-run AI SLA Classification"
            >
              <RotateCcw className={`size-3.5 ${reclassifying ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 text-xs">
        <div className="rounded-md bg-muted/60 p-2.5 space-y-1 border">
          <div className="font-semibold text-foreground flex items-center justify-between">
            <span>SLA Response Target:</span>
            <span className="text-primary font-bold">
              {ai.response_target_minutes ? `${ai.response_target_minutes} minutes` : "To be confirmed"}
            </span>
          </div>
          {ai.resolution_target && (
            <div className="text-muted-foreground flex items-center justify-between">
              <span>Resolution Target:</span>
              <span className="font-medium text-foreground">{ai.resolution_target}</span>
            </div>
          )}
          <div className="text-muted-foreground flex items-center justify-between">
            <span>Support Availability:</span>
            <span className="font-medium text-foreground">{ai.support_availability}</span>
          </div>
        </div>

        <div className="space-y-0.5">
          <span className="font-semibold text-muted-foreground">Affected Service & Category:</span>
          <p className="text-foreground font-medium">{ai.affected_service} ({ai.problem_category})</p>
        </div>

        <div className="space-y-0.5">
          <span className="font-semibold text-muted-foreground">Business Impact:</span>
          <p className="text-foreground">{ai.business_impact}</p>
        </div>

        <div className="space-y-0.5">
          <span className="font-semibold text-muted-foreground">Evidence-Based Reason:</span>
          <p className="text-muted-foreground leading-relaxed italic">"{ai.classification_reason}"</p>
        </div>

        <div className="space-y-0.5 border-t pt-2">
          <span className="font-semibold text-primary">Required Support Action:</span>
          <p className="text-foreground font-medium">{ai.required_support_action}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TicketControls({ t, onChange }: {
  t: { id: string; ticket_number: string; status: TicketStatus; priority: TicketPriority; category_id: string | null; department_id: string | null; assigned_agent_id: string | null };
  onChange: () => void;
}) {
  const { can, profile, isStaff, portal } = useAuth();
  const cats = useCategories();
  const deps = useDepartments();
  const staff = useStaff();
  const qc = useQueryClient();
  const nav = useNavigate();
  const NONE = "__none";
  const isCustomer = !isStaff;

  async function update(patch: Partial<Database["public"]["Tables"]["tickets"]["Update"]>, msg: string) {
    try {
      await updateTicketFn({
        data: {
          id: t.id,
          status: patch.status,
          priority: patch.priority,
          assigned_agent_id: patch.assigned_agent_id,
          department_id: patch.department_id,
          category_id: patch.category_id,
          caller_role: portal || "visitor",
        },
      });
      toast.success(msg);
      qc.invalidateQueries({ queryKey: ["ticket", t.id] });
      qc.invalidateQueries({ queryKey: ["tickets"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["dash-tickets"] });
      onChange();
    } catch (err) {
      toast.error((err as Error)?.message || friendlyError(err));
    }
  }

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1"><Label className="text-xs text-muted-foreground">{label}</Label>{children}</div>
  );

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2"><CardTitle className="text-sm">Manage ticket</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Row label="Status">
          <Select value={t.status} disabled={!can("tickets.change_status")} onValueChange={(v) => update({ status: v as TicketStatus }, "Status updated")}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>{STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
          </Select>
        </Row>
        <Row label="Priority">
          {!can("tickets.change_priority") || isCustomer ? (
            <div className="flex h-9 items-center px-1">
              <PriorityBadge priority={t.priority} />
            </div>
          ) : (
            <Select value={t.priority} onValueChange={(v) => update({ priority: v as TicketPriority }, "Priority updated")}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>{PRIORITIES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
          )}
        </Row>
        <Row label="Assigned agent">
          <Select value={t.assigned_agent_id ?? NONE} disabled={!can("tickets.assign")} onValueChange={(v) => update({ assigned_agent_id: v === NONE ? null : v }, "Assignment updated")}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>Unassigned</SelectItem>
              {staff.data?.filter((s) => s.is_active).map((s) => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </Row>
        <Row label="Department">
          <Select value={t.department_id ?? NONE} onValueChange={(v) => update({ department_id: v === NONE ? null : v }, "Department updated")}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>None</SelectItem>
              {deps.data?.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </Row>
        <Row label="Category">
          <Select value={t.category_id ?? NONE} onValueChange={(v) => update({ category_id: v === NONE ? null : v }, "Category updated")}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>None</SelectItem>
              {cats.data?.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </Row>
        {can("tickets.delete") && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full text-destructive hover:text-destructive"><Trash2 className="size-4" /> Delete ticket</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {t.ticket_number}?</AlertDialogTitle>
                <AlertDialogDescription>This permanently deletes the ticket, its conversation and attachments. This cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={async () => {
                    try {
                      const { data: files } = await supabase.from("ticket_attachments").select("storage_path").eq("ticket_id", t.id);
                      if (files?.length) await supabase.storage.from(BUCKET).remove(files.map((f) => f.storage_path));
                    } catch {}
                    try {
                      await deleteTicketFn({ data: { id: t.id } });
                      toast.success("Ticket deleted");
                      qc.invalidateQueries({ queryKey: ["tickets"] });
                      qc.invalidateQueries({ queryKey: ["dashboard"] });
                      qc.invalidateQueries({ queryKey: ["dash-tickets"] });
                      nav({ to: "/tickets" });
                    } catch (err) {
                      toast.error((err as Error)?.message || friendlyError(err));
                    }
                  }}
                >Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
}
