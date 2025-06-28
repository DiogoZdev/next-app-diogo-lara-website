'use client'

import { GradientHeader } from "@/components/GradientHeader";
import { ReactElement } from "react";

interface SectionProps {
  title: string;
  children: ReactElement;
}

export const Section = ({ title, children }: SectionProps) => {
  return (
    <section className="grid gap-8">
      <div><GradientHeader text={title} /></div>
      <div>{children}</div>
    </section>
  );
};
