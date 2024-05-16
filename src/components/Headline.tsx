import { Network } from "./Network";

interface HeadlineProps {
  title?: string;
}

export const Headline = ({ title }: HeadlineProps) => (
  <>
    <style jsx>{`
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 70vh;
      }

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

    <div className="container">
      <h1 style={title ? { fontSize: "1.5rem", marginTop: "3rem" } : undefined}>
        Diogo Lara
      </h1>
      <h2>&#123; {title ?? "fullstack developer"} &#125;</h2>
      <Network />
    </div>
  </>
);
