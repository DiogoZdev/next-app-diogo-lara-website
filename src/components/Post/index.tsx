"use client";

import { ArrowLeftIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { ReactElement } from "react";
import { Button } from "../Button";

interface PostProps {
  children: ReactElement;
}

export const Post = ({ children }: PostProps) => {
  return (
    <>
      <Link href=".." className="mt-10 block w-fit">
        <Button>
          <ArrowLeftIcon size={18} />
          back
        </Button>
      </Link>
      <article className="py-10">{children}</article>
      <Link href=".." className="mb-4 block w-fit">
        <Button>
          <ArrowLeftIcon size={18} />
          back
        </Button>
      </Link>
    </>
  );
};
