import { useEffect } from "react";

const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";

/**
 * Reveals top-level page sections (and their grid cards, staggered) once as they scroll into view.
 * Uses the Web Animations API so the page markup is never changed (no hydration mismatches and
 * React re-renders cannot undo it). Sections already on screen are untouched, and nothing is
 * hidden for reduced-motion visitors or browsers without IntersectionObserver.
 */
export function useScrollReveal(key: string) {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || typeof Element.prototype.animate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pending = new Map<Element, Animation[]>();
    const all: Animation[] = [];
    let io: IntersectionObserver | undefined;

    const raf = requestAnimationFrame(() => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("main section")).filter(
        (el) => !el.parentElement?.closest("main section"),
      );
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            pending.get(e.target)?.forEach((a) => a.play());
            pending.delete(e.target);
            io?.unobserve(e.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0 },
      );
      for (const el of sections) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) continue;
        const anims = [
          el.animate([{ opacity: 0, transform: "translateY(28px)" }, { opacity: 1, transform: "none" }], { duration: 750, easing: EASE, fill: "backwards" }),
        ];
        el.querySelectorAll(".grid > *").forEach((child, i) => {
          if (i > 40) return;
          const index = Array.prototype.indexOf.call(child.parentElement?.children ?? [], child);
          anims.push(
            child.animate([{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }], {
              duration: 650,
              delay: 120 + Math.min(index, 7) * 80,
              easing: EASE,
              fill: "backwards",
            }),
          );
        });
        anims.forEach((a) => a.pause());
        all.push(...anims);
        pending.set(el, anims);
        io.observe(el);
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      all.forEach((a) => a.cancel());
    };
  }, [key]);
}
