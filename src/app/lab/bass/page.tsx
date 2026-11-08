import { Bass } from "@/components/Lab/Bass";
import { T } from "@/lib/i18n";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bass",
  description:
    "A playable four-string bass with plucked-string synthesis and a heavy, fuzzy low end. Click the strings or play from the keyboard.",
};

export default function BassPage() {
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
          <span className="h-1.5 w-1.5 rounded-full bg-[#18b48d]" />
          Karplus–Strong
        </span>

        <h1 className="font-display text-[clamp(2.25rem,6vw,3.5rem)] font-bold leading-[1.05]">
          <T en="Bass" pt="Baixo" />
        </h1>

        <p className="mt-4 text-base leading-relaxed text-[var(--font-muted)] md:text-lg">
          <T
            en="A four-string bass with a deep, plucked-string voice synthesized from noise and feedback. Click anywhere along a string — closer to the body means a higher fret — or play the open strings with the keyboard."
            pt="Um baixo de quatro cordas com um som grave de corda pulsada, sintetizado a partir de ruído e realimentação. Clique em qualquer ponto de uma corda — mais perto do corpo significa uma casa mais alta — ou toque as cordas soltas pelo teclado."
          />
        </p>

        <p className="mt-3 text-sm leading-relaxed text-[var(--font-muted)]">
          <T
            en="The volume knob on the body adds a two-stage distorted low end. Every note is generated in real time by the Web Audio API."
            pt="O botão de volume no corpo adiciona um grave distorcido em dois estágios. Cada nota é gerada em tempo real pela Web Audio API."
          />
        </p>
      </section>

      <Bass />
    </div>
  );
}
