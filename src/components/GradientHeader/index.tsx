import { cn } from "@/lib/utils";

export function GradientHeader({
  text,
  center = false,
  className,
}: {
  text: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "gradient-text block font-display text-[1.5rem] font-bold md:text-[1.75rem]",
        center && "mx-auto",
        className
      )}
    >
      {text}
    </h2>
  );
}
