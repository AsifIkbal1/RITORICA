import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock, Globe } from "lucide-react";
import { useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { site } from "@/config/site";
import { Breadcrumbs } from "@/components/site/blocks";
import { LeadForm } from "@/components/site/LeadForm";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact Us", "Contact the Ritorica team about SMS, OTP, messaging channels, pricing and API integration.", "/contact"),
  component: ContactPage,
});

function ContactPage() {
  const t = useT();
  const rows = [
    { icon: Mail, label: t({ en: "Email", bn: "ইমেইল" }), value: <a href={`mailto:${site.email}`} className="text-primary hover:underline">{site.email}</a> },
    { icon: Phone, label: t({ en: "Phone", bn: "ফোন" }), value: <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="hover:text-primary">{site.phone}</a> },
    { icon: Globe, label: t({ en: "Website", bn: "ওয়েবসাইট" }), value: <a href={`https://${site.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{site.website}</a> },
    { icon: MapPin, label: t({ en: "Address", bn: "ঠিকানা" }), value: t(site.address) },
    { icon: Clock, label: t({ en: "Office hours", bn: "অফিস সময়" }), value: t(site.hours) },
  ];
  return (
    <section className="container-site pt-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <div className="surface-card p-8 sm:p-10">
          <Breadcrumbs items={[{ label: t(ui.nav.contact) }]} />
          <p className="eyebrow">{t(ui.nav.contact)}</p>
          <h1 className="heading-brand mt-2 text-3xl sm:text-4xl">{t({ en: "Get in touch", bn: "যোগাযোগ করুন" })}</h1>
          <p className="mt-4 text-muted-foreground">{t({ en: "Fill in your details and our team will get back to you.", bn: "আপনার তথ্য দিন, আমাদের টিম আপনার সাথে যোগাযোগ করবে।" })}</p>
          <ul className="mt-8 space-y-5">
            {rows.map((r) => (
              <li key={r.label} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"><r.icon className="size-5" /></span>
                <div><p className="text-sm text-muted-foreground">{r.label}</p><p className="font-medium">{r.value}</p></div>
              </li>
            ))}
          </ul>
        </div>
        <div className="surface-card p-8 sm:p-10">
          <LeadForm kind="contact" />
        </div>
      </div>
    </section>
  );
}
