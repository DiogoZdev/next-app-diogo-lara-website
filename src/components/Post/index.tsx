'use client'
import Link from "next/link";
import { ReactElement } from "react";
import { Button } from "../Button";



interface PostProps {
  children: ReactElement;
}

export const Post = ({ children }: PostProps) => {
  return (
    <>
      <Link href="..">
        <Button>back</Button>
      </Link>
      <article className="py-8">{children}</article>
      <Link href="..">
        <Button>back</Button>
      </Link>
    </>
  );
};
