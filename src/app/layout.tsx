import Footer from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Wrapper } from "@/components/Wrapper";
import { links } from "@/contents/links";
import type { Metadata } from "next";
import { ReactNode } from "react";
import "./ui/global.css";

export const metadata: Metadata = {
  title: {
    default: "Diogo Lara — Fullstack Developer",
    template: "%s · Diogo Lara",
  },
  description:
    "Diogo Lara is a fullstack developer building thoughtful, international-ready web products.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav pages={links} />
        <Wrapper>
          <main>{children}</main>
        </Wrapper>
        <Footer />
      </body>
    </html>
  );
}
