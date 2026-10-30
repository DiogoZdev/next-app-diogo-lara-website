import { cn } from "@/lib/utils";
import React, { useId } from "react";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function Textarea({
  label,
  required,
  className,
  id,
  ...props
}: Props) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className="grid gap-2">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--font-muted)]"
        >
          {label}
          {required ? <span className="text-[var(--accent)]"> *</span> : ""}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          "w-full resize-y rounded-xl border border-[var(--border-color)] bg-[var(--layer-200)] px-4 py-3 text-sm text-[var(--font-color)] outline-none transition-colors duration-200",
          "placeholder:text-[var(--font-muted)] hover:border-[var(--border-strong)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-transparent)]",
          className
        )}
        {...props}
      />
    </div>
  );
}
