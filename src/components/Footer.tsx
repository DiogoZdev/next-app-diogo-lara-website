"use client";

import { Container } from "@/layouts/Container";
import { Network } from "./Network";

export default function Footer() {
  return (
    <>
      <style jsx>{`
        .top {
          height: 100px;
        }

        .bottom {
        }
      `}</style>

      <footer>
        <div className="top"></div>
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
