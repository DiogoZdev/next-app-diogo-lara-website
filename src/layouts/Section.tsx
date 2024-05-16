import { ReactElement } from "react";

interface SectionProps {
  title: string;
  children: ReactElement;
}

export const Section = ({ title, children }: SectionProps) => {
  return (
    <>
      <style jsx>{`
        h1 {
          margin-top: 4rem;
          font-size: 1.5rem;
          line-height: 2;
          display: block;
        }
      `}</style>

      <section>
        <h1 className="gradient-text">{title}</h1>
        {children}
      </section>
    </>
  );
};
