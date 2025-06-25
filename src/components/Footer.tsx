"use client";

import { GithubLogo, LinkedinLogo, Phone } from "@phosphor-icons/react";
import { ButtonLink } from "./ButtonLink";

export default function Footer() {
  const iconSize = 30;

  return (
    <>
      <footer className="grid md:grid-cols-2">
        <div className="h-60 bg-orange-400 flex flex-col gap-4 justify-center items-center">
          <div className="flex gap-4 text-xl text-black">
            <GithubLogo size={iconSize} aria-label="Github" />
            diogoZdev
          </div>
          <ButtonLink
            text="VISIT GITHUB"
            url="https://github.com/diogozdev"
            variant='BLACK'
          />
        </div>

        <div className="h-60 bg-[#111] text-white  flex flex-col gap-4 justify-center items-center">
          <div className="flex gap-4 text-xl">
            <Phone size={iconSize} aria-label="Phone" />
            +55 43 98444-9774
          </div>
          <ButtonLink
            text="WHATSAPP"
            url="https://wa.me/5543984449774"
            variant='WHITE'
          />
        </div>

        <div className="h-60 bg-[#222] md:bg-[#111]"></div>

        <div className="h-60 bg-[#111] md:bg-[#222]  text-white  flex flex-col gap-4 justify-center items-center">
          <div className="flex gap-4 text-xl">
            <LinkedinLogo size={iconSize} aria-label="LinkedIn" />
            /diogo-lara
          </div>
          <ButtonLink
            text="LINKEDIN"
            url="https://linkedin.com/in/diogo-lara"
            variant='WHITE'
          />
        </div>
      </footer>
    </>
  );
}
