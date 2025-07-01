import React from "react";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function Textarea({ label, required, className, ...props }: Props) {
  return (
    <div>
      {label && <label htmlFor={label}>
        {label}
        {required ? <span className="text-red-600"> *</span> : ""}
      </label>}
      <textarea className={`p-2 bg-[#333] w-full ${className}`} {...props} />
    </div>
  );
}
