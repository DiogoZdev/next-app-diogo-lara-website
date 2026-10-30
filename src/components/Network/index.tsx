"use client";

import {
  EnvelopeOpenIcon,
  GithubLogoIcon,
  LinkedinLogoIcon,
  PhoneIcon,
} from "@phosphor-icons/react";

const links = [
  {
    label: "Linkedin",
    href: "https://linkedin.com/in/diogo-lara",
    icon: LinkedinLogoIcon,
  },
  {
    label: "Github",
    href: "https://github.com/diogozdev",
    icon: GithubLogoIcon,
  },
  {
    label: "Email",
    href: "mailto:diogo.lara.dev@gmail.com",
    icon: EnvelopeOpenIcon,
  },
  {
    label: "Phone",
    href: "https://wa.me/5543984449774",
    icon: PhoneIcon,
  },
];

export function Network() {
  const iconSize = 22;

  return (
    <ul className="flex w-fit items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--layer-100)] p-1.5">
      {links.map(({ label, href, icon: Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--font-muted)] transition-colors duration-200 hover:bg-[var(--accent-transparent)] hover:text-[var(--accent)]"
          >
            <Icon size={iconSize} />
          </a>
        </li>
      ))}
    </ul>
  );
}
