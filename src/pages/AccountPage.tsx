import { useAccountViewModel } from "../api/viewModels/account";
import { ActiveSessionsPanel } from "../components/account/ActiveSessionsPanel";
import { ChangePasswordPanel } from "../components/account/ChangePasswordPanel";
import { QuickLinksFooter } from "../components/layout/QuickLinksFooter";
import { useAuth } from "../lib/auth";

export function AccountPage() {
  const { user } = useAuth();
  const account = useAccountViewModel();

  return (
    <div className="px-4 pt-4 pb-4">
      <div className="mb-3 rounded-large border border-subtle bg-card px-4 py-3">
        <h1 className="font-heading font-bold text-white text-sm">Account &amp; Security</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          {user?.display_name} · {user?.email}
          {user?.is_admin ? " · Administrator" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ChangePasswordPanel onSubmit={account.changePassword} />
        <ActiveSessionsPanel
          sessions={account.sessions}
          isLoading={account.isLoading}
          error={account.error}
          onRefresh={account.refetchSessions}
        />
      </div>

      <QuickLinksFooter />
    </div>
  );
}
