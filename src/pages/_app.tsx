import { Container } from "@/layouts/Container";
import Footer from "@/components/Footer";
import { Nav, NavProps } from "@/components/Nav";
import GlobalStyles from "@/styles/Globals";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { sanchez } from "@/styles/fonts";

export default function App({ Component, pageProps }: AppProps) {
  const pages: NavProps = {
    pages: [
      { page: "Home", path: "/" },
      { page: "Blog", path: "/blog" },
      { page: "Projects", path: "/projects" },
    ],
  };

  return (
    <div style={sanchez.style}>
      <GlobalStyles />
      <Head>
        <link rel="shortcut icon" href="favicon.svg" type="image/svg" />
      </Head>
      <div className="stripe gradient-bg"></div>
      <Container>
        <>
          <Nav pages={pages.pages} />
          <Component {...pageProps} />
        </>
      </Container>
      <Footer />
    </div>
  );
}
