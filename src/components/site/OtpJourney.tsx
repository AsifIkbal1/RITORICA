import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Landmark, MessageSquareText, RadioTower, Smartphone } from "lucide-react";
import { useT } from "@/i18n/language";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { otpJourney as J } from "@/content/otp-journey";
import { cn } from "@/lib/utils";

/** Time spent on each stage (ms): send, Ritorica, operator, phone, verified. */
const STEP_MS = [1500, 1600, 1600, 2400, 3400];
const LAST = STEP_MS.length - 1;

/** Ritorica speech-bubble mark, taken from the official logo. */
function RitoricaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="116 0 43 28" aria-hidden className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        d="M127.267 0H147.827C153.84 0 158.758 5.008 158.758 11.131C158.758 13.985 157.689 16.594 155.941 18.57L147.239 27.432V22.264H127.266C121.254 22.264 116.335 17.254 116.335 11.132C116.335 5.009 121.254 0 127.266 0M126.944 14.16C125.29 14.16 123.988 12.8 123.988 11.15C123.988 9.5 125.29 8.101 126.944 8.101C128.6 8.101 129.937 9.5 129.937 11.15C129.937 12.8 128.6 14.16 126.944 14.16ZM148.11 14.16C146.46 14.16 145.154 12.8 145.154 11.15C145.154 9.5 146.46 8.101 148.11 8.101C149.77 8.101 151.104 9.5 151.104 11.15C151.104 12.8 149.77 14.16 148.11 14.16ZM137.527 14.16C135.87 14.16 134.571 12.8 134.571 11.15C134.571 9.5 135.87 8.101 137.527 8.101C139.18 8.101 140.521 9.5 140.521 11.15C140.521 12.8 139.18 14.16 137.527 14.16Z"
      />
    </svg>
  );
}

const stationIcons = [Landmark, RitoricaMark, RadioTower, Smartphone];

/**
 * Animated story of one OTP: business → Ritorica → mobile operator → customer's phone → verified.
 * Plays only while on screen; with reduced motion it shows the finished, verified state.
 */
export function OtpJourney() {
  const t = useT();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce) {
      setStep(LAST);
      return;
    }
    if (!visible) return;
    const id = window.setTimeout(() => {
      if (step === LAST) {
        setCycle((c) => c + 1);
        setStep(0);
      } else setStep(step + 1);
    }, STEP_MS[step]);
    return () => window.clearTimeout(id);
  }, [step, visible, reduce]);

  const pos = Math.min(step, 3);
  const arrived = step >= 3;
  const verified = step >= 4;

  return (
    <div ref={ref} className="surface-card relative isolate overflow-hidden p-6 sm:p-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="parallax absolute inset-0" style={{ ["--plx" as string]: "36px" }}>
          <div className="hero-glow -right-24 -top-24 size-[26rem]" />
        </div>
        {/* Floating message bubbles (desktop only, to keep mobile calm); drift slightly on scroll. */}
        <div className="parallax absolute inset-0" style={{ ["--plx" as string]: "-22px" }}>
          <MessageSquareText className="otp-float absolute left-[46%] top-6 hidden size-6 text-primary/25 sm:block" />
          <MessageSquareText className="otp-float absolute bottom-10 left-6 hidden size-8 text-sky/40 sm:block [animation-delay:-2s]" />
          <MessageSquareText className="otp-float absolute bottom-16 right-[38%] hidden size-5 text-primary/20 lg:block [animation-delay:-4s]" />
        </div>
      </div>

      <div className="grid items-center gap-10 lg:grid-cols-[1.45fr_1fr]">
        <div>
          {/* Track: four stations joined by a live wire; the OTP bubble flies between them. */}
          <div aria-hidden className="relative">
            <div className="absolute left-[12.5%] right-[12.5%] top-7 h-0.5 -translate-y-1/2 sm:top-8">
              <div className="otp-wire absolute inset-0 rounded-full" />
              <div className="absolute inset-y-0 left-0 rounded-full bg-primary transition-[width] duration-1000 ease-in-out" style={{ width: `${(pos / 3) * 100}%` }} />
            </div>

            <div className="relative grid grid-cols-4">
              {J.stations.map((s, i) => {
                const Icon = stationIcons[i]!;
                const active = pos === i && !verified;
                const done = i < pos || verified;
                return (
                  <div key={s.en} className="flex flex-col items-center text-center">
                    <span
                      className={cn(
                        "relative flex size-14 items-center justify-center rounded-2xl border transition-all duration-500 sm:size-16",
                        active && "node-pulse scale-110 border-primary bg-primary text-primary-foreground shadow-[var(--shadow-lift)]",
                        done && !active && "border-primary/40 bg-primary-soft text-primary",
                        !active && !done && "border-border bg-card text-muted-foreground",
                      )}
                    >
                      <Icon className={i === 1 ? "w-8" : "size-7"} />
                      {verified && i === 3 && <BadgeCheck className="otp-check absolute -right-2 -top-2 size-6 rounded-full bg-card text-success" />}
                    </span>
                    <span className={cn("mt-3 text-xs font-semibold sm:text-sm", active || done ? "text-foreground" : "text-muted-foreground")}>{t(s)}</span>
                  </div>
                );
              })}
            </div>

            <span
              key={cycle}
              className={cn(
                "otp-bubble absolute top-7 z-10 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold tracking-wide text-primary-foreground shadow-[var(--shadow-lift)] sm:top-8 sm:px-3 sm:text-xs",
                verified && "opacity-0",
              )}
              style={{ ["--pos" as string]: pos }}
            >
              OTP
            </span>
          </div>

          {/* Steps as readable text — the animation above is decorative. */}
          <ol className="mt-10 grid gap-2 sm:grid-cols-2">
            {J.steps.map((s, i) => (
              <li
                key={s.title.en}
                className={cn(
                  "flex gap-3 rounded-xl border p-3 transition-colors duration-500",
                  i === step ? "border-primary/40 bg-primary-soft" : "border-transparent",
                  i === LAST && "sm:col-span-2",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-500",
                    i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{t(s.title)}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{t(s.text)}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Phone mock-up */}
        <div aria-hidden className="flex flex-col items-center">
          <div className="relative h-[420px] w-[230px] overflow-hidden rounded-[2.4rem] border-[9px] border-navy-deep bg-gradient-to-b from-primary-soft to-card shadow-[var(--shadow-lift)]">
            <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-navy-deep" />
            <p className="mt-12 text-center text-4xl font-light tracking-tight text-foreground">9:41</p>

            {arrived ? (
              <div key={`n${cycle}`} className="otp-notif-in mx-3 mt-6 rounded-2xl border border-border bg-card/95 p-3 shadow-[var(--shadow-card)]">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="flex size-5 items-center justify-center rounded-md bg-success text-primary-foreground">
                    <MessageSquareText className="size-3" />
                  </span>
                  <span className="font-semibold text-foreground">{t(J.phone.sender)}</span>
                  <span className="ml-auto">{t(J.phone.now)}</span>
                </div>
                <p className="mt-2 text-[13px] leading-snug text-foreground">
                  <span className="font-mono font-bold tracking-widest text-primary">
                    {J.code.split("").map((d, i) => (
                      <span key={i} className="otp-digit inline-block" style={{ ["--i" as string]: i }}>
                        {d}
                      </span>
                    ))}
                  </span>{" "}
                  {t(J.phone.message)}
                </p>
              </div>
            ) : (
              <p className="mt-10 text-center text-xs text-muted-foreground">{t(J.phone.waiting)}</p>
            )}

            {verified && (
              <div key={`v${cycle}`} className="otp-notif-in absolute inset-x-3 bottom-6 rounded-2xl border border-border bg-card p-4 text-center">
                <p className="text-[11px] font-medium text-muted-foreground">{t(J.phone.enter)}</p>
                <div className="mt-2 flex justify-center gap-1">
                  {J.code.split("").map((d, i) => (
                    <span key={i} className="otp-digit flex h-8 w-6 items-center justify-center rounded-md border border-primary/40 bg-primary-soft font-mono text-sm font-bold text-primary" style={{ ["--i" as string]: i }}>
                      {d}
                    </span>
                  ))}
                </div>
                <p className="otp-check mt-3 inline-flex items-center gap-1.5 rounded-full bg-success px-3 py-1 text-xs font-bold text-primary-foreground [animation-delay:0.6s]">
                  <BadgeCheck className="size-4" /> {t(J.phone.verified)}
                </p>
              </div>
            )}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">{t(J.phone.illustrative)}</p>
        </div>
      </div>
    </div>
  );
}
