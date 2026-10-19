import { useState } from "react";
import { Tag, Plus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addTicketTagFn, removeTicketTagFn } from "@/lib/tickets.functions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PRESET_TAGS = [
  "vip",
  "smpp",
  "billing",
  "api",
  "dlr-delay",
  "btrc-dlc",
  "urgent-fix",
  "portal-bug",
  "hardware",
  "high-volume",
];

const TAG_COLORS: Record<string, string> = {
  vip: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
  smpp: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  billing: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  api: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
  "dlr-delay": "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
  "btrc-dlc": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  "urgent-fix": "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
  "portal-bug": "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
};

export function getTagColor(tag: string): string {
  const clean = tag.toLowerCase().replace(/^#+/, "");
  return TAG_COLORS[clean] || "bg-muted text-foreground border-border";
}

export function TicketTags({
  ticketId,
  tags = [],
  isStaff,
  onChange,
}: {
  ticketId: string;
  tags?: string[];
  isStaff?: boolean;
  onChange?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleAddTag(tagToAdd: string) {
    const clean = tagToAdd.trim().replace(/^#+/, "").toLowerCase();
    if (!clean) return;
    if (tags.includes(clean)) {
      setOpen(false);
      return;
    }

    setBusy(true);
    try {
      await addTicketTagFn({
        data: {
          ticket_id: ticketId,
          tag: clean,
        },
      });
      toast.success(`Tag #${clean} added.`);
      setCustomInput("");
      setOpen(false);
      onChange?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to add tag.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemoveTag(tagToRemove: string) {
    try {
      await removeTicketTagFn({
        data: {
          ticket_id: ticketId,
          tag: tagToRemove,
        },
      });
      toast.success(`Tag #${tagToRemove} removed.`);
      onChange?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove tag.");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((t) => (
        <span
          key={t}
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
            getTagColor(t)
          )}
        >
          <span>#{t}</span>
          {isStaff && (
            <button
              type="button"
              onClick={() => handleRemoveTag(t)}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded focus:outline-hidden"
              aria-label={`Remove tag ${t}`}
            >
              <X className="size-3" />
            </button>
          )}
        </span>
      ))}

      {isStaff && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-6 gap-1 px-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
            >
              <Plus className="size-3" />
              <span>Add Tag</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2.5 space-y-2 text-xs" align="start">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Add Tag
              </span>
              <div className="flex items-center gap-1">
                <Input
                  className="h-7 text-xs"
                  placeholder="e.g. smpp, vip"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleAddTag(customInput);
                    }
                  }}
                />
                <Button
                  size="sm"
                  className="h-7 px-2 text-xs"
                  disabled={!customInput.trim() || busy}
                  onClick={() => handleAddTag(customInput)}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-1 pt-1 border-t">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Suggested Tags:
              </span>
              <div className="flex flex-wrap gap-1">
                {PRESET_TAGS.map((pt) => {
                  const already = tags.includes(pt);
                  return (
                    <button
                      key={pt}
                      type="button"
                      disabled={already}
                      onClick={() => handleAddTag(pt)}
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors border",
                        already
                          ? "opacity-40 cursor-not-allowed bg-muted"
                          : "hover:bg-primary/10 hover:border-primary/40 text-foreground"
                      )}
                    >
                      #{pt}
                    </button>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
