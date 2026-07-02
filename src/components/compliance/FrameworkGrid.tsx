import clsx from "clsx";
import type { FrameworkCardData } from "../../types/compliance";
import { ACCENT_CLASSES } from "../ui/accentColors";
import { ProgressBar } from "../ui/ProgressBar";

interface FrameworkGridProps {
  frameworks: FrameworkCardData[];
}

function RingChart({ colorHex, percent, score, scoreTone }: {
  colorHex: string;
  percent: number;
  score: string;
  scoreTone: FrameworkCardData["scoreTone"];
}) {
  const degrees = (percent / 100) * 360;

  return (
    <div className="relative flex-shrink-0 w-16 h-16">
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `conic-gradient(${colorHex} 0deg ${degrees}deg, #21262D ${degrees}deg 360deg)`,
        }}
      />
      <div className="absolute inset-2 rounded-full flex items-center justify-center bg-card">
        <span className={clsx("font-heading text-sm font-bold", ACCENT_CLASSES[scoreTone].text)}>
          {score}
        </span>
      </div>
    </div>
  );
}

function FrameworkCard({ framework }: { framework: FrameworkCardData }) {
  return (
    <div
      className="framework-card rounded-large border bg-card p-4 transition-colors"
      style={{ borderColor: framework.borderHex ? `${framework.borderHex}30` : "#21262D" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="px-2 py-0.5 rounded-small text-xs font-bold text-gray-900"
              style={{ backgroundColor: framework.badgeColorHex }}
            >
              {framework.badgeLabel}
            </span>
            <span className="text-xs text-gray-500">{framework.subtitle}</span>
          </div>
          <div className="text-xs text-gray-600">{framework.description}</div>
        </div>
        <span
          className={clsx(
            "px-2 py-0.5 rounded-small text-[9px] border",
            ACCENT_CLASSES[framework.statusTone].text,
          )}
          style={{
            backgroundColor: framework.statusTone === "warn" ? "#1A1200" : undefined,
            borderColor:
              framework.statusTone === "neon"
                ? "#00FFA340"
                : framework.statusTone === "info"
                  ? "#1e3a8a"
                  : "#FBBF2440",
          }}
        >
          {framework.statusLabel}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <RingChart
          colorHex={framework.ringColorHex}
          percent={framework.ringPercent}
          score={framework.score}
          scoreTone={framework.scoreTone}
        />
        <div className="flex-1">
          <div className="text-xs text-gray-400 mb-1">
            Score:{" "}
            <span className={clsx("font-bold", ACCENT_CLASSES[framework.scoreTone].text)}>
              {framework.score}%
            </span>
          </div>
          {framework.metaLines.map((meta) => (
            <div key={meta.label} className="text-xs text-gray-600 mt-0.5">
              {meta.label}:{" "}
              <span className={meta.tone ? ACCENT_CLASSES[meta.tone].text : "text-gray-400"}>
                {meta.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        {framework.breakdown.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-xs">
            <span className="text-gray-600">{item.label}</span>
            <div className="flex items-center gap-1.5">
              <ProgressBar percent={item.percent} color={item.tone} trackClassName="w-16" />
              <span className={clsx("w-8 text-right", ACCENT_CLASSES[item.tone].text)}>
                {item.percent}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-subtle flex items-center justify-between text-xs">
        <span className="text-gray-600">{framework.footerLeft}</span>
        <span className={ACCENT_CLASSES[framework.footerRightTone].text}>
          {framework.footerRight}
        </span>
      </div>
    </div>
  );
}

export function FrameworkGrid({ frameworks }: FrameworkGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
      {frameworks.map((framework) => (
        <FrameworkCard key={framework.id} framework={framework} />
      ))}
    </div>
  );
}
