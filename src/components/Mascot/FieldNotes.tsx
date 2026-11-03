"use client";

import { Section } from "@/components/Section";
import { Eye, Grains, MoonStars } from "@phosphor-icons/react";

const fieldNotes = [
  {
    icon: Eye,
    title: "Snack radar",
    body: "Tuneba is now watching you. She is not being friendly. She is checking for seeds."
  },
  {
    icon: Grains,
    title: "Seed powered",
    body: "She is just a small gray hamster with a big appetite and no table manners whatsoever."
  },
  {
    icon: MoonStars,
    title: "Do not disturb",
    body: "Leave the page quiet for half a minute and Tuneba will doze off."
  }
];

export function MascotFieldNotes() {
  return (
    <Section title="Field notes" className="pt-16 md:pt-20">
      <div className="grid gap-4 md:grid-cols-3">
        {fieldNotes.map((note) => {
          const Icon = note.icon;

          return (
            <div key={note.title} className="surface surface-hover rounded-2xl p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-transparent)] text-[var(--accent)]">
                <Icon size={22} weight="duotone" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{note.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--font-muted)]">
                {note.body}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
