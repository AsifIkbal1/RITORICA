import { lazy, Suspense, useEffect, useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { cn } from "@/lib/utils";

// The chat window (and its markdown renderer) loads only after the first click, keeping pages fast.
const ChatPanel = lazy(() => import("./ChatPanel"));

/** Floating "chat with us" button, bottom-right on every page. */
export function ChatWidget() {
  const t = useT();
  const [open, setOpen] = useState(false);
  // Stays mounted after the first open so the conversation survives closing the window and changing pages.
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {loaded && (
        <Suspense fallback={null}>
          <ChatPanel open={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
      <button
        type="button"
        aria-label={t(open ? ui.chat.close : ui.chat.open)}
        aria-expanded={open}
        aria-controls="site-chat"
        onClick={() => {
          setLoaded(true);
          setOpen((o) => !o);
        }}
        className={cn(
          "chat-fab fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-lift)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:bottom-6 sm:right-6",
        )}
      >
        {open ? <X className="size-6" /> : <MessageSquare className="size-6" />}
      </button>
    </>
  );
}
