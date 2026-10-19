import { useState, useMemo } from "react";
import {
  Zap,
  Search,
  Plus,
  Check,
  Tag,
  Copy,
  MessageSquare,
  Sparkles,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getAllCannedResponses,
  saveCustomCannedResponse,
  interpolateCannedResponse,
  type CannedResponse,
  type CannedResponseCategory,
} from "@/lib/canned-responses";
import { cn } from "@/lib/utils";

export function CannedResponsePicker({
  ticket,
  agentName,
  onSelect,
}: {
  ticket: {
    ticket_number?: string;
    subject?: string;
    customer_name?: string;
  };
  agentName?: string;
  onSelect: (interpolatedText: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);

  // Custom macro creation state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newShortcut, setNewShortcut] = useState("");
  const [newContent, setNewContent] = useState("");

  const responses = useMemo(() => getAllCannedResponses(), [open, isCreating]);

  const filtered = useMemo(() => {
    return responses.filter((r) => {
      const matchCat =
        selectedCategory === "all" || r.category === selectedCategory;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.shortcut.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [responses, selectedCategory, search]);

  const activeTemplate = useMemo(() => {
    if (activePreviewId) {
      return responses.find((r) => r.id === activePreviewId) || responses[0];
    }
    return filtered[0] || responses[0];
  }, [activePreviewId, filtered, responses]);

  const interpolatedPreview = useMemo(() => {
    if (!activeTemplate) return "";
    return interpolateCannedResponse(activeTemplate.content, {
      customer_name: ticket.customer_name,
      ticket_number: ticket.ticket_number,
      subject: ticket.subject,
      agent_name: agentName || "Support Team",
    });
  }, [activeTemplate, ticket, agentName]);

  function handleInsert(item?: CannedResponse) {
    const target = item || activeTemplate;
    if (!target) return;
    const finalContent = interpolateCannedResponse(target.content, {
      customer_name: ticket.customer_name,
      ticket_number: ticket.ticket_number,
      subject: ticket.subject,
      agent_name: agentName || "Support Team",
    });
    onSelect(finalContent);
    setOpen(false);
    toast.success(`Inserted template "${target.title}"`);
  }

  function handleCreateCustom() {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Please provide title and content.");
      return;
    }
    saveCustomCannedResponse({
      title: newTitle.trim(),
      shortcut: newShortcut.trim().startsWith("/")
        ? newShortcut.trim()
        : `/${newShortcut.trim() || "macro"}`,
      content: newContent.trim(),
    });
    toast.success("Custom macro saved successfully!");
    setIsCreating(false);
    setNewTitle("");
    setNewShortcut("");
    setNewContent("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
        >
          <Zap className="size-3.5 fill-primary/20 text-primary" />
          <span>Quick Replies</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl p-5">
        <DialogHeader className="pb-3 border-b">
          <div className="flex items-center justify-between pr-4">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Zap className="size-4 text-primary fill-primary/20" /> Canned
              Responses & Quick Macros
            </DialogTitle>
            <Button
              size="sm"
              variant={isCreating ? "secondary" : "outline"}
              className="h-7 text-xs gap-1"
              onClick={() => setIsCreating(!isCreating)}
            >
              <Plus className="size-3" />
              {isCreating ? "Back to Templates" : "Add Custom Macro"}
            </Button>
          </div>
        </DialogHeader>

        {isCreating ? (
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs">Macro Title</Label>
              <Input
                placeholder="e.g. Inactive Account Warning"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Shortcut Keyword (e.g. /inactive)</Label>
              <Input
                placeholder="/inactive"
                value={newShortcut}
                onChange={(e) => setNewShortcut(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Response Body Template</Label>
                <span className="text-[11px] text-muted-foreground">
                  Variables: &#123;&#123;customer_name&#125;&#125;, &#123;&#123;ticket_number&#125;&#125;, &#123;&#123;agent_name&#125;&#125;
                </span>
              </div>
              <Textarea
                rows={6}
                placeholder="Hello {{customer_name}}, ..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreateCustom}>
                Save Macro
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-[280px_1fr] py-2">
            {/* Sidebar list */}
            <div className="space-y-2.5 border-r pr-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                <Input
                  className="h-8 pl-8 text-xs"
                  placeholder="Search templates (/shortcut)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1">
                {(["all", "general", "technical", "billing", "custom"] as const).map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "rounded px-2 py-0.5 text-[11px] font-medium capitalize transition-colors",
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>

              {/* Template Items */}
              <div className="max-h-[340px] space-y-1 overflow-y-auto pr-1">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivePreviewId(item.id)}
                    className={cn(
                      "w-full text-left rounded-md p-2 text-xs transition-all border",
                      (activeTemplate?.id === item.id)
                        ? "border-primary/50 bg-primary/10 font-semibold text-primary"
                        : "border-transparent hover:bg-muted text-foreground"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{item.title}</span>
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1 rounded">
                        {item.shortcut}
                      </span>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="py-6 text-center text-xs text-muted-foreground">
                    No templates found matching "{search}".
                  </p>
                )}
              </div>
            </div>

            {/* Preview Panel */}
            <div className="flex flex-col justify-between pl-1">
              {activeTemplate ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {activeTemplate.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                        <span>Shortcut: {activeTemplate.shortcut}</span>
                        <span>·</span>
                        <span className="capitalize text-primary">
                          {activeTemplate.category}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleInsert(activeTemplate)}
                      className="gap-1.5 h-8 font-semibold shadow-xs"
                    >
                      <Zap className="size-3.5 fill-current" />
                      Insert Template
                    </Button>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground font-medium">
                      Live Preview (Variables Resolved for {ticket.customer_name || "Customer"}):
                    </Label>
                    <div className="max-h-[260px] overflow-y-auto rounded-md border bg-muted/40 p-3 font-sans text-xs whitespace-pre-wrap leading-relaxed text-foreground">
                      {interpolatedPreview}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">
                  Select a template to preview.
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
