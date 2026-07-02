import clsx from "clsx";
import type { AccentColor } from "../../types/command-center";
import { ACCENT_CLASSES } from "./accentColors";

interface ProgressBarProps {
  percent: number;
  color?: AccentColor;
  trackClassName?: string;
  barClassName?: string;
  height?: "thin" | "sm" | "regular";
}

const HEIGHT_CLASSES: Record<NonNullable<ProgressBarProps["height"]>, string> = {
  thin: "h-1",
  sm: "h-2",
  regular: "h-4",
};

export function ProgressBar({
  percent,
  color = "neon",
  trackClassName,
  barClassName,
  height = "thin",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      className={clsx(
        "rounded-full bg-gray-800 overflow-hidden",
        HEIGHT_CLASSES[height],
        trackClassName ?? "w-full",
      )}
    >
      <div
        className={clsx(
          "h-full rounded-full transition-all duration-1000",
          ACCENT_CLASSES[color].bar,
          barClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
