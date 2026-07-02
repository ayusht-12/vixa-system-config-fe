import clsx from "clsx";
import type { SchemaEntry, SchemaFailure } from "../../types/compliance";

interface SchemaValidationPanelProps {
  summary: {
    totalToday: number;
    passRate: string;
    failures: number;
    passedLabel: string;
    failedLabel: string;
  };
  failures: SchemaFailure[];
  schemas: SchemaEntry[];
}

function StatTile({ value, label, tone }: { value: string; label: string; tone: string }) {
  return (
    <div className="p-2.5 rounded-small text-center bg-surface">
      <div className={clsx("font-heading text-lg font-bold", tone)}>{value}</div>
      <div className="text-xs text-gray-600 mt-0.5">{label}</div>
    </div>
  );
}

function FailureCard({ failure }: { failure: SchemaFailure }) {
  return (
    <div className="p-3 rounded-small border bg-[#1A0505] border-[#FF3B3B30]">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-danger text-xs font-bold">✗ FAIL</span>
          <span className="text-xs text-gray-500">{failure.endpoint}</span>
        </div>
        <span className="text-xs text-gray-600">{failure.timestamp}</span>
      </div>
      <div className="text-xs text-gray-300 mb-1.5 font-medium">{failure.title}</div>
      <div className="p-2 rounded-small text-xs font-mono bg-card text-danger">
        {failure.codeLines.map((line, index) => (
          <div key={index} style={{ color: line.colorHex }}>
            {line.text}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {failure.meta.map((field, index) => (
          <span key={field.label} className="flex items-center gap-2">
            {index > 0 && <span className="text-gray-700">·</span>}
            <span className="text-xs text-gray-600">
              {field.label}: <span className="text-gray-400">{field.value}</span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function SchemaValidationPanel({
  summary,
  failures,
  schemas,
}: SchemaValidationPanelProps) {
  return (
    <div className="lg:col-span-2 rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">
            Schema Validation
          </h3>
          <div className="text-xs text-gray-600">
            JSON Schema 2020-12 · real-time validation
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-small text-[9px] text-neon border bg-[#001A0D] border-[#00FFA340]">
            {summary.passedLabel}
          </span>
          <span className="px-2 py-0.5 rounded-small text-[9px] text-danger border bg-[#1A0505] border-[#FF3B3B40]">
            {summary.failedLabel}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <StatTile value={summary.totalToday.toLocaleString()} label="Total Today" tone="text-neon" />
          <StatTile value={summary.passRate} label="Pass Rate" tone="text-neon" />
          <StatTile value={String(summary.failures)} label="Failures" tone="text-danger" />
        </div>

        <div className="text-xs text-gray-600 uppercase tracking-widest mb-2">
          Validation Failures
        </div>
        <div className="space-y-2.5">
          {failures.map((failure) => (
            <FailureCard key={failure.id} failure={failure} />
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-subtle">
          <div className="text-xs text-gray-600 uppercase tracking-widest mb-2">
            Active Schemas
          </div>
          <div className="space-y-1.5">
            {schemas.map((schema) => (
              <div key={schema.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      "w-1.5 h-1.5 rounded-full",
                      schema.active ? "bg-neon" : "bg-warn",
                    )}
                  />
                  <span className="text-gray-400">{schema.name}</span>
                </div>
                <span className={schema.active ? "text-neon" : "text-warn"}>
                  {schema.active ? "✓ Active" : "⚠ Deprecated"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
