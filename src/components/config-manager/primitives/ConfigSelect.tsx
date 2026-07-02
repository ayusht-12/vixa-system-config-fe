import type { SelectHTMLAttributes } from "react";

interface ConfigSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
}

export function ConfigSelect({ options, ...rest }: ConfigSelectProps) {
  return (
    <select
      className="w-full rounded-small px-2.5 py-1.5 text-xs font-body outline-none cursor-pointer bg-[#0A0E14] border border-accent text-gray-300 focus:border-neon/40"
      {...rest}
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}
