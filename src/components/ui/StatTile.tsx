import clsx from "clsx";
import type { ReactNode } from "react";

interface StatTileProps {
  label: string;
  children: ReactNode;
  tone?: string;
  size?: "sm" | "lg";
}

export function StatTile({
  label,
  children,
  tone = "text-gray-300",
  size = "sm",
}: StatTileProps) {
  return (
    <div className="p-2 rounded-small bg-surface">
      <div className="text-xs text-gray-600">{label}</div>
      <div
        className={clsx(
          "mt-0.5",
          size === "sm"
            ? "text-xs font-medium"
            : "font-heading text-lg font-bold",
          tone,
        )}
      >
        {children}
      </div>
    </div>
  );
}
