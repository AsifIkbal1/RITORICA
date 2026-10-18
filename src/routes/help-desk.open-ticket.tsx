import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Loader2, ShieldAlert, RotateCcw } from "lucide-react";
import { useT } from "@/i18n/language";
import { Button } from "@/components/ui/button";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/help-desk/open-ticket")({
  head: () =>
    seo(
      "Help Desk & Ticket Portal",
      "Access the technical support ticket system powered by Goal Scaffold Kit.",
      "/help-desk/open-ticket",
    ),
  component: OpenTicketPage,
});

type ServerState = "checking" | "running" | "starting" | "error";

function OpenTicketPage() {
  const t = useT();
  const [serverState, setServerState] = useState<ServerState>("checking");
  const [serverUrl, setServerUrl] = useState("http://localhost:8081");
  const [reloadKey, setReloadKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const startServer = async () => {
    setServerState("starting");
    try {
      const res = await fetch("/api/ticket-server", { method: "POST" });
      if (!res.ok) throw new Error("Server launch failed");
      const data = await res.json();
      if (data.url) setServerUrl(data.url);
      setServerState(data.running ? "running" : "error");
    } catch {
      setServerState("error");
    }
  };

  const handleRetry = async () => {
    setServerState("checking");
    try {
      const getRes = await fetch("/api/ticket-server", { method: "GET" });
      const getData = await getRes.json();
      if (getData.running) {
        if (getData.url) setServerUrl(getData.url);
        setReloadKey((k) => k + 1);
        setServerState("running");
        return;
      }
    } catch {}
    await startServer();
  };

  useEffect(() => {
    let isMounted = true;
    const checkOrStart = async () => {
      try {
        const res = await fetch("/api/ticket-server", { method: "GET" });
        const data = await res.json();
        if (!isMounted) return;
        if (data.running) {
          if (data.url) setServerUrl(data.url);
          setServerState("running");
        } else {
          await startServer();
        }
      } catch {
        if (isMounted) await startServer();
      }
    };
    checkOrStart();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const unlockIframe = () => {
      try {
        iframeRef.current?.contentWindow?.postMessage({ type: "UNLOCK_AUDIO" }, "*");
      } catch {}
    };
    window.addEventListener("pointerdown", unlockIframe, { passive: true });
    window.addEventListener("click", unlockIframe, { passive: true });
    window.addEventListener("keydown", unlockIframe, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", unlockIframe);
      window.removeEventListener("click", unlockIframe);
      window.removeEventListener("keydown", unlockIframe);
    };
  }, []);

  return (
    <section className="container-site py-4">
      {serverState === "starting" || serverState === "checking" ? (
        <div className="flex h-[80vh] flex-col items-center justify-center p-8 text-center">
          <Loader2 className="size-10 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">
            {t({ en: "Connecting to Ticket Portal...", bn: "টিকিট পোর্টালে সংযোগ করা হচ্ছে..." })}
          </p>
        </div>
      ) : serverState === "error" ? (
        <div className="flex h-[70vh] flex-col items-center justify-center p-8 text-center">
          <ShieldAlert className="size-10 text-destructive" />
          <h2 className="mt-4 text-lg font-semibold text-destructive">
            {t({ en: "Unable to connect to Ticket Server", bn: "টিকিট সার্ভারে সংযোগ করা সম্ভব হয়নি" })}
          </h2>
          <Button onClick={handleRetry} className="mt-4 gap-2" variant="brand">
            <RotateCcw className="size-4" />
            {t({ en: "Retry", bn: "আবার চেষ্টা করুন" })}
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2 text-xs">
            <span className="font-medium text-muted-foreground flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              {t({ en: "SupportDesk Portal Active", bn: "সাপোর্টডেস্ক পোর্টাল চালু আছে" })}
            </span>
            <a
              href={serverUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
            >
              {t({ en: "Open in Full Screen ↗", bn: "ফুল স্ক্রিনে খুলুন ↗" })}
            </a>
          </div>
          <iframe
            key={reloadKey}
            ref={iframeRef}
            src={serverUrl}
            title="Help Desk & Ticket Portal"
            allow="autoplay; clipboard-write; clipboard-read"
            className="h-[calc(100vh-160px)] min-h-[720px] w-full border-0 bg-background"
          />
        </div>
      )}
    </section>
  );
}
