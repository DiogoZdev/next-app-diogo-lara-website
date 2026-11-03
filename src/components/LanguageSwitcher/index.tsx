"use client";

import { LANGUAGES, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Translate } from "@phosphor-icons/react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t({ en: "Language", pt: "Idioma" })}
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-[var(--border-color)] bg-[var(--layer-100)] p-0.5",
        className,
      )}
    >
      <Translate
        size={16}
        aria-hidden
        className="ml-1.5 mr-0.5 shrink-0 text-[var(--font-muted)]"
      />
      {LANGUAGES.map((option) => {
        const isActive = language === option.id;

        return (
          <button
            key={option.id}
            type="button"
            lang={option.id === "pt" ? "pt-BR" : "en"}
            title={option.label}
            aria-label={t({
              en: `Switch language to ${option.label}`,
              pt: `Mudar idioma para ${option.label}`
            })}
            aria-pressed={isActive}
            onClick={() => setLanguage(option.id)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors duration-200",
              isActive
                ? "bg-[var(--accent-transparent)] text-[var(--accent)] ring-1 ring-inset ring-[var(--accent)]"
                : "text-[var(--font-muted)] hover:text-[var(--font-color)]",
            )}
          >
            {option.short}
          </button>
        );
      })}
    </div>
  );
}
