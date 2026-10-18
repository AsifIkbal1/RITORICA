import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function GlobalSearch() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  return (
    <form
      className="relative max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        nav({ to: "/tickets", search: { q: q.trim() || undefined } as never });
      }}
    >
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search tickets, customers, emails, phone, messages…"
        className="h-9 bg-muted/60 pl-8"
      />
    </form>
  );
}
