import { cn } from "@/lib/utils";

type Variant = "PRIMARY" | "SECONDARY" | "BLACK" | "WHITE";

export function ButtonLink(props: {
  url: string;
  text: string;
  variant?: Variant;
  external?: boolean;
}) {
  const { variant = "SECONDARY", external = true } = props;

  return (
    <a
      href={props.url}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "inline-flex min-w-40 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--layer-000)]",
        {
          "gradient-surface text-white shadow-[var(--shadow-accent)] hover:-translate-y-0.5":
            variant === "PRIMARY",
          "border border-[var(--border-color)] bg-[var(--layer-200)] text-[var(--font-color)] hover:border-[var(--accent)] hover:text-[var(--accent)]":
            variant === "SECONDARY",
          "bg-[var(--layer-000)] text-white hover:-translate-y-0.5 hover:bg-black":
            variant === "BLACK",
          "border border-[var(--border-strong)] text-[var(--font-color)] hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]":
            variant === "WHITE",
        }
      )}
    >
      {props.text}
    </a>
  );
}
