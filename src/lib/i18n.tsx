"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "pt";

export type LocalizedText = {
  en: string;
  pt: string;
};

export type LocalizedList = {
  en: string[];
  pt: string[];
};

export const LANGUAGES: Array<{ id: Language; label: string; short: string }> =
  [
    { id: "en", label: "English", short: "EN" },
    { id: "pt", label: "Português", short: "PT" },
  ];

export const DEFAULT_LANGUAGE: Language = "en";

const STORAGE_KEY = "diogo-lara:language";

const isLanguage = (value: string | null): value is Language =>
  value === "en" || value === "pt";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (text: LocalizedText) => string;
  tl: (text: LocalizedList) => string[];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLanguage(stored)) setLanguageState(stored);
    } catch {
      // localStorage may be unavailable (private mode, disabled storage).
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";

    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Persisting the preference is best effort.
    }
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((current) => (current === "en" ? "pt" : "en"));
  }, []);

  const t = useCallback((text: LocalizedText) => text[language], [language]);
  const tl = useCallback((text: LocalizedList) => text[language], [language]);

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, t, tl }),
    [language, setLanguage, t, tl, toggleLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside a LanguageProvider.");
  }

  return context;
}

/** Renders the string that matches the selected language. */
export function T({ en, pt }: LocalizedText) {
  const { language } = useLanguage();

  return <>{language === "en" ? en : pt}</>;
}

/** Renders its children only when English is selected. */
export function En({ children }: { children: ReactNode }) {
  const { language } = useLanguage();

  return language === "en" ? <>{children}</> : null;
}

/** Renders its children only when Portuguese is selected. */
export function Pt({ children }: { children: ReactNode }) {
  const { language } = useLanguage();

  return language === "pt" ? <>{children}</> : null;
}
