import { useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError } from "@/lib/constants";
import { PageHeader, TableSkeleton, EmptyState, ErrorState } from "./states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AnyRow = Record<string, unknown> & { id: string };

export type CrudField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "switch" | "select" | "tags";
  required?: boolean;
  min?: number;
  max?: number;
  options?: { value: string; label: string }[];
  hint?: string | undefined;
  default?: unknown;
  showIf?: (row: AnyRow) => boolean;
};
export type CrudColumn = { header: string; render: (r: AnyRow) => ReactNode; className?: string };

type Table = "kb_categories" | "kb_subcategories" | "kb_articles" | "faqs" | "ticket_custom_fields" | "announcements";

import { listCrudItemsFn, saveCrudItemFn, deleteCrudItemFn } from "@/lib/crud.functions";

export function CrudManager({
  table, title, description, singular, fields, columns, orderBy = "created_at", ascending = false, extraInsert, select = "*", allowEdit = true, deleteWarning,
}: {
  table: Table;
  title: string;
  description?: string | undefined;
  singular: string;
  fields: CrudField[];
  columns: CrudColumn[];
  orderBy?: string;
  ascending?: boolean;
  extraInsert?: () => Record<string, unknown>;
  select?: string;
  allowEdit?: boolean;
  deleteWarning?: string;
}) {
  const qc = useQueryClient();
  const [edit, setEdit] = useState<AnyRow | Record<string, unknown> | null>(null);
  const [del, setDel] = useState<AnyRow | null>(null);
  const [busy, setBusy] = useState(false);
  const q = useQuery({
    queryKey: [table],
    queryFn: async () => {
      try {
        const local = await listCrudItemsFn({ data: { table, select, orderBy, ascending } });
        if (local && Array.isArray(local) && local.length > 0) return local as unknown as AnyRow[];
      } catch {}
      const { data, error } = await supabase.from(table).select(select).order(orderBy, { ascending }).limit(500);
      if (error) throw error;
      return (data ?? []) as unknown as AnyRow[];
    },
  });

  const blank = () => Object.fromEntries(fields.map((f) => [f.key, f.default ?? (f.type === "switch" ? true : f.type === "tags" ? [] : f.type === "number" ? 0 : "")]));

  async function save() {
    if (!edit) return;
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      if (f.showIf && !f.showIf(edit as AnyRow)) continue;
      let v = edit[f.key];
      if (f.type === "text" || f.type === "textarea") {
        v = String(v ?? "").trim();
        if (f.required && !v) return void toast.error(`${f.label} is required.`);
        if (f.min && String(v).length < f.min) return void toast.error(`${f.label} must be at least ${f.min} characters.`);
        if (f.max && String(v).length > f.max) return void toast.error(`${f.label} must be at most ${f.max} characters.`);
        if (!v) v = null;
      }
      if (f.type === "select") {
        v = v ? String(v) : null;
        if (f.required && !v) return void toast.error(`Choose a ${f.label.toLowerCase()}.`);
      }
      if (f.type === "number") v = Number(v) || 0;
      if (f.type === "tags") v = Array.isArray(v) ? v : String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      payload[f.key] = v;
    }
    setBusy(true);
    const id = (edit as AnyRow).id;
    try {
      await saveCrudItemFn({
        data: {
          table,
          id: id || undefined,
          payload: { ...payload, ...(extraInsert?.() ?? {}) },
        },
      });
      toast.success(`${singular} saved`);
      setEdit(null);
      qc.invalidateQueries({ queryKey: [table] });
      qc.invalidateQueries({ queryKey: ["kb_articles"] });
      qc.invalidateQueries({ queryKey: ["faqs"] });
      qc.invalidateQueries({ queryKey: ["kb_categories"] });
      qc.invalidateQueries({ queryKey: ["kb_subcategories"] });
    } catch (e: any) {
      toast.error(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }

  const rows = q.data;
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title={title} description={description} actions={<Button onClick={() => setEdit(blank())}><Plus className="size-4" /> Add {singular.toLowerCase()}</Button>} />
      <div className="overflow-hidden rounded-lg border bg-card shadow-card">
        {q.isLoading ? <TableSkeleton /> : q.isError ? <ErrorState onRetry={() => q.refetch()} /> : !rows?.length ? (
          <div className="p-4"><EmptyState title={`No ${title.toLowerCase()} yet`} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr className="border-b">
                  {columns.map((c) => <th key={c.header} className={`px-3 py-2.5 text-left font-medium first:pl-4 ${c.className ?? ""}`}>{c.header}</th>)}
                  <th className="hidden px-3 py-2.5 text-left font-medium sm:table-cell">Created</th>
                  <th className="px-3 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b align-top last:border-0">
                    {columns.map((c) => <td key={c.header} className={`px-3 py-2.5 first:pl-4 ${c.className ?? ""}`}>{c.render(r)}</td>)}
                    <td className="hidden whitespace-nowrap px-3 py-2.5 text-xs text-muted-foreground sm:table-cell">{format(new Date(String(r["created_at"])), "MMM d, yyyy")}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right">
                      {allowEdit && <Button size="icon" variant="ghost" className="size-8" aria-label="Edit" onClick={() => setEdit(r)}><Pencil className="size-4" /></Button>}
                      <Button size="icon" variant="ghost" className="size-8 text-destructive" aria-label="Delete" onClick={() => setDel(r)}><Trash2 className="size-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader><DialogTitle>{(edit as AnyRow | null)?.id ? `Edit ${singular.toLowerCase()}` : `New ${singular.toLowerCase()}`}</DialogTitle></DialogHeader>
          {edit && (
            <div className="space-y-3">
              {fields.filter((f) => !f.showIf || f.showIf(edit as AnyRow)).map((f) => {
                const v = edit[f.key];
                const set = (val: unknown) => setEdit({ ...edit, [f.key]: val });
                return (
                  <div key={f.key} className={f.type === "switch" ? "flex items-center gap-2" : "space-y-1.5"}>
                    {f.type === "switch" ? (
                      <><Switch checked={!!v} onCheckedChange={set} id={`f-${f.key}`} /><Label htmlFor={`f-${f.key}`}>{f.label}</Label></>
                    ) : (
                      <>
                        <Label htmlFor={`f-${f.key}`}>{f.label}{f.required && <span className="text-destructive"> *</span>}</Label>
                        {f.type === "textarea" ? (
                          <Textarea id={`f-${f.key}`} rows={6} value={String(v ?? "")} onChange={(e) => set(e.target.value)} />
                        ) : f.type === "select" ? (
                          <Select value={v ? String(v) : ""} onValueChange={set}>
                            <SelectTrigger id={`f-${f.key}`}><SelectValue placeholder="Select…" /></SelectTrigger>
                            <SelectContent>{(f.options ?? []).map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                          </Select>
                        ) : f.type === "tags" ? (
                          <Input id={`f-${f.key}`} value={Array.isArray(v) ? v.join(", ") : String(v ?? "")} onChange={(e) => set(e.target.value.split(",").map((s) => s.trimStart()))} placeholder="Option A, Option B" />
                        ) : (
                          <Input id={`f-${f.key}`} type={f.type === "number" ? "number" : "text"} value={String(v ?? "")} onChange={(e) => set(e.target.value)} />
                        )}
                        {f.hint && <p className="text-xs text-muted-foreground">{f.hint}</p>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEdit(null)}>Cancel</Button>
            <Button onClick={save} disabled={busy}>{busy && <Loader2 className="size-4 animate-spin" />} Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>{deleteWarning ?? "This cannot be undone."}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (!del) return;
                try {
                  await deleteCrudItemFn({ data: { table, id: del.id } });
                  toast.success(`${singular} deleted`);
                  qc.invalidateQueries({ queryKey: [table] });
                  qc.invalidateQueries({ queryKey: ["kb_articles"] });
                  qc.invalidateQueries({ queryKey: ["faqs"] });
                  qc.invalidateQueries({ queryKey: ["kb_categories"] });
                  qc.invalidateQueries({ queryKey: ["kb_subcategories"] });
                } catch (e: any) {
                  toast.error(friendlyError(e));
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
