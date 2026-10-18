/** Fixed addresses for the admin Mail section (from the brief). */
export const MAIL_FROM = "tech.support@smstraffic.ru";
export const MAIL_TO = "asif.ikbal@ritorica.com.bd";

export type MailAttachment = { path: string; name: string; size: number; type: string };
export type MailMessage = {
  id: string;
  thread_id: string;
  direction: "outbound" | "inbound";
  from_address: string;
  to_address: string;
  body: string;
  links: string[];
  attachments: MailAttachment[];
  delivery_status: "recorded" | "sent" | "failed" | "received";
  created_at: string;
};

export type ReplySpeed = { label: "Fast" | "On time" | "Late"; minutes: number };

/** Reply-speed thresholds in minutes. */
export const FAST_MINUTES = 30;
export const ON_TIME_MINUTES = 120;

export function speedFor(minutes: number): ReplySpeed {
  return { minutes, label: minutes <= FAST_MINUTES ? "Fast" : minutes <= ON_TIME_MINUTES ? "On time" : "Late" };
}

/**
 * How long tech.support took to answer: for every tech.support message that follows a
 * message from the other side, measure the gap. Returns one entry per reply.
 */
export function techSupportReplies(messages: Pick<MailMessage, "from_address" | "created_at" | "id">[]) {
  const out: (ReplySpeed & { messageId: string })[] = [];
  let waitingSince: number | null = null;
  for (const m of [...messages].sort((a, b) => a.created_at.localeCompare(b.created_at))) {
    const fromTech = m.from_address.toLowerCase() === MAIL_FROM;
    const t = new Date(m.created_at).getTime();
    if (!fromTech) {
      waitingSince ??= t;
    } else if (waitingSince != null) {
      out.push({ ...speedFor(Math.max(0, Math.round((t - waitingSince) / 60000))), messageId: m.id });
      waitingSince = null;
    }
  }
  return out;
}

export function formatMinutes(m: number) {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h < 48) return r ? `${h} h ${r} min` : `${h} h`;
  return `${Math.round(h / 24)} days`;
}
