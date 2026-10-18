import { useRef } from "react";
import { CheckCircle2, Loader2, Paperclip, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { validateFile, type UploadState } from "@/lib/attachments";
import { formatBytes, ALLOWED_EXT, MAX_FILE_MB } from "@/lib/constants";

const typeLabel = (f: File) => (f.name.split(".").pop() ?? "").toUpperCase() || "FILE";

export function FilePicker({ files, onChange, states, disabled }: {
  files: File[];
  onChange: (f: File[]) => void;
  states?: Record<number, UploadState>;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="min-w-0 space-y-2">
      <input
        ref={ref}
        type="file"
        multiple
        className="hidden"
        accept={ALLOWED_EXT.map((e) => "." + e).join(",")}
        onChange={(e) => {
          const picked = Array.from(e.target.files ?? []);
          const ok: File[] = [];
          for (const f of picked) {
            const err = validateFile(f);
            if (err) toast.error(err);
            else ok.push(f);
          }
          onChange([...files, ...ok].slice(0, 5));
          e.target.value = "";
        }}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={() => ref.current?.click()}>
          <Paperclip className="size-4" /> Attach File
        </Button>
        <span className="text-xs text-muted-foreground">Up to 5 files, {MAX_FILE_MB} MB each · images, PDF, text, logs, Office, ZIP</span>
      </div>
      {!!files.length && (
        <ul className="space-y-1.5">
          {files.map((f, i) => {
            const s = states?.[i];
            return (
              <li key={i} className="flex items-center gap-2 rounded-md border bg-muted/40 px-2.5 py-1.5 text-xs">
                <span className="rounded bg-background px-1 py-px font-mono text-[10px] text-muted-foreground">{typeLabel(f)}</span>
                <span className="min-w-0 flex-1 truncate font-medium">{f.name}</span>
                <span className="text-muted-foreground">{formatBytes(f.size)}</span>
                {s?.status === "uploading" && (
                  <span className="flex w-24 items-center gap-1.5"><Loader2 className="size-3 animate-spin" /><Progress value={s.pct} className="h-1.5" /></span>
                )}
                {s?.status === "done" && <span className="flex items-center gap-1 text-online"><CheckCircle2 className="size-3.5" /> Uploaded</span>}
                {s?.status === "error" && <span className="flex items-center gap-1 text-destructive" title={s.error}><AlertCircle className="size-3.5" /> {s.error}</span>}
                {!s && !disabled && (
                  <button type="button" aria-label={`Remove ${f.name}`} className="text-muted-foreground hover:text-destructive" onClick={() => onChange(files.filter((_, j) => j !== i))}>
                    <X className="size-3.5" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
