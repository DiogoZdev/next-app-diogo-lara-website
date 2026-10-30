import FadeIn from "@/components/animations/FadeIn";
import { PostCard } from "@/components/PostCard/index";
import { Section } from "@/components/Section";
import { postsData } from "./posts";

export const metadata = {
  title: 'Blog'
}

export default function Blog() {
  return (
    <Section title="Blog" className="pt-16 md:pt-24">
      <>
        {postsData.map((post) => (
          <FadeIn key={post.url}>
            <PostCard
              date={post.date}
              language={post.language}
              preview={post.preview}
              title={post.title}
              url={post.url}
            />
          </FadeIn>
        ))}
      </>
    </Section>
  );
}
