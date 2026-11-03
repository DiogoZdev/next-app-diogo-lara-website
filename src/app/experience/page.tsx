import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/Section";
import { Metadata } from 'next'

export const metadata: Metadata = {
 title: 'Experience',
}

export default function Experience() {
  return (
    <>
      <Section
        title={{ en: "Experience", pt: "Experiência" }}
        className="pt-16 md:pt-24"
      >
        <>
          <ProjectCard
            title="Oderço (2024 -> today)"
            image="/projects/oderco.jpg"
            description={{ en: "", pt: "" }}
            technologies={["React", "NestJS", "BullMQ", "Docker", "Postgres"]}
            githubUrl="https://github.com/oderco-ti"
            websiteUrl="https://oderco.com.br"
          ></ProjectCard>

          <ProjectCard
            title="Bankme (2021 -> 2024)"
            image="/projects/bankme.png"
            description={{
              en: "Simplifying credit for companies",
              pt: "Simplificando o crédito para empresas"
            }}
            technologies={["Angular", "NextJS", "NestJS", "RabbitMQ", "Docker", "Postgres"]}
            githubUrl="https://github.com/bankme-tech"
            websiteUrl="https://bankme.tech"
          ></ProjectCard>

          <ProjectCard
            title="Maptriz (2021)"
            image="/projects/maptriz.png"
            description={{
              en: "Smart cities management",
              pt: "Gestão de cidades inteligentes"
            }}
            technologies={["Angular", "SCSS", "Java", "Postgres", "GitLab"]}
            websiteUrl="https://maptriz.com.br"
          ></ProjectCard>
        </>
      </Section>
    </>
  );
}
