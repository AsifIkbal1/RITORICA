import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DATA_DIR = path.resolve(process.cwd(), "data");

export const ALLOWED_CRUD_TABLES = new Set([
  "kb_articles",
  "kb_categories",
  "kb_subcategories",
  "faqs",
  "announcements",
  "custom_fields",
  "departments",
  "categories",
  "roles",
  "permissions",
]);

function getFilePath(table: string): string {
  const safeTable = table.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
  if (!ALLOWED_CRUD_TABLES.has(safeTable)) {
    throw new Error(`Unauthorized table access: ${table}`);
  }
  const file = path.join(DATA_DIR, `${safeTable}.json`);
  if (!path.normalize(file).startsWith(DATA_DIR)) {
    throw new Error("Invalid file path detected");
  }
  return file;
}

export function getLocalCrudRows(table: string): any[] {
  try {
    const file = getFilePath(table);
    if (!fs.existsSync(file)) return [];
    const raw = fs.readFileSync(file, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalCrudRows(table: string, rows: any[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const file = getFilePath(table);
    fs.writeFileSync(file, JSON.stringify(rows, null, 2), "utf-8");
  } catch (err) {
    console.error(`Failed to save local table ${table}:`, err);
  }
}

export function createLocalCrudRow(table: string, payload: Record<string, any>): any {
  const rows = getLocalCrudRows(table);
  const newRow = {
    id: payload.id || crypto.randomUUID(),
    ...payload,
    created_at: payload.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  rows.unshift(newRow);
  saveLocalCrudRows(table, rows);
  return newRow;
}

export function updateLocalCrudRow(table: string, id: string, payload: Record<string, any>): any | null {
  const rows = getLocalCrudRows(table);
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  rows[idx] = {
    ...rows[idx],
    ...payload,
    updated_at: new Date().toISOString(),
  };
  saveLocalCrudRows(table, rows);
  return rows[idx];
}

export function deleteLocalCrudRow(table: string, id: string): boolean {
  const rows = getLocalCrudRows(table);
  const filtered = rows.filter((r) => r.id !== id);
  if (filtered.length === rows.length) return false;
  saveLocalCrudRows(table, filtered);
  return true;
}
