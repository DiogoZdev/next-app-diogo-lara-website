import { Headline } from "@/components/Headline";
import { Network } from "@/components/Network";
import { ProjectCard } from "@/components/ProjectCard";
import Head from "next/head";

export default function Projects() {
  return (
    <>
      <Head>
        <title>Projetos - Diogo Lara</title>
      </Head>

      <Headline title="projetos" />

      <ProjectCard
        title="Andressa Ilustra"
        image="/projects/ilustra-1.png"
        description="Portfolio da ilustradora Andressa Araujo"
        technologies={["Angular", "Typescript", "Scss"]}
        tags={["react", "typescript", "next"]}
        githubUrl="https://github.com/diogozdev/ilustra"
        websiteUrl="https://andressailustra.art"
      ></ProjectCard>

      <ProjectCard
        title="Sérgio Genealogia"
        image="/projects/sergio-genealogia.png"
        description="Em memória ao genealogista e amigo Sérgio Ricardo (1961 - 2023)"
        technologies={["HTML", "CSS", "Github Pages"]}
        tags={["frontend", "landing-page"]}
        githubUrl="https://github.com/sergiogenealogia"
        websiteUrl="https://sergiogenealogia.github.io"
      ></ProjectCard>

      <ProjectCard
        title="Orbit"
        image="/projects/orbit.png"
        description="Projeto em desenvolvimento"
        technologies={["Angular", "Typescript", "Scss", "NestJS", "SQL"]}
        tags={["full-stack", "social", "Work In Progress"]}
        githubUrl="https://github.com/diogozdev/social-orbit"
      ></ProjectCard>
    </>
  );
}
