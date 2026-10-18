import { useEffect, useRef, useState } from "react";
import { AppWindow, RadioTower } from "lucide-react";
import { useT } from "@/i18n/language";
import { apiConnection as A } from "@/content/demos";

/** Ritorica speech-bubble mark, from the official logo. */
function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="116 0 43 28" aria-hidden className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        d="M127.267 0H147.827C153.84 0 158.758 5.008 158.758 11.131C158.758 13.985 157.689 16.594 155.941 18.57L147.239 27.432V22.264H127.266C121.254 22.264 116.335 17.254 116.335 11.132C116.335 5.009 121.254 0 127.266 0M126.944 14.16C125.29 14.16 123.988 12.8 123.988 11.15C123.988 9.5 125.29 8.101 126.944 8.101C128.6 8.101 129.937 9.5 129.937 11.15C129.937 12.8 128.6 14.16 126.944 14.16ZM148.11 14.16C146.46 14.16 145.154 12.8 145.154 11.15C145.154 9.5 146.46 8.101 148.11 8.101C149.77 8.101 151.104 9.5 151.104 11.15C151.104 12.8 149.77 14.16 148.11 14.16ZM137.527 14.16C135.87 14.16 134.571 12.8 134.571 11.15C134.571 9.5 135.87 8.101 137.527 8.101C139.18 8.101 140.521 9.5 140.521 11.15C140.521 12.8 139.18 14.16 137.527 14.16Z"
      />
    </svg>
  );
}

const icons = [AppWindow, Mark, RadioTower];

/** Wire between two nodes: requests travel right, delivery reports travel back left. */
function Wire({ delay }: { delay: number }) {
  return (
    <div aria-hidden className="relative h-10 flex-1">
      <div className="api-wire absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full" />
      {[0, 1, 2].map((i) => (
        <span key={`f${i}`} className="api-packet api-packet-fwd bg-primary" style={{ animationDelay: `${delay + i * 0.8}s` }} />
      ))}
      {[0, 1].map((i) => (
        <span key={`b${i}`} className="api-packet api-packet-back bg-sky" style={{ animationDelay: `${delay + 0.4 + i * 1.2}s` }} />
      ))}
    </div>
  );
}

/** Decorative data-exchange illustration (not a live connection). Pauses while off screen. */
export function ApiConnection() {
  const t = useT();
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={ref} data-playing={visible ? "true" : "false"} className="api-connection dev-card-dark p-5 sm:p-8 lg:col-span-2">
      <p className="text-sm font-semibold">{t(A.title)}</p>
      <div className="mt-6 flex items-start">
        {A.nodes.map((n, i) => {
          const Icon = icons[i]!;
          return (
            <div key={n.en} className="contents">
              <div className="flex w-20 shrink-0 flex-col items-center text-center sm:w-32">
                <span className={`flex size-12 items-center justify-center rounded-2xl border sm:size-14 ${i === 1 ? "node-pulse border-primary bg-primary text-primary-foreground" : "border-navy-foreground/15 bg-navy-deep text-navy-foreground"}`}>
                  <Icon className={i === 1 ? "w-7" : "size-6"} />
                </span>
                <span className="mt-2 text-[11px] font-medium leading-tight sm:text-xs">{t(n)}</span>
              </div>
              {i < A.nodes.length - 1 && <Wire delay={i * 0.4} />}
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-navy-muted sm:text-xs">
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> {t(A.request)} →</span>
        <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-sky" /> ← {t(A.report)}</span>
      </div>
      <figcaption className="mt-3 text-[11px] text-navy-muted">{t(A.caption)}</figcaption>
    </figure>
  );
}
