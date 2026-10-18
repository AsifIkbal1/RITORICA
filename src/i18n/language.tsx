import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "bn";
/** A piece of copy in both site languages. */
export type L = { en: string; bn: string };
export type LList = { en: string[]; bn: string[] };

const STORAGE_KEY = "ritorica-lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void };
const LanguageContext = createContext<Ctx>({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "bn") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage unavailable: preference lasts for this visit only */
    }
  }, []);

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  return useContext(LanguageContext);
}

/** Returns a translator: t({en, bn}) → string in the active language. */
export function useT() {
  const { lang } = useLang();
  return useCallback(
    <V,>(v: { en: V; bn: V }): V => v[lang],
    [lang],
  );
}
