import type { LocalizedText } from "@/lib/i18n";
import { texts } from "@/contents/texts";

export const about: Array<LocalizedText> = [
  {
    en: `With over 10 years of passion for language learning, I'm constantly seeking new ways to explore different cultures and communicate with people from around the world. Portuguese is my mother language, but, currently, I'm fluent in English, have an advanced knowledge of Spanish, and I'm studying Italian.`,
    pt: `Com mais de 10 anos de paixão por aprender idiomas, estou constantemente buscando novas formas de explorar diferentes culturas e me comunicar com pessoas de todo o mundo. O português é minha língua materna, mas atualmente sou fluente em inglês, tenho conhecimento avançado de espanhol e estou estudando italiano.`,
  },
  {
    en: `Since 2017, I've had the opportunity to put into practice what I love and work with people from various nationalities. This experience has allowed me to develop valuable interpersonal and intercultural skills, as well as learn to adapt my communication to different contexts.`,
    pt: `Desde 2017, tive a oportunidade de colocar em prática o que amo e trabalhar com pessoas de diversas nacionalidades. Essa experiência me permitiu desenvolver habilidades interpessoais e interculturais valiosas, além de aprender a adaptar minha comunicação a diferentes contextos.`,
  },
  {
    en: `My commitment to creating quality digital solutions for a global audience is a natural extension of this passion. With my language skills and knowledge, I'm capable of creating internationalized products that are accessible and understandable to people from different backgrounds.`,
    pt: `Meu compromisso em criar soluções digitais de qualidade para um público global é uma extensão natural dessa paixão. Com minhas habilidades linguísticas e conhecimento, sou capaz de criar produtos internacionalizados que sejam acessíveis e compreensíveis para pessoas de diferentes origens.`,
  },
  {
    en: `If you're looking for a developer who can ensure your product is effective in a large part of the world, I'm available to help.`,
    pt: `Se você procura um desenvolvedor que possa garantir que seu produto seja eficaz em grande parte do mundo, estou disponível para ajudar.`,
  },
];

export interface IProjectData {
  title: string;
  image: string;
  description: LocalizedText;
  technologies: string[];
  githubUrl?: string;
  websiteUrl?: string;
}

export const projects: Array<IProjectData> = [
  {
    title: "NumWriter",
    image: "/projects/numwriter.png",
    description: {
      en: "A number-to-word converter library for JavaScript and TypeScript.",
      pt: "Uma biblioteca conversora de números para palavras para JavaScript e TypeScript.",
    },
    technologies: ["JavaScript", "TypeScript"],
    githubUrl: "https://github.com/diogozdev/numwriter-lib",
    websiteUrl: "https://www.npmjs.com/package/numwriter",
  },
  {
    title: "Compared Language Bible",
    image: "/projects/bible.png",
    description: {
      en: "A compared language bible. Includes Latin, Greek, Hebrew, Italian, Spanish, English, Portuguese and other languages.",
      pt: "Uma bíblia de idiomas comparados. Inclui latim, grego, hebraico, italiano, espanhol, inglês, português e outros idiomas.",
    },
    technologies: ["Angular", "TypeScript", "SCSS"],
    websiteUrl: "https://bible.diogolara.dev",
  },
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
    description: {
      en: "Andressa Araujo illustration portfolio",
      pt: "Portfólio de ilustrações de Andressa Araujo",
    },
    technologies: ["NextJS", "ReactJS", "TypeScript", "CSS"],
    githubUrl: "https://github.com/diogozdev/next-app-andressa-ilustra",
    websiteUrl: "https://andressailustra.art",
  },
  {
    title: "Sérgio Genealogy",
    image: "/projects/sergio-genealogia.png",
    description: {
      en: "In memory of Sérgio Ricardo (1961 - 2023)",
      pt: "Em memória de Sérgio Ricardo (1961 - 2023)",
    },
    technologies: ["HTML", "CSS", "Github Pages"],
  },
];
