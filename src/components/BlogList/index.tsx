"use client";

import FadeIn from "@/components/animations/FadeIn";
import { PostCard } from "@/components/PostCard";
import { postsData, type IPost } from "@/app/blog/posts";
import { useLanguage, type Language } from "@/lib/i18n";

const postLanguage = (post: IPost): Language =>
  post.language.toLowerCase().startsWith("port") ? "pt" : "en";

export function BlogList() {
  const { language } = useLanguage();
  const visiblePosts = postsData.filter(
    (post) => postLanguage(post) === language
  );

  return (
    <>
      {visiblePosts.map((post) => (
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
  );
}
