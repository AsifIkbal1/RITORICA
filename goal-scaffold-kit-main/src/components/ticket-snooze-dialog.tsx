import { useState } from "react";
import { Moon, Sun, Clock, Calendar, AlertCircle, Play, Check } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { snoozeTicketFn, unsnoozeTicketFn } from "@/lib/tickets.functions";
import { format, addHours, addDays, setHours, setMinutes } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function TicketSnoozeDialog({
  ticket,
  onSnoozed,
}: {
  ticket: {
    id: string;
    ticket_number: string;
    snoozed_until?: string | null;
    snooze_reason?: string | null;
  };
  onSnoozed?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [customDate, setCustomDate] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const { profile } = useAuth();

  const isSnoozed =
    ticket.snoozed_until && new Date(ticket.snoozed_until).getTime() > Date.now();

  async function handleSnooze(date: Date, defaultReason: string) {
    setBusy(true);
    try {
      await snoozeTicketFn({
        data: {
          ticket_id: ticket.id,
          until_iso: date.toISOString(),
          reason: reason.trim() || defaultReason,
          snoozed_by: profile?.full_name || "Support Staff",
        },
      });
      toast.success(
        `Ticket #${ticket.ticket_number} snoozed until ${format(date, "MMM d, hh:mm a")}.`
      );
      setOpen(false);
      setReason("");
      onSnoozed?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to snooze ticket.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUnsnooze() {
    setBusy(true);
    try {
      await unsnoozeTicketFn({
        data: { ticket_id: ticket.id },
      });
      toast.success(`Ticket #${ticket.ticket_number} is now active.`);
      onSnoozed?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to wake ticket.");
    } finally {
      setBusy(false);
    }
  }

  // Pre-calculated target dates
  const now = new Date();
  const twoHours = addHours(now, 2);
  const fourHours = addHours(now, 4);
  const tomorrowMorning = setMinutes(setHours(addDays(now, 1), 9), 0);
  const twoDays = addDays(now, 2);

  if (isSnoozed) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs text-indigo-950 dark:text-indigo-100 shadow-xs">
        <div className="flex items-center gap-2">
          <Moon className="size-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <div>
            <span className="font-bold">Ticket Snoozed:</span> Until{" "}
            {format(new Date(ticket.snoozed_until!), "MMM d, hh:mm a")}
            {ticket.snooze_reason && (
              <span className="ml-1 text-muted-foreground">
                ("{ticket.snooze_reason}")
              </span>
            )}
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1 border-indigo-500/30 hover:bg-indigo-500/20"
          disabled={busy}
          onClick={handleUnsnooze}
        >
          <Play className="size-3 fill-current" />
          <span>Wake Up Ticket</span>
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <Moon className="size-3.5 text-indigo-500" />
          <span>Snooze</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-5">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Moon className="size-4 text-indigo-500" /> Snooze Ticket #
            {ticket.ticket_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3.5 py-2">
          <p className="text-xs text-muted-foreground">
            Temporarily pause this ticket until you expect a customer response or scheduled test. It will automatically re-open and notify you when the snooze expires.
          </p>

          <div className="space-y-1">
            <Label className="text-xs">Reason for Snooze (Optional)</Label>
            <Input
              placeholder="e.g. Waiting for customer server reboot & firewall check"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="text-xs h-8"
            />
          </div>

          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-semibold text-muted-foreground">
              Select Snooze Duration:
            </Label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button
                variant="outline"
                className="h-auto flex-col items-start p-2.5 hover:border-indigo-500/50"
                onClick={() => handleSnooze(twoHours, "Follow-up in 2 hours")}
                disabled={busy}
              >
                <span className="font-semibold text-foreground">In 2 Hours</span>
                <span className="text-[10px] text-muted-foreground">
                  {format(twoHours, "hh:mm a")}
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col items-start p-2.5 hover:border-indigo-500/50"
                onClick={() => handleSnooze(fourHours, "Follow-up in 4 hours")}
                disabled={busy}
              >
                <span className="font-semibold text-foreground">In 4 Hours</span>
                <span className="text-[10px] text-muted-foreground">
                  {format(fourHours, "hh:mm a")}
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col items-start p-2.5 hover:border-indigo-500/50"
                onClick={() =>
                  handleSnooze(tomorrowMorning, "Follow-up tomorrow morning")
                }
                disabled={busy}
              >
                <span className="font-semibold text-foreground">
                  Tomorrow Morning
                </span>
                <span className="text-[10px] text-muted-foreground">
                  9:00 AM ({format(tomorrowMorning, "EEE, MMM d")})
                </span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col items-start p-2.5 hover:border-indigo-500/50"
                onClick={() => handleSnooze(twoDays, "Follow-up in 2 days")}
                disabled={busy}
              >
                <span className="font-semibold text-foreground">In 2 Days</span>
                <span className="text-[10px] text-muted-foreground">
                  {format(twoDays, "EEE, MMM d")}
                </span>
              </Button>
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t">
            <Label className="text-xs">Or Choose Custom Date & Time:</Label>
            <div className="flex items-center gap-2">
              <Input
                type="datetime-local"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="h-8 text-xs bg-card"
              />
              <Button
                size="sm"
                className="h-8 text-xs font-semibold"
                disabled={!customDate || busy}
                onClick={() => {
                  const d = new Date(customDate);
                  if (isNaN(d.getTime())) return void toast.error("Invalid date");
                  void handleSnooze(d, "Custom follow-up");
                }}
              >
                Snooze
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
