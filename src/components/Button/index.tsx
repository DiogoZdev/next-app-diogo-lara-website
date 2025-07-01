import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button = ({ children, type, ...props }: ButtonProps) => {
  return (

    <button
      className="w-fit flex gap-4 font-bold px-6 py-2 border-[1px] border-solid border-gray-400 cursor-pointer rounded hover:border-orange-400 hover:text-orange-400"
      type={type}
      {...props}
    >
      {children}
    </button>

  );
};
