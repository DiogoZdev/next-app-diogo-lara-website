/* eslint-disable @next/next/no-img-element */
"use client";

import { GithubLogo, Globe } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

interface ProjectProps {
  title: string;
  image: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  websiteUrl?: string;
  alt?: string;
}

export const ProjectCard = ({
  title,
  image,
  description,
  technologies,
  githubUrl,
  websiteUrl,
  alt,
}: ProjectProps) => {
  const iconsSize = 20;
  const multipleParagraphs = description.split("//").length > 1;
  const hasDescription = description.trim().length > 0;

  const [isOpen, setIsOpen] = useState(false);

  function handleSetIsOpen() {
    setIsOpen((open) => !open);
  }

  return (
    <article className="surface surface-hover group mb-8 overflow-hidden rounded-2xl md:flex">
      <div className="relative shrink-0 overflow-hidden bg-[var(--layer-200)] md:w-[280px]">
        <img
          src={image}
          alt={alt ?? `${title} project preview`}
          className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-full md:min-h-[260px]"
        />
      </div>

      <div className="flex w-full flex-col gap-3 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-xl font-bold leading-tight md:text-2xl">
            {title}
          </h2>

          <div className="flex shrink-0 gap-2">
            {githubUrl && (
              <Link
                href={githubUrl}
                target="_blank"
                aria-label={`${title} on GitHub`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--font-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <GithubLogo size={iconsSize} />
              </Link>
            )}
            {websiteUrl && (
              <Link
                href={websiteUrl}
                target="_blank"
                aria-label={`${title} website`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--font-muted)] transition-colors hover:border-[var(--accent-2)] hover:text-[var(--accent-2)]"
              >
                <Globe size={iconsSize} />
              </Link>
            )}
          </div>
        </div>

        {hasDescription && (
          <div className="text-sm leading-relaxed text-[var(--font-muted)]">
            {(!isOpen && multipleParagraphs) || !multipleParagraphs ? (
              <p className="mb-0">{description.split("//")[0]}</p>
            ) : null}

            {isOpen &&
              multipleParagraphs &&
              description
                .split("//")
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 20)} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
          </div>
        )}

        {multipleParagraphs && (
          <button
            type="button"
            onClick={handleSetIsOpen}
            className="w-fit text-sm font-semibold text-[var(--accent)] underline decoration-[var(--accent-transparent)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--accent-2)]"
          >
            read {isOpen ? "less" : "more"}
          </button>
        )}

        <ul className="mt-auto flex flex-wrap gap-2 pt-3">
          {technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-[var(--border-color)] bg-[var(--layer-200)] px-3 py-1 text-xs text-[var(--font-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};
