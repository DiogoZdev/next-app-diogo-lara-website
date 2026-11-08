"use client";

import { GradientHeader } from "@/components/GradientHeader";
import { useLanguage, type LocalizedText } from "@/lib/i18n";
import { ArrowRight, Guitar, MusicNotes, Sparkle } from "@phosphor-icons/react";
import Link from "next/link";

const experiments: Array<{
  href: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: typeof MusicNotes;
  tag: LocalizedText;
}> = [
  {
    href: "/lab/piano",
    title: { en: "Piano", pt: "Piano" },
    description: {
      en: "A playable two-octave keyboard synthesized from scratch with the Web Audio API. No samples, no libraries — just oscillators and envelopes.",
      pt: "Um teclado tocável de duas oitavas sintetizado do zero com a Web Audio API. Sem samples, sem bibliotecas — só osciladores e envelopes.",
    },
    icon: MusicNotes,
    tag: { en: "Sound", pt: "Som" },
  },
  {
    href: "/lab/guitar",
    title: { en: "Guitar", pt: "Guitarra" },
    description: {
      en: "A Telecaster-shaped six-string with plucked-string synthesis. Click the fretboard or strum chords with the keyboard.",
      pt: "Uma guitarra de seis cordas em formato Telecaster com síntese de cordas pulsadas. Clique na escala ou toque acordes pelo teclado.",
    },
    icon: Guitar,
    tag: { en: "Sound", pt: "Som" },
  },
  {
    href: "/lab/bass",
    title: { en: "Bass", pt: "Baixo" },
    description: {
      en: "A four-string bass with a deep plucked-string voice and a two-stage distortion for a heavy, fuzzy low end.",
      pt: "Um baixo de quatro cordas com um som grave de corda pulsada e distorção em dois estágios para um grave pesado.",
    },
    icon: Guitar,
    tag: { en: "Sound", pt: "Som" },
  },
];

export function LabList() {
  const { t } = useLanguage();

  return (
    <div className="pb-20 pt-16 md:pt-24">
      <section className="relative mb-16 overflow-hidden md:mb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-[320px] w-[320px] rounded-full bg-[var(--accent)] opacity-[0.12] blur-[110px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-8 h-[280px] w-[280px] rounded-full bg-[var(--accent-2)] opacity-[0.12] blur-[110px]"
        />

        <div className="relative max-w-[62ch]">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--layer-100)] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--font-muted)]">
            <Sparkle size={14} className="text-[var(--accent-2)]" weight="fill" />
            {t({ en: "Small experiments", pt: "Pequenos experimentos" })}
          </span>

          <h1 className="font-display text-[clamp(2.5rem,7vw,4.25rem)] font-bold leading-[1.02]">
            {t({ en: "Lab", pt: "Experimentos" })}
          </h1>

          <GradientHeader
            text={t({
              en: "instruments, built for the joy of sound",
              pt: "Instrumentos, feitos pelo prazer do som",
            })}
            className="mt-3 text-lg md:text-xl"
          />

          <p className="mt-6 text-base leading-relaxed text-[var(--font-muted)] md:text-lg">
            {t({
              en: "A small lab: browser instruments, audio experiments and other stuff.",
              pt: "Um pequeno laboratório: instrumentos e outros experimentos.",
            })}
          </p>
        </div>
      </section>

      <section aria-labelledby="lab-list-heading">
        <div className="mb-6 flex items-center gap-5">
          <h2
            id="lab-list-heading"
            className="font-display text-sm font-semibold uppercase tracking-[0.24em] text-[var(--font-muted)]"
          >
            {t({ en: "Instruments", pt: "Instrumentos" })}
          </h2>
          <span className="hairline flex-1" aria-hidden />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {experiments.map(({ href, title, description, icon: Icon, tag }) => (
            <Link
              key={href}
              href={href}
              className="surface surface-hover group flex flex-col rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-transparent)] text-[var(--accent)]">
                  <Icon size={24} weight="duotone" />
                </span>
                <span className="rounded-full border border-[var(--border-color)] bg-[var(--layer-200)] px-3 py-1 text-xs text-[var(--font-muted)]">
                  {t(tag)}
                </span>
              </div>

              <h3 className="mt-6 font-display text-2xl font-bold">{t(title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--font-muted)]">
                {t(description)}
              </p>

              <span className="mt-6 flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                {t({ en: "Open instrument", pt: "Abrir instrumento" })}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}

          <div className="flex flex-col justify-center rounded-2xl border border-dashed border-[var(--border-color)] p-6 text-[var(--font-muted)] md:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--layer-100)]">
              <Sparkle size={22} weight="duotone" />
            </span>
            <h3 className="mt-6 font-display text-lg font-bold text-[var(--font-color)]">
              {t({ en: "More soon", pt: "Mais em breve" })}
            </h3>
            <p className="mt-2 text-sm leading-relaxed">
              {t({
                en: "This lab is meant to grow. Next up: a drum machine, maybe.",
                pt: "Este laboratório foi feito para crescer. A seguir: uma bateria eletrônica, talvez.",
              })}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
