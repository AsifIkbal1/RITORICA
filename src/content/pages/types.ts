import type { L, LList } from "@/i18n/language";

/**
 * Detail pages opened from the main menu (Products, Channels, Solutions, Resources, Developers).
 * Copy follows ritorica.com; every visible string is bilingual.
 */
export type PageGroup = "products" | "channels" | "solutions" | "resources" | "developers";

/** Table cells may be plain technical text (same in both languages) or bilingual copy. */
export type Cell = string | L;

export type FeatureItem = { title: L; text?: L; points?: LList; tag?: L };

export type PageSection =
  /** Grid of cards. "tiles" = blue numbered tiles, "cards" = white cards with optional bullet points. */
  | { kind: "features"; id?: string; title: L; intro?: L; style?: "cards" | "tiles"; items: FeatureItem[] }
  /** Check-mark list. */
  | { kind: "list"; id?: string; title: L; intro?: L; items: LList }
  /** Numbered process (onboarding / implementation). */
  | { kind: "steps"; id?: string; title: L; intro?: L; items: { title: L; text: L }[] }
  /** Data table (API parameters, comparisons, pricing models). */
  | { kind: "table"; id?: string; title: L; intro?: L; head: Cell[]; rows: Cell[][] }
  /** Code samples; code is never translated. */
  | { kind: "code"; id?: string; title: L; intro?: L; blocks: { label: L; code: string }[] }
  /** Plain paragraphs. */
  | { kind: "text"; id?: string; title: L; paragraphs: L[] }
  /** Big numbers. */
  | { kind: "stats"; id?: string; title: L; intro?: L; items: { value: L; label: L }[] }
  /** Article / report / case-study cards. */
  | { kind: "articles"; id?: string; title: L; intro?: L; items: { tag?: L; title: L; text: L; meta?: L }[] }
  /** Questions and answers. */
  | { kind: "faq"; id?: string; title: L; items: { q: L; a: L }[] };

/**
 * Developer pages (API docs, integration guides) copy the ritorica.com developer layout:
 * gradient hero, badge strip, dark navy bands, endpoint cards and code tabs.
 * In bilingual text, `code` renders as inline code and **text** as bold.
 */
export type DotColor = "primary" | "warning" | "success" | "violet" | "destructive" | "sky" | "pink";
export type GuideIcon = "sms" | "whatsapp" | "phone" | "bell" | "send" | "repeat" | "lock" | "cart" | "calendar" | "pulse" | "map" | "refresh";
export type Level = "beginner" | "intermediate" | "advanced";
export type BadgeIcon = "code" | "shield" | "lock" | "pulse" | "globe" | "clock" | "hexagon";

export type ParamRow = { field: string; type?: Cell; req?: "required" | "required*" | "optional"; text: L };
export type ParamTable = { title: L; head: L[]; rows: ParamRow[] };
export type Endpoint = {
  method: "POST" | "CALLBACK";
  path: string;
  summary: L;
  /** Optional "How it works" paragraph shown above the tables. */
  how?: L;
  tables: ParamTable[];
  example: { title: L; code: string };
};

export type DevSection = { id: string; eyebrow: L; title: L; intro?: L; tone?: "light" | "dark" } & (
  | { kind: "auth"; endpoint: { label: L; url: string; tag: string }; items: { title: L; text: L; code: string }[] }
  | { kind: "endpoints"; items: Endpoint[] }
  | { kind: "limits"; head: L[]; rows: { op: string; limit: L; note: L }[] }
  | { kind: "errors"; items: { code: string; title: L; text: L }[] }
  | { kind: "languages"; items: { name: Cell; lib: string; color: DotColor; text: L; link: { label: L; to: string } }[] }
  | { kind: "steps"; items: { title: L; text: L }[] }
  | { kind: "codeTabs"; tabs: { label: string; code: string }[] }
  | { kind: "guides"; items: { icon: GuideIcon; color: DotColor; level: Level; title: L; text: L; read: L; tags: string }[] }
);

export type DevLayout = {
  /** Second hero line, shown in light blue. */
  titleAccent: L;
  badges: { icon: BadgeIcon; label: L }[];
  heroActions: { label: L; to: string; solid?: boolean }[];
  sections: DevSection[];
  ctaActions: { label: L; to: string; solid?: boolean }[];
};

export type RichPage = {
  group: PageGroup;
  slug: string;
  /** Short name used in breadcrumbs. */
  name: L;
  eyebrow?: L;
  title: L;
  intro: L;
  /** Small line under the hero buttons, e.g. throughput or pricing note. */
  highlight?: L;
  /** English meta description (≤160 chars). */
  description: string;
  sections: PageSection[];
  /** Show the shared "Why businesses trust Ritorica" block (approved company facts). Default true. */
  trust?: boolean;
  cta?: { title: L; text: L };
  /** When set, the page uses the developer layout and `sections` is ignored. */
  dev?: DevLayout;
};
