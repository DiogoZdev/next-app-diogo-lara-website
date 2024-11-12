interface ButtonProps {
  children: string;
}

export const Button = ({ children }: ButtonProps) => {
  return (
    <>
      <style jsx>{`
        button {
          margin: 1rem 0;
          padding: 1rem 2rem;
          background: var(--gradient-bg);
          cursor: pointer;
          font-weight: bold;
          width: fit-content;
        }

        button:hover {
          background: var(--accent);
        }
      `}</style>
      <button>{children}</button>
    </>
  );
};
