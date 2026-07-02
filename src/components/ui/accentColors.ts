import type { AccentColor } from "../../types/command-center";

interface AccentClasses {
  bar: string;
  text: string;
}

export const ACCENT_CLASSES: Record<AccentColor, AccentClasses> = {
  neon: { bar: "bg-neon", text: "text-neon" },
  info: { bar: "bg-info", text: "text-info" },
  warn: { bar: "bg-warn", text: "text-warn" },
  danger: { bar: "bg-danger", text: "text-danger" },
  purple: { bar: "bg-purple-400", text: "text-purple-400" },
};
