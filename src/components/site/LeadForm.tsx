import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang, useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { services } from "@/content/services";
import { validateInquiry, type InquiryErrors, type InquiryInput } from "@/lib/inquiry";
import { supabase } from "@/integrations/supabase/client";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const volumes = ["< 10,000", "10,000 – 100,000", "100,000 – 1,000,000", "> 1,000,000"];
const inputCls =
  "w-full rounded-[10px] border border-input bg-card px-4 py-3 text-[15px] placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-destructive";

export function LeadForm({ kind }: { kind: "contact" | "demo" }) {
  const t = useT();
  const { lang } = useLang();
  const [v, setV] = useState({
    full_name: "", email: "", company: "", phone: "", job_title: "", country: "", volume: "",
    services: [] as string[], integration: "", message: "", consent: false,
  });
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setV((s) => ({ ...s, [k]: e.target.value }));
  const err = (k: keyof InquiryErrors) => {
    const key = errors[k] as keyof typeof ui.form.err | undefined;
    return key && ui.form.err[key] ? t(ui.form.err[key]) : undefined;
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: InquiryInput = { kind, ...v, consent: v.consent as true };
    const r = validateInquiry(input);
    if (!r.ok) {
      setErrors(r.errors);
      const first = Object.keys(r.errors)[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    const d = r.data;
    const { error } = await supabase.from("inquiries").insert({
      kind: d.kind, full_name: d.full_name, email: d.email, company: d.company,
      phone: d.phone || null, job_title: d.job_title || null, country: d.country,
      volume: d.volume || null, services: d.services, integration: d.integration || null,
      message: d.message || null, consent: true, language: lang,
    });
    setStatus(error ? "error" : "done");
  }

  if (status === "done") {
    return (
      <div role="status" className="flex flex-col items-start gap-4 py-6">
        <CheckCircle2 className="size-10 text-success" />
        <h3 className="text-xl font-semibold">{t(ui.form.successTitle)}</h3>
        <p className="text-muted-foreground">{t(ui.form.successText)}</p>
        <Button variant="brandOutline" onClick={() => { setStatus("idle"); setV((s) => ({ ...s, message: "", integration: "" })); }}>
          {t(ui.form.another)}
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field id="full_name" label={t(ui.form.fullName)} required error={err("full_name")}>
        <input id="f-full_name" className={inputCls} autoComplete="name" value={v.full_name} onChange={set("full_name")} aria-invalid={!!errors.full_name} placeholder="John Smith" />
      </Field>
      <Field id="company" label={t(ui.form.company)} required error={err("company")}>
        <input id="f-company" className={inputCls} autoComplete="organization" value={v.company} onChange={set("company")} aria-invalid={!!errors.company} placeholder="Acme Corp" />
      </Field>
      <Field id="email" label={t(ui.form.email)} required error={err("email")}>
        <input id="f-email" type="email" className={inputCls} autoComplete="email" value={v.email} onChange={set("email")} aria-invalid={!!errors.email} placeholder="john@acme.com" />
      </Field>
      {kind === "demo" ? (
        <Field id="job_title" label={t(ui.form.jobTitle)} error={err("job_title")}>
          <input id="f-job_title" className={inputCls} autoComplete="organization-title" value={v.job_title} onChange={set("job_title")} />
        </Field>
      ) : (
        <Field id="phone" label={t(ui.form.phone)} error={err("phone")}>
          <input id="f-phone" type="tel" className={inputCls} autoComplete="tel" value={v.phone} onChange={set("phone")} placeholder="+880" />
        </Field>
      )}
      <Field id="country" label={t(ui.form.country)} required error={err("country")}>
        <input id="f-country" className={inputCls} autoComplete="country-name" value={v.country} onChange={set("country")} aria-invalid={!!errors.country} placeholder={lang === "bn" ? "বাংলাদেশ" : "Bangladesh"} />
      </Field>
      {kind === "demo" ? (
        <Field id="volume" label={t(ui.form.volume)}>
          <select id="f-volume" className={inputCls} value={v.volume} onChange={set("volume")}>
            <option value="">{t(ui.form.volumePick)}</option>
            {volumes.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </Field>
      ) : (
        <Field id="services" label={t(ui.form.service)} required error={err("services")}>
          <select id="f-services" className={inputCls} value={v.services[0] ?? ""} aria-invalid={!!errors.services}
            onChange={(e) => setV((s) => ({ ...s, services: e.target.value ? [e.target.value] : [] }))}>
            <option value="">{t(ui.form.servicePick)}</option>
            {services.map((s) => <option key={s.slug} value={s.slug}>{t(s.name)}</option>)}
          </select>
        </Field>
      )}

      {kind === "demo" && (
        <fieldset className="sm:col-span-2" aria-invalid={!!errors.services}>
          <legend className="mb-2 text-sm font-medium text-muted-foreground">
            {t(ui.form.services)} <span className="text-destructive">*</span>
          </legend>
          <div id="f-services" tabIndex={-1} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const on = v.services.includes(s.slug);
              return (
                <label key={s.slug} className={cn("flex cursor-pointer items-center gap-2 rounded-[10px] border px-3 py-2.5 text-sm", on ? "border-primary bg-primary-soft" : "border-input bg-card")}>
                  <input type="checkbox" className="accent-[var(--color-primary)]" checked={on}
                    onChange={() => setV((st) => ({ ...st, services: on ? st.services.filter((x) => x !== s.slug) : [...st.services, s.slug] }))} />
                  {t(s.name)}
                </label>
              );
            })}
          </div>
          {err("services") && <p className="mt-1.5 text-sm text-destructive">{err("services")}</p>}
        </fieldset>
      )}

      {kind === "demo" && (
        <Field id="integration" label={t(ui.form.integration)} full error={err("integration")}>
          <input id="f-integration" className={inputCls} value={v.integration} onChange={set("integration")} placeholder={t(ui.form.integrationHint)} />
        </Field>
      )}
      <Field id="message" label={t(kind === "demo" ? ui.form.additional : ui.form.message)} required={kind === "contact"} full error={err("message")}>
        <textarea id="f-message" rows={5} className={inputCls} value={v.message} onChange={set("message")} aria-invalid={!!errors.message} placeholder={t(ui.form.message) + "…"} />
      </Field>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-[15px] text-muted-foreground">
          <input id="f-consent" type="checkbox" className="mt-1 size-4 accent-[var(--color-primary)]" checked={v.consent}
            onChange={(e) => setV((s) => ({ ...s, consent: e.target.checked }))} aria-invalid={!!errors.consent} />
          <span>
            {t(ui.form.consentA)} <Link to="/privacy" className="text-primary underline">{t(ui.form.consentLink)}</Link> {t(ui.form.consentB)}
            <span className="text-destructive"> *</span>
          </span>
        </label>
        {err("consent") && <p className="mt-1.5 text-sm text-destructive">{err("consent")}</p>}
      </div>

      {status === "error" && (
        <div role="alert" className="flex gap-3 rounded-[10px] border border-destructive/30 bg-destructive/5 p-4 text-sm sm:col-span-2">
          <AlertCircle className="size-5 shrink-0 text-destructive" />
          <div>
            <p className="font-medium">{t(ui.form.errorTitle)}</p>
            <p className="text-muted-foreground">{t(ui.form.errorText)} <a className="text-primary underline" href={`mailto:${site.email}`}>{site.email}</a></p>
          </div>
        </div>
      )}

      <Button type="submit" variant="brand" size="lg" className="h-13 text-base sm:col-span-2" disabled={status === "sending"}>
        {status === "sending" ? t(ui.form.sending) : t(ui.form.submit)}
      </Button>
    </form>
  );
}

function Field({ id, label, required, error, full, children }: { id: string; label: string; required?: boolean | undefined; error?: string | undefined; full?: boolean | undefined; children: ReactNode }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label htmlFor={`f-${id}`} className="mb-2 block text-sm font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      {error && <p id={`e-${id}`} className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}
