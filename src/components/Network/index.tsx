'use client'
import {
  LinkedinLogo,
  GithubLogo,
  EnvelopeOpen,
  Phone,
} from "@phosphor-icons/react";

export function Network() {
  const iconSize = 36;

  return (
    <>
      <ul className="flex w-fit gap-4">
        <a href="https://linkedin.com/in/diogo-lara" target="_blank">
          <li className="p-[0.5rem] hover:text-rose-600 transition-colors">
            <LinkedinLogo size={iconSize} aria-label="Linkedin" />
          </li>
        </a>
        <a href="https://github.com/diogozdev" target="_blank">
          <li className="p-[0.5rem] hover:text-rose-600 transition-colors">
            <GithubLogo size={iconSize} aria-label="Github" />
          </li>
        </a>
        <a href="mailto:diogo.lara.dev@gmail.com" target="_blank">
          <li className="p-[0.5rem] hover:text-rose-600 transition-colors">
            <EnvelopeOpen size={iconSize} aria-label="Email" />
          </li>
        </a>
        <a href="https://wa.me/5543984449774" target="_blank">
          <li className="p-[0.5rem] hover:text-rose-600 transition-colors">
            <Phone size={iconSize} aria-label="Phone" />
          </li>
        </a>
      </ul>
    </>
  );
};
