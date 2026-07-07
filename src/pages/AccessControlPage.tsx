import { useMemo } from "react";
import { useAccessControlViewModel } from "../api/viewModels/accessControl";
import type { PermissionDTO } from "../api/types";
import { QuickLinksFooter } from "../components/layout/QuickLinksFooter";
import { Badge } from "../components/ui/Badge";
import { SectionCard } from "../components/ui/SectionCard";
import { StatTile } from "../components/ui/StatTile";
import { ErrorState, LoadingState } from "../components/ui/AsyncState";

export function AccessControlPage() {
  const vm = useAccessControlViewModel();

  const permissionsByResource = useMemo(() => {
    const grouped: Record<string, PermissionDTO[]> = {};
    for (const permission of vm.permissions) {
      (grouped[permission.resource] ??= []).push(permission);
    }
    return grouped;
  }, [vm.permissions]);

  if (vm.isLoading) return <LoadingState label="Loading access control…" />;
  if (vm.error) return <ErrorState message={vm.error.message} onRetry={vm.refetch} />;

  const activeUsers = vm.users.filter((u) => u.is_active).length;
  const activeRoles = vm.roles.filter((r) => r.is_active).length;

  return (
    <div className="px-4 pt-4 pb-4">
      <div className="mb-3 rounded-large border border-subtle bg-card px-4 py-3">
        <h1 className="font-heading font-bold text-white text-sm">Access Control · RBAC</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Users, roles and permissions · admin-managed identity surface
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatTile label="Users" size="lg" tone="text-white">
          {vm.users.length}
        </StatTile>
        <StatTile label="Active users" size="lg" tone="text-neon">
          {activeUsers}
        </StatTile>
        <StatTile label="Roles" size="lg" tone="text-white">
          {activeRoles}/{vm.roles.length}
        </StatTile>
        <StatTile label="Permissions" size="lg" tone="text-white">
          {vm.permissions.length}
        </StatTile>
      </div>

      <SectionCard className="mb-4">
        <div className="px-4 py-2.5 border-b border-subtle">
          <h2 className="text-xs font-heading font-bold text-gray-300 uppercase tracking-wider">
            Users
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-600 border-b border-subtle">
                <th className="text-left font-medium px-4 py-2">User</th>
                <th className="text-left font-medium px-4 py-2">Status</th>
                <th className="text-left font-medium px-4 py-2">Roles</th>
                <th className="text-right font-medium px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {vm.users.map((user) => (
                <tr key={user.id} className="border-b border-subtle/60 last:border-0">
                  <td className="px-4 py-2.5">
                    <div className="text-gray-200 font-medium">{user.display_name}</div>
                    <div className="text-gray-600">{user.email}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <Badge tone={user.is_active ? "neon" : "neutral"}>
                        {user.is_active ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                      {user.is_admin && <Badge tone="purple">ADMIN</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.length === 0 ? (
                        <span className="text-gray-600">—</span>
                      ) : (
                        user.roles.map((role) => (
                          <Badge key={role.id} tone="blue">
                            {role.name}
                          </Badge>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        user.is_active ? vm.deactivateUser(user.id) : vm.activateUser(user.id)
                      }
                      className="rounded-small border border-accent px-2.5 py-1 text-gray-300 hover:border-gray-500 transition-colors"
                    >
                      {user.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard className="mb-4">
        <div className="px-4 py-2.5 border-b border-subtle">
          <h2 className="text-xs font-heading font-bold text-gray-300 uppercase tracking-wider">
            Roles
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">
          {vm.roles.map((role) => (
            <div key={role.id} className="rounded-small bg-surface p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-200 font-medium text-xs">{role.name}</span>
                <Badge tone={role.is_active ? "neon" : "neutral"}>
                  {role.is_active ? "ACTIVE" : "DISABLED"}
                </Badge>
              </div>
              {role.description && (
                <p className="text-xs text-gray-600 mb-2">{role.description}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                <span>{role.permission_count} permissions</span>
                <span>·</span>
                <span>{role.user_count} users</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 12).map((permission) => (
                  <span
                    key={permission.id}
                    className="px-1.5 py-0.5 rounded-small bg-elevated text-gray-500 text-[10px]"
                  >
                    {permission.name}
                  </span>
                ))}
                {role.permissions.length > 12 && (
                  <span className="text-[10px] text-gray-600">
                    +{role.permissions.length - 12} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <div className="px-4 py-2.5 border-b border-subtle">
          <h2 className="text-xs font-heading font-bold text-gray-300 uppercase tracking-wider">
            Permission Catalogue
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3">
          {Object.entries(permissionsByResource).map(([resource, permissions]) => (
            <div key={resource} className="rounded-small bg-surface p-3">
              <div className="text-xs text-gray-300 font-medium mb-1.5">{resource}</div>
              <div className="flex flex-wrap gap-1">
                {permissions.map((permission) => (
                  <Badge key={permission.id} tone="neutral">
                    {permission.action}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <QuickLinksFooter />
    </div>
  );
}
