import { useState } from "react";
import { HeartHandshake, AlertCircle, Smile, Frown, Meh, Sparkles, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SentimentAnalysisResult } from "@/lib/sentiment-analyzer.server";
import { cn } from "@/lib/utils";

export function SentimentCard({
  sentiment,
}: {
  sentiment?: SentimentAnalysisResult | null;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!sentiment) return null;

  const isFrustrated = sentiment.sentiment === "frustrated";
  const isPositive = sentiment.sentiment === "positive";

  const Icon = isFrustrated ? Frown : isPositive ? Smile : Meh;

  return (
    <Card
      className={cn(
        "shadow-card transition-all",
        isFrustrated
          ? "border-destructive/30 bg-gradient-to-br from-card via-card to-destructive/5"
          : isPositive
          ? "border-emerald-500/30 bg-gradient-to-br from-card via-card to-emerald-500/5"
          : "border-border bg-card"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5 text-sm font-semibold">
            <Sparkles className="size-4 text-primary" />
            <span>Customer Sentiment</span>
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold border",
                isFrustrated
                  ? "bg-destructive/15 text-destructive border-destructive/30 animate-pulse"
                  : isPositive
                  ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground border-border"
              )}
            >
              <Icon className="size-3.5" />
              <span className="capitalize">{sentiment.sentiment}</span>
              {sentiment.risk_level === "high" && " · High Risk"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 text-muted-foreground"
              onClick={() => setExpanded(!expanded)}
              aria-label="Toggle sentiment details"
            >
              {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-xs">
        <p className="text-foreground leading-relaxed font-medium">
          {sentiment.summary}
        </p>

        {expanded && (
          <div className="space-y-2 pt-2 border-t">
            {/* Tone Keywords */}
            {sentiment.tone_keywords && sentiment.tone_keywords.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  Detected Sentiment Triggers:
                </span>
                <div className="flex flex-wrap gap-1">
                  {sentiment.tone_keywords.map((kw, i) => (
                    <span
                      key={i}
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-mono",
                        isFrustrated
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted text-foreground"
                      )}
                    >
                      "{kw}"
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Agent Handling */}
            <div className="rounded-md bg-muted/60 p-2 space-y-1 border">
              <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                <HeartHandshake className="size-3" /> Recommended Agent Action:
              </span>
              <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                "{sentiment.recommended_action}"
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CompactSentimentBadge({
  sentiment,
}: {
  sentiment?: SentimentAnalysisResult | null;
}) {
  if (!sentiment) return null;

  if (sentiment.sentiment === "frustrated") {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-destructive/15 px-1.5 py-0.5 text-[10px] font-bold text-destructive animate-pulse" title="High Churn Risk: Customer is Frustrated">
        <Frown className="size-3" /> Frustrated
      </span>
    );
  }

  if (sentiment.sentiment === "positive") {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
        <Smile className="size-3" /> Satisfied
      </span>
    );
  }

  return null;
}
