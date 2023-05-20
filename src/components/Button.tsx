interface ButtonProps {
  children: string;
}

export const Button = ({ children }: ButtonProps) => {
  return (
    <>
      <style jsx>{`
        button {
          margin: 1rem 0;
          padding: 0.5rem 1rem;
          background: var(--accent-transparent);
          cursor:pointer;
        }

        button:hover {
          background: var(--accent);
        }
      `}</style>
      <button>{children}</button>
    </>
  );
};
