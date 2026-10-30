"use client";

import { cn } from "@/lib/utils";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface Props {
  pages: Array<{
    page: string;
    path: string;
  }>;
}

export const Nav = ({ pages }: Props) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-40">
      <div className="gradient-bg h-[3px] w-full" />

      <div className="nav-glass border-b border-[var(--border-color)]">
        <nav className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-3 md:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-display text-lg font-bold tracking-tight"
            onClick={() => setIsOpen(false)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon_color.svg"
              width={30}
              height={30}
              alt=""
              className="transition-transform duration-300 group-hover:rotate-6"
            />
            <span>
              Diogo<span className="gradient-text">Lara</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {pages.map(({ page, path }) => (
              <li key={page}>
                <Link
                  href={path}
                  className={cn(
                    "block rounded-full px-4 py-2 text-sm transition-colors duration-200",
                    isActive(path)
                      ? "bg-[var(--accent-transparent)] text-white ring-1 ring-inset ring-[var(--accent)]"
                      : "text-[var(--font-muted)] hover:bg-[var(--layer-100)] hover:text-[var(--font-color)]"
                  )}
                >
                  {page}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--font-color)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] md:hidden"
          >
            {isOpen ? <XIcon size={22} /> : <ListIcon size={22} />}
          </button>
        </nav>

        {isOpen && (
          <ul className="grid gap-1 border-t border-[var(--border-color)] px-5 pb-4 pt-2 md:hidden">
            {pages.map(({ page, path }) => (
              <li key={page}>
                <Link
                  href={path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm transition-colors",
                    isActive(path)
                      ? "bg-[var(--accent-transparent)] text-white"
                      : "text-[var(--font-muted)] hover:bg-[var(--layer-100)] hover:text-[var(--font-color)]"
                  )}
                >
                  {page}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
};
