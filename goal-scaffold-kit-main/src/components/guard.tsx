import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Forbidden } from "./states";

/** UI-level gate. Real enforcement happens in database policies. */
export function Guard({ perm, staff, admin, superAdmin, children }: { perm?: string; staff?: boolean; admin?: boolean; superAdmin?: boolean; children: ReactNode }) {
  const { can, isStaff, isAdmin, isSuperAdmin } = useAuth();
  if (admin && !isAdmin) return <Forbidden />;
  if (perm && !can(perm)) return <Forbidden />;
  if (staff && !isStaff) return <Forbidden />;
  if (superAdmin && !isSuperAdmin) return <Forbidden />;
  return <>{children}</>;
}

export function meta(title: string, description: string) {
  return {
    meta: [
      { title: `${title} — SupportDesk` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — SupportDesk` },
      { property: "og:description", content: description },
    ],
  };
}
