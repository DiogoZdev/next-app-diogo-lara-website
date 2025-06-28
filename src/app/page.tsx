import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/Section";
import { texts } from "@/utils/text";


export default function Page() {
  return (
    <>
      <Hero />

      <div className="grid gap-8">
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

        <Section title="Projects & Contributions">
          <>
            <ProjectCard
              title="Testing With Jest Made Simple"
              image="/projects/jest.jpeg"
              description={texts.jest}
              technologies={["Jest", "NodeJS", "JavaScript"]}
              githubUrl="https://github.com/diogozdev/Jest"
            ></ProjectCard>

            <ProjectCard
              title="Andressa's Illustrations"
              image="/projects/ilustra-1.png"
              description="Andressa Araujo illustration portfolio"
              technologies={["NextJS", "ReactJS", "TypeScript", "CSS"]}
              githubUrl="https://github.com/diogozdev/next-app-andressa-ilustra"
              websiteUrl="https://andressailustra.art"
            ></ProjectCard>

            <ProjectCard
              title="Sérgio Genealogy"
              image="/projects/sergio-genealogia.png"
              description="In memory of Sérgio Ricardo (1961 - 2023)"
              technologies={["HTML", "CSS", "Github Pages"]}
            ></ProjectCard>
          </>
        </Section>
      </div>
    </>
  );
}
