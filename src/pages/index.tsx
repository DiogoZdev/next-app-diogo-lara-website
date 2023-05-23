import { Headline } from "@/components/Headline";
import { Me } from "@/components/Me";
import { Network } from "@/components/Network";
import { Section } from "@/layouts/Section";
import { sanchez } from "@/styles/fonts";
import Head from "next/head";

export default function Home() {
  return (
    <div className={sanchez.className}>
      <Head>
        <title>Diogo Lara</title>
      </Head>

      <Me />
      <Headline />
      <Network margin="auto" />
      <Section title="A little beyond the code">
        <>
          <p>
            With over 10 years of passion for language learning, I&apos;m constantly
            seeking new ways to explore different cultures and communicate with
            people from around the world. Portuguese is my mother language, but,
            currently, I&apos;m fluent in English, have an advanced knowledge of
            Spanish, and I&apos;m studying Italian.
          </p>
          <p>
            Since 2017, I&apos;ve had the opportunity to put into practice what I
            love and work with people from various nationalities. This
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
            If you&apos;re looking for a developer who can ensure your product is
            effective in a large part of the world, I&apos;m available to help.
          </p>
        </>
      </Section>
    </div>
  );
}
