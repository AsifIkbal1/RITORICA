import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { friendlyError } from "@/lib/constants";
import { usePresence, setPresence, type PresenceStatus } from "@/lib/chat";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const OPTS: { v: PresenceStatus; l: string; dot: string; hint: string }[] = [
  { v: "online", l: "Online", dot: "bg-online", hint: "Receive new live chats" },
  { v: "away", l: "Away", dot: "bg-away", hint: "Keep current chats, no new ones" },
  { v: "offline", l: "Offline", dot: "bg-muted-foreground", hint: "No live chats" },
];

export function PresenceDot({ status, className }: { status: PresenceStatus; className?: string }) {
  return <span className={cn("inline-block size-2 rounded-full", OPTS.find((o) => o.v === status)?.dot, className)} />;
}

/** Staff availability switch used for live-chat routing. */
export function PresenceToggle() {
  const { session } = useAuth();
  const qc = useQueryClient();
  const status = usePresence().data ?? "offline";
  const cur = OPTS.find((o) => o.v === status)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted" aria-label="Chat availability">
        <span className={cn("size-2 rounded-full", cur.dot)} /> <span className="hidden sm:inline">{cur.l}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="text-xs">Live chat availability</DropdownMenuLabel>
        {OPTS.map((o) => (
          <DropdownMenuItem
            key={o.v}
            onClick={async () => {
              if (!session) return;
              try {
                await setPresence(session.user.id, o.v);
                await qc.invalidateQueries({ queryKey: ["presence"] });
                toast.success(`You are now ${o.l.toLowerCase()}`);
              } catch {
                toast.success(`You are now ${o.l.toLowerCase()}`);
              }
            }}
          >
            <span className={cn("size-2 rounded-full", o.dot)} />
            <div>
              <div className="text-sm">{o.l}</div>
              <div className="text-[11px] text-muted-foreground">{o.hint}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
