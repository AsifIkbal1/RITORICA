import { createFileRoute, Link } from "@tanstack/react-router";
import { KeyRound, Server, Webhook, ListChecks } from "lucide-react";
import { useT, type L } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { site } from "@/config/site";
import { Button } from "@/components/ui/button";
import { PageHero, Section, CTASection } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/developers")({
  head: () => seo("API & Developer Integrations", "Ritorica HTTP(S) API for sending SMS and OTP, checking delivery status and balance, managing contact lists, SMPP and delivery callbacks.", "/developers"),
  component: DevelopersPage,
});

type Param = { f: string; type: string; req: boolean; d: L };

const sendParams: Param[] = [
  { f: "login", type: "string", req: true, d: { en: "Your account login", bn: "আপনার অ্যাকাউন্ট লগইন" } },
  { f: "password", type: "string", req: true, d: { en: "Your account password", bn: "আপনার অ্যাকাউন্ট পাসওয়ার্ড" } },
  { f: "phones", type: "string", req: true, d: { en: "Comma-separated numbers in international format without +", bn: "+ ছাড়া আন্তর্জাতিক ফরম্যাটে কমা দিয়ে আলাদা নম্বর" } },
  { f: "message", type: "string", req: true, d: { en: "SMS text. Max 160 Latin or 70 Unicode characters per part; long messages split automatically", bn: "এসএমএস টেক্সট। প্রতি অংশে সর্বোচ্চ ১৬০ ল্যাটিন বা ৭০ ইউনিকোড অক্ষর; দীর্ঘ মেসেজ স্বয়ংক্রিয়ভাবে ভাগ হয়" } },
  { f: "originator", type: "string", req: false, d: { en: "Sender name — up to 11 alphanumeric characters or 15 digits", bn: "সেন্ডারের নাম — সর্বোচ্চ ১১টি অক্ষর-সংখ্যা বা ১৫ ডিজিট" } },
  { f: "rus", type: "integer", req: false, d: { en: "Encoding: 0 = Latin (default), 5 = UTF-8", bn: "এনকোডিং: ০ = ল্যাটিন (ডিফল্ট), ৫ = UTF-8" } },
  { f: "start_date", type: "string", req: false, d: { en: "Schedule time YYYY-MM-DD HH:MM:SS (max 3 days ahead)", bn: "শিডিউল সময় YYYY-MM-DD HH:MM:SS (সর্বোচ্চ ৩ দিন আগে)" } },
  { f: "timeout", type: "integer", req: false, d: { en: "SMS lifetime in seconds, max 86400", bn: "সেকেন্ডে এসএমএসের মেয়াদ, সর্বোচ্চ ৮৬৪০০" } },
  { f: "want_sms_ids", type: "0 or 1", req: false, d: { en: "Set to 1 to receive message IDs for tracking", bn: "ট্র্যাকিংয়ের জন্য মেসেজ আইডি পেতে ১ দিন" } },
  { f: "group", type: "string", req: false, d: { en: "Saved contact group — replaces phones", bn: "সংরক্ষিত কনট্যাক্ট গ্রুপ — phones-এর পরিবর্তে" } },
];

const statuses: { s: string; final: boolean; d: L }[] = [
  { s: "Delivered", final: true, d: { en: "Message reached the handset", bn: "মেসেজ ফোনে পৌঁছেছে" } },
  { s: "Non Delivered", final: true, d: { en: "Failed — invalid number, blocked subscriber or barring", bn: "ব্যর্থ — ভুল নম্বর, ব্লকড গ্রাহক বা বাধা" } },
  { s: "Expired", final: true, d: { en: "Phone off or memory full during message lifetime", bn: "মেয়াদকালে ফোন বন্ধ বা মেমরি পূর্ণ" } },
  { s: "Rejected", final: true, d: { en: "Operator rejected — sender, format or spam filter", bn: "অপারেটর প্রত্যাখ্যান করেছে — সেন্ডার, ফরম্যাট বা স্প্যাম ফিল্টার" } },
  { s: "Checked", final: true, d: { en: "Subscriber used the OTP", bn: "গ্রাহক ওটিপি ব্যবহার করেছেন" } },
  { s: "Buffered SMSC", final: false, d: { en: "Still trying to deliver", bn: "এখনও পৌঁছানোর চেষ্টা চলছে" } },
];

const ops = [
  { icon: Server, op: "send", d: { en: "Send a single or bulk SMS", bn: "একক বা বাল্ক এসএমএস পাঠান" } },
  { icon: ListChecks, op: "operation=status", d: { en: "Check delivery status (history kept 2 days)", bn: "ডেলিভারি স্ট্যাটাস দেখুন (২ দিনের ইতিহাস)" } },
  { icon: KeyRound, op: "operation=account", d: { en: "Check account credit balance", bn: "অ্যাকাউন্ট ব্যালেন্স দেখুন" } },
  { icon: Webhook, op: "callback", d: { en: "Automatic delivery status notifications", bn: "স্বয়ংক্রিয় ডেলিভারি স্ট্যাটাস নোটিফিকেশন" } },
];

function DevelopersPage() {
  const t = useT();
  return (
    <>
      <PageHero
        crumbs={[{ label: t(ui.nav.developers) }]}
        eyebrow={t({ en: "API Documentation", bn: "API ডকুমেন্টেশন" })}
        title={t({ en: "API & Developer Integrations", bn: "API ও ডেভেলপার ইন্টিগ্রেশন" })}
        text={t({ en: "Connect your applications with a simple HTTP(S) API or SMPP. Send messages, track delivery, check your balance and manage contact lists.", bn: "সহজ HTTP(S) API বা SMPP দিয়ে আপনার অ্যাপ্লিকেশন যুক্ত করুন। মেসেজ পাঠান, ডেলিভারি ট্র্যাক করুন, ব্যালেন্স দেখুন এবং কনট্যাক্ট লিস্ট পরিচালনা করুন।" })}
        actions={<Button asChild variant="brand" size="lg"><Link to="/request-demo">{t(ui.cta.talkDev)}</Link></Button>}
      />

      <Section>
        <div className="rounded-2xl bg-navy-deep p-6 text-navy-foreground sm:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full bg-primary/25 px-3 py-1 text-xs font-bold tracking-widest">{t({ en: "ENDPOINTS", bn: "এন্ডপয়েন্ট" })}</span>
            <h2 className="mt-4 text-3xl font-bold">{t({ en: "API Operations", bn: "API অপারেশন" })}</h2>
            <p className="mt-3 text-navy-muted">
              {t({ en: "All HTTP(S) operations use the same endpoint with different parameters:", bn: "সব HTTP(S) অপারেশন ভিন্ন প্যারামিটারসহ একই এন্ডপয়েন্ট ব্যবহার করে:" })}{" "}
              <code className="rounded bg-navy px-1.5 py-0.5 font-mono text-sm">{site.apiHost}/multi.php</code>
              {t({ en: ". Mailing lists use ", bn: "। মেইলিং লিস্ট ব্যবহার করে " })}
              <code className="rounded bg-navy px-1.5 py-0.5 font-mono text-sm">{site.apiHost}/list.php</code>.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ops.map((o) => (
              <div key={o.op} className="rounded-xl border border-navy bg-navy p-5">
                <o.icon className="size-6 text-code-type" />
                <p className="mt-3 font-mono text-sm text-code-key">{o.op}</p>
                <p className="mt-1 text-sm text-navy-muted">{t(o.d)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-xl border border-navy">
            <div className="flex flex-wrap items-center gap-3 border-b border-navy bg-navy px-5 py-4">
              <span className="rounded-md bg-success/25 px-2.5 py-1 text-xs font-bold text-code-ok">POST</span>
              <code className="font-mono text-sm">/multi.php</code>
              <span className="ml-auto text-sm text-navy-muted">{t({ en: "Send a single or bulk SMS", bn: "একক বা বাল্ক এসএমএস পাঠান" })}</span>
            </div>
            <div className="grid grid-cols-1 gap-6 bg-navy p-5 lg:grid-cols-2 [&>*]:min-w-0">
              <div className="overflow-x-auto">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-muted">{t({ en: "Request parameters", bn: "রিকোয়েস্ট প্যারামিটার" })}</p>
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="text-xs uppercase text-navy-muted">
                    <tr><th className="pb-2 pr-3">{t({ en: "Field", bn: "ফিল্ড" })}</th><th className="pb-2 pr-3">{t({ en: "Type", bn: "ধরন" })}</th><th className="pb-2">{t({ en: "Description", bn: "বিবরণ" })}</th></tr>
                  </thead>
                  <tbody>
                    {sendParams.map((p) => (
                      <tr key={p.f} className="border-t border-navy-deep/60 align-top">
                        <td className="py-2.5 pr-3 font-mono text-code-key">{p.f}</td>
                        <td className="py-2.5 pr-3 whitespace-nowrap text-code-type">{p.type} <span className={p.req ? "text-destructive" : "text-navy-muted"}>{p.req ? t({ en: "required", bn: "আবশ্যক" }) : t({ en: "optional", bn: "ঐচ্ছিক" })}</span></td>
                        <td className="py-2.5 text-navy-muted">{t(p.d)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-muted">{t({ en: "Example request & response", bn: "উদাহরণ রিকোয়েস্ট ও রেসপন্স" })} · {t(ui.draft.illustrative)}</p>
                <pre className="code-panel overflow-x-auto p-5">{`POST /multi.php HTTP/1.0
Host: ${site.apiHost}
Content-Type: application/x-www-form-urlencoded

login=mylogin&password=mypassword
&phones=8801XXXXXXXXX
&originator=Ritorica
&message=Your+OTP+is+481923
&want_sms_ids=1

<?xml version="1.0" ?>
<reply>
  <result>OK</result>
  <code>0</code>
  <description>queued 1 messages</description>
  <message_infos>
    <message_info>
      <phone>8801XXXXXXXXX</phone>
      <sms_id>1000472891</sms_id>
    </message_info>
  </message_infos>
</reply>`}</pre>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 [&>*]:min-w-0">
            <div className="rounded-xl border border-navy bg-navy p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-muted">{t({ en: "Delivery status values", bn: "ডেলিভারি স্ট্যাটাসের মান" })}</p>
              <ul className="space-y-2 text-sm">
                {statuses.map((s) => (
                  <li key={s.s} className="grid grid-cols-[7rem_1fr] gap-x-2 sm:grid-cols-[8.5rem_6rem_1fr] [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1">
                    <span className="font-mono text-code-key">{s.s}</span>
                    <span className="text-code-type">{s.final ? "Final" : "Transitional"}</span>
                    <span className="text-navy-muted">{t(s.d)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-navy bg-navy p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-navy-muted">{t({ en: "Delivery callback (webhook)", bn: "ডেলিভারি কলব্যাক (ওয়েবহুক)" })} · {t(ui.draft.illustrative)}</p>
              <p className="mb-3 text-sm text-navy-muted">{t({ en: "Share your callback URL with the Ritorica support team. The platform posts to it after every status change; your server must answer HTTP 200.", bn: "আপনার কলব্যাক URL Ritorica সাপোর্ট টিমকে দিন। প্রতিটি স্ট্যাটাস পরিবর্তনের পর প্ল্যাটফর্ম সেখানে পোস্ট করে; আপনার সার্ভারকে HTTP 200 দিতে হবে।" })}</p>
              <pre className="code-panel overflow-x-auto p-5">{`POST /your-callback-url HTTP/1.1
Host: yourapp.com
Content-Type: application/x-www-form-urlencoded

sms_id=1000472891
&status=Delivered
&delivery_date=2025-04-29 10:23:03
&error_code=0`}</pre>
            </div>
          </div>
        </div>
      </Section>

      <Section id="integration" title={t({ en: "Integration workflow", bn: "ইন্টিগ্রেশনের ধাপ" })}>
        <ol className="grid gap-4 md:grid-cols-4">
          {[
            { en: "Request a demo and receive test account credentials", bn: "ডেমো অনুরোধ করুন এবং টেস্ট অ্যাকাউন্টের তথ্য পান" },
            { en: "Register your sender ID and channels", bn: "আপনার সেন্ডার আইডি ও চ্যানেল নিবন্ধন করুন" },
            { en: "Connect via HTTP API or SMPP and test", bn: "HTTP API বা SMPP দিয়ে যুক্ত হয়ে পরীক্ষা করুন" },
            { en: "Set your callback URL and go live", bn: "কলব্যাক URL সেট করে চালু করুন" },
          ].map((s, i) => (
            <li key={i} className="surface-card p-6"><span className="heading-brand text-3xl">{i + 1}</span><p className="mt-3 text-[15px]">{t(s)}</p></li>
          ))}
        </ol>
        <div className="surface-card mt-6 p-6 text-sm text-muted-foreground">
          <p><strong className="text-foreground">SMPP:</strong> {t({ en: "SMPP connections are available for high-volume senders and aggregators. Connection details are provided after account approval.", bn: "বেশি পরিমাণে প্রেরক ও অ্যাগ্রিগেটরদের জন্য SMPP সংযোগ পাওয়া যায়। অ্যাকাউন্ট অনুমোদনের পর সংযোগের তথ্য দেওয়া হয়।" })}</p>
          <p className="mt-2"><strong className="text-foreground">{t({ en: "Authentication:", bn: "প্রমাণীকরণ:" })}</strong> {t({ en: "Each request carries your account login and password. Keep credentials on your server only and always use HTTPS.", bn: "প্রতিটি রিকোয়েস্টে আপনার অ্যাকাউন্ট লগইন ও পাসওয়ার্ড থাকে। তথ্যগুলো শুধু আপনার সার্ভারে রাখুন এবং সবসময় HTTPS ব্যবহার করুন।" })}</p>
          <p className="mt-2">{t({ en: "Examples on this page use placeholder values. Full API reference is shared with registered developers.", bn: "এই পেজের উদাহরণে প্লেসহোল্ডার মান ব্যবহার করা হয়েছে। পূর্ণ API রেফারেন্স নিবন্ধিত ডেভেলপারদের দেওয়া হয়।" })}</p>
        </div>
      </Section>
      <CTASection />
    </>
  );
}
