import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

interface SectionCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: boolean;
}

export function SectionCard({
  children,
  glow,
  className,
  ...rest
}: SectionCardProps) {
  return (
    <div
      className={clsx(
        "rounded-large border border-subtle bg-card",
        glow && "glow-green",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
