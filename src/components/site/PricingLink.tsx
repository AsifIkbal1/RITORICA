import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";

/** On the same page the router would restore the old scroll position, so cancel that navigation and scroll to `#id` ourselves. */
export function scrollIfHere(e: { preventDefault: () => void }, path: string, id: string) {
  if (typeof window === "undefined" || window.location.pathname !== path) return;
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Link to the SMS price cards — used by every "Request Demo" button (client request). */
export function PricingLink(props: Omit<ComponentProps<typeof Link>, "to" | "hash">) {
  return <Link {...props} to="/pricing" hash="pricing" onClick={(e) => { props.onClick?.(e); scrollIfHere(e, "/pricing", "pricing"); }} />;
}
