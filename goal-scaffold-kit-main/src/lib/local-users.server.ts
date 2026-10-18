import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type LocalUser = {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  department_id?: string | null;
  is_active: boolean;
  company_name?: string | null;
  must_change_password: boolean;
  company_email?: string | null;
  company_email_verified_at?: string | null;
  created_at: string;
  last_login_at?: string | null;
  roles: string[];
  password?: string;
};

const DATA_DIR = path.resolve(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "local-users.json");

function getInitialUsers(): LocalUser[] {
  return [
    {
      id: "00000000-0000-0000-0000-000000000001",
      username: "asif.ikbal",
      full_name: "Asif Ikbal (Admin)",
      email: "mdasifikbalmamun220@gmail.com",
      phone: "+8801805991950",
      avatar_url: null,
      department_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      is_active: true,
      company_name: "Ritorica CPaaS",
      must_change_password: false,
      company_email: "mdasifikbalmamun220@gmail.com",
      company_email_verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
      roles: ["super_admin", "admin"],
      password: "vR9!qT7#Lm2@Xk8$Np4^Za6&Hw1*Cs5%",
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      username: "agent",
      full_name: "Support Agent",
      email: "support.agent@ritorica.com.bd",
      phone: "+8801805991951",
      avatar_url: null,
      department_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      is_active: true,
      company_name: "Ritorica Support Team",
      must_change_password: false,
      company_email: "support.agent@ritorica.com.bd",
      company_email_verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      last_login_at: null,
      roles: ["agent"],
      password: "Password123!",
    },
  ];
}

export function getLocalUsers(): LocalUser[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      const initial = getInitialUsers();
      fs.writeFileSync(USERS_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return getInitialUsers();
  }
}

export function saveLocalUsers(users: LocalUser[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save local users:", err);
  }
}

export function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(plain, salt, 100000, 64, "sha512").toString("hex");
  return `pbkdf2:${salt}:${hash}`;
}

export function verifyPassword(plain: string, stored?: string | null, onUpgrade?: (hashed: string) => void): boolean {
  if (!stored || !plain) return false;

  if (stored.startsWith("pbkdf2:")) {
    const parts = stored.split(":");
    if (parts.length !== 3) return false;
    const [, salt, hash] = parts;
    const computed = crypto.pbkdf2Sync(plain, salt, 100000, 64, "sha512").toString("hex");
    try {
      const a = Buffer.from(computed, "hex");
      const b = Buffer.from(hash, "hex");
      if (a.length !== b.length) return false;
      return crypto.timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }

  // Legacy fallback comparison with safe constant-time check
  const a = Buffer.from(plain);
  const b = Buffer.from(stored);
  const matched = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (matched && onUpgrade) {
    try {
      const upgraded = hashPassword(plain);
      onUpgrade(upgraded);
    } catch {}
  }
  return matched;
}

export function sanitizeUser(user: LocalUser): Omit<LocalUser, "password"> {
  const { password, ...safe } = user;
  return safe;
}

export function getLocalUsersSafe(): Omit<LocalUser, "password">[] {
  return getLocalUsers().map(sanitizeUser);
}

export function createLocalUser(params: {
  username: string;
  password: string;
  phone?: string | null;
  role: string;
  company_name?: string | null;
  avatar_url?: string | null;
  department_id?: string | null;
  company_email?: string | null;
  email?: string | null;
}): LocalUser {
  const users = getLocalUsers();
  const uname = params.username.toLowerCase().trim();

  if (users.some((u) => u.username.toLowerCase() === uname)) {
    throw new Error("That username is already used.");
  }

  const id = crypto.randomUUID();
  const newUser: LocalUser = {
    id,
    username: uname,
    full_name: uname,
    email: params.email || `${uname}@users.ritorica.invalid`,
    phone: params.phone || null,
    avatar_url: params.avatar_url || null,
    department_id: params.department_id || null,
    is_active: true,
    company_name: params.company_name || null,
    must_change_password: true,
    company_email: params.company_email || null,
    company_email_verified_at: params.company_email ? new Date().toISOString() : null,
    created_at: new Date().toISOString(),
    last_login_at: null,
    roles: [params.role],
    password: hashPassword(params.password),
  };

  users.unshift(newUser);
  saveLocalUsers(users);
  return newUser;
}

export function updateLocalUser(id: string, updates: Partial<LocalUser>): LocalUser | null {
  const users = getLocalUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;

  if (updates.password && !updates.password.startsWith("pbkdf2:")) {
    updates.password = hashPassword(updates.password);
  }

  users[idx] = { ...users[idx], ...updates };
  saveLocalUsers(users);
  return users[idx];
}

export function deleteLocalUser(id: string): boolean {
  const users = getLocalUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) return false;

  saveLocalUsers(filtered);
  return true;
}

export function findLocalUserByUsername(uname: string): LocalUser | null {
  const users = getLocalUsers();
  const clean = uname.toLowerCase().trim().replace(/@ritorica\.com\.bd$/, "").replace(/@users\.ritorica\.invalid$/, "");
  return users.find((u) => u.username.toLowerCase() === clean) || null;
}
