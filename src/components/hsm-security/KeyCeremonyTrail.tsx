import clsx from "clsx";
import type { CeremonyEntry } from "../../types/hsm-security";
import { ACCENT_CLASSES } from "../ui/accentColors";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routes";

interface KeyCeremonyTrailProps {
  ceremonies: CeremonyEntry[];
  summary: string;
}

function CeremonyItem({ ceremony, isLast }: { ceremony: CeremonyEntry; isLast: boolean }) {
  return (
    <div className={ceremony.historical ? "mb-2" : "mb-4"}>
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center">
          <div
            className={clsx("w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", ceremony.dotPulse && "animate-pulse-dot")}
            style={{ backgroundColor: ceremony.dotColorHex }}
          >
            <span className="text-[8px] font-bold" style={{ color: "#080C10" }}>
              {ceremony.dotContent}
            </span>
          </div>
          {!isLast && (
            <div
              className="flex-1 mt-1"
              style={{
                width: 2,
                height: 80,
                background: "linear-gradient(180deg, #00FFA340 0%, #00FFA310 100%)",
                marginLeft: 7,
              }}
            />
          )}
        </div>
        <div className={clsx("flex-1", !isLast && "pb-4")}>
          <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
            <span className={clsx("text-xs font-medium", ACCENT_CLASSES[ceremony.eventTone].text)}>
              {ceremony.eventLabel}
            </span>
            <span className="text-xs text-gray-600">{ceremony.timeLabel}</span>
          </div>
          <div className={clsx("text-xs mb-2", ceremony.historical ? "text-gray-600" : "text-gray-400")}>
            {ceremony.description}
          </div>
          {ceremony.approvals.length > 0 && (
            <div
              className="p-2 rounded-small border"
              style={{
                backgroundColor: ceremony.eventTone === "info" ? "#0A0F1A" : "#001A0D",
                borderColor: ceremony.eventTone === "info" ? "#60A4FA40" : "#00FFA340",
              }}
            >
              <div className="text-xs text-gray-600 mb-1.5">{ceremony.quorumLabel}</div>
              <div className="space-y-1">
                {ceremony.approvals.map((approval) => (
                  <div key={approval.name} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{approval.name}</span>
                    <span
                      className={clsx(
                        "text-[9px]",
                        approval.pending ? "text-info animate-pulse-dot" : "text-neon",
                      )}
                    >
                      {approval.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="hash-text mt-1.5">{ceremony.ceremonyMeta}</div>
        </div>
      </div>
    </div>
  );
}

export function KeyCeremonyTrail({ ceremonies, summary }: KeyCeremonyTrailProps) {
  return (
    <div className="lg:col-span-2 rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">Key Ceremony Audit Trail</h3>
        <span className="px-2 py-0.5 rounded-small text-[9px] text-neon border bg-[#001A0D] border-neon/25">
          M-OF-N QUORUM
        </span>
      </div>
      <div className="p-4 scrollbar-thin overflow-y-auto max-h-[420px]">
        {ceremonies.map((ceremony, index) => (
          <CeremonyItem key={ceremony.id} ceremony={ceremony} isLast={index === ceremonies.length - 1} />
        ))}
      </div>
      <div className="px-4 py-3 border-t border-subtle bg-[#0A0E14] flex items-center justify-between">
        <span className="text-xs text-gray-500">{summary}</span>
        <Link to={ROUTES.auditLogs.path} className="text-xs text-neon hover:underline">
          Full Audit Log →
        </Link>
      </div>
    </div>
  );
}
