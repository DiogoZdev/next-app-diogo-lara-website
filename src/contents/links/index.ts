import type { LocalizedText } from "@/lib/i18n";

interface IPage {
  page: LocalizedText;
  path: string;
}

export const links: Array<IPage> = [
  {
    page: { en: "Home", pt: "Início" },
    path: "/",
  },
  {
    page: { en: "Blog", pt: "Blog" },
    path: "/blog",
  },
  {
    page: { en: "Experience", pt: "Experiência" },
    path: "/experience",
  },
  {
    page: { en: "Manifesto", pt: "Manifesto" },
    path: "/manifesto",
  },
  {
    page: { en: "Mascot", pt: "Mascote" },
    path: "/mascot",
  },
  {
    page: { en: "Lab", pt: "Experimentos" },
    path: "/lab",
  },
];
