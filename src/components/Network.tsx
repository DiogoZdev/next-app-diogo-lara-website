import {
  LinkedinLogo,
  GithubLogo,
  EnvelopeOpen,
  Phone,
} from "@phosphor-icons/react";

interface NetworkProps {
  margin?: 'auto';
}

export const Network = ({margin}: NetworkProps)  => {
  const iconSize = 26;

  return (
    <>
      <style jsx>{`
        ul {
          margin: ${margin};
          display: flex;
          width: fit-content;
          gap: 1rem;
          margin-top: 2rem;
        }

        li {
          padding: 0.5rem;
          border-radius: 100px;
          transition: color 0.2s ease-in-out;
        }

        a:hover li {
          color: var(--accent);
        }
      `}</style>

      <ul className="network">
        <a href="https://linkedin.com/in/diogo-lara" target="_blank">
          <li>
            <LinkedinLogo size={iconSize} aria-label="Linkedin"/>
          </li>
        </a>
        <a href="https://github.com/diogozdev" target="_blank">
          <li>
            <GithubLogo size={iconSize} aria-label="Github"/>
          </li>
        </a>
        <a href="mailto:diogo.lara.dev@gmail.com" target="_blank">
          <li>
            <EnvelopeOpen size={iconSize} aria-label="Email"/>
          </li>
        </a>
        <a href="https://wa.me/5543984449774" target="_blank">
          <li>
            <Phone size={iconSize} aria-label="Phone"/>
          </li>
        </a>
      </ul>
    </>
  );
}
