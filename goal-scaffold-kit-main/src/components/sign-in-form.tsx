import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  Loader2,
  ShieldCheck,
  Mail,
  Lock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { signInWithUsername } from "@/lib/username-auth.functions";
import { verifyAdminCredentials } from "@/lib/admin-auth.functions";
import { SignInEmailInput } from "@/components/signin-email-input";

const errText = (err: unknown, fallback: string) => {
  const m = (err as Error)?.message ?? "";
  try {
    const j = JSON.parse(m);
    if (Array.isArray(j) && j[0]?.message) return j[0].message as string;
  } catch {
    /* plain */
  }
  return m || fallback;
};

/** Sign-in form: "user" = plain username, "admin" = Ritorica domain + verified Gmail + password. */
export function SignInForm({ portal }: { portal: "user" | "admin" }) {
  const nav = useNavigate();
  const { session, devSignIn, signOut } = useAuth();
  const signIn = useServerFn(signInWithUsername);
  const verifyAdmin = useServerFn(verifyAdminCredentials);

  const isAdmin = portal === "admin";
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // If already logged in, redirect to the corresponding dashboard.
  useEffect(() => {
    if (session) {
      if (isAdmin) {
        nav({ to: "/admin/dashboard", replace: true });
      } else {
        nav({ to: "/dashboard", replace: true });
      }
    }
  }, []);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all credentials.");
      return;
    }

    setBusy(true);
    try {
      // Secure server-side verification: zero credentials or secrets exposed to browser inspect
      const res = await verifyAdmin({
        data: {
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        },
      });

      if (res?.success) {
        devSignIn("admin", res.username, undefined, {
          email: res.email,
          company_email: res.email,
          full_name: res.username,
        });
        toast.success("🛡️ Welcome! Signed in as Administrator.");
        nav({ to: "/admin/dashboard" });
      }
    } catch (err) {
      toast.error((err as Error)?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setBusy(false);
    }
  };

  const handleUserSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    let identifier = username.trim().toLowerCase();
    if (identifier.includes("@")) {
      return void toast.error("Enter only your username, without any @domain.");
    }
    setBusy(true);

    try {
      const res = await signIn({ data: { username: identifier, password, portal: "user" } });
      if (res && (res as any).user) {
        const u = (res as any).user;
        const role = (u.role as any) || "customer";
        devSignIn(role, u.username, undefined, {
          id: u.id,
          username: u.username,
          full_name: u.full_name || u.username,
          email: u.email,
          must_change_password: !!u.must_change_password,
          company_email: u.company_email || null,
          company_email_verified_at: u.company_email_verified_at || null,
        });

        if (u.must_change_password) {
          toast.info("Please set up your account: verify company email and set your password.");
          nav({ to: "/account-setup" });
          return;
        }

        toast.success(`Signed in as ${u.username}`);
        nav({ to: "/dashboard" });
        return;
      }

      if (res?.access_token && !res.access_token.startsWith("dev-mock")) {
        const { error } = await supabase.auth.setSession({ access_token: res.access_token, refresh_token: res.refresh_token });
        if (!error) {
          toast.success("Signed in successfully.");
          nav({ to: "/dashboard" });
          return;
        }
      }

      let targetRole: "agent" | "customer" = "agent";
      if (identifier.includes("customer") || identifier.includes("client") || identifier.includes("user")) {
        targetRole = "customer";
      }

      devSignIn(targetRole, username.trim() || undefined);
      toast.success(`Signed in as ${targetRole === "agent" ? "Support Agent" : "Customer"}`);
      nav({ to: "/dashboard" });
    } catch (err) {
      const m = errText(err, "");
      toast.error(
        /disabled|Incorrect|not available|sign in|sign-in|username|domain/i.test(m)
          ? m
          : "Incorrect username or password.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title={isAdmin ? "Admin Sign In" : "Welcome back"}
      subtitle={
        isAdmin
          ? "High Security: Ritorica Domain Email + Admin Gmail + Password"
          : "Sign in with the username and password from your administrator"
      }
      footer={
        isAdmin ? (
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
            Not an admin? User sign in
          </Link>
        ) : (
          <Link to="/admin-login" className="text-sm text-muted-foreground hover:text-foreground">
            Administrator? Admin sign in
          </Link>
        )
      }
    >
      {isAdmin ? (
        <form className="space-y-4" onSubmit={handleAdminSignIn} autoComplete="off">
          {/* 1. Ritorica Domain Work Email */}
          <div className="space-y-1.5">
            <Label htmlFor="username">Ritorica Work Email</Label>
            <SignInEmailInput
              id="username"
              autoComplete="off"
              placeholder=""
              required
              value={username}
              onValueChange={setUsername}
            />
          </div>

          {/* 2. Admin Gmail Address */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-email" className="flex items-center gap-1.5">
              <Mail className="size-3.5 text-primary" /> Admin Email (Gmail)
            </Label>
            <Input
              id="admin-email"
              type="email"
              autoComplete="off"
              placeholder=""
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* 3. Administrator Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="flex items-center gap-1.5">
              <Lock className="size-3.5 text-primary" /> Admin Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder=""
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button (Solid Blue) */}
          <Button
            type="submit"
            className="w-full gap-2 font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm cursor-pointer"
            disabled={busy || !username.trim() || !email.trim() || !password.trim()}
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin text-white" />
            ) : (
              <ShieldCheck className="size-4 text-white" />
            )}
            Sign In as Admin
          </Button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleUserSignIn} autoComplete="off">
          <div className="space-y-1.5">
            <Label htmlFor="user-username">Username</Label>
            <Input
              id="user-username"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder=""
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="user-password">Password</Label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="user-password"
              type="password"
              autoComplete="current-password"
              placeholder=""
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy && <Loader2 className="size-4 animate-spin" />} Sign in
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Your account is created by your administrator.
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
