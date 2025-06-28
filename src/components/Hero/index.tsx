/* eslint-disable @next/next/no-img-element */
"use client";

import { GradientHeader } from "../GradientHeader";
import { Network } from "../Network";

export const Hero = ({ title = "Diogo Lara" }: { title?: string }) => (
  <>
    <div className="grid content-center min-h-[70vh]">
      <div className="py-24">
        <img className="mx-auto" src="icon_color.svg" width="100" height="100" alt="Diogo Lara" />
        <h1 className="block font-semibold text-[2.5rem] mt-4 mx-auto w-fit">{title}</h1>
        <GradientHeader center text="{ fullstack developer }" />
        <div className="flex justify-center py-4">
          <Network />
        </div>
      </div>
    </div>
  </>
);
