"use client";

import { links } from "@/contents/links";
import {
  ArrowUpRight,
  GithubLogo,
  Heart,
  LinkedinLogo,
  Phone,
} from "@phosphor-icons/react";
import Link from "next/link";

const iconSize = 26;

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--border-color)]">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-16 md:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="https://github.com/diogozdev"
            target="_blank"
            rel="noreferrer"
            className="gradient-surface group relative overflow-hidden rounded-2xl p-7 text-white transition-transform duration-300 hover:-translate-y-1"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full bg-white/20 blur-2xl"
            />
            <div className="relative flex items-start justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
                <GithubLogo size={iconSize} aria-label="Github" />
              </span>
              <ArrowUpRight
                size={22}
                className="opacity-70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
            <p className="relative mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              GitHub
            </p>
            <p className="relative font-display text-xl font-bold">diogoZdev</p>
          </a>

          <a
            href="https://wa.me/5543984449774"
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-[var(--border-color)] bg-[var(--layer-200)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--accent)]">
                <Phone size={iconSize} aria-label="Phone" />
              </span>
              <ArrowUpRight
                size={22}
                className="text-[var(--font-muted)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
              />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--font-muted)]">
              WhatsApp
            </p>
            <p className="font-display text-xl font-bold">
              +55 43 98444-9774
            </p>
          </a>

          <a
            href="https://linkedin.com/in/diogo-lara"
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-[var(--border-color)] bg-[var(--layer-100)] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-2)]"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--accent-2)]">
                <LinkedinLogo size={iconSize} aria-label="LinkedIn" />
              </span>
              <ArrowUpRight
                size={22}
                className="text-[var(--font-muted)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent-2)]"
              />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--font-muted)]">
              LinkedIn
            </p>
            <p className="font-display text-xl font-bold">/diogo-lara</p>
          </a>

          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--layer-200)] p-7">
            <nav className="grid grid-cols-2 gap-x-4 gap-y-2">
              {links.map((link) => (
                <Link
                  key={link.page}
                  href={link.path}
                  className="w-fit text-sm text-[var(--font-muted)] transition-colors hover:text-[var(--accent)]"
                >
                  {link.page}
                </Link>
              ))}
            </nav>
            <p className="mt-6 flex items-center gap-2 text-sm text-[var(--font-muted)]">
              With love from Brazil
              <Heart size={14} weight="fill" className="text-green-500" />
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--border-color)] pt-6 text-sm text-[var(--font-muted)] md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Diogo Lara. All rights reserved.</span>
          <span className="font-display tracking-wide">
            Built with Next.js
          </span>
        </div>
      </div>
    </footer>
  );
}
