import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { friendlyError } from "@/lib/constants";
import { saveLookupFn, deleteLookupFn } from "@/lib/lookups.functions";
import { PageHeader, TableSkeleton, EmptyState } from "./states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Row = { id: string; name: string; description: string | null; is_active: boolean; created_at: string };

export function LookupManager({
  table, title, singular, rows, loading, extraColumn,
}: {
  table: "categories" | "departments";
  title: string;
  singular: string;
  rows: Row[] | undefined;
  loading: boolean;
  extraColumn?: { header: string; render: (r: Row) => React.ReactNode };
}) {
  const qc = useQueryClient();
  const [edit, setEdit] = useState<Partial<Row> | null>(null);
  const [del, setDel] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    if (!edit) return;
    const name = edit.name?.trim() ?? "";
    if (name.length < 2 || name.length > 80) return void toast.error("Name must be 2–80 characters.");
    setBusy(true);
    try {
      await saveLookupFn({
        data: {
          table,
          id: edit.id,
          name,
          description: edit.description?.trim() || null,
          is_active: edit.is_active ?? true,
        },
      });
      toast.success(`${singular} saved`);
      setEdit(null);
      qc.invalidateQueries({ queryKey: [table] });
    } catch (err) {
      toast.error((err as Error)?.message || friendlyError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title={title} actions={<Button onClick={() => setEdit({ is_active: true })}><Plus className="size-4" /> Add {singular.toLowerCase()}</Button>} />
      <div className="overflow-hidden rounded-lg border bg-card shadow-card">
        {loading ? <TableSkeleton /> : !rows?.length ? <div className="p-4"><EmptyState title={`No ${title.toLowerCase()} yet`} /></div> : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr className="border-b">
                <th className="py-2.5 pl-4 pr-3 text-left font-medium">Name</th>
                <th className="hidden px-3 py-2.5 text-left font-medium md:table-cell">Description</th>
                {extraColumn && <th className="px-3 py-2.5 text-left font-medium">{extraColumn.header}</th>}
                <th className="px-3 py-2.5 text-left font-medium">Status</th>
                <th className="hidden px-3 py-2.5 text-left font-medium sm:table-cell">Created</th>
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="py-2.5 pl-4 pr-3 font-medium">{r.name}</td>
                  <td className="hidden px-3 py-2.5 text-muted-foreground md:table-cell">{r.description ?? "—"}</td>
                  {extraColumn && <td className="px-3 py-2.5">{extraColumn.render(r)}</td>}
                  <td className="px-3 py-2.5"><Badge variant={r.is_active ? "secondary" : "outline"}>{r.is_active ? "Active" : "Inactive"}</Badge></td>
                  <td className="hidden px-3 py-2.5 text-xs text-muted-foreground sm:table-cell">{format(new Date(r.created_at), "MMM d, yyyy")}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right">
                    <Button size="icon" variant="ghost" className="size-8" aria-label="Edit" onClick={() => setEdit(r)}><Pencil className="size-4" /></Button>
                    <Button size="icon" variant="ghost" className="size-8 text-destructive" aria-label="Delete" onClick={() => setDel(r)}><Trash2 className="size-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{edit?.id ? `Edit ${singular.toLowerCase()}` : `New ${singular.toLowerCase()}`}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>Name</Label><Input value={edit?.name ?? ""} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Description</Label><Textarea value={edit?.description ?? ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></div>
            <div className="flex items-center gap-2"><Switch checked={edit?.is_active ?? true} onCheckedChange={(v) => setEdit({ ...edit, is_active: v })} /><Label>Active</Label></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEdit(null)}>Cancel</Button>
            <Button onClick={save} disabled={busy}>{busy && <Loader2 className="size-4 animate-spin" />} Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {del?.name}?</AlertDialogTitle>
            <AlertDialogDescription>Existing tickets keep their history but will no longer reference this {singular.toLowerCase()}. Consider marking it inactive instead.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={async () => {
              if (!del) return;
              try {
                await deleteLookupFn({ data: { table, id: del.id } });
                toast.success(`${singular} deleted`);
                qc.invalidateQueries({ queryKey: [table] });
              } catch (err) {
                toast.error((err as Error)?.message || friendlyError(err));
              }
            }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
