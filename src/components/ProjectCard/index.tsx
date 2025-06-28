/* eslint-disable @next/next/no-img-element */
"use client";

import { GithubLogo, Globe } from "@phosphor-icons/react";
import "./style.scss"
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
      <div id="card" className="relative flex flex-col md:flex-row md:even:flex-row-reverse border-solid border-[1px] border-gray-700 mb-12 rounded-lg">
        <div className="min-w-[220px]">
          <img
            src={image}
            alt={alt ?? "project image"}
            className="rounded-lg p-0 object-cover w-[220px] h-[220px]"
          />
        </div>

        <div className="w-full p-4 flex flex-col gap-2">
          <h2 className="text-xl font-bold">{title}</h2>

          {multipleParagraphs && (
            <button
              id="read-more"
              className="absolute -top-2 ml-auto bg-orange-700 w-fit px-4 py-2 rounded font-bold"
              onClick={handleSetIsOpen}
            >
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

          <ul className="flex flex-wrap gap-4">
            {technologies.map((tech) => (
              <li
                key={tech}
                className="p-2 bg-[#333] rounded hover:text-black hover:bg-orange-300 cursor-default"
              >{tech}</li>
            ))}
          </ul>
          <div className="flex gap-4 text-white mt-4">
           {githubUrl && <Link
              className="text-[var(--accent-2)]"
              href={githubUrl ?? "#"}
              target="_blank"
            >
              <GithubLogo size={iconsSize} />
            </Link>}
            {websiteUrl && (
              <Link
                className="text-[var(--accent-2)]"
                href={websiteUrl}
                target="_blank"
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
