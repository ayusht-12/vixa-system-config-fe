import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

interface ConfigInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  warn?: boolean;
  className?: string;
}

export function ConfigInput({ warn, className, ...rest }: ConfigInputProps) {
  return (
    <input
      className={clsx(
        "w-full rounded-small px-2.5 py-1.5 text-xs font-body outline-none transition-colors bg-[#0A0E14]",
        warn
          ? "border border-warn/25 text-warn"
          : "border border-accent text-neon focus:border-neon/40",
        className,
      )}
      {...rest}
    />
  );
}
