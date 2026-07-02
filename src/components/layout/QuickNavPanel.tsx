import { Link } from "react-router-dom";
import type { RouteDef } from "../../routes/routes";

interface QuickNavPanelProps {
  items: RouteDef[];
  title?: string;
}

export function QuickNavPanel({ items, title = "Quick Navigation" }: QuickNavPanelProps) {
  return (
    <div className="rounded-large border border-subtle bg-card p-3">
      <div className="text-xs text-gray-600 uppercase tracking-widest mb-2">
        {title}
      </div>
      <div className="space-y-1.5">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center gap-2 p-2 rounded-small hover:bg-gray-800 transition-colors group"
          >
            <span className="text-sm">{item.icon}</span>
            <span className="text-xs text-gray-400 group-hover:text-neon transition-colors">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
