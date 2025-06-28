import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/Section";
import Head from "next/head";
import { Metadata } from 'next'

export const metadata: Metadata = {
 title: 'Diogo Lara - Experience',
}

export default function Experience() {
  return (
    <>
      <Head>
        <title>Experience - Diogo Lara</title>
      </Head>

      <Section title="Experience">
        <>
          <ProjectCard
            title="Oderço (2024 -> today)"
            image="/projects/oderco.jpg"
            description=""
            technologies={["React", "NestJS", "BullMQ", "Docker", "Postgres"]}
            githubUrl="https://github.com/oderco-ti"
            websiteUrl="https://oderco.com.br"
          ></ProjectCard>

          <ProjectCard
            title="Bankme (2021 -> 2024)"
            image="/projects/bankme.png"
            description="Simplifying Credit to companies"
            technologies={["Angular", "NextJS", "NestJS", "RabbitMQ", "Docker", "Postgres"]}
            githubUrl="https://github.com/bankme-tech"
            websiteUrl="https://bankme.tech"
          ></ProjectCard>

          <ProjectCard
            title="Maptriz - (2021)"
            image="/projects/maptriz.png"
            description="Smart Cities management"
            technologies={["Angular", "SCSS", "Java", "Postgres", "GitLab"]}
            websiteUrl="https://maptriz.com.br"
          ></ProjectCard>
        </>
      </Section>
    </>
  );
}
