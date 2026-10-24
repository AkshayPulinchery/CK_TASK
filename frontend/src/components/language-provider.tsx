"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { DEFAULT_LANG, fill, isLang, translate, type Lang } from "@/lib/i18n";

export const LANG_STORAGE_KEY = "civicforce-lang";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Translate a dictionary key. */
  t: (key: string) => string;
  /** Translate a key whose value contains a {n} placeholder. */
  tCount: (key: string, n: number) => string;
  /** Translate a key, substituting every {name} placeholder from `vars`. */
  tFill: (key: string, vars: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

/** Convenience hook — the same object, named for call sites that only translate. */
export function useI18n(): LanguageContextValue {
  return useLanguage();
}

// Small external store around the persisted language. `getServerSnapshot`
// returns the default so the server and first client render agree; React
// re-reads the client snapshot right after hydration without a hydration
// mismatch — the same pattern the theme uses.
const listeners = new Set<() => void>();

function subscribeLang(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (isLang(stored)) return stored;
  } catch {
    /* localStorage unavailable — fall through to the default */
  }
  return DEFAULT_LANG;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(
    subscribeLang,
    readStoredLang,
    () => DEFAULT_LANG
  );

  // Manual override for this session, so a change applies even when the
  // external-store notification has not fired yet.
  const [override, setOverride] = useState<Lang | null>(null);
  const activeLang = override ?? lang;

  // Reflect the active language on <html lang> for screen readers and search.
  useEffect(() => {
    document.documentElement.lang = activeLang;
  }, [activeLang]);

  const setLang = useCallback((next: Lang) => {
    setOverride(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      /* ignore persistence failures */
    }
    listeners.forEach((listener) => listener());
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang: activeLang,
      setLang,
      t: (key: string) => translate(activeLang, key),
      tCount: (key: string, n: number) => fill(translate(activeLang, key), n),
      tFill: (key: string, vars: Record<string, string | number>) => {
        let out = translate(activeLang, key);
        for (const [name, value] of Object.entries(vars)) {
          out = out.split(`{${name}}`).join(String(value));
        }
        return out;
      },
    }),
    [activeLang, setLang]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}
