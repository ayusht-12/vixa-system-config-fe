import { useState } from "react";
import clsx from "clsx";

interface SegmentedButtonsProps {
  options: string[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function SegmentedButtons({ options, defaultValue, onChange }: SegmentedButtonsProps) {
  const [active, setActive] = useState(defaultValue ?? options[0]);

  function select(option: string) {
    setActive(option);
    onChange?.(option);
  }

  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => select(option)}
          className={clsx(
            "px-3 py-1.5 rounded-small text-xs font-medium transition-colors",
            option === active
              ? "text-gray-900 bg-neon"
              : "text-gray-500 border border-accent bg-surface hover:border-gray-500",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
