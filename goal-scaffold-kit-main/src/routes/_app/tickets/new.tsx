import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { friendlyError } from "@/lib/constants";
import { useCategories, useDepartments } from "@/lib/lookups";
import { useCustomFields } from "@/lib/kb";
import { createTicketFn } from "@/lib/tickets.functions";
import { publishNotification } from "@/lib/notifications";
import { Checkbox } from "@/components/ui/checkbox";
import { uploadAttachments, type UploadState } from "@/lib/attachments";
import { PageHeader } from "@/components/states";
import { FilePicker } from "@/components/file-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_app/tickets/new")({
  head: () => ({
    meta: [
      { title: "New ticket — SupportDesk" },
      { name: "description", content: "Submit a new support request." },
      { property: "og:title", content: "New ticket — SupportDesk" },
      { property: "og:description", content: "Submit a new support request." },
    ],
  }),
  component: NewTicket,
});

const schema = z.object({
  subject: z.string().trim().min(4, "Subject must be at least 4 characters").max(200),
  message: z.string().trim().min(10, "Please describe the issue (10+ characters)").max(20000),
  category_id: z.string().uuid("Choose a category"),
  department_id: z.string().uuid("Choose a department"),
});

function NewTicket() {
  const { profile } = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();
  const cats = useCategories();
  const deps = useDepartments();
  const customFields = useCustomFields(true);
  const [extra, setExtra] = useState<Record<string, string | boolean>>({});
  const [f, setF] = useState({ subject: "", message: "", category_id: "", department_id: "" });
  const [files, setFiles] = useState<File[]>([]);
  const [uploads, setUploads] = useState<Record<number, UploadState>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) return void setErrors(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
    const missing = (customFields.data ?? []).filter((cf) => cf.is_required && (extra[cf.id] === undefined || extra[cf.id] === "" || (cf.field_type === "checkbox" && extra[cf.id] !== true)));
    if (missing.length) return void setErrors(Object.fromEntries(missing.map((m) => [`cf_${m.id}`, `${m.label} is required`])));
    setErrors({});
    if (!profile) return;
    setBusy(true);
    try {
      const t = await createTicketFn({
        data: {
          customer_id: profile.id,
          customer_name: profile.full_name || profile.username || "Customer",
          subject: r.data.subject,
          description: r.data.message,
          category_id: r.data.category_id,
          department_id: r.data.department_id,
          custom_fields: Object.fromEntries(
            (customFields.data ?? []).filter((cf) => extra[cf.id] !== undefined && extra[cf.id] !== "").map((cf) => [
              cf.id,
              cf.field_type === "number" ? Number(extra[cf.id]) : typeof extra[cf.id] === "string" ? String(extra[cf.id]).trim().slice(0, 2000) : extra[cf.id],
            ]),
          ),
        },
      });

      if (files.length) {
        try {
          const { failed } = await uploadAttachments(t.id, null, files, (i, st) => setUploads((u) => ({ ...u, [i]: st })));
          if (failed) toast.error(`Ticket created, but ${failed} attachment${failed > 1 ? "s" : ""} failed to upload. You can attach them again from the ticket.`);
        } catch {}
      }

      // Instant real-time alert for Admin across all tabs & windows!
      publishNotification({
        type: "ticket",
        title: `New Ticket: ${t.ticket_number}`,
        message: `${profile.full_name || profile.username || "Customer"} submitted: "${r.data.subject}"`,
        ticket_id: t.id,
        target_role: "admin",
        ticket: { ticket_number: t.ticket_number, subject: r.data.subject },
      });

      // Instant confirmation alert for Customer with sound!
      publishNotification({
        type: "ticket_confirmation",
        title: `Ticket Created: ${t.ticket_number}`,
        message: `Your ticket has been submitted: "${r.data.subject}"`,
        ticket_id: t.id,
        target_role: "customer",
        user_id: profile.id,
        ticket: { ticket_number: t.ticket_number, subject: r.data.subject },
      });

      qc.invalidateQueries();
      toast.success(`Ticket ${t.ticket_number} created`, { description: "We have received your support request. A confirmation has been sent to you." });
      nav({ to: "/tickets/$id", params: { id: t.id } });
    } catch (err) {
      toast.error((err as Error)?.message || friendlyError(err));
    } finally {
      setBusy(false);
    }
  }


  const err = (k: string) => errors[k] && <p className="text-xs text-destructive">{errors[k]}</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="New support ticket" description="Tell us what's going on and we'll get back to you as soon as possible." />
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <form className="space-y-5" onSubmit={submit}>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} placeholder="Short summary of the issue" />
              {err("subject")}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={f.category_id} onValueChange={(v) => setF({ ...f, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>{cats.data?.filter((c) => c.is_active).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
                {err("category_id")}
              </div>
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Select value={f.department_id} onValueChange={(v) => setF({ ...f, department_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>{deps.data?.filter((c) => c.is_active).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
                {err("department_id")}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={8} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} placeholder="Describe the problem, steps to reproduce, and anything you've tried." />
              {err("message")}
              <p className="text-xs text-muted-foreground">The priority level (Level 1 to Level 4) is set automatically from what you describe — for example, a full outage, one operator failing, a partial problem, or a single SMS question.</p>
            </div>
            {!!customFields.data?.length && (
              <div className="grid gap-4 sm:grid-cols-2">
                {customFields.data.map((cf) => (
                  <div key={cf.id} className={cf.field_type === "textarea" ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
                    {cf.field_type === "checkbox" ? (
                      <label className="flex items-center gap-2 pt-6 text-sm">
                        <Checkbox checked={extra[cf.id] === true} onCheckedChange={(v) => setExtra({ ...extra, [cf.id]: v === true })} />
                        {cf.label}{cf.is_required && <span className="text-destructive">*</span>}
                      </label>
                    ) : (
                      <>
                        <Label htmlFor={`cf-${cf.id}`}>{cf.label}{cf.is_required && <span className="text-destructive"> *</span>}</Label>
                        {cf.field_type === "select" ? (
                          <Select value={String(extra[cf.id] ?? "")} onValueChange={(v) => setExtra({ ...extra, [cf.id]: v })}>
                            <SelectTrigger id={`cf-${cf.id}`}><SelectValue placeholder="Select…" /></SelectTrigger>
                            <SelectContent>{cf.options.filter(Boolean).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                          </Select>
                        ) : cf.field_type === "textarea" ? (
                          <Textarea id={`cf-${cf.id}`} rows={3} maxLength={2000} value={String(extra[cf.id] ?? "")} onChange={(e) => setExtra({ ...extra, [cf.id]: e.target.value })} />
                        ) : (
                          <Input id={`cf-${cf.id}`} maxLength={500} type={cf.field_type === "number" ? "number" : cf.field_type === "date" ? "date" : "text"} value={String(extra[cf.id] ?? "")} onChange={(e) => setExtra({ ...extra, [cf.id]: e.target.value })} />
                        )}
                      </>
                    )}
                    {err(`cf_${cf.id}`)}
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Attachments</Label>
              <FilePicker files={files} onChange={setFiles} states={uploads} disabled={busy} />
            </div>
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button type="button" variant="ghost" onClick={() => nav({ to: "/tickets" })}>Cancel</Button>
              <Button type="submit" disabled={busy}>{busy && <Loader2 className="size-4 animate-spin" />} Submit ticket</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
