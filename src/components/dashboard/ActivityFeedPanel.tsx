import { Link } from "react-router-dom";
import type { ActivityFeedItem } from "../../types/dashboard";
import { ROUTES } from "../../routes/routes";
import { SectionCard } from "../ui/SectionCard";
import { toBadgeTone } from "./tone";
import { Badge } from "../ui/Badge";

export function ActivityFeedPanel({ items }: { items: ActivityFeedItem[] }) {
  return (
    <SectionCard className="lg:col-span-2 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">Recent Activity</h3>
          <div className="text-xs text-gray-600">Latest entries from the immutable audit log</div>
        </div>
        <Link to={ROUTES.auditLogs.path} className="text-xs text-neon hover:underline">
          View All →
        </Link>
      </div>
      <div className="space-y-2 overflow-y-auto scrollbar-thin max-h-80">
        {items.map((item) => (
          <div key={item.id} className="p-2.5 rounded-small border border-subtle bg-surface">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5">
                <Badge tone={toBadgeTone(item.severityTone)}>{item.severity}</Badge>
                <span className="text-xs text-gray-600 capitalize">{item.eventType}</span>
              </div>
              <span className="text-xs text-gray-600">{item.timestamp}</span>
            </div>
            <div className="text-xs text-gray-300 mb-1">{item.description}</div>
            <div className="text-xs text-gray-600">
              {item.actor}
              {item.tenantSlug && <span> · {item.tenantSlug}</span>}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-xs text-gray-600 text-center py-6">No recent activity</div>
        )}
      </div>
    </SectionCard>
  );
}
