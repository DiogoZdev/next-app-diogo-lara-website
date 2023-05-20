import { Headline } from "@/components/Headline";
import { Me } from "@/components/Me";
import { Network } from "@/components/Network";
import { Section } from "@/layouts/Section";   
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Diogo Lara</title>
      </Head>

      <Me />
      <Headline />
      <Network margin="auto" />
      <Section title="Um pouco além do Código">
        <>
          <p>
            Com mais de 10 anos de paixão pelo aprendizado de idiomas, estou
            sempre em busca de novas formas de explorar diferentes culturas e me
            comunicar com pessoas de todo o mundo. Atualmente sou fluente em
            Ingês, tenho um conhecimento avançado em Espanhol e estou estudando
            Italiano.
          </p>
          <p>
            A partir de 2017, tive a oportunidade de colocar em prática o que
            amo e trabalhar com pessoas de diversas nacionalidades. Essa
            experiência me permitiu desenvolver habilidades interpessoais e
            interculturais valiosas, além de aprender a adaptar minha
            comunicação para diferentes contextos.
          </p>
          <p>
            Meu comprometimento em criar soluções digitais de qualidade para uma
            audiência global é uma extensão natural dessa paixão. Com minha
            experiência e aprendizados em idiomas, sou capaz de criar produtos
            internacionalizados que sejam acessíveis e compreensíveis para
            pessoas de diferentes origens.
          </p>
          <p>
            Se você está procurando um desenvolvedor que possa garantir que seu
            produto seja eficaz em grande parte do mundo, estou à disposição
            para ajudar.
          </p>
        </>
      </Section>
    </>
  );
}
