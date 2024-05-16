interface HeadlineProps {
  title?: string;
}

export const Headline = ({ title }: HeadlineProps) => (
  <>
    <style jsx>{`
      h1,
      h2 {
        margin: 0 auto;
        text-align: center;
        display: block;
        width: fit-content;
      }

      h1 {
        margin-top: 1rem;
        font-size: 2.5rem;
      }

      h2 {
        background: var(--gradient-bg);
        color: transparent;
        background-clip: text;
      }
    `}</style>

    <h1 style={title ? { fontSize: "1.5rem", marginTop: "3rem" } : undefined}>
      Diogo Lara
    </h1>
    <h2>&lt; {title ?? "web developer"} /&gt;</h2>
  </>
);
