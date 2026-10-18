/**
 * Everyone signs in with a work address on this one fixed domain.
 * The part before "@" is the account's username; the domain can't be changed by anyone.
 */
export const SIGNIN_DOMAIN = "ritorica.com.bd";
export const SIGNIN_SUFFIX = `@${SIGNIN_DOMAIN}`;
export const DOMAIN_ERROR = `Only ${SIGNIN_SUFFIX} email addresses can sign in.`;

export function toSignInEmail(username: string | null | undefined) {
  return username ? `${username}${SIGNIN_SUFFIX}` : "";
}

/** Returns the username for "name" or "name@ritorica.com.bd"; null for any other domain. */
export function parseSignInEmail(input: string): string | null {
  const v = input.trim().toLowerCase();
  if (!v) return null;
  const at = v.indexOf("@");
  if (at === -1) return v;
  if (v.slice(at + 1) !== SIGNIN_DOMAIN) return null;
  const local = v.slice(0, at);
  return local || null;
}

/** Public address of the live app; used when the page is open inside the private editor preview. */
export const PUBLIC_APP_URL = "https://goal-scaffold-kit.lovable.app";

/** Sign-in link to hand to a new user: admins get the admin page, everyone else the user page. */
export function signInLink(role: string, origin?: string) {
  const base = origin || (typeof window !== "undefined" ? window.location.origin : PUBLIC_APP_URL);
  return `${base}${role === "admin" || role === "super_admin" ? "/admin-login" : "/login"}`;
}

