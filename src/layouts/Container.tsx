import { ReactElement } from "react";

interface Props {
  children?: ReactElement;
}

export const Container = ({ children }: Props) => (
  <div className="wrapper">{children}</div>
);
