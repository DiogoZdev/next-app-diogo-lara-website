/* eslint-disable @next/next/no-img-element */
"use client";

import { Network } from "./Network";

export const Hero = ({ title = "Diogo Lara" }: { title?: string }) => (
  <>
    <style jsx>{`
      .container {
        display: grid;
        place-content: center;
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

      .center {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `}</style>

    <div className="container">
      <div className="center">
        <img src="icon_color.svg" width="100" height="100" alt="Diogo Lara" />
        <h1 style={{ fontSize: "2.5rem", marginTop: "2rem" }}>{title}</h1>
        <h2>&#123; fullstack developer &#125;</h2>
        <Network />
      </div>
    </div>
  </>
);
