import type { ReactNode } from "react";
import { Inbox, ShieldAlert, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function EmptyState({ title, description, action, icon }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card px-6 py-14 text-center">
      <div className="mb-3 rounded-full bg-muted p-3 text-muted-foreground">{icon ?? <Inbox className="size-5" />}</div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border bg-card px-6 py-12 text-center">
      <AlertCircle className="mb-3 size-6 text-destructive" />
      <p className="text-sm font-medium">{message ?? "We couldn't load this data."}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <ShieldAlert className="mb-3 size-8 text-muted-foreground" />
      <h2 className="text-lg font-semibold">Access restricted</h2>
      <p className="mt-1 text-sm text-muted-foreground">You don't have permission to view this page.</p>
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string | undefined; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
