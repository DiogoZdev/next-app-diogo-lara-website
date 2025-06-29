import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/Section";
import { about, projects } from "../contents/texts/about";
import FadeIn from "@/components/animations/FadeIn";

export default function Page() {
  return (
    <>
      <Hero />

      <div className="grid gap-8">
        <Section title="A little beyond the code">
          <>
            {about.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </>
        </Section>

        <Section title="Projects & Contributions">
          <>
            {projects.map((project, index) => (
              <FadeIn key={index}>
                <ProjectCard
                  title={project.title}
                  image={project.image}
                  description={project.description}
                  technologies={project.technologies}
                  githubUrl={project.githubUrl}
                  websiteUrl={project.websiteUrl}
                ></ProjectCard>
              </FadeIn>
            ))}
          </>
        </Section>
      </div>
    </>
  );
}
