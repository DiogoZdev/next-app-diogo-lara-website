import { Section } from "@/components/Section";
import { BlogList } from "@/components/BlogList";

export const metadata = {
  title: "Blog",
};

export default function Blog() {
  return (
    <Section
      title={{ en: "Blog", pt: "Blog" }}
      className="pt-16 md:pt-24"
    >
      <BlogList />
    </Section>
  );
}
