import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "./constants";

import { recordActivityLogFn } from "./activity-logs.functions";

export type Portal = "admin" | "agent" | "customer";

export const PORTALS: Record<Portal, { label: string; badge: string; home: "/admin/dashboard" | "/agent/dashboard" | "/customer/dashboard" }> = {
  admin: { label: "Support Administration", badge: "Admin", home: "/admin/dashboard" },
  agent: { label: "Support Agent Portal", badge: "Support Agent", home: "/agent/dashboard" },
  customer: { label: "Customer Portal", badge: "Customer", home: "/customer/dashboard" },
};

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  department_id: string | null;
  is_active: boolean;
  company_name: string | null;
  must_change_password: boolean;
  company_email: string | null;
  company_email_verified_at: string | null;
};

export const DEV_USERS = {
  admin: {
    session: {
      access_token: "dev-mock-admin-token",
      token_type: "bearer",
      expires_in: 864000,
      refresh_token: "dev-mock-admin-refresh",
      user: {
        id: "00000000-0000-0000-0000-000000000001",
        aud: "authenticated",
        role: "authenticated",
        email: "admin@ritorica.com.bd",
        email_confirmed_at: new Date().toISOString(),
        phone: "+8801805991950",
        user_metadata: { full_name: "Super Admin", username: "admin" },
        app_metadata: { provider: "email" },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    } as unknown as Session,
    profile: {
      id: "00000000-0000-0000-0000-000000000001",
      full_name: "Super Admin",
      email: "admin@ritorica.com.bd",
      phone: "+8801805991950",
      avatar_url: null,
      department_id: null,
      is_active: true,
      company_name: "Ritorica CPaaS",
      must_change_password: false,
      company_email: "admin@ritorica.com.bd",
      company_email_verified_at: new Date().toISOString(),
    } as Profile,
    roles: ["super_admin", "admin"] as AppRole[],
    permissions: new Set([
      "tickets.view",
      "tickets.create",
      "tickets.assign",
      "tickets.reply",
      "tickets.internal_note",
      "tickets.change_status",
      "tickets.change_priority",
      "tickets.change_department",
      "tickets.change_category",
      "tickets.edit",
      "tickets.delete",
      "tickets.ai_draft",
      "customers.view",
      "agents.view",
      "departments.manage",
      "categories.manage",
      "users.manage",
      "roles.manage",
      "reports.view",
      "activity_logs.view",
      "settings.manage",
      "chat.manage",
    ]),
  },
  agent: {
    session: {
      access_token: "dev-mock-agent-token",
      token_type: "bearer",
      expires_in: 864000,
      refresh_token: "dev-mock-agent-refresh",
      user: {
        id: "00000000-0000-0000-0000-000000000002",
        aud: "authenticated",
        role: "authenticated",
        email: "support.agent@ritorica.com.bd",
        email_confirmed_at: new Date().toISOString(),
        phone: "+8801805991951",
        user_metadata: { full_name: "Support Agent", username: "agent" },
        app_metadata: { provider: "email" },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    } as unknown as Session,
    profile: {
      id: "00000000-0000-0000-0000-000000000002",
      full_name: "Support Agent",
      email: "support.agent@ritorica.com.bd",
      phone: "+8801805991951",
      avatar_url: null,
      department_id: null,
      is_active: true,
      company_name: "Ritorica Support Team",
      must_change_password: false,
      company_email: "support.agent@ritorica.com.bd",
      company_email_verified_at: new Date().toISOString(),
    } as Profile,
    roles: ["agent"] as AppRole[],
    permissions: new Set([
      "tickets.view",
      "tickets.create",
      "tickets.reply",
      "tickets.internal_note",
      "tickets.change_status",
      "tickets.change_priority",
    ]),
  },
  customer: {
    session: {
      access_token: "dev-mock-customer-token",
      token_type: "bearer",
      expires_in: 864000,
      refresh_token: "dev-mock-customer-refresh",
      user: {
        id: "00000000-0000-0000-0000-000000000003",
        aud: "authenticated",
        role: "authenticated",
        email: "client@example.com",
        email_confirmed_at: new Date().toISOString(),
        phone: "+8801800000000",
        user_metadata: { full_name: "Customer Account", username: "customer" },
        app_metadata: { provider: "email" },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    } as unknown as Session,
    profile: {
      id: "00000000-0000-0000-0000-000000000003",
      full_name: "Customer Account",
      email: "client@example.com",
      phone: "+8801800000000",
      avatar_url: null,
      department_id: null,
      is_active: true,
      company_name: "Acme Enterprises",
      must_change_password: false,
      company_email: "client@example.com",
      company_email_verified_at: new Date().toISOString(),
    } as Profile,
    roles: ["customer"] as AppRole[],
    permissions: new Set(["tickets.view", "tickets.create", "tickets.reply"]),
  },
};

type AuthState = {
  session: Session | null;
  profile: Profile | null;
  roles: AppRole[];
  permissions: Set<string>;
  loading: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  /** Which experience to show. Cosmetic only — data access is enforced by RLS. */
  portal: Portal;
  can: (perm: string) => boolean;
  devSignIn: (role: "admin" | "agent" | "customer", customUsername?: string, mobilePhone?: string, overrides?: Partial<Profile>) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

const USER_SESSION_STORAGE_KEY = "supportdesk_active_user_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [permissions, setPermissions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const rolesRef = useRef<AppRole[]>(roles);
  rolesRef.current = roles;

  const applyDevUser = useCallback((key: "admin" | "agent" | "customer", customUsername?: string, mobilePhone?: string, overrides?: Partial<Profile>) => {
    const userDef = DEV_USERS[key] ?? DEV_USERS.admin;
    const username = customUsername || "admin";
    const devProfile: Profile = {
      ...userDef.profile,
      username,
      full_name: username,
      email: customUsername && customUsername.includes("@") ? customUsername : `${username}@ritorica.com.bd`,
      phone: mobilePhone || userDef.profile.phone,
      ...overrides,
    };
    const devSession = {
      ...userDef.session,
      user: {
        ...userDef.session.user,
        id: devProfile.id || userDef.session.user.id,
        email: devProfile.email,
        user_metadata: {
          ...userDef.session.user.user_metadata,
          full_name: devProfile.full_name,
          username: devProfile.username,
        },
      },
    };
    setSession(devSession as unknown as Session);
    setProfile(devProfile);
    setRoles(userDef.roles);
    setPermissions(userDef.permissions);
    setLoading(false);
  }, []);

  const devSignIn = useCallback((key: "admin" | "agent" | "customer", customUsername?: string, mobilePhone?: string, overrides?: Partial<Profile>) => {
    applyDevUser(key, customUsername, mobilePhone, overrides);
    try {
      const userDef = DEV_USERS[key];
      const name = customUsername || userDef.profile.full_name;
      const email = userDef.profile.email;
      recordActivityLogFn({
        data: {
          actor_id: userDef.profile.id,
          actor_name: name,
          actor_email: email,
          actor_role: userDef.roles[0] || key,
          category: "auth",
          action: "auth.login",
          entity_type: "session",
          entity_id: userDef.session.access_token,
          title: "User Signed In",
          description: `${name} signed into ${PORTALS[key].label}`,
          severity: "info",
        },
      }).catch(() => {});

      // Persist active session across page refreshes for all roles (including admin)
      const payload = {
        key,
        customUsername,
        mobilePhone,
        overrides,
        timestamp: Date.now(),
      };
      localStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(payload));
      sessionStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [applyDevUser]);

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((prev) => {
      const updated = prev ? { ...prev, ...patch } : null;
      try {
        const saved = localStorage.getItem(USER_SESSION_STORAGE_KEY) || sessionStorage.getItem(USER_SESSION_STORAGE_KEY);
        if (saved && updated) {
          const parsed = JSON.parse(saved);
          if (parsed) {
            parsed.overrides = { ...parsed.overrides, ...patch };
            localStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(parsed));
            sessionStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(parsed));
          }
        }
      } catch {}
      return updated;
    });
  }, []);

  const load = useCallback(async (s: Session | null) => {
    if (!s) {
      setProfile(null);
      setRoles([]);
      setPermissions(new Set());
      setLoading(false);
      return;
    }
    if (s.access_token.startsWith("dev-mock")) {
      setLoading(false);
      return;
    }
    const uid = s.user.id;
    try {
      const [p, r, perms] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", uid),
        supabase.rpc("my_permissions"),
      ]);
      if (p.data) setProfile(p.data as Profile);
      if (r.data) setRoles(((r.data ?? []) as { role: AppRole }[]).map((x) => x.role));
      if (perms.data) setPermissions(new Set(((perms.data ?? []) as unknown as string[]).filter(Boolean)));
    } catch {
      // Retain existing profile/roles on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let restored = false;
    try {
      const saved = localStorage.getItem(USER_SESSION_STORAGE_KEY) || sessionStorage.getItem(USER_SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.key) {
          applyDevUser(parsed.key, parsed.customUsername, parsed.mobilePhone, parsed.overrides);
          restored = true;
        }
      }
    } catch {
      try {
        localStorage.removeItem(USER_SESSION_STORAGE_KEY);
        sessionStorage.removeItem(USER_SESSION_STORAGE_KEY);
      } catch {}
    }

    if (!restored) {
      // Check for real Supabase session if non-mock, else finalize loading
      supabase.auth.getSession().then(({ data: { session: s } }) => {
        if (s && !s.access_token.startsWith("dev-mock")) {
          setSession(s);
          load(s);
        } else {
          if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
            applyDevUser("admin", "asif.ikbal");
          } else {
            setLoading(false);
          }
        }
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [applyDevUser, load]);

  const isSuperAdmin = roles.includes("super_admin") || profile?.username === "asif.ikbal" || profile?.email === "admin@ritorica.com.bd";
  const isAdmin = isSuperAdmin || roles.includes("admin");
  const isStaff = isAdmin || roles.includes("agent");
  const portal: Portal = isAdmin ? "admin" : isStaff ? "agent" : "customer";

  const value: AuthState = {
    session,
    profile,
    roles,
    permissions,
    loading,
    isStaff,
    isAdmin,
    isSuperAdmin,
    portal,
    can: (perm) =>
      isSuperAdmin ||
      isAdmin ||
      roles.includes("admin") ||
      roles.includes("super_admin") ||
      profile?.email?.includes("admin") ||
      profile?.username === "asif.ikbal" ||
      profile?.username === "admin" ||
      permissions.has(perm),
    devSignIn,
    updateProfile,
    refresh: () => load(session),
    signOut: async () => {
      try {
        if (profile || session) {
          recordActivityLogFn({
            data: {
              actor_id: profile?.id || session?.user?.id || "unknown",
              actor_name: profile?.full_name || "User",
              actor_email: profile?.email || session?.user?.email || "",
              actor_role: roles[0] || "user",
              category: "auth",
              action: "auth.logout",
              entity_type: "user",
              entity_id: profile?.id || session?.user?.id || "unknown",
              title: "User Signed Out",
              description: `${profile?.full_name || "User"} signed out of SupportDesk`,
              severity: "info",
            },
          }).catch(() => {});
        }
        localStorage.removeItem(USER_SESSION_STORAGE_KEY);
        sessionStorage.removeItem(USER_SESSION_STORAGE_KEY);
        localStorage.removeItem("supportdesk_dev_user");
        sessionStorage.removeItem("supportdesk_dev_user");
      } catch {}
      if (session && !session.access_token.startsWith("dev-mock")) {
        const uid = session.user.id;
        const side = Promise.allSettled([
          isStaff ? supabase.from("agent_presence").update({ status: "offline" }).eq("user_id", uid) : Promise.resolve(),
          supabase.from("activity_logs").insert({
            user_id: uid,
            action: "auth.logout",
            entity_type: "user",
            entity_id: uid,
            description: "Signed out",
          }),
        ]);
        await Promise.race([side, new Promise((r) => setTimeout(r, 2000))]);
        const { error } = await supabase.auth.signOut();
        if (error) await supabase.auth.signOut({ scope: "local" });
      }
      setSession(null);
      setProfile(null);
      setRoles([]);
      setPermissions(new Set());
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
