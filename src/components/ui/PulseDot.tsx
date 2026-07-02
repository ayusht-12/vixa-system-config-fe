import clsx from "clsx";

export type PulseDotColor = "neon" | "danger" | "warn" | "info" | "purple";

interface PulseDotProps {
  color?: PulseDotColor;
  size?: "sm" | "md";
  pulse?: boolean;
  className?: string;
}

const COLOR_CLASSES: Record<NonNullable<PulseDotProps["color"]>, string> = {
  neon: "bg-neon",
  danger: "bg-danger",
  warn: "bg-warn",
  info: "bg-info",
  purple: "bg-purple-400",
};

const SIZE_CLASSES: Record<NonNullable<PulseDotProps["size"]>, string> = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
};

export function PulseDot({
  color = "neon",
  size = "sm",
  pulse = true,
  className,
}: PulseDotProps) {
  return (
    <span
      className={clsx(
        "inline-block rounded-full",
        SIZE_CLASSES[size],
        COLOR_CLASSES[color],
        pulse && "animate-pulse-dot",
        className,
      )}
    />
  );
}
