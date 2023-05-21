export default function GlobalStyles() {
  return (
    <style global jsx>{`
      @import "./reset.css";
      @import "./colors.css";

      :root {
        font-family: sanchez, monospace, sans-serif;
      }

      body {
        background-color: var(--layer-000);
        color: #eee;
      }

      ul {
        list-style-type: none;
      }

      ol {
        padding-left: 1rem;
      }

      .stripe {
        height: 1rem;
      }

      .center {
        max-width: 1000px;
        padding: 1rem;
        margin: 0 auto;
      }

      .gradient-bg {
        background: linear-gradient(to right, var(--accent), var(--accent-2));
      }

      .gradient-text {
        background: linear-gradient(to right, var(--accent), var(--accent-2));
        width: fit-content;
        color: transparent;
        background-clip: text;
      }

      p {
        font-size: 16px;
        max-width: 70ch;
        text-indent: 2ch;
        margin-bottom: 1rem;
        line-height: 1.8;
      }

      article h1 {
        margin-bottom: 2rem;
      }

      .accent {
        color: var(--accent);
      }

      .bold {
        font-weight: bold;
        font-size: 18px;
        line-height: 1.5;
      }

      pre {
        background-color: #000;
        padding: 1rem;
        border-radius: 8px;
        max-width: 80ch;
        margin: 1rem 0;
      }

      ::-webkit-scrollbar {
        width: 8px;
      }

      ::-webkit-scrollbar-track {
        background: var(--layer-000);
      }

      ::-webkit-scrollbar-thumb {
        background: var(--accent);
        border-radius: 8px;
      }

    `}</style>
  );
}
