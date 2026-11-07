import { Guitar } from "@/components/Lab/Guitar";
import { T } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guitar",
  description:
    "A Telecaster-shaped six-string with plucked-string synthesis. Click the fretboard or strum chords with the keyboard.",
};

export default function GuitarPage() {
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
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-2)]" />
          Karplus–Strong
        </span>

        <h1 className="font-display text-[clamp(2.25rem,6vw,3.5rem)] font-bold leading-[1.05]">
          <T en="Guitar" pt="Guitarra" />
        </h1>

        <p className="mt-4 text-base leading-relaxed text-[var(--font-muted)] md:text-lg">
          <T
            en="A Telecaster with six strings synthesized from noise and feedback. Click anywhere along a string — the closer to the body, the higher the fret — or strum chords from the keyboard."
            pt="Uma Telecaster com seis cordas sintetizadas a partir de ruído e realimentação. Clique em qualquer ponto de uma corda — quanto mais perto do corpo, mais alta a casa — ou toque acordes pelo teclado."
          />
        </p>

        <p className="mt-3 text-sm leading-relaxed text-[var(--font-muted)]">
          <T
            en="Every note is generated in real time by the Web Audio API. No samples, no audio files."
            pt="Cada nota é gerada em tempo real pela Web Audio API. Sem samples, sem arquivos de áudio."
          />
        </p>
      </section>

      <Guitar />
    </div>
  );
}
