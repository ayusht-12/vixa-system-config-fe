import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../../routes/routes";

export function QuickLinksFooter() {
  const location = useLocation();
  const items = NAV_ITEMS.filter((item) => item.path !== location.pathname);

  return (
    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="rounded-large border border-subtle bg-card p-3 flex items-center gap-2 hover:border-green-800 transition-colors group"
        >
          <span className="text-lg">{item.icon}</span>
          <div>
            <div className="text-xs font-medium text-gray-300 group-hover:text-neon transition-colors">
              {item.label}
            </div>
            <div className="text-xs text-gray-600">{item.description}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
