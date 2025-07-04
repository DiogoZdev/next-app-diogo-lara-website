export const about = [
  `
    With over 10 years of passion for language learning, I'm
    constantly seeking new ways to explore different cultures and
    communicate with people from around the world. Portuguese is my
    mother language, but, currently, I'm fluent in English, have an
    advanced knowledge of Spanish, and I'm studying Italian.
  `,
  `
    Since 2017, I've had the opportunity to put into practice what
    I love and work with people from various nationalities. This
    experience has allowed me to develop valuable interpersonal and
    intercultural skills, as well as learn to adapt my communication to
    different contexts.
  `,
  `
    My commitment to creating quality digital solutions for a global
    audience is a natural extension of this passion. With my language
    skills and knowledge, I'm capable of creating internationalized
    products that are accessible and understandable to people from
    different backgrounds.
  `,
  `
    If you're looking for a developer who can ensure your product
    is effective in a large part of the world, I'm available to
    help.
  `,
]

import { texts } from "@/contents/texts";

export interface IProjectData {
  title: string;
  image: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  websiteUrl?: string;
}

export const projects: Array<IProjectData> = [
  {
    title: "Testing With Jest Made Simple",
    image: "/projects/jest.jpeg",
    description: texts.jest,
    technologies: ["Jest", "NodeJS", "JavaScript"],
    githubUrl: "https://github.com/diogozdev/Jest",
  },
  {
    title: "Andressa's Illustrations",
    image: "/projects/ilustra-1.png",
    description: "Andressa Araujo illustration portfolio",
    technologies: ["NextJS", "ReactJS", "TypeScript", "CSS"],
    githubUrl: "https://github.com/diogozdev/next-app-andressa-ilustra",
    websiteUrl: "https://andressailustra.art",
  },
  {
    title: "Sérgio Genealogy",
    image: "/projects/sergio-genealogia.png",
    description: "In memory of Sérgio Ricardo (1961 - 2023)",
    technologies: ["HTML", "CSS", "Github Pages"],
  },
]
