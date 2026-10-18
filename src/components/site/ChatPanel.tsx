import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { X } from "lucide-react";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { useLang, useT } from "@/i18n/language";
import { ui } from "@/i18n/ui";
import { cn } from "@/lib/utils";

const MAX_TEXT = 2000;

/** Chat window: one conversation for this visit, answers stream from the Ritorica assistant. */
export default function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const { lang } = useLang();
  const langRef = useRef(lang);
  langRef.current = lang;
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/chat", body: () => ({ lang: langRef.current }) }));
  const { messages, sendMessage, status, stop, error } = useChat({ transport });
  const busy = status === "submitted" || status === "streaming";

  // Keep the message box focused when the window opens and after each answer.
  useEffect(() => {
    if (open && !busy) inputRef.current?.focus();
  }, [open, busy]);

  const send = (text: string) => {
    const clean = text.trim().slice(0, MAX_TEXT);
    if (!clean || busy) return;
    void sendMessage({ text: clean });
  };

  const lastIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div
      id="site-chat"
      role="dialog"
      aria-label={t(ui.chat.name)}
      className={cn(
        "chat-panel fixed bottom-24 right-4 z-50 flex h-[min(600px,calc(100dvh-8rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-lift)] sm:right-6",
        !open && "hidden",
      )}
    >
      <header className="flex items-center gap-3 bg-gradient-to-r from-primary to-primary/80 px-5 py-4 text-primary-foreground">
        <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20 text-lg font-bold">
          A
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">{t(ui.chat.name)}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs opacity-90">
            <span className="size-2 rounded-full bg-success" />
            {t(ui.chat.status)}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label={t(ui.chat.close)} className="rounded-md p-1.5 hover:bg-primary-foreground/15">
          <X className="size-5" />
        </button>
      </header>

      <Conversation className="flex-1">
        <ConversationContent className="gap-4 p-4">
          <Message from="assistant">
            <MessageContent className="rounded-2xl rounded-tl-sm bg-primary-soft px-4 py-3 text-[15px] leading-relaxed">
              <p className="whitespace-pre-line">{t(ui.chat.welcome)}</p>
            </MessageContent>
          </Message>

          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {ui.chat.suggestions.map((s) => (
                <button
                  key={s.en}
                  type="button"
                  onClick={() => send(t(s))}
                  className="rounded-full border border-primary/30 bg-card px-3 py-1.5 text-sm text-primary hover:bg-primary-soft"
                >
                  {t(s)}
                </button>
              ))}
            </div>
          )}

          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              <MessageContent
                className={cn(
                  "text-[15px] leading-relaxed",
                  m.role === "user"
                    ? "group-[.is-user]:rounded-2xl group-[.is-user]:rounded-tr-sm group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground"
                    : "rounded-2xl rounded-tl-sm bg-primary-soft px-4 py-3",
                )}
              >
                {m.parts.map((p, i) =>
                  p.type !== "text" ? null : m.role === "user" ? (
                    <p key={i} className="whitespace-pre-wrap">
                      {p.text}
                    </p>
                  ) : (
                    <MessageResponse key={i} isAnimating={status === "streaming" && m.id === messages[messages.length - 1]?.id}>
                      {p.text}
                    </MessageResponse>
                  ),
                )}
              </MessageContent>
            </Message>
          ))}

          {status === "submitted" && lastIsUser && (
            <Message from="assistant">
              <MessageContent className="rounded-2xl rounded-tl-sm bg-primary-soft px-4 py-3">
                <Shimmer className="text-sm">{t(ui.chat.thinking)}</Shimmer>
              </MessageContent>
            </Message>
          )}

          {error && (
            <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {t(ui.chat.error)}
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border p-3">
        <PromptInput onSubmit={({ text }) => send(text)} className="[&_[data-slot=input-group]]:rounded-xl">
          <PromptInputTextarea
            ref={inputRef}
            placeholder={t(ui.chat.placeholder)}
            maxLength={MAX_TEXT}
            className="min-h-11 text-[15px]"
            aria-label={t(ui.chat.placeholder)}
          />
          <PromptInputFooter className="justify-end py-1.5">
            <PromptInputSubmit status={status} onStop={stop} className="rounded-lg bg-primary text-primary-foreground hover:bg-primary/90" />
          </PromptInputFooter>
        </PromptInput>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">{t(ui.chat.footer)}</p>
      </div>
    </div>
  );
}
