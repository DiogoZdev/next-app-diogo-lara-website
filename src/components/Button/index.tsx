import { cn } from "@/lib/utils";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  type = "button",
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "flex w-fit items-center gap-2.5 rounded-full border border-[var(--border-color)] px-6 py-2.5 text-sm font-semibold uppercase tracking-wide transition-all duration-200",
        "hover:border-[var(--accent)] hover:bg-[var(--accent-transparent)] hover:text-[var(--accent)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--layer-000)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
};
