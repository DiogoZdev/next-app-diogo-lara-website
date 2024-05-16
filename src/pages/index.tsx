import { Headline } from "@/components/Headline";
import { Me } from "@/components/Me";
import { Network } from "@/components/Network";
import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/layouts/Section";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Diogo Lara</title>
      </Head>

      {/* temporary removal for improvement <Me /> */}

      <Headline />
      <Network margin="auto" />
      <Section title="A little beyond the code">
        <>
          <p>
            With over 10 years of passion for language learning, I&apos;m
            constantly seeking new ways to explore different cultures and
            communicate with people from around the world. Portuguese is my
            mother language, but, currently, I&apos;m fluent in English, have an
            advanced knowledge of Spanish, and I&apos;m studying Italian.
          </p>
          <p>
            Since 2017, I&apos;ve had the opportunity to put into practice what
            I love and work with people from various nationalities. This
            experience has allowed me to develop valuable interpersonal and
            intercultural skills, as well as learn to adapt my communication to
            different contexts.
          </p>
          <p>
            My commitment to creating quality digital solutions for a global
            audience is a natural extension of this passion. With my language
            skills and knowledge, I&apos;m capable of creating internationalized
            products that are accessible and understandable to people from
            different backgrounds.
          </p>
          <p>
            If you&apos;re looking for a developer who can ensure your product
            is effective in a large part of the world, I&apos;m available to
            help.
          </p>
        </>
      </Section>

      <Section title="Projects">
        <>
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
        </>
      </Section>
    </>
  );
}
