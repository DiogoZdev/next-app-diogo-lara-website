import Footer from "@/components/Footer";
import "./ui/global.css";
import { Wrapper } from "@/components/Wrapper";
import { ReactNode } from "react";
import { Nav } from "@/components/Nav";
import { links } from "@/contents/links";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Diogo Lara</title>
        <link rel="icon" href="/favicon.svg" />
      </head>

      <body>
        <div className="stripe gradient-bg"></div>
        <Nav pages={links} />
        <Wrapper>
          <>{children}</>
        </Wrapper>
        <Footer />
        <div className="stripe gradient-bg"></div>
      </body>
    </html>
  );
}
