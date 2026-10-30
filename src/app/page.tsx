import FadeIn from "@/components/animations/FadeIn";
import { ContactForm } from "@/components/ContactForm";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/Section";
import { about, projects } from "../contents/texts/about";

export default function Page() {
  return (
    <>
      <Hero />

      <div className="grid gap-24 md:gap-32">
        <Section id="about" title="A little beyond the code">
          <>
            {about.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </>
        </Section>

        <Section id="projects" title="Projects & Contributions">
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

        <ContactForm />
      </div>
    </>
  );
}
