import { TIER_STYLES, type ConfigTier } from "./primitives/tierStyles";

interface ConfigSectionHeaderProps {
  tier: ConfigTier;
  hint: string;
}

export function ConfigSectionHeader({ tier, hint }: ConfigSectionHeaderProps) {
  const style = TIER_STYLES[tier];

  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-small inline-block" style={{ backgroundColor: style.dotHex }} />
        <span className="font-heading font-semibold text-white text-sm tracking-wide">
          {style.label} CONFIGURATION
        </span>
      </div>
      <div className="flex-1 h-px" style={{ backgroundColor: `${style.dotHex}20` }} />
      <span className="text-xs text-gray-600">{hint}</span>
    </div>
  );
}
