"use client";

import { GithubLogo, Globe } from "@phosphor-icons/react";
import Image from "next/image";
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
  const iconsSize = 28;
  const multipleParagraphs = description.split("//").length > 1;

  const [isOpen, setIsOpen] = useState(false);

  function handleSetIsOpen() {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <style jsx>{`
        .project-card {
          display: flex;
          margin: 2rem 0;
          border-radius: 8px;
          border: 1px solid var(--layer-200);
        }

        .project-card:nth-child(odd) {
          display: flex;
          flex-direction: row-reverse;
        }

        @media (max-width: 500px) {
          .project-card {
            flex-direction: column;
          }

          .project-card:nth-child(odd) {
            display: flex;
            flex-direction: column;
          }
        }

        .project-card:hover {
          border: 1px solid var(--border-color);
        }

        .project-card-image {
          height: 220px;
        }

        .project-card-info {
          width: 100%;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .project-card-technologies {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .project-card-technologies li {
          padding: 0.5rem;
          background: var(--layer-200);
          color: var(--font-color);
          border-radius: 4px;
        }

        .icons {
          display: flex;
          gap: 1rem;
          color: white;
          margin-top: 1rem;
        }

        .read-more {
          cursor: pointer;
          background-color: var(--accent-2-transparent);
          color: white;
          font-weight: bold;
          width: 100px;
          border-radius: 4px;
          padding: 0.4em 0.8em;
          margin-left: auto;
        }

        a:hover {
          color: var(--accent);
        }
      `}</style>

      <div className="project-card">
        <div className="project-card-image">
          <Image
            src={image}
            alt={alt ?? "project image"}
            width={220}
            height={220}
            style={{
              borderRadius: "8px",
              padding: "0",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="project-card-info">
          <h2>{title}</h2>

          {multipleParagraphs && (
            <button className="read-more" onClick={handleSetIsOpen}>
              read {!isOpen ? "more" : "less"}
            </button>
          )}

          {(!isOpen && multipleParagraphs) || !multipleParagraphs ? (
            <p>{description.split("//")[0]}</p>
          ) : null}

          {isOpen &&
            multipleParagraphs &&
            description
              .split("//")
              .map((paragraph) => (
                <p key={paragraph.slice(0, 10)}>{paragraph}</p>
              ))}

          <ul className="project-card-technologies">
            {technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <div className="icons">
           {githubUrl && <Link
              href={githubUrl ?? "#"}
              target="_blank"
              style={{ color: "var(--accent-2)" }}
            >
              <GithubLogo size={iconsSize} />
            </Link>}
            {websiteUrl && (
              <Link
                href={websiteUrl}
                target="_blank"
                style={{ color: "var(--accent-2)" }}
              >
                <Globe size={iconsSize} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
