import { ReactElement } from "react";

interface Props {
  children?: ReactElement;
}

export const Container = ({ children }: Props) => (
  <>
    <style jsx>{`
      .container {
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
        padding: 1rem;
      }  
    `}</style>

    <div className="container">{children}</div>
  </>
);
