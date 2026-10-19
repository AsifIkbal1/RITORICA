import { useEffect, useState, useRef } from "react";
import { Eye, Edit3, AlertCircle } from "lucide-react";
import { pingPresenceFn, leavePresenceFn } from "@/lib/collision.functions";
import type { ViewerPresence } from "@/lib/collision.server";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function useTicketPresence(ticketId: string, isTyping: boolean = false) {
  const { session, profile, isStaff, portal } = useAuth();
  const [viewers, setViewers] = useState<ViewerPresence[]>([]);
  const isTypingRef = useRef(isTyping);
  isTypingRef.current = isTyping;

  const uid = session?.user.id;
  const name =
    profile?.full_name ||
    session?.user.user_metadata?.full_name ||
    "Staff Member";

  useEffect(() => {
    if (!ticketId || !uid || !isStaff) return;

    let mounted = true;

    async function sendPing() {
      try {
        const res = await pingPresenceFn({
          data: {
            ticket_id: ticketId,
            user_id: uid!,
            user_name: name,
            role: portal || "staff",
            action: isTypingRef.current ? "typing" : "viewing",
          },
        });
        if (mounted && res?.activeViewers) {
          setViewers(res.activeViewers);
        }
      } catch {}
    }

    // Immediate ping on mount
    void sendPing();

    // Repeat every 4 seconds
    const interval = setInterval(sendPing, 4000);

    return () => {
      mounted = false;
      clearInterval(interval);
      try {
        void leavePresenceFn({ data: { ticket_id: ticketId, user_id: uid! } });
      } catch {}
    };
  }, [ticketId, uid, isStaff, name, portal]);

  return viewers;
}

export function CollisionBanner({
  ticketId,
  isTyping = false,
}: {
  ticketId: string;
  isTyping?: boolean;
}) {
  const viewers = useTicketPresence(ticketId, isTyping);

  if (!viewers.length) return null;

  const typingViewers = viewers.filter((v) => v.action === "typing");
  const viewingViewers = viewers.filter((v) => v.action === "viewing");

  if (typingViewers.length > 0) {
    const names = typingViewers.map((v) => v.userName).join(", ");
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-950 dark:text-amber-100 shadow-xs animate-pulse">
        <Edit3 className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <div className="flex-1">
          <span className="font-bold">{names}</span> is currently typing a reply!
          Please coordinate to avoid duplicate responses.
        </div>
      </div>
    );
  }

  const names = viewingViewers.map((v) => v.userName).join(", ");
  return (
    <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3.5 py-2 text-xs text-foreground shadow-xs">
      <Eye className="size-3.5 text-primary shrink-0" />
      <div>
        <span className="font-semibold text-primary">{names}</span> is also viewing this ticket right now.
      </div>
    </div>
  );
}
