import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { changeMyPassword } from "@/lib/setup.functions";
import { updateMyProfileFn } from "@/lib/profile.functions";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2, Camera, Upload, Trash2, Sparkles, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { friendlyError, roleLabel } from "@/lib/constants";
import { meta } from "@/components/guard";
import { PageHeader } from "@/components/states";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/_app/profile")({
  head: () => meta("Profile", "Manage your SupportDesk profile and password."),
  component: Profile,
});

const AVATAR_PRESETS = [
  { name: "Support Agent", url: "https://api.dicebear.com/7.x/bottts/svg?seed=agent1" },
  { name: "Executive", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
  { name: "Manager", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" },
  { name: "Advisor", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack" },
  { name: "Specialist", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" },
  { name: "Tech Bot", url: "https://api.dicebear.com/7.x/bottts/svg?seed=tech" },
];

function Profile() {
  const { profile, roles, session, refresh, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [pw, setPw] = useState({ next: "", confirm: "" });
  const [pwBusy, setPwBusy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const changePw = useServerFn(changeMyPassword);
  const updateMyProfile = useServerFn(updateMyProfileFn);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name);
      setPhone(profile.phone ?? "");
      setAvatar(profile.avatar_url ?? "");
      const p = profile as typeof profile & { company_name?: string | null; company_website?: string | null };
      setCompany(p.company_name ?? "");
      setWebsite(p.company_website ?? "");
    }
  }, [profile]);

  if (!profile) return null;

  const initials = (name || profile.full_name || "User")
    .split(" ")
    .map((x) => x[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
          if (w > max) {
            h = Math.round((h * max) / w);
            w = max;
          }
        } else {
          if (h > max) {
            w = Math.round((w * max) / h);
            h = max;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL("image/jpeg", 0.88);
        setAvatar(compressed);
        toast.success("Photo selected! Click 'Save changes' below to save.");
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return void toast.error("Enter your full name.");
    if (phone && !/^[+\d\s()-]{6,30}$/.test(phone)) return void toast.error("Enter a valid phone number.");
    if (avatar && !avatar.startsWith("data:image/") && !/^https?:\/\/.+/.test(avatar)) {
      return void toast.error("Photo must be an uploaded file or valid URL.");
    }
    if (website && !/^https?:\/\/.+\..+/.test(website.trim())) return void toast.error("Website URL must start with https://");

    setBusy(true);
    try {
      // 1. Update through server function (persists to local users & activity log)
      await updateMyProfile({
        data: {
          userId: profile.id,
          full_name: name.trim(),
          phone: phone.trim() || null,
          avatar_url: avatar.trim() || null,
          company_name: company.trim() || null,
          company_website: website.trim() || null,
        },
      });

      // 2. Update local auth state and storage immediately
      updateProfile({
        full_name: name.trim(),
        phone: phone.trim() || null,
        avatar_url: avatar.trim() || null,
        company_name: company.trim() || null,
      });

      // 3. Update Supabase if available
      try {
        await supabase
          .from("profiles")
          .update({
            full_name: name.trim(),
            phone: phone.trim() || null,
            avatar_url: avatar.trim() || null,
            company_name: company.trim() || null,
            company_website: website.trim() || null,
          })
          .eq("id", profile.id);
      } catch {}

      toast.success("Profile and photo updated successfully! 📸");
      refresh();
    } catch (error) {
      toast.error(friendlyError(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Profile" description="Your personal account information and profile picture." />

      <div className="mb-5 flex items-center gap-4">
        <Avatar className="size-16 ring-2 ring-primary/20 shadow-sm">
          {avatar && <AvatarImage src={avatar} alt={name || "User"} />}
          <AvatarFallback className="bg-primary text-lg font-bold text-primary-foreground">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">{profile.full_name}</p>
          {profile.company_name && <p className="text-sm text-muted-foreground">{profile.company_name}</p>}
          {profile.company_email && (
            <p className="text-xs text-muted-foreground">
              Company email: {profile.company_email}
              {profile.company_email_verified_at ? " (verified)" : ""}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-5">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Profile Photo & Picture</CardTitle>
            <CardDescription>Upload a photo from your computer/device or choose an avatar preset.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-4">
              <div className="relative group">
                <Avatar className="size-24 border-2 border-primary/20 shadow-md">
                  {avatar && <AvatarImage src={avatar} alt={name || "User"} />}
                  <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 text-white"
                  aria-label="Upload photo"
                >
                  <Camera className="size-6" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1.5">
                    <Upload className="size-4" /> Upload photo
                  </Button>
                  {avatar && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setAvatar("")} className="gap-1.5 text-destructive hover:bg-destructive/10">
                      <Trash2 className="size-4" /> Remove photo
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, WebP, GIF. Auto-resized for fast loading.</p>
              </div>
            </div>

            <div className="pt-2">
              <Label className="text-xs text-muted-foreground mb-1.5 block">Or choose a stylish preset avatar:</Label>
              <div className="flex flex-wrap gap-2">
                {AVATAR_PRESETS.map((p) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => {
                      setAvatar(p.url);
                      toast.success(`Selected ${p.name} preset!`);
                    }}
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs hover:border-primary transition-colors ${
                      avatar === p.url ? "border-primary bg-primary/10 font-medium" : "border-muted bg-card"
                    }`}
                  >
                    <img src={p.url} alt={p.name} className="size-5 rounded-full bg-muted" />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSaveProfile}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Full name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Profile photo URL (optional)</Label>
                  <Input
                    value={avatar.startsWith("data:") ? "(Uploaded local image)" : avatar}
                    placeholder="https://…"
                    onChange={(e) => setAvatar(e.target.value)}
                    disabled={avatar.startsWith("data:")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Company name</Label>
                  <Input value={company} maxLength={150} onChange={(e) => setCompany(e.target.value)} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Company's website URL</Label>
                  <Input value={website} placeholder="https://…" maxLength={300} onChange={(e) => setWebsite(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                Role: {roles.map((r) => <Badge key={r} variant="secondary">{roleLabel(r)}</Badge>)}
                {session?.user.created_at && <span className="ml-2">Member since {format(new Date(session.user.created_at), "MMM d, yyyy")}</span>}
              </div>
              <Button type="submit" disabled={busy}>
                {busy && <Loader2 className="size-4 animate-spin" />} Save changes
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-base">Change password</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={async (e) => {
              e.preventDefault();
              if (pw.next.length < 8) return void toast.error("Password must be at least 8 characters.");
              if (pw.next !== pw.confirm) return void toast.error("Passwords do not match.");
              setPwBusy(true);
              try {
                await changePw({ data: { password: pw.next } });
              } catch (err) {
                setPwBusy(false);
                return void toast.error((err as Error).message || "Could not change the password.");
              }
              setPwBusy(false);
              setPw({ next: "", confirm: "" });
              toast.success("Password changed");
            }}>
              <div className="space-y-1.5"><Label>New password</Label><Input type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Confirm new password</Label><Input type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} /></div>
              <div><Button type="submit" variant="outline" disabled={pwBusy}>{pwBusy && <Loader2 className="size-4 animate-spin" />} Update password</Button></div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
