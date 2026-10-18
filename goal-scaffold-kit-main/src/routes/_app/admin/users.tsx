import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useRef } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Copy, ExternalLink, Loader2, Pencil, Plus, Search, Trash2, Camera, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useDepartments } from "@/lib/lookups";
import { ROLES, roleLabel, friendlyError, type AppRole } from "@/lib/constants";
import { createUserAccount, updateUserCredentials, deleteUserAccount, listAdminUsersAccount } from "@/lib/admin.functions";
import { Guard, meta } from "@/components/guard";
import { SIGNIN_SUFFIX, toSignInEmail, signInLink } from "@/lib/signin-domain";
import { PageHeader, TableSkeleton, EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/_app/admin/users")({
  head: () => meta("Users", "Create, edit, disable users and assign roles."),
  component: () => <Guard perm="users.manage"><Users /></Guard>,
});

const NONE = "__none";
const AVATAR_PRESETS = [
  { name: "Support Agent", url: "https://api.dicebear.com/7.x/bottts/svg?seed=agent1" },
  { name: "Executive", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
  { name: "Manager", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" },
  { name: "Advisor", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack" },
  { name: "Specialist", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" },
  { name: "Tech Bot", url: "https://api.dicebear.com/7.x/bottts/svg?seed=tech" },
];

type U = {
  id: string;
  full_name: string;
  username: string | null;
  email: string;
  company_email?: string | null;
  phone: string | null;
  avatar_url?: string | null;
  department_id: string | null;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
  roles: AppRole[];
};

function getUserDisplayEmail(u: U): string {
  if (u.company_email && u.company_email.trim()) {
    return u.company_email.trim();
  }
  if (u.email && !u.email.endsWith("@users.ritorica.invalid")) {
    return u.email;
  }
  return "—";
}


function Users() {
  const qc = useQueryClient();
  const { session, isSuperAdmin } = useAuth();
  const deps = useDepartments();
  const createUser = useServerFn(createUserAccount);
  const updateCreds = useServerFn(updateUserCredentials);
  const deleteUser = useServerFn(deleteUserAccount);
  const listUsers = useServerFn(listAdminUsersAccount);
  const [del, setDel] = useState<U | null>(null);
  const [created, setCreated] = useState<{ link: string; signIn: string; password: string } | null>(null);
  const copy = async (v: string) => {
    let copied = false;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(v);
        copied = true;
      }
    } catch {}

    if (!copied) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = v;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        copied = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch {}
    }

    if (copied) {
      toast.success("Copied to clipboard!");
    } else {
      toast.error("Couldn't copy — select the text and copy it manually.");
    }
  };
  const [newPw, setNewPw] = useState("");
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<U | null>(null);
  const [create, setCreate] = useState(false);
  const [busy, setBusy] = useState(false);
  const [nf, setNf] = useState({ username: "", phone: "", password: "", role: "agent" as AppRole, company_name: "", avatar_url: "", email: "", department_id: null as string | null });
  const editFileRef = useRef<HTMLInputElement | null>(null);
  const createFileRef = useRef<HTMLInputElement | null>(null);

  const processImageFile = (file: File, callback: (dataUrl: string) => void) => {
    if (!file.type.startsWith("image/")) {
      return void toast.error("Please select an image file (PNG, JPG, WebP, GIF).");
    }
    if (file.size > 10 * 1024 * 1024) {
      return void toast.error("Image must be smaller than 10MB.");
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const max = 320;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > max) { h = Math.round((h * max) / w); w = max; }
        } else {
          if (h > max) { h = Math.round((w * max) / h); w = max; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, w, h);
        callback(canvas.toDataURL("image/jpeg", 0.88));
        toast.success("Photo selected!");
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };


  const list = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      try {
        const local = await listUsers();
        if (local && Array.isArray(local) && local.length > 0) {
          return local as unknown as U[];
        }
      } catch (e) {
        console.warn("Local users query error:", e);
      }
      const [p, r] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(1000),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      return (p.data ?? []).map((x) => ({ ...x, roles: (r.data ?? []).filter((y) => y.user_id === x.id).map((y) => y.role) })) as U[];
    },
  });
  const rows = (list.data ?? []).filter((u) => !q || `${u.full_name} ${u.username ?? ""} ${u.email} ${u.company_email ?? ""} ${u.phone ?? ""}`.toLowerCase().includes(q.toLowerCase()));
  const roleOptions = ROLES.filter((r) => isSuperAdmin || r.value !== "super_admin");

  async function saveEdit() {
    if (!edit) return;
    setBusy(true);
    try {
      const original = list.data?.find((u) => u.id === edit.id);
      const uname = (edit.username ?? "").trim().toLowerCase();
      if (newPw && newPw.length < 8) throw new Error("Not allowed: the new password must be at least 8 characters");
      if (uname && uname !== (original?.username ?? "") && !/^[a-z0-9._-]{3,40}$/.test(uname)) {
        throw new Error("Not allowed: the name before @ must be 3-40 letters, numbers, dot, dash or underscore");
      }

      await updateCreds({
        data: {
          user_id: edit.id,
          full_name: edit.full_name.trim(),
          phone: edit.phone?.trim() || null,
          avatar_url: edit.avatar_url || null,
          is_active: edit.is_active,
          department_id: edit.department_id,
          company_email: edit.company_email?.trim() || null,
          email: edit.company_email?.trim() || undefined,
          ...(uname && uname !== original?.username ? { username: uname } : {}),
          ...(newPw ? { password: newPw } : {}),
        },
      });

      try {
        await supabase.from("profiles").update({
          full_name: edit.full_name.trim(),
          phone: edit.phone?.trim() || null,
          department_id: edit.department_id,
          company_email: edit.company_email?.trim() || null,
          is_active: edit.is_active,
          avatar_url: edit.avatar_url || null,
        }).eq("id", edit.id);
      } catch {}

      if (original && original.is_active !== edit.is_active && session) {
        await supabase.from("activity_logs").insert({ user_id: session.user.id, action: edit.is_active ? "user.activated" : "user.disabled", entity_type: "user", entity_id: edit.id, description: `${edit.is_active ? "Activated" : "Disabled"} ${edit.email}` });
      }
      if (isSuperAdmin && original && original.roles.join() !== edit.roles.join()) {
        if (edit.id === session?.user.id && !edit.roles.includes("super_admin")) throw new Error("Not allowed: you can't remove your own Super Admin role");
        const toRemove = original.roles.filter((r) => !edit.roles.includes(r));
        const toAdd = edit.roles.filter((r) => !original.roles.includes(r));
        if (toRemove.length) { const { error: e } = await supabase.from("user_roles").delete().eq("user_id", edit.id).in("role", toRemove); if (e) throw e; }
        if (toAdd.length) { const { error: e } = await supabase.from("user_roles").insert(toAdd.map((role) => ({ user_id: edit.id, role }))); if (e) throw e; }
      }
      toast.success("User updated");
      setEdit(null);
      setNewPw("");
      qc.invalidateQueries();
    } catch (e) {
      const m = (e as Error).message ?? "";
      toast.error(/^Not allowed/.test(m) ? m.replace(/^Not allowed: /, "") : friendlyError(e));
    } finally { setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Users" description="All accounts: customers, agents and administrators." actions={<Button onClick={() => setCreate(true)}><Plus className="size-4" /> Create user</Button>} />
      <div className="relative mb-4 max-w-md">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="bg-card pl-8" placeholder="Search users…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="overflow-hidden rounded-lg border bg-card shadow-card">
        {list.isLoading ? <TableSkeleton /> : !rows.length ? <div className="p-4"><EmptyState title="No users found" /></div> : (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground"><tr className="border-b">{["Name", "Sign-in", "Personal email", "Roles", "Department", "Status", "Created", "Last login", ""].map((h) => <th key={h} className="px-3 py-2.5 text-left font-medium first:pl-4">{h}</th>)}</tr></thead>
            <tbody>{rows.map((u) => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-muted/40">
                <td className="py-2.5 pl-4 pr-3 font-medium">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-7 ring-1 ring-border">
                      {u.avatar_url && <AvatarImage src={u.avatar_url} alt={u.full_name} />}
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                        {u.full_name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{u.full_name}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 font-mono text-xs">{u.username ? (u.roles?.some((r: string) => r === "admin" || r === "super_admin") ? toSignInEmail(u.username) : u.username) : "—"}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{getUserDisplayEmail(u)}</td>
                <td className="px-3 py-2.5">{u.roles.map((r) => <Badge key={r} variant="outline" className="mr-1">{roleLabel(r)}</Badge>)}</td>
                <td className="px-3 py-2.5">{deps.data?.find((d) => d.id === u.department_id || d.name.toLowerCase() === u.department_id?.toLowerCase())?.name ?? (u.department_id || "—")}</td>
                <td className="px-3 py-2.5"><Badge variant={u.is_active ? "secondary" : "destructive"}>{u.is_active ? "Active" : "Disabled"}</Badge></td>
                <td className="px-3 py-2.5 text-xs text-muted-foreground">{format(new Date(u.created_at), "MMM d, yyyy")}</td>
                <td className="px-3 py-2.5 text-xs text-muted-foreground">{u.last_login_at ? formatDistanceToNow(new Date(u.last_login_at), { addSuffix: true }) : "Never"}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right">
                  <Button size="icon" variant="ghost" className="size-8" aria-label="Edit" onClick={() => { setNewPw(""); setEdit({ ...u }); }}><Pencil className="size-4" /></Button>
                  {u.id !== session?.user.id && (isSuperAdmin || !u.roles.includes("super_admin")) && (
                    <Button size="icon" variant="ghost" className="size-8 text-destructive hover:text-destructive" aria-label="Delete" onClick={() => setDel(u)}><Trash2 className="size-4" /></Button>
                  )}
                </td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </div>

      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {del?.full_name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the account and its sign-in. It can't be undone. Users who have tickets can't be deleted — disable them instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <Button variant="destructive" disabled={busy} onClick={async () => {
              if (!del) return;
              setBusy(true);
              try {
                await deleteUser({ data: { user_id: del.id } });
                toast.success("User deleted");
                setDel(null);
                qc.invalidateQueries();
              } catch (e) {
                const m = (e as Error).message ?? "";
                toast.error(/^Not allowed/.test(m) ? m.replace(/^Not allowed: /, "") : "Could not delete the user.");
              } finally { setBusy(false); }
            }}>{busy && <Loader2 className="size-4 animate-spin" />} Delete</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit {edit?.full_name}</DialogTitle></DialogHeader>
          {edit && (
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Full name</Label><Input value={edit.full_name} onChange={(e) => setEdit({ ...edit, full_name: e.target.value })} /></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2"><Label>Username</Label><Input autoComplete="off" value={edit.username ?? ""} onChange={(e) => setEdit({ ...edit, username: e.target.value.replace(/\s/g, "") })} /><p className="text-xs text-muted-foreground">Admins sign in with this username + {SIGNIN_SUFFIX}; everyone else with the username only.</p></div>
                <div className="space-y-1.5 sm:col-span-2"><Label>New password</Label><Input type="password" autoComplete="new-password" placeholder="Leave empty to keep" value={newPw} onChange={(e) => setNewPw(e.target.value)} /></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5"><Label>Personal / Company email</Label><Input type="email" placeholder="e.g. name@example.com" value={edit.company_email ?? (edit.email?.endsWith("@users.ritorica.invalid") ? "" : edit.email) ?? ""} onChange={(e) => setEdit({ ...edit, company_email: e.target.value, email: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Phone</Label><Input value={edit.phone ?? ""} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} /></div>
              </div>
              <div className="space-y-2">
                <Label>Profile photo</Label>
                <div className="flex items-center gap-3">
                  <Avatar className="size-12 border">
                    {edit.avatar_url && <AvatarImage src={edit.avatar_url} />}
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {edit.full_name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="file"
                      ref={editFileRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) processImageFile(file, (dataUrl) => setEdit({ ...edit, avatar_url: dataUrl }));
                      }}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={() => editFileRef.current?.click()}>
                      <Upload className="size-3.5 mr-1.5" /> Upload photo
                    </Button>
                    {edit.avatar_url && (
                      <Button type="button" variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setEdit({ ...edit, avatar_url: null })}>
                        <Trash2 className="size-3.5 mr-1.5" /> Remove
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {AVATAR_PRESETS.map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => setEdit({ ...edit, avatar_url: p.url })}
                      className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${edit.avatar_url === p.url ? "border-primary bg-primary/10 font-medium" : "border-muted bg-card"}`}
                    >
                      <img src={p.url} alt={p.name} className="size-4 rounded-full bg-muted" />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
                <Input placeholder="Or enter photo URL: https://…" value={edit.avatar_url ?? ""} onChange={(e) => setEdit({ ...edit, avatar_url: e.target.value })} className="text-xs mt-1" />
              </div>
              <div className="space-y-1.5"><Label>Department</Label>
                <Select value={edit.department_id ?? NONE} onValueChange={(v) => setEdit({ ...edit, department_id: v === NONE ? null : v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value={NONE}>None</SelectItem>{deps.data?.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Roles {!isSuperAdmin && <span className="text-xs font-normal text-muted-foreground">(only Super Admin can change roles)</span>}</Label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((r) => {
                    const on = edit.roles.includes(r.value);
                    return (
                      <button key={r.value} type="button" disabled={!isSuperAdmin}
                        onClick={() => setEdit({ ...edit, roles: on ? edit.roles.filter((x) => x !== r.value) : [...edit.roles, r.value] })}
                        className={`rounded-md border px-2.5 py-1 text-xs ${on ? "border-primary bg-primary text-primary-foreground" : "bg-card"} disabled:opacity-60`}>
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2"><Switch checked={edit.is_active} disabled={edit.id === session?.user.id} onCheckedChange={(v) => setEdit({ ...edit, is_active: v })} /><Label>Account active</Label></div>
            </div>
          )}
          <DialogFooter><Button variant="ghost" onClick={() => setEdit(null)}>Cancel</Button><Button onClick={saveEdit} disabled={busy}>{busy && <Loader2 className="size-4 animate-spin" />} Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={create} onOpenChange={setCreate}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create user</DialogTitle></DialogHeader>
          <p className="text-xs text-muted-foreground">The user signs in with this username and password, then sets their own password and company email at first login.</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Username</Label><Input placeholder="e.g. username" autoComplete="off" value={nf.username} onChange={(e) => setNf({ ...nf, username: e.target.value.replace(/\s/g, "") })} /><p className="text-xs text-muted-foreground">Letters, numbers, dot, dash or underscore.</p></div>
            <div className="space-y-1.5"><Label>Password</Label><Input type="password" autoComplete="new-password" value={nf.password} onChange={(e) => setNf({ ...nf, password: e.target.value })} /><p className="text-xs text-muted-foreground">8+ characters. Simple ones like 12345678 are refused.</p></div>
            <div className="space-y-1.5"><Label>Personal email (optional)</Label><Input type="email" placeholder="e.g. user@example.com" value={nf.email} onChange={(e) => setNf({ ...nf, email: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Phone number</Label><Input value={nf.phone} onChange={(e) => setNf({ ...nf, phone: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Role</Label>
              <Select value={nf.role} onValueChange={(v) => setNf({ ...nf, role: v as AppRole })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{roleOptions.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Department (optional)</Label>
              <Select value={nf.department_id ?? NONE} onValueChange={(v) => setNf({ ...nf, department_id: v === NONE ? null : v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value={NONE}>None</SelectItem>{deps.data?.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2"><Label>Company name</Label><Input maxLength={150} value={nf.company_name} onChange={(e) => setNf({ ...nf, company_name: e.target.value })} /></div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Profile photo (optional)</Label>
              <div className="flex items-center gap-3">
                <Avatar className="size-12 border">
                  {nf.avatar_url && <AvatarImage src={nf.avatar_url} />}
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {(nf.username || "U").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="file"
                    ref={createFileRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) processImageFile(file, (dataUrl) => setNf({ ...nf, avatar_url: dataUrl }));
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => createFileRef.current?.click()}>
                    <Upload className="size-3.5 mr-1.5" /> Upload photo
                  </Button>
                  {nf.avatar_url && (
                    <Button type="button" variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setNf({ ...nf, avatar_url: "" })}>
                      <Trash2 className="size-3.5 mr-1.5" /> Remove
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {AVATAR_PRESETS.map((p) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => setNf({ ...nf, avatar_url: p.url })}
                    className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${nf.avatar_url === p.url ? "border-primary bg-primary/10 font-medium" : "border-muted bg-card"}`}
                  >
                    <img src={p.url} alt={p.name} className="size-4 rounded-full bg-muted" />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreate(false)}>Cancel</Button>
            <Button disabled={busy} onClick={async () => {
              if (!/^[a-zA-Z0-9._-]{3,40}$/.test(nf.username.trim()) || nf.password.length < 8) return void toast.error("Enter a username (3-40 letters, numbers, dot, dash or underscore) and an 8+ character password.");
              setBusy(true);
              try {
                const uname = nf.username.trim().toLowerCase();
                await createUser({
                  data: {
                    username: uname,
                    phone: nf.phone || undefined,
                    password: nf.password,
                    role: nf.role,
                    company_name: nf.company_name.trim() || undefined,
                    avatar_url: nf.avatar_url.trim() || undefined,
                    department_id: nf.department_id,
                    company_email: nf.email.trim() || undefined,
                    email: nf.email.trim() || undefined,
                  },
                });
                toast.success("User created");
                const isAdmin = nf.role === "admin" || nf.role === "super_admin";
                setCreated({ link: signInLink(nf.role, window.location.origin), signIn: isAdmin ? toSignInEmail(uname) : uname, password: nf.password });
                setCreate(false);
                setNf({ username: "", phone: "", password: "", role: "agent", company_name: "", avatar_url: "", email: "", department_id: null });
                qc.invalidateQueries();
              } catch (e) {
                const m = (e as Error).message ?? "";
                toast.error(/Not allowed|Only a Super/i.test(m) ? m.replace(/^Not allowed: /, "") : /already/i.test(m) ? "That username is already used." : "Could not create user.");
              } finally { setBusy(false); }
            }}>{busy && <Loader2 className="size-4 animate-spin" />} Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!created} onOpenChange={(o) => !o && setCreated(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Share these sign-in details</DialogTitle></DialogHeader>
          <p className="text-xs text-muted-foreground">Send this to the new user. They must set their own password and company email the first time they sign in.</p>
          {created && (
            <div className="space-y-3">
              {[["Sign-in link", created.link], ["Username", created.signIn], ["Temporary password", created.password]].map(([label, value]) => (
                <div key={label} className="space-y-1.5">
                  <Label>{label}</Label>
                  <div className="flex gap-2">
                    <Input readOnly value={value} className="font-mono text-xs" onFocus={(e) => e.currentTarget.select()} />
                    <Button size="icon" variant="outline" aria-label={`Copy ${label}`} onClick={() => copy(value!)}><Copy className="size-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" asChild><a href={created?.link} target="_blank" rel="noreferrer"><ExternalLink className="size-4" /> Open link</a></Button>
            <Button onClick={() => created && copy(`Sign-in link: ${created.link}\nUsername: ${created.signIn}\nTemporary password: ${created.password}`)}><Copy className="size-4" /> Copy all</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
