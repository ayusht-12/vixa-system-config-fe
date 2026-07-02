import type { ReactNode } from "react";

interface ConfigFieldProps {
  label: string;
  hint?: string;
  trailing?: ReactNode;
  children: ReactNode;
}

export function ConfigField({ label, hint, trailing, children }: ConfigFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-gray-500 uppercase tracking-widest">
          {label} {hint && <span className="text-gray-700 normal-case">({hint})</span>}
        </label>
        {trailing}
      </div>
      {children}
    </div>
  );
}
