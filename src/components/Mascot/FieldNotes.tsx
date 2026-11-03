"use client";

import { Section } from "@/components/Section";
import { T, type LocalizedText } from "@/lib/i18n";
import { Eye, Grains, MoonStars } from "@phosphor-icons/react";

const fieldNotes: Array<{
  icon: typeof Eye;
  title: LocalizedText;
  body: LocalizedText;
}> = [
  {
    icon: Eye,
    title: { en: "Snack radar", pt: "Radar de petiscos" },
    body: {
      en: "Tuneba is now watching you. She is not being friendly. She is checking for seeds.",
      pt: "Tuneba está te observando. Ela não está sendo simpática. Está procurando sementes.",
    },
  },
  {
    icon: Grains,
    title: { en: "Seed powered", pt: "Movida a sementes" },
    body: {
      en: "She is just a small gray hamster with a big appetite and no table manners whatsoever.",
      pt: "Ela é só uma pequena hamster cinza com um apetite enorme e nenhuma educação à mesa.",
    },
  },
  {
    icon: MoonStars,
    title: { en: "Do not disturb", pt: "Não perturbe" },
    body: {
      en: "Leave the page quiet for half a minute and Tuneba will doze off.",
      pt: "Deixe a página em silêncio por meio minuto e Tuneba vai cochilar.",
    },
  },
];

export function MascotFieldNotes() {
  return (
    <Section
      title={{ en: "Field notes", pt: "Notas de campo" }}
      className="pt-16 md:pt-20"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {fieldNotes.map((note) => {
          const Icon = note.icon;

          return (
            <div
              key={note.title.en}
              className="surface surface-hover rounded-2xl p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-transparent)] text-[var(--accent)]">
                <Icon size={22} weight="duotone" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">
                <T {...note.title} />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--font-muted)]">
                <T {...note.body} />
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
