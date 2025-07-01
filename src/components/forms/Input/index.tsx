import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, required, type, ...props }: Props) {
  return (
    <div>
      {label && <label htmlFor={label}>
        {label}
        {required ? <span className="text-red-600"> *</span> : ""}
      </label>}
      <input className="p-2 bg-[#333] w-full" type={type} {...props} />
    </div>
  );
}
