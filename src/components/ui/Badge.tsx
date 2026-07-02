import clsx from "clsx";
import type { ReactNode } from "react";

type BadgeTone = "neon" | "blue" | "purple" | "danger" | "warn" | "neutral";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  neon: "bg-green-950 text-neon border border-neon/25",
  blue: "bg-blue-950 text-blue-400 border border-blue-900",
  purple: "bg-purple-950 text-purple-400 border border-purple-900",
  danger: "bg-red-950 text-danger border border-red-900",
  warn: "bg-amber-950/40 text-warn border border-amber-900/60",
  neutral: "bg-gray-800 text-gray-500",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "px-2 py-0.5 rounded-small text-xs font-medium whitespace-nowrap",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
