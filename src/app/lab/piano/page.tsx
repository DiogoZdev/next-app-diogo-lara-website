import { Piano } from "@/components/Lab/Piano";
import { T } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Piano",
  description:
    "A playable two-octave piano synthesized from scratch with the Web Audio API. No samples, no libraries — just oscillators and envelopes.",
};

export default function PianoPage() {
  return (
    <div className="pb-20 pt-10 md:pt-14">
      <Link
        href="/lab"
        className="group mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] px-4 py-2 text-sm text-[var(--font-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--font-color)]"
      >
        <span
          aria-hidden
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        >
          ←
        </span>
        <T en="Back to Lab" pt="Voltar para os Experimentos" />
      </Link>

      <section className="mb-10 max-w-[62ch] md:mb-12">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--layer-100)] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[var(--font-muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          Web Audio API
        </span>

        <h1 className="font-display text-[clamp(2.25rem,6vw,3.5rem)] font-bold leading-[1.05]">
          <T en="Piano" pt="Piano" />
        </h1>

        <p className="mt-4 text-base leading-relaxed text-[var(--font-muted)] md:text-lg">
          <T
            en="Two octaves of pure synthesis. Every note is generated live in your browser with oscillators, a filter and an envelope. No samples, no audio files."
            pt="Duas oitavas de síntese pura. Cada nota é gerada ao vivo no seu navegador com osciladores, um filtro e um envelope. Sem samples, sem arquivos de áudio."
          />
        </p>

        <p className="mt-3 text-sm leading-relaxed text-[var(--font-muted)]">
          <T
            en="Hold a key to let the note ring, or turn on Sustain to build a chord. The computer keyboard works too."
            pt="Segure uma tecla para a nota soar, ou ligue Sustentar para montar um acorde. O teclado do computador também funciona."
          />
        </p>
      </section>

      <Piano />
    </div>
  );
}
