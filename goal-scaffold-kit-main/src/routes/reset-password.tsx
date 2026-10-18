import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { friendlyError } from "@/lib/constants";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set new password — SupportDesk" },
      { name: "description", content: "Choose a new password for your SupportDesk account." },
      { property: "og:title", content: "Set new password — SupportDesk" },
      { property: "og:description", content: "Choose a new password for your SupportDesk account." },
    ],
  }),
  component: Page,
});

function Page() {
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <AuthLayout title="Set a new password" subtitle="Use at least 8 characters.">
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (pw.length < 8) return void toast.error("Password must be at least 8 characters.");
          if (pw !== confirm) return void toast.error("Passwords do not match.");
          setBusy(true);
          const { data, error } = await supabase.auth.updateUser({ password: pw });
          setBusy(false);
          if (error) return void toast.error(friendlyError(error));
          if (data.user) {
            await supabase.from("activity_logs").insert({
              user_id: data.user.id, action: "auth.password_reset", entity_type: "user", entity_id: data.user.id, description: "Password reset",
            });
          }
          toast.success("Password updated.");
          nav({ to: "/dashboard" });
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="pw">New password</Label>
          <Input id="pw" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cf">Confirm password</Label>
          <Input id="cf" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy && <Loader2 className="size-4 animate-spin" />} Update password
        </Button>
      </form>
    </AuthLayout>
  );
}
