/* eslint-disable @next/next/no-img-element */
"use client";

import { ArrowRightIcon, CalendarDotsIcon } from "@phosphor-icons/react";
import Link from "next/link";

interface PostCardProps {
  title: string;
  date: string;
  language: string;
  preview: string;
  url: string;
}

export const PostCard = ({
  date,
  language,
  title,
  preview,
  url,
}: PostCardProps) => {
  const dateSplit = date.includes("/") ? date.split("/") : date.split("-");
  const dateOrdered =
    Number.parseInt(dateSplit[0], 10) > Number.parseInt(dateSplit[2], 10)
      ? dateSplit.reverse()
      : dateSplit;

  const [day, month, year] = dateOrdered;

  function translateMonth(month: string) {
    const names: { [key: string]: string } = {
      "01": "Jan",
      "02": "Feb",
      "03": "Mar",
      "04": "Apr",
      "05": "May",
      "06": "Jun",
      "07": "Jul",
      "08": "Aug",
      "09": "Sep",
      "10": "Oct",
      "11": "Nov",
      "12": "Dec",
    };

    return names[month] || month;
  }

  return (
    <Link href={url} className="group mb-6 block">
      <article className="surface surface-hover flex flex-col overflow-hidden rounded-2xl md:flex-row group-hover:border-[var(--accent)]">
        <div className="flex items-center gap-3 border-b border-[var(--border-color)] bg-[var(--layer-200)] p-5 md:w-[150px] md:flex-col md:justify-center md:gap-1 md:border-b-0 md:border-r">
          <CalendarDotsIcon
            size={22}
            className="text-[var(--font-muted)] md:mb-2"
          />
          <span className="gradient-text font-display text-3xl font-bold leading-none">
            {day}
          </span>
          <span className="text-sm text-[var(--font-color)]">
            {translateMonth(month)}
          </span>
          <span className="text-xs text-[var(--font-muted)]">{year}</span>
        </div>

        <div className="flex w-full flex-col gap-3 p-6">
          <h2 className="font-display text-xl font-bold leading-tight transition-colors group-hover:text-[var(--accent)]">
            {title}
          </h2>

          <p className="mb-0 text-sm leading-relaxed text-[var(--font-muted)]">
            {preview}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <span className="rounded-full border border-[var(--border-color)] bg-[var(--layer-200)] px-3 py-1 text-xs text-[var(--font-muted)]">
              {language}
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--font-muted)] transition-all duration-300 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
              <ArrowRightIcon
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};
