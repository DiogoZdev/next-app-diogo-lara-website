"use client";

import { Container } from "@/layouts/Container";
import { Network } from "./Network";
import ContactForm from "./ContactForm";

export default function Footer() {
  return (
    <>
      <style jsx>{`
        .top {
          min-height: 100px;
        }

        .bottom {
          padding-top: 2rem;
        }
      `}</style>

      <footer>
        <div className="top">
          <ContactForm />
        </div>
        <div className="bottom gradient-bg">
          <Container>
            <>
              <h2>Get in touch</h2>
              <Network margin="0" marginTop="0" hover="white"></Network>
            </>
          </Container>
        </div>
      </footer>
    </>
  );
}
