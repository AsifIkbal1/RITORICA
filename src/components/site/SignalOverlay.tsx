import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Decorative layer for the home hero image: light pulses travel from the central platform
 * tile to each message icon, and the icons pulse softly. Coordinates match the hero artwork.
 */
const W = 746;
const H = 507;
const hub = { x: 373, y: 172 };
const nodes = [
  { x: 176, y: 86 },
  { x: 570, y: 86 },
  { x: 170, y: 236 },
  { x: 566, y: 240 },
  { x: 168, y: 402 },
  { x: 372, y: 400 },
];

export function SignalOverlay() {
  const reduce = useReducedMotion();
  return (
    <svg aria-hidden viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 size-full">
      <defs>
        <radialGradient id="sig-dot">
          <stop offset="0%" style={{ stopColor: "var(--color-card)", stopOpacity: 1 }} />
          <stop offset="45%" style={{ stopColor: "var(--color-sky)", stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      {nodes.map((n, i) => {
        const mx = (hub.x + n.x) / 2;
        const my = Math.min(hub.y, n.y) - 30;
        const d = `M${hub.x},${hub.y} Q${mx},${my} ${n.x},${n.y}`;
        const dur = `${3.2 + (i % 3) * 0.6}s`;
        const begin = `${i * 0.55}s`;
        return (
          <g key={i}>
            <path d={d} fill="none" style={{ stroke: "var(--color-card)" }} strokeOpacity="0.55" strokeWidth="1.4" strokeDasharray="3 7" className="signal-line" />
            <circle cx={n.x} cy={n.y} r="34" fill="none" strokeWidth="1.5" className="signal-pulse" style={{ stroke: "var(--color-card)", animationDelay: begin }} />
            {!reduce && (
              <circle r="7" fill="url(#sig-dot)">
                <animateMotion dur={dur} begin={begin} repeatCount="indefinite" path={d} keyPoints={i % 2 ? "1;0" : "0;1"} keyTimes="0;1" calcMode="linear" />
                <animate attributeName="opacity" values="0;1;1;0" dur={dur} begin={begin} repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}
      <circle cx={hub.x} cy={hub.y} r="58" fill="none" strokeWidth="2" className="signal-pulse" style={{ stroke: "var(--color-card)" }} />
    </svg>
  );
}
