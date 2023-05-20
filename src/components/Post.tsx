import Link from "next/link";
import { ReactElement } from "react";
import { Headline } from "./Headline";
import { Button } from "./Button";

interface PostProps {
  children: ReactElement;
}

export const Post = ({ children }: PostProps) => {
  return (
    <>
      <Headline title="post" />
      <Link href="../blog">
        <Button>voltar</Button>
      </Link>
      <article>{children}</article>
      <Link href="../blog">
        <Button>voltar</Button>
      </Link>
    </>
  );
};
