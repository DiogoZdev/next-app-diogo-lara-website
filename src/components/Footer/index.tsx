/* eslint-disable @next/next/no-img-element */
"use client";

import { GithubLogo, LinkedinLogo, Phone } from "@phosphor-icons/react";
import { ButtonLink } from "../ButtonLink";
import { links } from "@/contents/links";
import Link from "next/link";

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

        <div className="h-60 bg-[#2f2f2f] text-white  flex flex-col gap-4 justify-center items-center">
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

        <div className="h-60 bg-[#111]  text-white  flex flex-col gap-4 justify-center items-center">
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

        <div className="grid grid-cols-2">
          <div className="bg-gray-300 text-black flex flex-col justify-center gap-4 font-bold text-lg">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.path}
                className="pl-16 hover:text-orange-700 transition-colors"
              >{link.page}</Link>
            ))}
          </div>
          <div
            className="h-60 bg-cover bg-center"
            style={{ backgroundImage: 'url(/br-bg.jpeg)' }}
          >
            <div className="w-full h-full bg-[#000b] flex justify-center items-center p-8">
              <span className="text-xl font-bold">With love from Brazil 💚</span>
            </div>
          </div>

        </div>

      </footer>
    </>
  );
}
