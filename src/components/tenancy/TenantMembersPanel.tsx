import { useEffect, useState, type FormEvent } from "react";
import { useTenantMembersViewModel } from "../../api/viewModels/tenantMembers";
import { ApiError } from "../../lib/apiClient";
import { timeAgo } from "../../lib/format";
import { Badge } from "../ui/Badge";
import { StatTile } from "../ui/StatTile";

export interface TenantOption {
  id: string;
  label: string;
}

interface TenantMembersPanelProps {
  tenants: TenantOption[];
}

const ROLE_OPTIONS = ["viewer", "analyst", "admin", "owner"] as const;

const ROLE_TONE: Record<string, "neon" | "blue" | "purple" | "warn" | "neutral"> = {
  owner: "purple",
  admin: "warn",
  analyst: "blue",
  viewer: "neutral",
};

const INPUT_CLASSES =
  "w-full rounded-small bg-surface border border-accent px-3 py-2 text-sm text-gray-200 outline-none focus:border-neon";

export function TenantMembersPanel({ tenants }: TenantMembersPanelProps) {
  const [selected, setSelected] = useState<string | null>(tenants[0]?.id ?? null);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<string>("viewer");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Tenants load asynchronously; adopt the first one once it arrives.
  useEffect(() => {
    if (selected === null && tenants.length > 0) {
      setSelected(tenants[0].id);
    }
  }, [tenants, selected]);

  const vm = useTenantMembersViewModel(selected);

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    if (!selected || !userId.trim()) return;
    setFormError(null);
    setSubmitting(true);
    try {
      await vm.addMember({ user_id: userId.trim(), role });
      setUserId("");
      setRole("viewer");
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to add member.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(memberUserId: string) {
    setFormError(null);
    try {
      await vm.removeMember(memberUserId);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Failed to remove member.");
    }
  }

  return (
    <div className="lg:col-span-5 rounded-large border border-subtle bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle">
        <h3 className="font-heading font-semibold text-white text-sm">Tenant Members &amp; Usage</h3>
        <select
          value={selected ?? ""}
          onChange={(event) => setSelected(event.target.value || null)}
          className="rounded-small bg-surface border border-accent px-2 py-1 text-xs text-gray-200 outline-none focus:border-neon"
        >
          {tenants.length === 0 ? <option value="">No tenants</option> : null}
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.label}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4">
        {vm.usage ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
            <StatTile label="Members" size="lg" tone="text-neon">
              {vm.usage.member_count}
            </StatTile>
            <StatTile label="Events / sec" size="lg">
              {vm.usage.events_per_second}
            </StatTile>
            <StatTile label="Provisioning (active / total)">
              {vm.usage.active_provisioning_jobs} / {vm.usage.provisioning_jobs_total}
            </StatTile>
            <StatTile label="Snapshots (current / total)">
              {vm.usage.current_backup_snapshots} / {vm.usage.backup_snapshots_total}
            </StatTile>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Members</div>
            {vm.isLoading ? (
              <p className="text-xs text-gray-500">Loading members…</p>
            ) : vm.error ? (
              <p className="text-xs text-danger">{vm.error.message}</p>
            ) : vm.members.length === 0 ? (
              <p className="text-xs text-gray-600">No members assigned to this tenant yet.</p>
            ) : (
              <div className="space-y-1.5">
                {vm.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between rounded-small bg-surface px-3 py-2"
                  >
                    <div>
                      <div className="text-xs text-gray-200">{member.display_name}</div>
                      <div className="text-[10px] text-gray-600">
                        {member.email} · added {timeAgo(member.created_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={ROLE_TONE[member.role] ?? "neutral"}>
                        {member.role.toUpperCase()}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => handleRemove(member.user_id)}
                        className="rounded-small border border-danger/25 bg-[#1A0505] px-2 py-0.5 text-[10px] text-danger hover:border-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Add Member</div>
            <form onSubmit={handleAdd} className="space-y-2.5">
              <div>
                <label className="text-xs text-gray-600 block mb-1">User ID (UUID)</label>
                <input
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  placeholder="00000000-0000-0000-0000-000000000000"
                  className={INPUT_CLASSES}
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 block mb-1">Role</label>
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className={INPUT_CLASSES}
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {formError ? <p className="text-xs text-danger">{formError}</p> : null}
              <button
                type="submit"
                disabled={!selected || !userId.trim() || submitting}
                className="w-full rounded-small bg-neon text-gray-900 font-bold text-xs py-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Adding…" : "+ Add Member"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
