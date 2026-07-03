import { useState } from "react";
import { useComplianceAssessmentsViewModel } from "../../api/viewModels/complianceAssessments";
import { ApiError } from "../../lib/apiClient";
import { timeAgo } from "../../lib/format";
import { Badge } from "../ui/Badge";

const SELECT_CLASSES =
  "rounded-small bg-surface border border-accent px-2 py-1 text-xs text-gray-200 outline-none focus:border-neon";

export function ComplianceAssessmentsPanel() {
  const vm = useComplianceAssessmentsViewModel();
  const [selected, setSelected] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const activeFramework = selected || vm.frameworkOptions[0]?.id || "";

  async function handleStart() {
    if (!activeFramework) return;
    setBusy(true);
    setError(null);
    try {
      await vm.start(activeFramework);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to start assessment.");
    } finally {
      setBusy(false);
    }
  }

  async function handleComplete(id: string) {
    setError(null);
    try {
      await vm.complete(id);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to complete assessment.");
    }
  }

  return (
    <div className="rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">Compliance Assessments</h3>
        <div className="flex items-center gap-2">
          <select
            value={activeFramework}
            onChange={(event) => setSelected(event.target.value)}
            className={SELECT_CLASSES}
          >
            {vm.frameworkOptions.length === 0 ? <option value="">No frameworks</option> : null}
            {vm.frameworkOptions.map((framework) => (
              <option key={framework.id} value={framework.id}>
                {framework.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleStart}
            disabled={!activeFramework || busy}
            className="rounded-small bg-neon text-gray-900 font-bold text-xs px-3 py-1 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {busy ? "Starting…" : "+ Start Assessment"}
          </button>
        </div>
      </div>

      <div className="p-4">
        {error ? <p className="text-xs text-danger mb-2">{error}</p> : null}
        {vm.isLoading ? (
          <p className="text-xs text-gray-500">Loading assessments…</p>
        ) : vm.error ? (
          <p className="text-xs text-danger">{vm.error.message}</p>
        ) : vm.assessments.length === 0 ? (
          <p className="text-xs text-gray-600">
            No assessments yet. Start one against a framework above.
          </p>
        ) : (
          <div className="space-y-1.5">
            {vm.assessments.map((assessment) => {
              const completed = assessment.status === "completed";
              return (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between rounded-small bg-surface px-3 py-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-200 uppercase">
                        {assessment.framework_code}
                      </span>
                      <Badge tone={completed ? "neon" : "warn"}>
                        {completed ? "COMPLETED" : "IN PROGRESS"}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-gray-600 mt-0.5">
                      {assessment.started_by} · started {timeAgo(assessment.started_at)}
                      {completed && assessment.total_controls != null
                        ? ` · ${assessment.mapped_controls}/${assessment.total_controls} mapped, ${assessment.gap_controls} gaps`
                        : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {completed && assessment.score != null ? (
                      <span className="font-heading text-sm font-bold text-neon">
                        {assessment.score.toFixed(1)}%
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleComplete(assessment.id)}
                        className="rounded-small border border-accent bg-surface px-2 py-0.5 text-[10px] text-gray-300 hover:border-neon transition-colors"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-3 text-[10px] text-gray-600">
          Completing an assessment snapshots the framework's control coverage and score.
        </p>
      </div>
    </div>
  );
}
