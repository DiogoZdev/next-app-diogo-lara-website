"use client";

import { GradientHeader } from "@/components/GradientHeader";
import { cn } from "@/lib/utils";
import { ReactElement } from "react";

interface SectionProps {
  title: string;
  children: ReactElement;
  id?: string;
  className?: string;
}

export const Section = ({ title, children, id, className }: SectionProps) => {
  return (
    <section id={id} className={cn("scroll-mt-28", className)}>
      <div className="mb-10 flex items-center gap-5">
        <div className="flex items-center gap-3">
          <GradientHeader text={title} />
        </div>
        <span className="hairline min-w-8 flex-1" aria-hidden />
      </div>
      <div>{children}</div>
    </section>
  );
};
