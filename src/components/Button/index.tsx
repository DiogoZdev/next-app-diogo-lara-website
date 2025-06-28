interface ButtonProps {
  children: string;
}

export const Button = ({ children }: ButtonProps) => {
  return (

    <button
      className="px-4 py-2 border-[1px] border-solid border-gray-400 cursor-pointer rounded hover:border-orange-400 hover:-translate-y-[5px] transition-all"
    >
      {children}
    </button>

  );
};
