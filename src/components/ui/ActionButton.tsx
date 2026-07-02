import clsx from "clsx";
import { Link } from "react-router-dom";
import type { StreamAction } from "../../types/anomaly-detection";

interface ActionButtonProps {
  action: StreamAction;
  size?: "sm" | "md";
}

const VARIANT_CLASSES: Record<StreamAction["variant"], string> = {
  escalate: "escalate-btn text-white font-bold",
  isolate: "isolate-btn text-gray-900 font-bold",
  block: "bg-[#1A0A2A] border border-[#A78BFA40] text-[#A78BFA] font-bold",
  primary: "bg-neon text-gray-900 font-bold hover:opacity-90",
  default: "bg-surface border border-accent text-gray-400 hover:border-gray-500 transition-colors",
  link: "bg-surface border border-accent text-gray-400 hover:border-gray-500 transition-colors",
};

export function ActionButton({ action, size = "md" }: ActionButtonProps) {
  const className = clsx(
    "rounded-small text-xs transition-colors",
    size === "md" ? "px-3 py-1" : "px-2 py-0.5",
    VARIANT_CLASSES[action.variant],
  );

  if (action.variant === "link" && action.href) {
    return (
      <Link to={action.href} className={className}>
        {action.label}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {action.label}
    </button>
  );
}
