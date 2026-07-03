import { useState } from "react";
import type { ConfigParameterDTO } from "../../api/types";
import { ConfigField } from "./primitives/ConfigField";
import { ConfigInput } from "./primitives/ConfigInput";
import { ConfigSelect } from "./primitives/ConfigSelect";

interface ParameterRowProps {
  parameter: ConfigParameterDTO;
  onStage: (value: string) => void;
  onRevert: () => void;
}

function ParameterRow({ parameter, onStage, onRevert }: ParameterRowProps) {
  const [draft, setDraft] = useState(parameter.active_value);

  const isEnumLike = parameter.value_type === "enum" || parameter.value_type === "boolean";
  const options = parameter.allowed_values ?? (parameter.value_type === "boolean" ? ["true", "false"] : []);

  return (
    <ConfigField
      label={parameter.key}
      hint={parameter.value_type}
      trailing={
        parameter.has_pending_change ? (
          <span className="text-[9px] px-1.5 py-0.5 rounded-small text-warn bg-[#1A1200] border border-warn/25">
            PENDING → {parameter.pending_value}
          </span>
        ) : undefined
      }
    >
      <div className="flex items-center gap-1.5">
        {isEnumLike ? (
          <ConfigSelect
            options={options.length ? options : [parameter.active_value]}
            value={draft}
            disabled={parameter.is_sensitive}
            onChange={(e) => setDraft(e.target.value)}
          />
        ) : (
          <ConfigInput
            value={draft}
            disabled={parameter.is_sensitive}
            onChange={(e) => setDraft(e.target.value)}
          />
        )}
        <button
          type="button"
          onClick={() => onStage(draft)}
          disabled={draft === parameter.active_value || parameter.is_sensitive}
          className="px-2 py-1.5 rounded-small text-xs text-gray-400 border border-accent bg-surface hover:border-gray-500 transition-colors disabled:opacity-30 disabled:pointer-events-none flex-shrink-0"
        >
          Stage
        </button>
        {parameter.has_pending_change && (
          <button
            type="button"
            onClick={onRevert}
            className="px-2 py-1.5 rounded-small text-xs text-warn border border-warn/25 bg-[#1A1200] hover:border-warn/50 transition-colors flex-shrink-0"
          >
            Revert
          </button>
        )}
      </div>
      {parameter.description && (
        <div className="text-[10px] text-gray-700 mt-1">{parameter.description}</div>
      )}
    </ConfigField>
  );
}

interface SectionCardProps {
  section: string;
  parameters: ConfigParameterDTO[];
  onStage: (parameterId: string, value: string) => void;
  onRevert: (parameterId: string) => void;
}

function SectionCard({ section, parameters, onStage, onRevert }: SectionCardProps) {
  return (
    <div className="rounded-large border border-subtle bg-card p-4">
      <h3 className="font-heading font-semibold text-white text-sm mb-3">{section}</h3>
      <div className="flex flex-col gap-3">
        {parameters.map((parameter) => (
          <ParameterRow
            key={parameter.id}
            parameter={parameter}
            onStage={(value) => onStage(parameter.id, value)}
            onRevert={() => onRevert(parameter.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface DynamicConfigSectionProps {
  sections: Record<string, ConfigParameterDTO[]>;
  onStage: (parameterId: string, value: string) => void;
  onRevert: (parameterId: string) => void;
}

export function DynamicConfigSection({ sections, onStage, onRevert }: DynamicConfigSectionProps) {
  const entries = Object.entries(sections);
  if (entries.length === 0) {
    return <div className="text-xs text-gray-600 mb-4">No parameters in this tier.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
      {entries.map(([section, parameters]) => (
        <SectionCard
          key={section}
          section={section}
          parameters={parameters}
          onStage={onStage}
          onRevert={onRevert}
        />
      ))}
    </div>
  );
}
