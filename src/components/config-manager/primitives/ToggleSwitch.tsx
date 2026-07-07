import { useState } from "react";
import clsx from "clsx";

interface ToggleSwitchProps {
  label?: string;
  defaultOn?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  disabled?: boolean;
  onChange?: (on: boolean) => void;
}

const TRACK_CLASSES: Record<NonNullable<ToggleSwitchProps["size"]>, string> = {
  sm: "w-7 h-3.5",
  md: "w-8 h-4",
  lg: "w-10 h-5",
};

const THUMB_CLASSES: Record<NonNullable<ToggleSwitchProps["size"]>, string> = {
  sm: "w-2.5 h-2.5 top-0.5 left-0.5",
  md: "w-3 h-3 top-0.5 left-0.5",
  lg: "w-3 h-3 top-1 left-1",
};

const TRANSLATE_CLASSES: Record<NonNullable<ToggleSwitchProps["size"]>, string> = {
  sm: "translate-x-3.5",
  md: "translate-x-4",
  lg: "translate-x-5",
};

export function ToggleSwitch({
  label,
  defaultOn = true,
  size = "md",
  showLabel = true,
  disabled = false,
  onChange,
}: ToggleSwitchProps) {
  const [on, setOn] = useState(defaultOn);

  function toggle() {
    setOn((prev) => {
      const next = !prev;
      onChange?.(next);
      return next;
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      className="flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={label}
    >
      <span
        className={clsx(
          "relative rounded-full transition-colors",
          TRACK_CLASSES[size],
          on ? "bg-neon" : "bg-accent",
        )}
      >
        <span
          className={clsx(
            "absolute rounded-full bg-gray-900 transition-transform",
            THUMB_CLASSES[size],
            on && TRANSLATE_CLASSES[size],
          )}
        />
      </span>
      {showLabel && (
        <span className={clsx("text-xs", on ? "text-neon font-bold" : "text-gray-500")}>
          {on ? "ON" : "OFF"}
        </span>
      )}
    </button>
  );
}
