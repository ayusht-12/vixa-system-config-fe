import clsx from "clsx";
import type { IntegrityBadge } from "../../types/audit-log";
import { ACCENT_CLASSES } from "../ui/accentColors";

interface IntegrityBadgesPanelProps {
  badges: IntegrityBadge[];
}

const GLOW_CLASSES: Record<IntegrityBadge["tone"], string> = {
  neon: "glow-green",
  info: "glow-blue",
  warn: "glow-amber",
  danger: "glow-red",
  purple: "glow-purple",
};

const BG_CLASSES: Record<IntegrityBadge["tone"], string> = {
  neon: "bg-[#001A0D] border-neon/25",
  info: "bg-[#0A0F1A] border-info/25",
  warn: "bg-[#1A1200] border-warn/25",
  danger: "bg-[#1A0505] border-danger/25",
  purple: "bg-[#0D0A1A] border-purple-500/25",
};

function BadgeTile({ badge }: { badge: IntegrityBadge }) {
  const tone = ACCENT_CLASSES[badge.tone];

  if (badge.wide) {
    return (
      <div className={clsx("p-3 rounded-small border flex items-center gap-2 col-span-2", "bg-[#0A0F1A] border-info/19")}>
        <span className={clsx("text-lg", tone.text)}>{badge.icon}</span>
        <div className="flex-1">
          <div className={clsx("text-xs font-medium", tone.text)}>{badge.label}</div>
          <div className="flex gap-1.5 mt-1 flex-wrap">
            {badge.tags?.map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 rounded-small text-[9px] text-neon border bg-[#001A0D] border-neon/25">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("p-3 rounded-small border flex items-center gap-2", BG_CLASSES[badge.tone], GLOW_CLASSES[badge.tone])}>
      <span className={clsx("text-lg", tone.text)}>{badge.icon}</span>
      <div>
        <div className={clsx("text-xs font-medium", tone.text)}>{badge.label}</div>
        <div className="text-xs text-gray-600">{badge.description}</div>
      </div>
    </div>
  );
}

export function IntegrityBadgesPanel({ badges }: IntegrityBadgesPanelProps) {
  return (
    <div className="rounded-large border border-subtle bg-card">
      <div className="px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">Log Integrity Badges</h3>
      </div>
      <div className="p-4 grid grid-cols-2 gap-2">
        {badges.map((badge) => (
          <BadgeTile key={badge.label} badge={badge} />
        ))}
      </div>
    </div>
  );
}
