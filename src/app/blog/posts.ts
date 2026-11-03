export interface IPost {
  date: string,
  language: string,
  preview: string,
  title: string,
  url: string,
}

export const postsData: Array<IPost> = [
  {
    date: "2026/10/30",
    language: "Português",
    preview: "Mordi a língua. Às vezes vemos coisas darem certo, às vezes falharem, às vezes nos empolgamos e às vezes deixamos passar.",
    title: "Do autocompletar à programação assistida por agentes",
    url: "blog/post/agent-assisted-programming-ptbr",
  },
  {
    date: "2026/10/30",
    language: "English",
    preview: "I bit my tongue. Sometimes we see things succeed, sometimes fail, sometimes we hype, and sometimes we let go.",
    title: "From autocompletion to agent assistance",
    url: "blog/post/agent-assisted-programming",
  },
  {
    date: "2023/06/10",
    language: "English",
    preview: "A new era has truly started. Do humans have place in it?",
    title: "Empower people with AI",
    url: "blog/post/artificial-intelligence",
  },
  {
    date: "2023/04/28",
    language: "Português",
    preview: "Devo aprender React ou Angular? Como ter resultados mais rápido? Por onde começar com tantas possibilidades semelhantes?",
    title: "Escolhendo tecnologias para se usar",
    url: "blog/post/choosing-technologies-ptbr",
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
