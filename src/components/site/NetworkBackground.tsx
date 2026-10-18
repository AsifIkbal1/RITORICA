import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Particle = { x: number; y: number; vx: number; vy: number; r: number; phase: number; speed: number; alt: boolean };

/**
 * Decorative "digital network": slowly floating glowing dots, linked by thin lines when close.
 * Lightweight canvas — fewer dots on small screens, paused off-screen / in hidden tabs,
 * and drawn once (no motion) when the visitor prefers reduced motion.
 */
export function NetworkBackground({ variant = "light", className }: { variant?: "light" | "dark"; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(canvas);
    const read = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
    const main = variant === "dark" ? read("--primary-glow", "#8fb0f0") : read("--primary", "#4072D6");
    const alt = read("--sky", "#38bdf8");
    const lineStrength = variant === "dark" ? 0.28 : 0.18;

    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let last = 0;
    let onScreen = true;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const maxD = Math.min(140, Math.max(90, w / 9));
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = main;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]!;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD * maxD) {
            ctx.globalAlpha = (1 - Math.sqrt(d2) / maxD) * lineStrength;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        // Each dot slowly fades in and out on its own rhythm.
        const alpha = 0.45 + 0.4 * Math.sin(p.phase + time * 0.001 * p.speed);
        ctx.fillStyle = p.alt ? alt : main;
        ctx.globalAlpha = alpha * 0.18;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobile = w < 640;
      const count = Math.round(Math.min(mobile ? 24 : 60, Math.max(12, (w * h) / (mobile ? 14000 : 16000))));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 1 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.8,
        alt: Math.random() < 0.35,
      }));
      draw(0);
    };

    const step = (time: number) => {
      const dt = Math.min(50, time - (last || time));
      last = time;
      for (const p of particles) {
        p.x += p.vx * dt * 0.06;
        p.y += p.vy * dt * 0.06;
        if (p.x < -10) p.x = w + 10;
        else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        else if (p.y > h + 10) p.y = -10;
      }
      draw(time);
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (reduce || raf || !onScreen || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    setup();
    let resizeRaf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(setup);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = !!entry?.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      cancelAnimationFrame(resizeRaf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [variant]);

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 size-full", className)} />;
}
