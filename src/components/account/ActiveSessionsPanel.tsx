import type { SessionDTO } from "../../api/types";
import { timeAgo } from "../../lib/format";
import { PulseDot } from "../ui/PulseDot";
import { SectionCard } from "../ui/SectionCard";

interface ActiveSessionsPanelProps {
  sessions: SessionDTO[];
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
}

function formatExpiry(iso: string): string {
  return new Date(iso).toLocaleString();
}

export function ActiveSessionsPanel({
  sessions,
  isLoading,
  error,
  onRefresh,
}: ActiveSessionsPanelProps) {
  return (
    <SectionCard>
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">Active Sessions</h3>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-small border border-accent px-2 py-0.5 text-xs text-gray-400 hover:border-gray-500 transition-colors"
        >
          Refresh
        </button>
      </div>
      <div className="p-4">
        {isLoading ? (
          <p className="text-xs text-gray-500">Loading sessions…</p>
        ) : error ? (
          <p className="text-xs text-danger">{error.message}</p>
        ) : sessions.length === 0 ? (
          <p className="text-xs text-gray-600">No active sessions.</p>
        ) : (
          <div className="space-y-1.5">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-small bg-surface px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <PulseDot color="neon" />
                  <div>
                    <div className="text-xs text-gray-300 font-mono">
                      {session.id.slice(0, 8)}…
                    </div>
                    <div className="text-[10px] text-gray-600">
                      started {timeAgo(session.created_at)}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-gray-500 text-right">
                  expires
                  <br />
                  {formatExpiry(session.expires_at)}
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 text-[10px] text-gray-600">
          Sessions are your active refresh tokens. Token values are never exposed.
        </p>
      </div>
    </SectionCard>
  );
}
