/* eslint-disable @next/next/no-img-element */
"use client";

import { ArrowDownIcon } from "@phosphor-icons/react";
import { GradientHeader } from "../GradientHeader";
import { Network } from "../Network";

export const Hero = ({ title = "Diogo Lara" }: { title?: string }) => (
  <section className="relative flex min-h-[76vh] items-center overflow-hidden">
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-[0.14] blur-[110px]"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute right-[8%] top-[30%] h-[300px] w-[300px] rounded-full bg-[var(--accent-2)] opacity-[0.12] blur-[110px]"
    />

    <div className="relative mx-auto w-full py-20 text-center md:py-28">
      <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--layer-100)] px-4 py-1.5 text-xs text-[var(--font-muted)]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        Available for new projects
      </div>

      <div className="relative mx-auto mb-7 w-fit">
        <div className="absolute inset-0 -z-10 scale-125 rounded-full bg-[var(--accent-transparent)] blur-2xl" />
        <img
          src="/icon_color.svg"
          width="96"
          height="96"
          alt="Diogo Lara"
          className="mx-auto drop-shadow-[0_18px_30px_rgba(0,0,0,0.45)]"
        />
      </div>

      <h1 className="font-display text-[clamp(2.75rem,9vw,5.5rem)] font-bold leading-[0.95] tracking-tight">
        {title}
      </h1>

      <GradientHeader
        text="FULLSTACK DEVELOPER"
        center
        className="mt-4 text-sm font-semibold uppercase tracking-[0.35em] md:text-base"
      />

      <p className="mx-auto mt-7 max-w-[58ch] text-center text-base leading-relaxed text-[var(--font-muted)] md:text-lg">
        I build thoughtful, international-ready web products — turning complex
        problems into simple, human interfaces.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <a
          href="#contact"
          className="group flex items-center gap-2 rounded-full gradient-surface px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-accent)] transition-transform duration-200 hover:-translate-y-0.5"
        >
          Let&apos;s talk
          <ArrowDownIcon
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </a>
        <a
          href="#projects"
          className="group flex items-center gap-2 rounded-full border border-[var(--border-color)] px-6 py-3 text-sm font-semibold text-[var(--font-color)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          View projects
          <ArrowDownIcon
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
          />
        </a>
      </div>

      <div className="mt-10 flex justify-center">
        <Network />
      </div>
    </div>
  </section>
);
