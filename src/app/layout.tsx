import Footer from "@/components/Footer";
import "./ui/global.css";
import { Container } from "@/layouts/Container";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Diogo Lara</title>
        <link rel="icon" href="/favicon.svg" />
      </head>

      <body>
        <div className="stripe gradient-bg"></div>
        <Container>
          <>{children}</>
        </Container>
        <Footer />
      </body>
    </html>
  );
}
