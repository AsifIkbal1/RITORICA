import { useState } from "react";
import { Star, Smile, CheckCircle, MessageSquareQuote, Send, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitCsatRatingFn } from "@/lib/tickets.functions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const RATING_EMOJIS: Record<number, { emoji: string; label: string; color: string }> = {
  1: { emoji: "😡", label: "Very Unsatisfied", color: "text-red-500" },
  2: { emoji: "🙁", label: "Unsatisfied", color: "text-orange-500" },
  3: { emoji: "😐", label: "Neutral", color: "text-yellow-500" },
  4: { emoji: "🙂", label: "Satisfied", color: "text-blue-500" },
  5: { emoji: "🤩", label: "Excellent", color: "text-emerald-500" },
};

export function CsatSurveyCard({
  ticket,
  isStaff,
  onRated,
}: {
  ticket: {
    id: string;
    ticket_number?: string;
    status?: string | null;
    csat_rating?: number | null;
    csat_comment?: string | null;
    csat_submitted_at?: string | null;
    custom_fields?: any;
    customer_name?: string;
  };
  isStaff?: boolean;
  onRated?: () => void;
}) {
  const isResolved = ticket.status === "solved" || ticket.status === "closed";
  if (!isResolved) return null;

  const existingRating =
    ticket.csat_rating || ticket.custom_fields?.csat_rating || null;
  const existingComment =
    ticket.csat_comment || ticket.custom_fields?.csat_comment || "";
  const submittedAt =
    ticket.csat_submitted_at || ticket.custom_fields?.csat_submitted_at || null;

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number>(existingRating || 5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  // If already rated or just submitted
  if (existingRating || justSubmitted) {
    const finalRating = justSubmitted ? selectedRating : existingRating!;
    const meta = RATING_EMOJIS[finalRating] || RATING_EMOJIS[5];

    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-foreground shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{meta.emoji}</span>
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-emerald-950 dark:text-emerald-100">
                <Award className="size-4 text-emerald-600 dark:text-emerald-400" />
                Customer Satisfaction Feedback: {finalRating}/5 ({meta.label})
              </div>
              <p className="text-xs text-muted-foreground">
                {justSubmitted
                  ? "Thank you! Your feedback helps us improve our support SLA quality."
                  : submittedAt
                  ? `Submitted on ${new Date(submittedAt).toLocaleDateString()}`
                  : "Verified customer satisfaction rating"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "size-4",
                  star <= finalRating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted/60"
                )}
              />
            ))}
          </div>
        </div>
        {(existingComment || (justSubmitted && comment)) && (
          <div className="mt-2.5 rounded-md border bg-card/60 p-2.5 text-xs italic text-muted-foreground">
            "{existingComment || comment}"
          </div>
        )}
      </div>
    );
  }

  // Active rating form for customer (or preview for staff)
  async function handleSubmit() {
    setSubmitting(true);
    try {
      await submitCsatRatingFn({
        data: {
          ticket_id: ticket.id,
          rating: selectedRating,
          comment: comment.trim() || undefined,
          customer_name: ticket.customer_name,
        },
      });
      toast.success("Thank you for your feedback!");
      setJustSubmitted(true);
      onRated?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit rating.");
    } finally {
      setSubmitting(false);
    }
  }

  const activeRating = hoverRating !== null ? hoverRating : selectedRating;
  const activeMeta = RATING_EMOJIS[activeRating] || RATING_EMOJIS[5];

  return (
    <div className="rounded-lg border border-primary/25 bg-gradient-to-br from-card via-card to-primary/5 p-4 shadow-card">
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-1.5 text-foreground">
            <Smile className="size-4 text-primary" /> How satisfied are you with our
            support?
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ticket #{ticket.ticket_number || "Support Ticket"} was marked resolved.
            Please rate your experience.
          </p>
        </div>
        <span className="text-2xl transition-transform hover:scale-125">
          {activeMeta.emoji}
        </span>
      </div>

      <div className="mt-3.5 space-y-3">
        {/* Star Selection */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                onClick={() => setSelectedRating(star)}
                className="p-1 transition-transform hover:scale-125 focus:outline-hidden"
              >
                <Star
                  className={cn(
                    "size-6 transition-colors",
                    star <= activeRating
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30 hover:text-amber-300"
                  )}
                />
              </button>
            ))}
          </div>
          <span
            className={cn(
              "text-xs font-bold transition-colors",
              activeMeta.color
            )}
          >
            {activeRating} / 5 · {activeMeta.label}
          </span>
        </div>

        {/* Optional Comment */}
        <Textarea
          rows={2}
          className="text-xs resize-none"
          placeholder="Leave a short comment (optional): What did we do well or how can we improve?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={submitting}
            className="h-8 gap-1.5 text-xs font-semibold shadow-xs"
          >
            <Send className="size-3.5" />
            {submitting ? "Submitting..." : "Submit CSAT Feedback"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CompactCsatScore({
  rating,
}: {
  rating?: number | null;
}) {
  if (!rating) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
      <Star className="size-3 fill-amber-400 text-amber-400" />
      {rating}/5
    </span>
  );
}
