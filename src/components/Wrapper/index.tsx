'use client'
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export function Wrapper({ children }: Props) {
  return <div className="p-4 md:p-20 w-full max-w-[1100px] mx-auto border-2 boorder-red-500">{children}</div>
};
