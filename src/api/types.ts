// Wire-format DTOs mirroring vsc-be's Pydantic response schemas exactly
// (snake_case, same field names) so a diff against app/schemas/*.py always
// shows what's in sync. View-model mapping into the existing display types
// (src/types/*.ts) happens in the per-domain api/*.ts modules, not here.

// --- auth ---

export interface CurrentUserDTO {
  id: string;
  email: string;
  display_name: string;
  is_admin: boolean;
}

// --- engine / command center ---

export interface EngineIdentityDTO {
  instance_uuid: string;
  name: string;
  region: string;
  availability_zone: string;
  cluster_role: string;
  uptime_seconds: number;
  build_hash: string;
  build_branch: string;
  version: string;
  is_operational: boolean;
}

export interface SystemHealthMetricDTO {
  metric_key: string;
  label: string;
  value: number;
  unit: string;
  limit_value: number | null;
  percent_of_limit: number | null;
  footnote: string;
  recorded_at: string;
}

export interface EtcdNodeStatusDTO {
  node_name: string;
  address: string;
  is_leader: boolean;
  raft_term: number;
  lag_ms: number;
}

export interface EtcdClusterStatusDTO {
  nodes: EtcdNodeStatusDTO[];
  has_quorum: boolean;
  raft_term: number;
  db_size_bytes: number;
  write_ops_per_second: number;
  read_ops_per_second: number;
}

export interface ApiEndpointBreakdownDTO {
  endpoint_path: string;
  requests_per_second: number;
  percent_of_total: number;
}

export interface ApiRateSummaryDTO {
  current_rate: number;
  peak_rate: number;
  rate_limit: number;
  throttled: number;
  rejected: number;
  latency_p99_ms: number;
  endpoints: ApiEndpointBreakdownDTO[];
}

export interface OidcAuthStatusDTO {
  provider: string | null;
  active_tokens: number;
  auth_rate: number;
  failure_count: number;
  failure_rate_percent: number;
  jwks_refreshed_minutes_ago: number | null;
  cert_valid_days: number | null;
}

export interface CommandCenterOverviewDTO {
  engine: EngineIdentityDTO;
  system_health: SystemHealthMetricDTO[];
  etcd_cluster: EtcdClusterStatusDTO;
  api_rate: ApiRateSummaryDTO;
  oidc: OidcAuthStatusDTO;
}

// --- anomaly detection ---

export interface AnomalyEventDTO {
  id: string;
  category: string;
  score: number;
  severity: string;
  status: string;
  title: string;
  description: string;
  actor: string | null;
  source_ip: string | null;
  baseline_sigma: number | null;
  metadata_json: Record<string, unknown>;
  occurred_at: string;
}

export interface SeveritySummaryBucketDTO {
  severity: string;
  count: number;
  trend_delta: number;
  trend_window_label: string;
}

export interface BehavioralBaselineDTO {
  metric_key: string;
  label: string;
  baseline_value: number;
  current_value: number;
  unit: string;
  upper_bound: number;
  percent_of_upper_bound: number;
  deviation_multiple: number;
}

export interface HeatmapCellDTO {
  hour: number;
  severity: string;
  count: number;
  intensity_percent: number;
}

export interface ThreatCategoryStatDTO {
  category: string;
  count: number;
  percent: number;
}

export interface IncidentDTO {
  id: string;
  code: string;
  severity: string;
  status: string;
  summary: string;
  sla_minutes: number;
  sla_remaining_minutes: number | null;
  is_overdue: boolean;
  created_at: string;
  resolved_at: string | null;
}

export interface AnomalyDetectionOverviewDTO {
  stream_events_per_second: number;
  ml_model_name: string;
  severity_summary: SeveritySummaryBucketDTO[];
  recent_events: AnomalyEventDTO[];
  baselines: BehavioralBaselineDTO[];
  heatmap: HeatmapCellDTO[];
  threat_categories: ThreatCategoryStatDTO[];
  incidents: IncidentDTO[];
}

// --- compliance ---

export interface ControlMappingDTO {
  control_domain: string;
  control_description: string;
  control_code: string;
  status: string;
}

export interface FrameworkDTO {
  id: string;
  code: string;
  display_name: string;
  subtitle: string;
  description: string;
  auditor: string | null;
  certified: boolean;
  cert_expires_at: string | null;
  score: number;
  open_violation_count: number;
  control_breakdown: ControlMappingDTO[];
}

export interface ControlCoverageRowDTO {
  control_domain: string;
  control_description: string;
  per_framework: Record<string, ControlMappingDTO | null>;
  coverage_percent: number;
}

export interface ViolationDTO {
  id: string;
  framework_code: string;
  severity: string;
  status: string;
  control_reference: string;
  title: string;
  description: string;
  detected_at: string;
  resolved_at: string | null;
  resolution_note: string | null;
}

export interface SchemaValidationRowDTO {
  endpoint_path: string;
  schema_ref: string;
  passed: boolean;
  error_message: string | null;
  tenant_slug: string | null;
  reference_id: string | null;
  validated_at: string;
}

export interface SchemaValidationSummaryDTO {
  total_today: number;
  pass_rate_percent: number;
  failure_count: number;
  failures: SchemaValidationRowDTO[];
}

export interface ComplianceOverviewDTO {
  overall_score: number;
  frameworks: FrameworkDTO[];
  control_coverage: ControlCoverageRowDTO[];
  violations: ViolationDTO[];
  schema_validation: SchemaValidationSummaryDTO;
}

// --- config manager ---

export interface ConfigParameterDTO {
  id: string;
  key: string;
  section: string;
  tier: string;
  value_type: string;
  active_value: string;
  pending_value: string | null;
  has_pending_change: boolean;
  allowed_values: string[] | null;
  is_sensitive: boolean;
  requires_restart: boolean;
  description: string | null;
}

export interface ConfigChangeDTO {
  id: string;
  parameter_key: string;
  previous_value: string;
  new_value: string;
  reason: string | null;
  changed_by: string;
  status: string;
  created_at: string;
  applied_at: string | null;
}

export interface ConfigTierSummaryDTO {
  tier: string;
  total: number;
  pending: number;
}

export interface ConfigManagerOverviewDTO {
  sections: Record<string, ConfigParameterDTO[]>;
  tier_summary: ConfigTierSummaryDTO[];
  pending_changes: ConfigChangeDTO[];
}

// --- audit log ---

export interface AuditLogEntryDTO {
  id: string;
  sequence: number;
  occurred_at: string;
  severity: string;
  event_type: string;
  event_subtype: string;
  tenant_slug: string | null;
  actor: string;
  source_ip: string | null;
  description: string;
  metadata_json: Record<string, unknown>;
  prev_hash: string | null;
  entry_hash: string;
  signing_key_id: string;
  signature: string;
  integrity: string;
}

export interface AuditLogEntriesPageDTO {
  items: AuditLogEntryDTO[];
  total: number;
  page: number;
  page_size: number;
}

export interface ChainVerificationResultDTO {
  verified_count: number;
  failed_count: number;
  is_valid: boolean;
  first_break_sequence: number | null;
  duration_ms: number;
  root_hash: string | null;
}

export interface HashChainSummaryDTO {
  total_entries: number;
  root_hash: string | null;
  signing_key_id: string | null;
  last_verified_at: string | null;
  last_verification: ChainVerificationResultDTO | null;
}

// --- hsm security ---

export interface HsmSlotDTO {
  id: string;
  slot_number: number;
  label: string;
  purpose: string;
  is_active: boolean;
  object_count: number;
  capacity_max_objects: number;
  capacity_percent: number;
  ops_per_second: number;
  token_flags: string;
}

export interface MasterKeyDTO {
  id: string;
  key_label: string;
  slot_label: string | null;
  algorithm: string;
  status: string;
  effective_status: string;
  rotation_policy_days: number;
  rotation_percent: number;
  activated_at: string | null;
  expires_at: string | null;
  days_until_rotation: number | null;
  wraps_dek_count: number;
  throughput_ops: number;
}

export interface MasterKeyCreateDTO {
  key_label: string;
  algorithm: string;
  slot_id?: string | null;
  rotation_policy_days?: number;
}

export interface MasterKeyRotateRequestDTO {
  new_label?: string | null;
}

export interface CustodianApprovalDTO {
  custodian_email: string;
  approved_at: string | null;
}

export interface KeyCeremonyDTO {
  id: string;
  ceremony_ref: string;
  master_key_label: string;
  predecessor_label: string | null;
  required_approvals: number;
  approval_count: number;
  quorum_met: boolean;
  status: string;
  scheduled_at: string | null;
  completed_at: string | null;
  approvals: CustodianApprovalDTO[];
}

export interface KeyCeremonyCreateDTO {
  master_key_id: string;
  predecessor_key_id?: string | null;
  required_approvals?: number;
  scheduled_at?: string | null;
}

export interface CertificateDTO {
  id: string;
  common_name: string;
  cert_type: string;
  key_algorithm: string;
  signature_algorithm: string;
  issued_at: string;
  expires_at: string;
  days_left: number;
  status: string;
  auto_renew: boolean;
}

export interface CryptoAlgorithmDTO {
  id: string;
  name: string;
  purpose_label: string;
  is_active: boolean;
  is_deprecated: boolean;
  deprecated_at: string | null;
  ops_per_second: number;
  detail_json: Record<string, unknown>;
}

export interface AttestationCheckResultDTO {
  key: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface AttestationRunDTO {
  id: string;
  ran_at: string;
  all_passed: boolean;
  pass_count: number;
  total_checks: number;
  checks: AttestationCheckResultDTO[];
}

export interface AttestationHistoryPointDTO {
  ran_at: string;
  all_passed: boolean;
}

export interface HsmOverviewDTO {
  module_serial: string;
  slots: HsmSlotDTO[];
  master_keys: MasterKeyDTO[];
  ceremonies: KeyCeremonyDTO[];
  certificates: CertificateDTO[];
  algorithms: CryptoAlgorithmDTO[];
  latest_attestation: AttestationRunDTO | null;
  attestation_history: AttestationHistoryPointDTO[];
}

export interface SecurityProviderDTO {
  id: string;
  name: string;
  provider_type: string;
  model: string;
  manufacturer: string;
  library_path: string | null;
  firmware_version: string | null;
  serial_number: string | null;
  fips_level: string;
  is_active: boolean;
  status: string;
  pool_active: number;
  pool_max: number;
  pool_utilization_percent: number;
  connection_timeout_seconds: number;
  avg_latency_ms: number;
  session_count: number;
  rw_session_count: number;
  error_count_24h: number;
  supported_mechanisms: string[];
  last_health_check_at: string | null;
}

// --- tenancy ---

export interface TenantDTO {
  id: string;
  slug: string;
  org_id: string;
  display_name: string;
  tier: string;
  isolation_mode: string;
  status: string;
  region: string;
  db_schema_name: string;
  db_schema_valid: boolean;
  network_cidr: string | null;
  network_vpc: string | null;
  network_shared: boolean;
  dek_label: string | null;
  encryption_valid: boolean;
  events_per_second: number;
  isolation_score: number;
  isolation_level: string;
}

export interface BreachAlertDTO {
  id: string;
  severity: string;
  title: string;
  description: string;
  source_tenant_slug: string | null;
  target_tenant_slug: string | null;
  resource: string | null;
  principal: string | null;
  action_taken: string | null;
  detected_at: string;
  dismissed: boolean;
}

export interface ProvisioningStepDTO {
  key: string;
  label: string;
  status: string;
}

export interface ProvisioningJobDTO {
  id: string;
  tenant_slug: string;
  status: string;
  percent_complete: number;
  steps: ProvisioningStepDTO[];
  eta_seconds: number | null;
}

export interface TenantSchemaValidationDTO {
  tenant_slug: string;
  schema_name: string;
  schema_version: string;
  table_count: number | null;
  status: string;
  detail: string | null;
  validated_at: string;
}

export interface BackupSnapshotDTO {
  tenant_slug: string;
  status: string;
  size_bytes: number | null;
  taken_at: string | null;
  age_hours: number | null;
  retention_days: number;
  retained_count: number;
  stale_reason: string | null;
}

export interface IsolationSummaryDTO {
  enforced: number;
  partial: number;
  breach: number;
  pending: number;
  total: number;
}

export interface TenancyOverviewDTO {
  tenants: TenantDTO[];
  isolation_summary: IsolationSummaryDTO;
  breach_alerts: BreachAlertDTO[];
  active_provisioning: ProvisioningJobDTO[];
  schema_validations: TenantSchemaValidationDTO[];
  backup_snapshots: BackupSnapshotDTO[];
  total_events_per_second: number;
}

export interface TenantCreateDTO {
  slug: string;
  org_id: string;
  display_name: string;
  tier: string;
  isolation_mode?: string;
  region: string;
  db_schema_name: string;
  network_cidr?: string | null;
  network_vpc?: string | null;
  network_shared?: boolean;
  dek_label?: string | null;
}

// --- generic paging ---

export interface PageDTO<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

// --- system / health ---

export interface DependencyHealthDTO {
  name: string;
  status: string; // "up" | "down"
  detail: string | null;
}

export interface LivenessDTO {
  status: string; // "alive"
}

export interface ReadinessDTO {
  status: string; // "ready" | "not_ready"
  dependencies: DependencyHealthDTO[];
}

export interface VersionDTO {
  name: string;
  version: string;
  environment: string;
  api_prefix: string;
}

export interface DependenciesDTO {
  status: string; // "healthy" | "degraded"
  dependencies: DependencyHealthDTO[];
}

// --- auth: sessions & password management ---

export interface SessionDTO {
  id: string;
  created_at: string;
  expires_at: string;
}

export interface ForgotPasswordResponseDTO {
  detail: string;
  // The raw reset token is only surfaced by the backend outside production,
  // so the reset flow is exercisable without an email transport.
  reset_token: string | null;
}

// --- tenancy: members & usage ---

export interface TenantMemberDTO {
  id: string;
  tenant_id: string;
  user_id: string;
  email: string;
  display_name: string;
  role: string; // owner | admin | analyst | viewer
  created_at: string;
}

export interface TenantMemberCreateDTO {
  user_id: string;
  role?: string;
}

export interface TenantUsageSummaryDTO {
  tenant_id: string;
  slug: string;
  display_name: string;
  status: string;
  member_count: number;
  events_per_second: number;
  provisioning_jobs_total: number;
  active_provisioning_jobs: number;
  schema_validations_total: number;
  backup_snapshots_total: number;
  current_backup_snapshots: number;
  isolation_score: number;
  isolation_level: string;
}

// --- compliance: controls / assessments / summary / gaps ---

export interface ComplianceControlDTO {
  id: string;
  framework_id: string;
  framework_code: string;
  control_domain: string;
  control_description: string;
  control_code: string;
  status: string; // mapped | partial | gap | not_applicable
}

export interface ComplianceAssessmentDTO {
  id: string;
  framework_id: string;
  framework_code: string;
  status: string; // in_progress | completed
  started_by: string;
  started_at: string;
  completed_at: string | null;
  score: number | null;
  total_controls: number | null;
  mapped_controls: number | null;
  gap_controls: number | null;
  notes: string | null;
}

export interface ComplianceAssessmentCreateDTO {
  framework_id: string;
}

export interface FrameworkScoreDTO {
  code: string;
  display_name: string;
  score: number;
  certified: boolean;
  open_violation_count: number;
}

export interface ComplianceSummaryDTO {
  overall_score: number;
  framework_count: number;
  certified_count: number;
  total_controls: number;
  mapped_controls: number;
  partial_controls: number;
  gap_controls: number;
  open_violation_count: number;
  frameworks: FrameworkScoreDTO[];
}

export interface ComplianceGapDTO {
  framework_id: string;
  framework_code: string;
  control_domain: string;
  control_description: string;
  control_code: string;
  status: string; // gap | partial
}

export interface ScoreTrendPointDTO {
  captured_at: string;
  score: number;
}

export interface ScoreTrendSeriesDTO {
  framework_id: string;
  code: string;
  display_name: string;
  current_score: number;
  delta: number;
  points: ScoreTrendPointDTO[];
}

export interface ScoreTrendsResponseDTO {
  window_days: number;
  series: ScoreTrendSeriesDTO[];
}
