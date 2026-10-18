import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  type LookupItem,
  type LookupsStore,
  DEFAULT_CATEGORIES,
  DEFAULT_DEPARTMENTS,
} from "./lookups.shared";

export { type LookupItem, type LookupsStore, DEFAULT_CATEGORIES, DEFAULT_DEPARTMENTS };

const DATA_DIR = path.resolve(process.cwd(), "data");
const LOOKUPS_FILE = path.join(DATA_DIR, "lookups.json");


export function getLocalLookups(): LookupsStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOOKUPS_FILE)) {
      const initial: LookupsStore = {
        categories: DEFAULT_CATEGORIES,
        departments: DEFAULT_DEPARTMENTS,
      };
      fs.writeFileSync(LOOKUPS_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(LOOKUPS_FILE, "utf-8");
    const data = JSON.parse(raw) as LookupsStore;

    // Ensure both arrays exist and have defaults if empty
    let updated = false;
    if (!Array.isArray(data.categories) || data.categories.length === 0) {
      data.categories = DEFAULT_CATEGORIES;
      updated = true;
    }
    if (!Array.isArray(data.departments) || data.departments.length === 0) {
      data.departments = DEFAULT_DEPARTMENTS;
      updated = true;
    }
    if (updated) {
      fs.writeFileSync(LOOKUPS_FILE, JSON.stringify(data, null, 2), "utf-8");
    }
    return data;
  } catch (err) {
    console.error("Failed to read lookups file:", err);
    return {
      categories: DEFAULT_CATEGORIES,
      departments: DEFAULT_DEPARTMENTS,
    };
  }
}

export function saveLocalLookups(data: LookupsStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOOKUPS_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save lookups file:", err);
  }
}

export function getLookupsServer(table: "categories" | "departments"): LookupItem[] {
  const store = getLocalLookups();
  return store[table] || [];
}

export function saveLookupRecordServer(params: {
  table: "categories" | "departments";
  id?: string | null;
  name: string;
  description?: string | null;
  is_active?: boolean;
}): LookupItem {
  const store = getLocalLookups();
  const list = store[params.table] || [];
  const now = new Date().toISOString();

  if (params.id) {
    // Update existing
    const idx = list.findIndex((item) => item.id === params.id);
    if (idx !== -1) {
      const updated: LookupItem = {
        ...list[idx],
        name: params.name.trim(),
        description: params.description?.trim() || null,
        is_active: params.is_active ?? true,
        updated_at: now,
      };
      list[idx] = updated;
      store[params.table] = list;
      saveLocalLookups(store);
      return updated;
    }
  }

  // Create new with a valid UUID
  const newItem: LookupItem = {
    id: params.id || crypto.randomUUID(),
    name: params.name.trim(),
    description: params.description?.trim() || null,
    is_active: params.is_active ?? true,
    created_at: now,
    updated_at: now,
  };
  list.push(newItem);
  store[params.table] = list;
  saveLocalLookups(store);
  return newItem;
}

export function deleteLookupRecordServer(params: {
  table: "categories" | "departments";
  id: string;
}): boolean {
  const store = getLocalLookups();
  const list = store[params.table] || [];
  const filtered = list.filter((item) => item.id !== params.id);
  store[params.table] = filtered;
  saveLocalLookups(store);
  return true;
}
