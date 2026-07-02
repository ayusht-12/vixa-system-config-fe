import { useState } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  defaultValue: number;
  formatValue: (value: number) => string;
}

export function RangeSlider({ min, max, defaultValue, formatValue }: RangeSliderProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="flex-1 accent-neon"
      />
      <span className="text-neon text-xs w-16 text-right font-mono">{formatValue(value)}</span>
    </div>
  );
}
