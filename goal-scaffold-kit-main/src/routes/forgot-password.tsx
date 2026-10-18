import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestResetCode, resetPasswordWithCode } from "@/lib/username-auth.functions";
import { DOMAIN_ERROR, parseSignInEmail } from "@/lib/signin-domain";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — SupportDesk" },
      { name: "description", content: "Reset your password with a 6-digit code sent to your verified company email." },
      { property: "og:title", content: "Forgot password — SupportDesk" },
      { property: "og:description", content: "Reset your password with a 6-digit code sent to your verified company email." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

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
  const request = useServerFn(requestResetCode);
  const reset = useServerFn(resetPasswordWithCode);
  const [username, setUsername] = useState("");
  const [step, setStep] = useState<"ask" | "code">("ask");
  const [sentAt, setSentAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (step !== "code") return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [step]);
  const left = Math.max(0, Math.ceil((sentAt + VALID_MS - now) / 1000));

  async function sendCode() {
    const local = parseSignInEmail(username);
    if (!local) return void toast.error(username.trim() ? DOMAIN_ERROR : "Enter your username.");
    setBusy(true);
    try {
      const r = await request({ data: { username: local } });
      playNotificationSound();
      toast.success(r.message);
      setSentAt(Date.now()); setNow(Date.now()); setCode(""); setStep("code");
    } catch (err) {
      const m = (err as Error).message ?? "";
      toast.error(/wait|Too many|couldn't send|can sign in/i.test(m) ? m : "Could not request a code. Please try again.");
    } finally { setBusy(false); }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={step === "ask"
        ? "Enter your username (admins: your @ritorica.com.bd address). A 6-digit code will be sent to your verified company email."
        : "Check your company email for the 6-digit code. It works for 3 minutes and only once."}
      footer={<Link to="/login" className="font-medium text-primary hover:underline">Back to sign in</Link>}
    >
      {step === "ask" ? (
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); void sendCode(); }}>
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input id="username" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="your.username" required value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" />} Request code
          </Button>
        </form>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!/^\d{6}$/.test(code)) return void toast.error("Enter the 6-digit code.");
            if (left === 0) return void toast.error("This code has expired. Request a new one.");
            if (pw.length < 8) return void toast.error("Password must be at least 8 characters.");
            if (pw !== confirm) return void toast.error("Passwords do not match.");
            setBusy(true);
            try {
              await reset({ data: { username: parseSignInEmail(username) ?? "", code, password: pw } });
              playNotificationSound();
              toast.success("Password changed. You can sign in now.");
              nav({ to: "/login" });
            } catch (err) {
              const m = (err as Error).message ?? "";
              toast.error(/code|password|Too many/i.test(m) ? m : "Could not change the password.");
            } finally { setBusy(false); }
          }}
        >
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="code">6-digit code</Label>
              <span className={left ? "font-mono text-xs text-muted-foreground" : "text-xs text-destructive"}>
                {left ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")} left` : "Expired"}
              </span>
            </div>
            <Input id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} className="text-center font-mono text-lg tracking-[0.5em]"
              value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw">New password</Label>
            <Input id="pw" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cf">Confirm new password</Label>
            <Input id="cf" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={busy || left === 0}>
            {busy && <Loader2 className="size-4 animate-spin" />} Change password
          </Button>
          <Button type="button" variant="ghost" className="w-full" disabled={busy} onClick={() => void sendCode()}>
            Send a new code
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
