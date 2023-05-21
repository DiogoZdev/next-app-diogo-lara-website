import { GithubLogo, Globe } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

interface ProjectProps {
  title: string;
  image: string;
  description: string;
  technologies: string[];
  tags: string[];
  githubUrl: string;
  websiteUrl?: string;
  alt?: string;
}

export const ProjectCard = ({
  title,
  image,
  description,
  technologies,
  tags,
  githubUrl,
  websiteUrl,
  alt,
}: ProjectProps) => {

  const iconsSize = 28;
  return (
    <>
      <style jsx>{`
        .project-card {
          display: flex;
          height: 200px;
          margin: 2rem 0;
          {/* cursor: pointer; */}
        }

        .project-card:nth-child(odd) {
          display: flex;
          flex-direction: row-reverse;
        }

        .project-card:hover {
          background: var(--gradient-bg-transparent);
        }

        .project-card-info {
          width: 100%;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: .5rem;
        }

        .project-card-technologies, .project-card-tags {
          display: flex;
          gap: 1rem;
        }

        .project-card-technologies li, .project-card-tags li {
          padding: 0.5rem;
          background: var(--accent);
          border-radius: 4px;
        }

        .icons {
          display: flex;
          gap: 1rem;
          color: white;
          margin-top: 1rem;
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
            width={200}
            height={200}
            style={{ borderRadius: "8px" }}
          />
        </div>
        <div className="project-card-info">
          <h2>{title}</h2>
          <p>{description}</p>
          <ul className="project-card-technologies">
            {technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <div className="icons">
            <Link href={githubUrl ?? "#"} target="_blank" style={{ color: "var(--accent-2)" }}>
              <GithubLogo size={iconsSize}/>
            </Link>
            {websiteUrl && <Link href={websiteUrl} target="_blank" style={{ color: "var(--accent-2)" }}>
              <Globe size={iconsSize}/>
            </Link>}

          </div>
        </div>
      </div>
    </>
  );
};
