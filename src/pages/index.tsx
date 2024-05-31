import { Headline } from "@/components/Headline";
// import { Me } from "@/components/Me";
import { Network } from "@/components/Network";
import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/layouts/Section";
import Head from "next/head";
import { texts } from "../utils/text";
import { useLanguage } from "@/hooks/useLanguage";
import { Translate } from "@/components/Translate";
import React, { useMemo } from "react";

export default function Home() {
  const { t, language } = useLanguage();

  const mainPageMemo = useMemo(() => {

    console.log("called MEMO ", language)

    return <>
      <Head>
        <title>Diogo Lara</title>
      </Head>

      {/* temporary removal for improvement <Me /> */}

      <Headline />

      <Section title={t('intro.title')}>
        <>
          <p>{t('intro.p1')}</p>
          <p>{t('intro.p2')}</p>
          <p>{t('intro.p3')}</p>
          <p>{t('intro.p4')}</p>
        </>
      </Section>

      <Section title={t("projects.title")}>
        <>
          <ProjectCard
            title={t("projects.jest.title")}
            image="/projects/jest.jpeg"
            description={texts.jest}
            technologies={["Jest", "NodeJS", "JavaScript"]}
            githubUrl="https://github.com/diogozdev/Jest"
          ></ProjectCard>

          <ProjectCard
            title={t("projects.diogo_website.title")}
            image="/projects/diogolara-dev.png"
            description={t("projects.diogo_website.p1")}
            technologies={["NextJS", "ReactJS", "TypeScript", "CSS"]}
            githubUrl="https://github.com/diogozdev/next-app-diogo-lara-website"
          ></ProjectCard>

          <ProjectCard
            title={t("projects.andressa.title")}
            image="/projects/ilustra-1.png"
            description={t("projects.andressa.p1")}
            technologies={["NextJS", "ReactJS", "TypeScript", "CSS"]}
            githubUrl="https://github.com/diogozdev/next-app-andressa-ilustra"
            websiteUrl="https://andressailustra.art"
          ></ProjectCard>

          <ProjectCard
            title={t("projects.sergio.title")}
            image="/projects/sergio-genealogia.png"
            description={t("projects.sergio.p1")}
            technologies={["HTML", "CSS", "Github Pages"]}
            githubUrl="https://github.com/sergiogenealogia"
            websiteUrl="https://sergiogenealogia.github.io"
          ></ProjectCard>
        </>
      </Section>
    </>
  }, [language])

  return (
    <div>
      <Translate/>
      { mainPageMemo }
    </div>
  );
}