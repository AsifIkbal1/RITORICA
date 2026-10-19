import { useState, useMemo } from "react";
import { GitMerge, Search, AlertTriangle, ArrowRight, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTicketsListFn, mergeTicketsFn } from "@/lib/tickets.functions";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { PriorityBadge, StatusBadge } from "@/components/badges";
import { cn } from "@/lib/utils";

export function MergeTicketDialog({
  currentTicket,
  onMerged,
}: {
  currentTicket: {
    id: string;
    ticket_number: string;
    subject: string;
    customer_id?: string;
    customer_name?: string;
  };
  onMerged?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [merging, setMerging] = useState(false);
  const { profile } = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();

  const ticketsQuery = useQuery({
    queryKey: ["tickets-for-merge"],
    enabled: open,
    queryFn: async () => {
      return getTicketsListFn();
    },
  });

  const availableTickets = useMemo(() => {
    const list = ticketsQuery.data || [];
    return list.filter((t) => t.id !== currentTicket.id && t.status !== "closed");
  }, [ticketsQuery.data, currentTicket.id]);

  const filteredTickets = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return availableTickets;
    return availableTickets.filter(
      (t) =>
        t.ticket_number.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        (t.customer_name && t.customer_name.toLowerCase().includes(q))
    );
  }, [availableTickets, search]);

  const selectedTarget = useMemo(() => {
    return availableTickets.find((t) => t.id === selectedTargetId) || null;
  }, [availableTickets, selectedTargetId]);

  async function handleConfirmMerge() {
    if (!selectedTargetId) {
      toast.error("Please select a target ticket to merge into.");
      return;
    }

    setMerging(true);
    try {
      const res = await mergeTicketsFn({
        data: {
          source_ticket_id: currentTicket.id,
          target_ticket_id: selectedTargetId,
          merged_by: profile?.full_name || "Support Staff",
        },
      });

      toast.success(
        `Ticket #${currentTicket.ticket_number} successfully merged into #${res.target.ticket_number}!`
      );

      qc.invalidateQueries({ queryKey: ["ticket"] });
      qc.invalidateQueries({ queryKey: ["tickets"] });
      setOpen(false);
      onMerged?.();

      // Navigate to the merged target ticket
      nav({ to: "/tickets/$id", params: { id: selectedTargetId } });
    } catch (err: any) {
      toast.error(err.message || "Failed to merge ticket.");
    } finally {
      setMerging(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <GitMerge className="size-3.5 text-primary" />
          <span>Merge Ticket</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl p-5">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="flex items-center gap-2 text-base">
            <GitMerge className="size-4 text-primary" /> Merge Ticket #
            {currentTicket.ticket_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3.5 py-2">
          {/* Warning banner */}
          <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-950 dark:text-amber-100">
            <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Notice on Merging Tickets:</p>
              <p className="leading-relaxed">
                All conversation messages and attachments from{" "}
                <span className="font-bold">#{currentTicket.ticket_number}</span> will be
                transferred to the target ticket. This ticket will be marked as{" "}
                <span className="font-bold">Closed</span> and linked to the target.
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              className="h-8 pl-8 text-xs"
              placeholder="Search target ticket by #ID, subject, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Target Ticket List */}
          <div className="max-h-60 space-y-1.5 overflow-y-auto pr-1">
            {ticketsQuery.isLoading ? (
              <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
                <Loader2 className="mr-2 size-4 animate-spin text-primary" /> Loading
                tickets...
              </div>
            ) : filteredTickets.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">
                No open tickets available to merge with.
              </p>
            ) : (
              filteredTickets.map((t) => {
                const isSameCustomer = t.customer_id === currentTicket.customer_id;
                const isSelected = t.id === selectedTargetId;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTargetId(t.id)}
                    className={cn(
                      "w-full text-left rounded-lg p-2.5 text-xs transition-all border flex items-center justify-between gap-3",
                      isSelected
                        ? "border-primary bg-primary/10 font-medium"
                        : "border-border hover:bg-muted/60"
                    )}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-primary">
                          #{t.ticket_number}
                        </span>
                        {isSameCustomer && (
                          <span className="rounded bg-primary/20 px-1 py-0.2 text-[10px] font-semibold text-primary">
                            Same Customer
                          </span>
                        )}
                        <StatusBadge status={t.status as any} />
                        <PriorityBadge priority={t.priority as any} />
                      </div>
                      <p className="line-clamp-1 text-foreground font-medium">
                        {t.subject}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        Customer: {t.customer_name || "Customer"}
                      </p>
                    </div>

                    <div
                      className={cn(
                        "size-5 rounded-full border flex items-center justify-center shrink-0 transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {isSelected && <Check className="size-3" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Selected target preview */}
          {selectedTarget && (
            <div className="rounded-lg border bg-muted/40 p-3 text-xs space-y-1">
              <span className="font-semibold text-muted-foreground">
                Merge Destination:
              </span>
              <div className="flex items-center gap-2 font-medium text-foreground">
                <span className="font-mono text-primary">
                  #{selectedTarget.ticket_number}
                </span>
                <span>—</span>
                <span className="truncate">{selectedTarget.subject}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!selectedTargetId || merging}
            onClick={handleConfirmMerge}
            className="gap-1.5 font-semibold"
          >
            {merging ? (
              <>
                <Loader2 className="size-3.5 animate-spin" /> Merging...
              </>
            ) : (
              <>
                <GitMerge className="size-3.5" /> Confirm Merge
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
