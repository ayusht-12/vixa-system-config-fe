import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { EntryDetail } from "../../types/audit-log";
import { ROUTES } from "../../routes/routes";

interface EntryDetailPanelProps {
  detail: EntryDetail;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-xs text-gray-600 uppercase tracking-widest mb-1">{label}</div>
      {children}
    </div>
  );
}

export function EntryDetailPanel({ detail }: EntryDetailPanelProps) {
  return (
    <div className="rounded-large border bg-card border-neon/25">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-semibold text-white text-sm">Entry Detail</h3>
          <span className="px-2 py-0.5 rounded-small text-[9px] text-danger border bg-[#1A0505] border-danger/25">
            seq:{detail.seq} · {detail.severity}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neon">✓ Signature Valid</span>
          <Link to={ROUTES.hsmSecurity.path} className="text-xs text-neon hover:underline">
            HSM →
          </Link>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Sequence">
            <div className="text-xs text-neon font-mono">{detail.seq}</div>
          </Field>
          <Field label="Timestamp">
            <div className="text-xs text-gray-300 font-mono">{detail.timestamp}</div>
          </Field>
          <Field label="Event Type">
            <div className="text-xs text-gray-300">{detail.eventType}</div>
          </Field>
          <Field label="Tenant">
            <div className="text-xs text-purple-400">{detail.tenant}</div>
          </Field>
          <Field label="Actor">
            <div className="text-xs text-gray-300">{detail.actor}</div>
          </Field>
          <Field label="Source IP">
            <div className="text-xs text-gray-300 font-mono">{detail.sourceIp}</div>
          </Field>
        </div>

        <Field label="Description">
          <div className="text-xs text-gray-300 p-2 rounded-small bg-surface">{detail.description}</div>
        </Field>

        <div className="grid grid-cols-1 gap-2">
          <Field label="Entry Hash (SHA-256)">
            <div className="hash-text p-2 rounded-small bg-[#0A0E14] border border-subtle break-all">
              {detail.entryHash}
            </div>
          </Field>
          <Field label="Previous Hash">
            <div className="hash-text p-2 rounded-small bg-[#0A0E14] border border-subtle break-all">
              {detail.previousHash}
            </div>
          </Field>
          <Field label="ECDSA-P384 Signature">
            <div className="hash-text p-2 rounded-small bg-[#0A0E14] border border-subtle break-all">
              {detail.signature}
            </div>
          </Field>
        </div>

        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <span className="px-2 py-1 rounded-small text-xs text-neon border bg-[#001A0D] border-neon/25">
            ✓ Hash Chain Valid
          </span>
          <span className="px-2 py-1 rounded-small text-xs text-neon border bg-[#001A0D] border-neon/25">
            ✓ Signature Valid
          </span>
          <span className="px-2 py-1 rounded-small text-xs text-info border bg-[#0A0F1A] border-info/25">
            ✓ WORM Synced
          </span>
        </div>
      </div>
    </div>
  );
}
