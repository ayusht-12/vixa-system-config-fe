import type { AccentColor } from "../../types/command-center";
import type { PkcsMechanism } from "../../types/hsm-security";
import { ACCENT_CLASSES } from "../ui/accentColors";
import { PulseDot } from "../ui/PulseDot";
import { ProgressBar } from "../ui/ProgressBar";

const MECHANISM_STYLES: Record<AccentColor, string> = {
  neon: "bg-[#001A0D] border-neon/25",
  purple: "bg-[#0D0A1A] border-purple-500/25",
  info: "bg-[#0A0F1A] border-info/25",
  warn: "bg-[#1A1200] border-warn/25",
  danger: "bg-[#1A0505] border-danger/25",
};

interface Pkcs11PanelProps {
  module: {
    libraryPath: string;
    manufacturer: string;
    firmware: string;
    serial: string;
    connectionPoolActive: string;
    connectionPoolPercent: number;
    latency: string;
    timeout: string;
    sessions: string;
    rwSessions: string;
    errors24h: string;
  };
  mechanisms: PkcsMechanism[];
}

function InfoTile({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="p-2.5 rounded-small bg-surface">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className={valueClass ?? "text-xs text-gray-300"}>{value}</div>
    </div>
  );
}

export function Pkcs11Panel({ module, mechanisms }: Pkcs11PanelProps) {
  return (
    <div className="lg:col-span-2 rounded-large border bg-card border-purple-500/25">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <div className="flex items-center gap-2">
          <PulseDot color="purple" />
          <h3 className="font-heading font-semibold text-white text-sm">PKCS#11 Integration</h3>
        </div>
        <span className="px-2 py-0.5 rounded-small text-[9px] text-purple-400 border bg-[#0D0A1A] border-purple-500/25">
          Provider telemetry
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <InfoTile label="Library Path" value={module.libraryPath} valueClass="text-xs font-mono text-purple-400" />
          <InfoTile label="Manufacturer" value={module.manufacturer} />
          <InfoTile label="Firmware" value={module.firmware} valueClass="text-xs text-neon" />
          <InfoTile label="Serial Number" value={module.serial} valueClass="text-xs text-gray-300 font-mono" />
        </div>

        <div className="p-3 rounded-small border bg-[#001A0D] border-neon/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-widest">Connection Pool</span>
            <span className="text-xs text-neon">{module.connectionPoolActive}</span>
          </div>
          <ProgressBar percent={module.connectionPoolPercent} color="neon" height="sm" />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Latency: {module.latency}</span>
            <span>Timeout: {module.timeout}</span>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-600 uppercase tracking-widest mb-2">Supported Mechanisms</div>
          <div className="flex flex-wrap gap-1.5">
            {mechanisms.map((mechanism) => (
              <span
                key={mechanism.label}
                className={`px-2 py-0.5 rounded-small border font-mono text-[10px] ${ACCENT_CLASSES[mechanism.tone].text} ${MECHANISM_STYLES[mechanism.tone]}`}
              >
                {mechanism.label}
              </span>
            ))}
            {mechanisms.length === 0 && (
              <span className="text-xs text-gray-600">No supported mechanisms reported.</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-subtle">
          <div className="text-center">
            <div className="text-xs text-gray-600">Sessions</div>
            <div className="text-sm font-medium text-neon">{module.sessions}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600">R/W Sessions</div>
            <div className="text-sm font-medium text-info">{module.rwSessions}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600">Errors (24h)</div>
            <div className="text-sm font-medium text-neon">{module.errors24h}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
