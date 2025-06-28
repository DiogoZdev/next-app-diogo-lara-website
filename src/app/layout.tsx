import Footer from "@/components/Footer";
import "./ui/global.css";
import { Container } from "@/components/Container";
import { ReactNode } from "react";
import { Nav } from "@/components/Nav";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Diogo Lara</title>
        <link rel="icon" href="/favicon.svg" />
      </head>

      <body>
        <div className="stripe gradient-bg"></div>
        <Nav pages={[
            {
              page: 'Home',
              path: '/',
            },
            {
              page: 'Blog',
              path: '/blog',
            },
            {
              page: 'Experience & Projects',
              path: '/experience',
            },
            {
              page: 'Manifesto',
              path: '/manifesto',
            },
          ]} />
        <Container>
          <>{children}</>
        </Container>
        <Footer />
        <div className="stripe gradient-bg"></div>
      </body>
    </html>
  );
}
