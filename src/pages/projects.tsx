import { Headline } from "@/components/Headline";
import { ProjectCard } from "@/components/ProjectCard";
import Head from "next/head";

export default function Projects() {
  return (
    <>
      <Head>
        <title>Projects - Diogo Lara</title>
      </Head>

      <Headline title="projects" />

      <ProjectCard
        title="Diogo Lara Website"
        image="/projects/diogolara-dev.png"
        description="Version 2.0 of my website. Initialy made with Angular, now with NextJS (ReactJS)."
        technologies={["NextJS", "ReactJS", "Typescript", "CSS"]}
        githubUrl="https://github.com/diogozdev/next-app-diogo-lara-dev"
      ></ProjectCard>

      <ProjectCard
        title="Andressa's Illustrations"
        image="/projects/ilustra-1.png"
        description="Andressa Araujo illustration portfolio"
        technologies={["Angular", "Typescript", "SCSS"]}
        githubUrl="https://github.com/diogozdev/ilustra"
        websiteUrl="https://andressailustra.art"
      ></ProjectCard>

      <ProjectCard
        title="Sérgio Genealogy"
        image="/projects/sergio-genealogia.png"
        description="In memory of a great genealogist and friend of mine, Sérgio Ricardo (1961 - 2023)"
        technologies={["HTML", "CSS", "Github Pages"]}
        githubUrl="https://github.com/sergiogenealogia"
        websiteUrl="https://sergiogenealogia.github.io"
      ></ProjectCard>

      <ProjectCard
        title="Dev Orbit"
        image="/projects/orbit.png"
        description="New project in progress. Social network application to connect developers."
        technologies={["Angular", "Typescript", "SCSS", "NestJS", "SQL"]}
        githubUrl="https://github.com/diogozdev/social-orbit"
      ></ProjectCard>
    </>
  );
}
