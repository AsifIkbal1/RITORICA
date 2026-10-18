import { CHAT_STATUS_LABEL, type ChatStatus } from "@/lib/chat";
import { cn } from "@/lib/utils";

export function ChatStatusPill({ status }: { status: ChatStatus }) {
  return (
    <span
      className={cn(
        "whitespace-nowrap rounded px-1.5 py-px font-semibold",
        status === "waiting_for_agent" && "bg-destructive/10 text-destructive",
        status === "active" && "bg-online/15 text-online",
        status === "waiting_for_customer" && "bg-away/20 text-foreground",
        status === "closed" && "bg-muted text-muted-foreground",
      )}
    >
      {CHAT_STATUS_LABEL[status]}
    </span>
  );
}
