export interface IPost {
  date: string,
  language: string,
  preview: string,
  title: string,
  url: string,
}

export const postsData: Array<IPost> = [
  {
    date: "2023/06/10",
    language: "English",
    preview: "A new era has truly started. Do humans have place in it?",
    title: "Empower people with AI",
    url: "blog/post/artificial-intelligence",
  },
  {
    date: "2023/04/28",
    language: "English",
    preview: "Should I learn React ou Angular? How to get results faster? Where to start with so many similar options?",
    title: "Choosing technologies to work with",
    url: "blog/post/choosing-technologies",
  },
  {
    date: "2023/04/22",
    language: "Português",
    preview: "Programação parece legal, mas não sei falar inglês, só o básico do básico. Será que é pra mim?",
    title: "Preciso falar inglês para ser programador?",
    url: "blog/post/preciso-falar-ingles",
  }
];
