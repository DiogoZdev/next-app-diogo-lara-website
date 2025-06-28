'use client'
import Link from "next/link";
import { ReactElement } from "react";
import { Hero } from "../Hero";
import { Button } from "../Button";



interface PostProps {
  children: ReactElement;
}

export const Post = ({ children }: PostProps) => {
  return (
    <>
      <Hero title="post" />
      <Link href="../blog">
        <Button>back</Button>
      </Link>
      <article>{children}</article>
      <Link href="../blog">
        <Button>back</Button>
      </Link>
    </>
  );
};
