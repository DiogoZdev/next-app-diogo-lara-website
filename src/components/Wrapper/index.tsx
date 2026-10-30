import { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export function Wrapper({ children }: Props) {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 md:px-8">
      {children}
    </div>
  );
}
