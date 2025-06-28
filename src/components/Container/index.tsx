'use client'
import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export function Container({ children }: Props) {
  return <div className="p-20 w-full max-w-[1100px] mx-auto border-2 boorder-red-500">{children}</div>
};
