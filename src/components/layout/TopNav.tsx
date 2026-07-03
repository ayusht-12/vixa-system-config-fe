import clsx from "clsx";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { NAV_BADGES, type NavBadge } from "../../data/navStatus";
import { useAuth } from "../../lib/auth";
import { ACCOUNT_PATH, NAV_ITEMS } from "../../routes/routes";
import { PulseDot } from "../ui/PulseDot";

const BADGE_TEXT_CLASSES: Record<NavBadge["color"], string> = {
  neon: "text-neon",
  danger: "text-danger",
  warn: "text-warn",
  info: "text-info",
  purple: "text-purple-400",
};

export function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const badge = NAV_BADGES[location.pathname];
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <nav className="bg-card border-b border-subtle sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-small bg-neon flex items-center justify-center">
              <span className="text-gray-900 text-xs font-bold">⬡</span>
            </div>
            <span className="font-heading font-bold text-white text-sm tracking-wide">
              NEXUS ENGINE
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-small bg-green-900 border border-green-700 text-neon">
              v4.7.2
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  clsx(
                    "px-3 py-1.5 text-xs rounded-small transition-colors",
                    isActive
                      ? "text-neon bg-green-950 border border-neon/25"
                      : "text-gray-400 border border-transparent hover:text-gray-200 hover:bg-gray-800",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {badge ? (
            <div className="flex items-center gap-1.5 text-xs">
              <PulseDot color={badge.color} />
              <span className={clsx("font-medium", BADGE_TEXT_CLASSES[badge.color])}>
                {badge.label}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <PulseDot color="neon" />
              <span className="text-neon">LIVE</span>
            </div>
          )}
          <div className="text-xs text-gray-500 hidden sm:block">
            UTC 2026-07-02 · 14:32:07
          </div>
          <NavLink
            to={ACCOUNT_PATH}
            title="Account & Security"
            className={({ isActive }) =>
              clsx(
                "w-7 h-7 rounded-small bg-elevated flex items-center justify-center border cursor-pointer transition-colors",
                isActive ? "border-neon" : "border-accent hover:border-green-700",
              )
            }
          >
            <span className="text-xs text-gray-400">⚙</span>
          </NavLink>
          <button
            type="button"
            className="w-7 h-7 rounded-small bg-elevated flex items-center justify-center border border-accent cursor-pointer"
          >
            <span className="text-xs text-gray-400">🔔</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            className="flex items-center gap-2 pl-3 border-l border-subtle cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-small bg-green-900 border border-green-700 flex items-center justify-center">
              <span className="text-neon text-xs font-bold">
                {(user?.display_name ?? user?.email ?? "?").charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs text-gray-400 group-hover:text-gray-200 hidden sm:block transition-colors">
              {user?.email ?? ""}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
