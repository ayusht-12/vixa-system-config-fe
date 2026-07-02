import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { TIER_STYLES, type ConfigTier } from "./tierStyles";

interface StatusBadgeProps {
  label: string;
  colorHex: string;
  bgHex?: string;
  borderHex?: string;
}

interface PanelShellProps {
  tier: ConfigTier;
  title: string;
  statusBadge?: StatusBadgeProps;
  actionLink?: { label: string; href: string };
  children: ReactNode;
  className?: string;
}

export function PanelShell({
  tier,
  title,
  statusBadge,
  actionLink,
  children,
  className,
}: PanelShellProps) {
  const style = TIER_STYLES[tier];

  return (
    <div
      className={`panel-hover rounded-large border bg-card ${className ?? ""}`}
      style={{ borderColor: style.cardBorderHex }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.dotHex }} />
          <h3 className="font-heading font-semibold text-white text-sm">{title}</h3>
          <span
            className="px-1.5 py-0.5 rounded-small text-[9px] border"
            style={{
              backgroundColor: style.badgeBgHex,
              color: style.textHex,
              borderColor: style.badgeBorderHex,
            }}
          >
            {style.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {statusBadge && (
            <span
              className="px-2 py-0.5 rounded-small text-[9px] border"
              style={{
                backgroundColor: statusBadge.bgHex ?? "#001A0D",
                color: statusBadge.colorHex,
                borderColor: statusBadge.borderHex ?? `${statusBadge.colorHex}40`,
              }}
            >
              {statusBadge.label}
            </span>
          )}
          {actionLink && (
            <Link to={actionLink.href} className="text-xs text-neon hover:underline">
              {actionLink.label}
            </Link>
          )}
        </div>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}
