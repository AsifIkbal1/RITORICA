import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Loader2, MessageSquareText, RotateCcw, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/language";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { otpDemo as D } from "@/content/demos";
import { cn } from "@/lib/utils";

type Phase = "idle" | "sending" | "received" | "verifying" | "verified";

/** Pretend six-digit code made in the browser; never sent anywhere. */
function makeCode() {
  const n = new Uint32Array(1);
  crypto.getRandomValues(n);
  return String((n[0] ?? 0) % 1_000_000).padStart(6, "0");
}

/**
 * Click-to-play OTP demo: send → code arrives → Verify → success.
 * Fully local: no input fields, no network calls, no SMS.
 */
export function OtpDemo() {
  const t = useT();
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [code, setCode] = useState("");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const after = (ms: number, next: Phase) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPhase(next), reduce ? 0 : ms);
  };

  const send = () => {
    setCode(makeCode());
    setPhase("sending");
    after(1400, "received");
  };
  const verify = () => {
    setPhase("verifying");
    after(900, "verified");
  };
  const reset = () => {
    window.clearTimeout(timer.current);
    setPhase("idle");
    setCode("");
  };

  const hasCode = phase === "received" || phase === "verifying" || phase === "verified";
  const status =
    phase === "sending" ? t(D.sending) : phase === "received" ? t(D.received) : phase === "verifying" ? t(D.verifying) : phase === "verified" ? t(D.success) : t(D.idle);

  return (
    <div className="surface-card mt-8 grid items-center gap-8 p-6 sm:p-10 md:grid-cols-[1fr_auto]">
      <div>
        <span className="eyebrow">{t({ en: "Interactive demo", bn: "ইন্টারঅ্যাকটিভ ডেমো" })}</span>
        <h3 className="mt-2 text-2xl font-bold text-foreground">{t(D.title)}</h3>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground">{t(D.text)}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {phase === "idle" || phase === "sending" ? (
            <Button variant="brand" size="lg" onClick={send} disabled={phase === "sending"}>
              {phase === "sending" ? <Loader2 className="animate-spin" /> : <Send />} {phase === "sending" ? t(D.sending) : t(D.start)}
            </Button>
          ) : phase === "verified" ? (
            <Button variant="brandOutline" size="lg" onClick={reset}>
              <RotateCcw /> {t(D.again)}
            </Button>
          ) : (
            <Button variant="brand" size="lg" onClick={verify} disabled={phase === "verifying"}>
              {phase === "verifying" ? <Loader2 className="animate-spin" /> : <ShieldCheck />} {phase === "verifying" ? t(D.verifying) : t(D.verify)}
            </Button>
          )}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{t(D.notice)}</p>
      </div>

      {/* Mini phone screen */}
      <div className="mx-auto w-full max-w-[280px] rounded-[1.8rem] border-[7px] border-navy-deep bg-gradient-to-b from-primary-soft to-card p-4 shadow-[var(--shadow-lift)]">
        <p className="text-center text-[11px] font-medium text-muted-foreground">{D.sampleNumber}</p>

        <div className="mt-3 min-h-[76px]">
          {phase === "sending" && (
            <div className="flex items-center justify-center gap-1.5 py-6" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className="demo-dot size-2 rounded-full bg-primary" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          )}
          {hasCode && (
            <div className="otp-notif-in rounded-2xl border border-border bg-card/95 p-3 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="flex size-5 items-center justify-center rounded-md bg-success text-primary-foreground">
                  <MessageSquareText className="size-3" />
                </span>
                <span className="font-semibold text-foreground">{t(D.sender)}</span>
              </div>
              <p className="mt-1.5 text-[13px] leading-snug text-foreground">
                <span className="font-mono font-bold tracking-widest text-primary">{code}</span> {t(D.message)}
              </p>
            </div>
          )}
          {phase === "idle" && <p className="py-6 text-center text-xs text-muted-foreground">{t(D.idle)}</p>}
        </div>

        <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={`${code}-${i}`}
              className={cn(
                "flex h-9 w-7 items-center justify-center rounded-md border font-mono text-sm font-bold transition-colors duration-300",
                hasCode ? "otp-digit border-primary/40 bg-primary-soft text-primary" : "border-border bg-card text-muted-foreground",
                phase === "verified" && "border-success/50 text-success",
              )}
              style={{ ["--i" as string]: i }}
            >
              {hasCode ? code[i] : "•"}
            </span>
          ))}
        </div>

        <p role="status" aria-live="polite" className="mt-4 flex min-h-7 items-center justify-center text-center text-xs font-semibold">
          {phase === "verified" ? (
            <span className="otp-check inline-flex items-center gap-1.5 rounded-full bg-success px-3 py-1 text-primary-foreground">
              <BadgeCheck className="size-4" /> {status}
            </span>
          ) : (
            <span className="text-muted-foreground">{status}</span>
          )}
        </p>
      </div>
    </div>
  );
}
