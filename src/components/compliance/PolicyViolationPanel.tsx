import type { ResolvedViolation, ViolationEntry } from "../../types/compliance";
import { ActionButton } from "../ui/ActionButton";
import { Badge } from "../ui/Badge";

interface PolicyViolationPanelProps {
  violations: ViolationEntry[];
  resolved: ResolvedViolation;
}

function ViolationCard({ violation }: { violation: ViolationEntry }) {
  return (
    <div
      className="p-3 rounded-small border"
      style={{
        backgroundColor: violation.cardBgHex,
        borderColor: `${violation.borderHex}40`,
        borderLeft: `3px solid ${violation.borderHex}`,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge tone={violation.tagTone === "danger" ? "danger" : "warn"}>
            {violation.tag}
          </Badge>
          <span
            className="px-1.5 py-0.5 rounded-small text-[9px]"
            style={{ backgroundColor: violation.cardBgHex, color: violation.frameworkColorHex }}
          >
            {violation.frameworkLabel}
          </span>
        </div>
        <span className="text-xs text-gray-600 flex-shrink-0">{violation.timestamp}</span>
      </div>
      <div className="text-xs text-gray-200 font-medium mb-1">{violation.title}</div>
      <div className="text-xs text-gray-500 mb-2">{violation.description}</div>
      <div className="grid grid-cols-2 gap-1.5 mb-2">
        {violation.meta.map((field) => (
          <div key={field.label} className="p-1.5 rounded-small bg-card">
            <div className="text-xs text-gray-600">{field.label}</div>
            <div className="text-xs text-warn">{field.value}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {violation.actions.map((action) => (
          <ActionButton key={action.label} action={action} size="sm" />
        ))}
      </div>
    </div>
  );
}

function ResolvedCard({ resolved }: { resolved: ResolvedViolation }) {
  return (
    <div className="p-3 rounded-small border bg-surface border-subtle opacity-50">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded-small text-[9px] text-neon bg-[#001A0D] border border-[#00FFA330]">
            RESOLVED
          </span>
          <span className="text-xs text-gray-500">{resolved.tenantLabel}</span>
        </div>
        <span className="text-xs text-neon">{resolved.resolvedAt}</span>
      </div>
      <div className="text-xs text-gray-600">{resolved.description}</div>
    </div>
  );
}

export function PolicyViolationPanel({ violations, resolved }: PolicyViolationPanelProps) {
  return (
    <div className="lg:col-span-2 rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">
            Policy Violation Alerts
          </h3>
          <div className="text-xs text-gray-600">
            Active violations requiring remediation
          </div>
        </div>
        <Badge tone="warn">{violations.length} ACTIVE</Badge>
      </div>
      <div className="p-4 space-y-3">
        {violations.map((violation) => (
          <ViolationCard key={violation.id} violation={violation} />
        ))}
        <ResolvedCard resolved={resolved} />
      </div>
    </div>
  );
}
