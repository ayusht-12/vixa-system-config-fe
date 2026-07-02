import clsx from "clsx";
import type { EtcdClusterSummary, EtcdNode } from "../../types/command-center";
import { Badge } from "../ui/Badge";
import { PulseDot } from "../ui/PulseDot";
import { SectionCard } from "../ui/SectionCard";
import { StatTile } from "../ui/StatTile";

interface EtcdClusterStateProps {
  summary: EtcdClusterSummary;
}

function NodeRow({ node }: { node: EtcdNode }) {
  const isLeader = node.role === "leader";

  return (
    <div className="flex items-center justify-between p-2 rounded-small bg-surface">
      <div className="flex items-center gap-2">
        <PulseDot color="neon" pulse={isLeader} />
        <span className="text-xs text-gray-300">
          {node.id} · {node.address}
        </span>
        <span
          className={clsx(
            "text-[9px] px-1.5 py-0.5 rounded-small",
            isLeader
              ? "bg-green-950 text-neon"
              : "bg-gray-800 text-gray-500",
          )}
        >
          {isLeader ? "LEADER" : "FOLLOWER"}
        </span>
      </div>
      <div className="text-xs text-gray-500">
        term:{node.term} · lag:{node.lagMs}ms
      </div>
    </div>
  );
}

export function EtcdClusterState({ summary }: EtcdClusterStateProps) {
  return (
    <SectionCard className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-heading font-semibold text-white text-sm">
            etcd Cluster State
          </h3>
          <div className="text-xs text-gray-600">
            Raft consensus · 3-node quorum
          </div>
        </div>
        <Badge tone="neon">QUORUM</Badge>
      </div>

      <div className="space-y-2 mb-3">
        {summary.nodes.map((node) => (
          <NodeRow key={node.id} node={node} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <StatTile label="Raft Term" size="lg" tone="text-white">
          {summary.raftTerm}
        </StatTile>
        <StatTile label="Commit Index" size="lg" tone="text-white">
          {summary.commitIndex}
        </StatTile>
        <StatTile label="DB Size" size="lg" tone="text-white">
          {summary.dbSizeGb}
          <span className="text-xs text-gray-500">GB</span>
        </StatTile>
        <StatTile label="Keys" size="lg" tone="text-white">
          {summary.keyCount}
        </StatTile>
      </div>

      <div className="pt-2 border-t border-subtle">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Write throughput</span>
          <span className="text-neon">
            {summary.writeOpsPerSecond.toLocaleString()} ops/s
          </span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-gray-600">Read throughput</span>
          <span className="text-info">
            {summary.readOpsPerSecond.toLocaleString()} ops/s
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
