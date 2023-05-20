import { Headline } from "@/components/Headline";
import { PostCard } from "@/components/PostCard";
import Head from "next/head";

export default function Blog() {
  return (
    <>
      <Head>
        <title>Blog - Diogo Lara</title>
      </Head>

      <Headline title="blog" />

      <PostCard
        date="2023/04/22"
        language="Português"
        preview="Programação parece legal, mas não sei falar inglês, só o básico do básico. Será que é pra mim?"
        title="Preciso falar inglês para ser programador?"
        url="preciso-falar-ingles"
      />

      <PostCard
        date="2023/04/28"
        language="English"
        preview="Should I learn React ou Angular? How to get results faster? Where to start with so many similar options?"
        title="Choosing technologies to work with"
        url="choosing-technologies"
      />
    </>
  );
}
