import { Server, Cpu, Smartphone, FileCheck2 } from "lucide-react";
import { useT } from "@/i18n/language";

/** Conceptual flow: business system → Ritorica platform → channels → delivery report. */
export function WorkflowDiagram() {
  const t = useT();
  const steps = [
    { icon: Server, title: { en: "Your system", bn: "আপনার সিস্টেম" }, text: { en: "App, website, CRM or core banking sends an API request.", bn: "অ্যাপ, ওয়েবসাইট, CRM বা কোর ব্যাংকিং API রিকোয়েস্ট পাঠায়।" } },
    { icon: Cpu, title: { en: "Ritorica platform", bn: "Ritorica প্ল্যাটফর্ম" }, text: { en: "Validates, routes and applies channel fallback rules.", bn: "যাচাই, রাউটিং ও চ্যানেল ফলব্যাক নিয়ম প্রয়োগ করে।" } },
    { icon: Smartphone, title: { en: "Channels", bn: "চ্যানেল" }, text: { en: "SMS, WhatsApp, Viber, Telegram, email, push or voice.", bn: "এসএমএস, হোয়াটসঅ্যাপ, ভাইবার, টেলিগ্রাম, ইমেইল, পুশ বা ভয়েস।" } },
    { icon: FileCheck2, title: { en: "Delivery report", bn: "ডেলিভারি রিপোর্ট" }, text: { en: "Status returned by API query or callback to your server.", bn: "API কোয়েরি বা আপনার সার্ভারে কলব্যাকে স্ট্যাটাস ফেরত আসে।" } },
  ];
  return (
    <figure>
      <ol className="grid gap-4 md:grid-cols-4">
        {steps.map((s, i) => (
          <li key={i} className="surface-card relative p-6">
            <span className="text-xs font-bold text-primary">0{i + 1}</span>
            <s.icon className="mt-3 size-9 text-primary" />
            <h3 className="mt-4 font-semibold">{t(s.title)}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t(s.text)}</p>
            {i < steps.length - 1 && <span aria-hidden className="node-pulse absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground md:flex" style={{ animationDelay: `${i * 0.6}s` }}>→</span>}
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-xs text-muted-foreground">{t({ en: "Conceptual overview — available channels depend on your account configuration.", bn: "ধারণাগত চিত্র — উপলব্ধ চ্যানেল আপনার অ্যাকাউন্ট কনফিগারেশনের উপর নির্ভর করে।" })}</figcaption>
    </figure>
  );
}
