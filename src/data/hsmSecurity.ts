import type {
  AlgorithmEntry,
  AttestationCheck,
  AttestationHistoryPoint,
  CeremonyEntry,
  CertRow,
  HsmKpiCard,
  HsmSlot,
  MasterKeyRow,
  PkcsMechanism,
} from "../types/hsm-security";

export const hsmHeader = {
  serial: "TL7-US-E1-0042",
};

export const kpiCards: HsmKpiCard[] = [
  { id: "status", label: "HSM Status", value: "ONLINE", description: "Thales Luna 7", iconContent: "●", iconPulse: true, tone: "purple", glow: "glow-purple", borderHex: "#A78BFA" },
  { id: "active-keys", label: "Active Keys", value: "1,247", description: "3 expiring soon", iconContent: "🔑", tone: "neon", glow: "glow-green", borderHex: "#00FFA3" },
  { id: "key-ops", label: "Key Ops/s", value: "2,847", description: "peak 4,200/s", iconContent: "⚡", tone: "info", borderHex: "#21262D" },
  { id: "certificates", label: "Certificates", value: "84", description: "2 expiring <30d", iconContent: "📜", tone: "purple", borderHex: "#21262D" },
  { id: "next-rotation", label: "Next Rotation", value: "14d", description: "master-key-v5", iconContent: "⏱", tone: "warn", glow: "glow-amber", borderHex: "#FBBF24" },
  { id: "attestation", label: "Attestation", value: "PASS", description: "verified 6h ago", iconContent: "✓", tone: "neon", glow: "glow-green", borderHex: "#00FFA3" },
];

export const pkcs11Module = {
  libraryPath: "/usr/lib/libCryptoki2_64.so",
  manufacturer: "Thales Group",
  firmware: "7.4.2-build.47",
  serial: "TL7-US-E1-0042",
  connectionPoolActive: "8/10 active",
  connectionPoolPercent: 80,
  latency: "0.4ms avg",
  timeout: "5s",
  sessions: "8",
  rwSessions: "3",
  errors24h: "0",
};

export const pkcsMechanisms: PkcsMechanism[] = [
  { label: "CKM_AES_GCM", tone: "neon" },
  { label: "CKM_RSA_PKCS", tone: "neon" },
  { label: "CKM_ECDSA", tone: "purple" },
  { label: "CKM_SHA256_HMAC", tone: "purple" },
  { label: "CKM_ECDH1_DERIVE", tone: "info" },
  { label: "CKM_AES_KEY_WRAP", tone: "info" },
  { label: "CKM_RSA_OAEP", tone: "warn" },
  { label: "CKM_SHA384", tone: "neon" },
];

export const hsmSlots: HsmSlot[] = [
  { id: "slot-0", name: "Slot 0", badgeLabel: "PRIMARY", style: "active", labelValue: "nexus-primary", keysCount: "487 objects", capacityPercent: 39, opsPerSecond: "1,247", extraLabel: "Token Flags", extraValue: "RNG·WRITE·LOGIN" },
  { id: "slot-1", name: "Slot 1", badgeLabel: "SIGNING", style: "active", labelValue: "nexus-signing", keysCount: "124 objects", capacityPercent: 10, opsPerSecond: "892", extraLabel: "Token Flags", extraValue: "RNG·WRITE·LOGIN" },
  { id: "slot-2", name: "Slot 2", badgeLabel: "87% FULL", style: "warn", labelValue: "nexus-tenant-dek", keysCount: "1,087 objects", capacityPercent: 87, opsPerSecond: "708", extraLabel: "Alert", extraValue: "⚠ Near capacity" },
  { id: "slot-3", name: "Slot 3", badgeLabel: "STANDBY", style: "inactive", labelValue: "nexus-dr-backup", keysCount: "0 objects", capacityPercent: 0, opsPerSecond: "0", extraLabel: "Purpose", extraValue: "DR failover ready" },
];

export const slotSummary = "4 slots · 3 active · 1 standby";

export const masterKeys: MasterKeyRow[] = [
  {
    id: "k1", keyId: "nexus-master-v5", keyIdMeta: "slot:0 · id:0x0005", keyIdTone: "neon",
    algorithm: "AES-256", algorithmTone: "neon", created: "2025-01-15", expires: "2025-07-15", expiresTone: "info",
    status: "ACTIVE", rotationPercent: 3, rotationLabel: "180d · auto", rotationNote: "Next: 2025-07-15 · 1,247 DEKs wrapped",
    actionLabel: "Details", actionVariant: "default", borderHex: "#00FFA3",
  },
  {
    id: "k2", keyId: "nexus-signing-v4", keyIdMeta: "slot:1 · id:0x0014", keyIdTone: "warn",
    algorithm: "ECDSA-P384", algorithmTone: "purple", created: "2024-07-15", expires: "2025-01-29", expiresTone: "warn",
    status: "EXPIRING", rotationPercent: 93, rotationLabel: "14d left", rotationNote: "⚠ Rotation overdue · 892 signatures/s",
    actionLabel: "Rotate", actionVariant: "primary", borderHex: "#FBBF24",
  },
  {
    id: "k3", keyId: "tenant-dek-root-v3", keyIdMeta: "slot:2 · id:0x0023", keyIdTone: "neon",
    algorithm: "AES-256-GCM", algorithmTone: "neon", created: "2024-10-01", expires: "2025-04-01", expiresTone: "info",
    status: "ACTIVE", rotationPercent: 55, rotationLabel: "76d · auto", rotationNote: "Wraps 24 tenant DEKs · 708 ops/s",
    actionLabel: "Details", actionVariant: "default", borderHex: "#00FFA3",
  },
  {
    id: "k4", keyId: "nexus-master-v4", keyIdMeta: "slot:0 · id:0x0004", keyIdTone: "neon",
    algorithm: "AES-256", algorithmTone: "neon", created: "2024-07-15", expires: "2025-01-15", expiresTone: "danger",
    status: "RETIRED", rotationPercent: 100, rotationLabel: "Rotated to v5 · 14:19:47 UTC today", rotationNote: "1,247 DEKs re-wrapped · archived",
    actionLabel: "Archive", actionVariant: "default", borderHex: "#FF3B3B",
  },
  {
    id: "k5", keyId: "nexus-signing-v5", keyIdMeta: "slot:1 · pending", keyIdTone: "info",
    algorithm: "ECDSA-P384", algorithmTone: "info", created: "—", expires: "—", expiresTone: "neon",
    status: "PENDING", rotationPercent: 60, rotationLabel: "Awaiting key ceremony · 3 of 5 custodians approved", rotationNote: "Ceremony scheduled: 2025-01-29 09:00 UTC",
    actionLabel: "Approve", actionVariant: "info", borderHex: "#60A4FA",
  },
];

export const masterKeySummary = {
  active: 3,
  expiring: 1,
  retired: 1,
  pending: 1,
  policyNote: "Auto-rotation: enabled · Policy: 180d master / 365d signing",
};

export const keyCeremonies: CeremonyEntry[] = [
  {
    id: "cer-1",
    eventLabel: "KEY_ROTATION_COMPLETE",
    eventTone: "neon",
    timeLabel: "14:19:47 UTC",
    description: "nexus-master-v4 → v5 · AES-256-GCM · 1,247 DEKs re-wrapped",
    quorumLabel: "Custodian Quorum (5-of-5)",
    approvals: [
      { name: "admin@nexus", status: "✓ APPROVED · 14:15:02" },
      { name: "security@nexus", status: "✓ APPROVED · 14:16:44" },
      { name: "cto@nexus", status: "✓ APPROVED · 14:17:11" },
      { name: "compliance@nexus", status: "✓ APPROVED · 14:18:03" },
      { name: "auditor@external", status: "✓ APPROVED · 14:19:22" },
    ],
    ceremonyMeta: "ceremony-id: cer-20250115-001 · signed: ECDSA-P384",
    dotColorHex: "#00FFA3",
    dotContent: "✓",
  },
  {
    id: "cer-2",
    eventLabel: "KEY_CEREMONY_PENDING",
    eventTone: "info",
    timeLabel: "Scheduled: 2025-01-29",
    description: "nexus-signing-v5 · ECDSA-P384 · 3-of-5 quorum achieved",
    quorumLabel: "Custodian Quorum (3-of-5 so far)",
    approvals: [
      { name: "admin@nexus", status: "✓ APPROVED · 14:02:11" },
      { name: "security@nexus", status: "✓ APPROVED · 14:08:33" },
      { name: "cto@nexus", status: "✓ APPROVED · 14:11:47" },
      { name: "compliance@nexus", status: "⏳ PENDING", pending: true },
      { name: "auditor@external", status: "⏳ PENDING", pending: true },
    ],
    ceremonyMeta: "ceremony-id: cer-20250129-001 · awaiting quorum",
    dotColorHex: "#60A4FA",
    dotContent: "3",
    dotPulse: true,
  },
  {
    id: "cer-3",
    eventLabel: "KEY_ROTATION_COMPLETE",
    eventTone: "neon",
    timeLabel: "2024-07-15",
    description: "nexus-master-v3 → v4 · AES-256-GCM · 5-of-5 quorum",
    quorumLabel: "",
    approvals: [],
    ceremonyMeta: "ceremony-id: cer-20240715-001 · archived",
    dotColorHex: "#6B7280",
    dotContent: "✓",
    historical: true,
  },
];

export const ceremonySummary = "3 ceremonies · 2 complete · 1 pending";

export const certificates: CertRow[] = [
  { id: "c1", cn: "nexus-engine.internal", cnTone: "text-gray-300", algoLine: "RSA-4096 · SHA-384", type: "TLS SERVER", typeTone: "neon", issued: "2024-01-15", expires: "2026-01-15", expiresTone: "info", daysLeft: "365d", daysLeftTone: "neon", status: "VALID", statusTone: "neon", borderHex: "#00FFA3" },
  { id: "c2", cn: "nexus-signing.internal", cnTone: "text-warn", algoLine: "ECDSA-P384 · SHA-384", type: "CODE SIGN", typeTone: "purple", issued: "2024-02-01", expires: "2025-02-01", expiresTone: "warn", daysLeft: "17d", daysLeftTone: "warn", status: "EXPIRING", statusTone: "warn", borderHex: "#FBBF24" },
  { id: "c3", cn: "keycloak-oidc.internal", cnTone: "text-warn", algoLine: "RSA-2048 · SHA-256", type: "OIDC/JWT", typeTone: "info", issued: "2024-03-10", expires: "2025-02-08", expiresTone: "warn", daysLeft: "24d", daysLeftTone: "warn", status: "EXPIRING", statusTone: "warn", borderHex: "#FBBF24" },
  { id: "c4", cn: "etcd-cluster.internal", cnTone: "text-gray-300", algoLine: "ECDSA-P256 · SHA-256", type: "MUTUAL TLS", typeTone: "neon", issued: "2024-06-01", expires: "2025-06-01", expiresTone: "info", daysLeft: "137d", daysLeftTone: "neon", status: "VALID", statusTone: "neon", borderHex: "#00FFA3" },
  { id: "c5", cn: "nexus-ca-root", cnTone: "text-gray-300", algoLine: "RSA-4096 · SHA-512", type: "ROOT CA", typeTone: "purple", issued: "2020-01-01", expires: "2030-01-01", expiresTone: "info", daysLeft: "1,812d", daysLeftTone: "neon", status: "VALID", statusTone: "neon", borderHex: "#00FFA3" },
  { id: "c6", cn: "hsm-attestation.internal", cnTone: "text-gray-300", algoLine: "ECDSA-P384 · SHA-384", type: "ATTESTATION", typeTone: "info", issued: "2024-01-01", expires: "2027-01-01", expiresTone: "info", daysLeft: "712d", daysLeftTone: "neon", status: "VALID", statusTone: "neon", borderHex: "#00FFA3" },
];

export const certSummary = {
  totalLabel: "84 TOTAL · 2 EXPIRING",
  showingLabel: "Showing 6 of 84 certificates",
};

export const algorithms: AlgorithmEntry[] = [
  {
    id: "aes-256-gcm", name: "AES-256-GCM", nameHex: "#00FFA3", badgeLabel: "PRIMARY", badgeHex: "#00FFA3",
    active: true, bgHex: "#001A0D", borderHex: "#00FFA340",
    stats: [
      { label: "Key Size", value: "256-bit" },
      { label: "Tag Size", value: "128-bit" },
      { label: "Usage", value: "Data encryption" },
      { label: "Ops/s", value: "1,847", valueTone: "neon" },
    ],
  },
  {
    id: "ecdsa-p384", name: "ECDSA-P384", nameHex: "#A78BFA", badgeLabel: "SIGNING", badgeHex: "#A78BFA",
    active: true, bgHex: "#0D0A1A", borderHex: "#A78BFA40",
    stats: [
      { label: "Curve", value: "P-384 (secp384r1)" },
      { label: "Hash", value: "SHA-384" },
      { label: "Usage", value: "Audit log signing" },
      { label: "Ops/s", value: "892", valueTone: "purple" },
    ],
  },
  {
    id: "rsa-4096", name: "RSA-4096-OAEP", nameHex: "#60A4FA", badgeLabel: "KEY WRAP", badgeHex: "#60A4FA",
    active: true, bgHex: "#0A0F1A", borderHex: "#60A4FA40",
    stats: [
      { label: "Key Size", value: "4096-bit" },
      { label: "Padding", value: "OAEP-SHA256" },
      { label: "Usage", value: "DEK transport" },
      { label: "Ops/s", value: "108", valueTone: "info" },
    ],
  },
  {
    id: "sha-384", name: "SHA-384 / SHA-512", nameHex: "#D1D5DB", badgeLabel: "HASHING", badgeHex: "#9CA3AF",
    active: true, bgHex: "#0A0E14", borderHex: "#21262D",
    stats: [
      { label: "Digest Size", value: "384 / 512-bit" },
      { label: "Standard", value: "FIPS 180-4" },
      { label: "Usage", value: "Chain integrity" },
      { label: "Ops/s", value: "4,721K", valueTone: "neon" },
    ],
  },
  {
    id: "aes-128-cbc", name: "AES-128-CBC", nameHex: "#FF3B3B", badgeLabel: "DEPRECATED", badgeHex: "#FF3B3B",
    active: false, bgHex: "#1A0505", borderHex: "#FF3B3B40",
    stats: [],
    note: "Disabled 2024-01-01 · NIST SP 800-131A Rev.2 · 0 active uses",
    deprecated: true,
  },
];

export const algorithmSummary = "5 algorithms · 4 active · 1 deprecated";

export const attestationHeader = {
  lastRun: "LAST RUN: 6h ago · ALL PASS",
};

export const attestationChecks: AttestationCheck[] = [
  { label: "FIPS Mode", description: "FIPS 140-3 Level 3", hashLabel: "verified: 08:32:07", tone: "neon", glow: "glow-green", bgHex: "#001A0D", borderHex: "#00FFA340" },
  { label: "Tamper Seal", description: "Physical integrity", hashLabel: "seal: intact", tone: "neon", glow: "glow-green", bgHex: "#001A0D", borderHex: "#00FFA340" },
  { label: "Firmware Hash", description: "7.4.2-build.47", hashLabel: "sha256: a3f9c2d7", tone: "neon", glow: "glow-green", bgHex: "#001A0D", borderHex: "#00FFA340" },
  { label: "RNG Quality", description: "NIST SP 800-90B", hashLabel: "entropy: 7.99 bits", tone: "neon", glow: "glow-green", bgHex: "#001A0D", borderHex: "#00FFA340" },
  { label: "Key Zeroize", description: "FIPS zeroization", hashLabel: "test: passed", tone: "neon", glow: "glow-green", bgHex: "#001A0D", borderHex: "#00FFA340" },
  { label: "Self-Test", description: "Power-on KAT", hashLabel: "all 12 passed", tone: "neon", glow: "glow-green", bgHex: "#001A0D", borderHex: "#00FFA340" },
  { label: "Attest Chain", description: "ECDSA-P384 cert", hashLabel: "chain: 3 certs", tone: "purple", glow: "glow-purple", bgHex: "#0D0A1A", borderHex: "#A78BFA40" },
];

export const attestationHistory: AttestationHistoryPoint[] = [
  { label: "08:32 - PASS", heightPercent: 100 },
  { label: "02:32 - PASS", heightPercent: 85 },
  { label: "2025-01-14 20:32 - PASS", heightPercent: 100 },
  { label: "14:32 - PASS", heightPercent: 90 },
  { label: "08:32 - PASS", heightPercent: 100 },
  { label: "02:32 - PASS", heightPercent: 95 },
  { label: "2025-01-13 20:32 - PASS", heightPercent: 100 },
];

export const attestationScheduleNote = "Schedule: every 6h · next: 20:32 UTC";
