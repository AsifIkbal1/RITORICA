import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { CheckCircle2, Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeFirstTimeSetup, sendCompanyEmailCode, verifyCompanyEmailCode } from "@/lib/setup.functions";

export const Route = createFileRoute("/account-setup")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set up your account — Ritorica Support" },
      { name: "description", content: "Verify your company email and choose your own password to finish setting up your account." },
      { property: "og:title", content: "Set up your account — Ritorica Support" },
      { property: "og:description", content: "Verify your company email and choose your own password to finish setting up your account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const msg = (e: unknown) => {
  const m = (e as Error)?.message ?? "";
  try { const j = JSON.parse(m); if (Array.isArray(j) && j[0]?.message) return j[0].message as string; } catch { /* plain text */ }
  return m || "Something went wrong. Please try again.";
};

function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.25, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch {}
}

const VALID_MS = 3 * 60 * 1000;

function Page() {
  const nav = useNavigate();
  const { session, profile, loading, refresh, signOut, updateProfile } = useAuth();
  const sendCode = useServerFn(sendCompanyEmailCode);
  const verify = useServerFn(verifyCompanyEmailCode);
  const complete = useServerFn(completeFirstTimeSetup);
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [sentAt, setSentAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!session) nav({ to: "/login", replace: true });
    else if (profile && !profile.must_change_password && !isVerified) {
      nav({ to: "/dashboard", replace: true });
    }
  }, [loading, session, profile, isVerified, nav]);

  useEffect(() => {
    if (!sentTo) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [sentTo]);
  const left = Math.max(0, Math.ceil((sentAt + VALID_MS - now) / 1000));

  const verified = isVerified || !!profile?.company_email_verified_at;

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    try { await fn(); } catch (e) { toast.error(msg(e)); } finally { setBusy(false); }
  }

  return (
    <AuthLayout
      title="Set up your account"
      subtitle="Two quick steps before you can use your dashboard: verify your company email, then choose your own password."
      footer={<button type="button" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground" onClick={() => signOut()}><LogOut className="size-3.5" /> Sign out</button>}
    >
      <ol className="mb-5 flex gap-2 text-xs font-medium">
        <li className={`flex-1 rounded-md border px-3 py-2 ${verified ? "border-primary/40 bg-primary/5 text-primary" : "border-primary"}`}>1. Company email {verified && <CheckCircle2 className="ml-1 inline size-3.5" />}</li>
        <li className={`flex-1 rounded-md border px-3 py-2 ${verified ? "border-primary" : "text-muted-foreground"}`}>2. New password</li>
      </ol>

      {!verified ? (
        !sentTo ? (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void run(async () => {
            if (!/^\S+@\S+\.\S+$/.test(email.trim())) throw new Error("Enter a valid company email address.");
            const r = await sendCode({ data: { email: email.trim(), userId: profile?.id } });
            setSentTo(r.sentTo);
            setCode("");
            setSentAt(Date.now());
            setNow(Date.now());
            playNotificationSound();
            toast.success("Verification code sent!", {
              description: `A 6-digit code has been sent to ${r.sentTo}. Valid for 3 minutes.`,
            });
          }); }}>
            <div className="space-y-1.5">
              <Label htmlFor="ce">Company email</Label>
              <Input id="ce" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <p className="text-xs text-muted-foreground">We'll send a 6-digit code to this address. Security alerts and password reset codes will go here.</p>
            </div>
            <Button type="submit" className="w-full" disabled={busy || !profile}>{busy && <Loader2 className="size-4 animate-spin" />} Send code</Button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void run(async () => {
            if (left === 0) throw new Error("This verification code has expired. Please request a new code.");
            const res = await verify({ data: { code, userId: profile?.id } });
            playNotificationSound();
            toast.success("Company email verified successfully!");
            setIsVerified(true);
            updateProfile({ company_email: res.email || sentTo || email, company_email_verified_at: new Date().toISOString() });
          }); }}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="code">6-digit code sent to {sentTo}</Label>
                <span className={left ? "font-mono text-xs font-semibold text-primary" : "text-xs font-semibold text-destructive"}>
                  {left ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")} left` : "Expired"}
                </span>
              </div>

              <Input id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="text-center font-mono text-lg tracking-[0.5em]"
                value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} />
              <p className="text-xs text-muted-foreground">The code works for 3 minutes and only once.</p>
            </div>
            <Button type="submit" className="w-full" disabled={busy || code.length !== 6 || left === 0}>
              {busy && <Loader2 className="size-4 animate-spin" />} Verify email
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={busy}
              onClick={() => void run(async () => {
                const r = await sendCode({ data: { email: (sentTo || email).trim(), userId: profile?.id } });
                setSentTo(r.sentTo);
                setCode("");
                setSentAt(Date.now());
                setNow(Date.now());
                playNotificationSound();
                toast.success("New verification code sent!", {
                  description: `Please check your email at ${r.sentTo}.`,
                });
              })}
            >
              Send a new code
            </Button>
            <Button type="button" variant="link" className="w-full text-xs text-muted-foreground" disabled={busy} onClick={() => setSentTo(null)}>
              Use a different email
            </Button>
          </form>
        )
      ) : (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void run(async () => {
          if (pw.length < 8) throw new Error("Password must be at least 8 characters.");
          if (pw !== confirm) throw new Error("Passwords do not match.");
          await complete({ data: { password: pw, userId: profile?.id } });
          playNotificationSound();
          toast.success("Account set up successfully! Welcome to your dashboard.");
          updateProfile({ must_change_password: false });
          nav({ to: "/dashboard", replace: true });
        }); }}>
          <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">Verified: {profile?.company_email || sentTo || email}</p>
          <div className="space-y-1.5">
            <Label htmlFor="pw">New password</Label>
            <Input id="pw" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
            <p className="text-xs text-muted-foreground">8+ characters, different from the one your administrator gave you.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cf">Confirm new password</Label>
            <Input id="cf" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>{busy && <Loader2 className="size-4 animate-spin" />} Save and continue</Button>
        </form>
      )}
    </AuthLayout>
  );
}
