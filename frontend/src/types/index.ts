/**
 * TypeScript Type Definitions for Q-LIFELOCK.
 */

export type CryptoAlgorithm = 
  | "RSA"
  | "ECDSA"
  | "ECDH"
  | "DSA"
  | "Diffie-Hellman"
  | "Ed25519"
  | "AES"
  | "ChaCha20"
  | "SHA-256"
  | "UNKNOWN";

export type AlgorithmFamily = 
  | "asymmetric_factoring"
  | "asymmetric_discrete_log"
  | "asymmetric_elliptic_curve"
  | "symmetric"
  | "hash"
  | "unknown";

export type CryptoFunction = 
  | "key_establishment"
  | "digital_signature"
  | "authentication"
  | "encryption"
  | "certificate_pki"
  | "configuration"
  | "unknown";

export type UsageContext = 
  | "production"
  | "test"
  | "sample"
  | "documentation"
  | "generated"
  | "configuration"
  | "unknown";

export type DataSensitivity = 
  | "low"
  | "medium"
  | "high"
  | "critical"
  | "unknown";

export type DataLifetimeCategory = 
  | "<1_year"
  | "1-3_years"
  | "3-5_years"
  | "5-10_years"
  | "10-20_years"
  | "20-30_years"
  | "30+_years"
  | "unknown";

export type QuantumExposure = 
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "UNKNOWN";

export type MigrationStatus = 
  | "not_started"
  | "planned"
  | "in_progress"
  | "validated"
  | "completed";

export type PQCTarget = 
  | "ML-KEM-512"
  | "ML-KEM-768"
  | "ML-KEM-1024"
  | "ML-DSA-44"
  | "ML-DSA-65"
  | "ML-DSA-87"
  | "SLH-DSA-SHA2-128f"
  | "SLH-DSA-SHAKE-128f"
  | "SLH-DSA-SHA2-256f"
  | "Hybrid-ECDH-ML-KEM"
  | "Hybrid-ECDSA-ML-DSA"
  | "UNKNOWN";

export interface Evidence {
  file_path: string;
  line_number: number;
  line_content: string;
  surrounding_context?: string;
  character_range?: [number, number];
  detection_method: string;
}

export interface Finding {
  finding_id: string;
  repository: string;
  file_path: string;
  line_number: number;
  language: string;
  algorithm: CryptoAlgorithm;
  algorithm_family: AlgorithmFamily;
  function: CryptoFunction;
  library?: string;
  key_size?: number;
  protocol?: string;
  usage_context: UsageContext;
  data_class?: string;
  data_sensitivity: DataSensitivity;
  data_lifetime_years?: number;
  data_lifetime_category: DataLifetimeCategory;
  confidence: number;
  evidence: Evidence;
  quantum_exposure: QuantumExposure;
  risk_score: number;
  priority: QuantumExposure;
  priority_reason: string;
  recommended_pqc_target?: PQCTarget;
  migration_strategy: string;
  migration_status: MigrationStatus;
}

export interface ScanSummary {
  scan_id: string;
  repository_path: string;
  scanned_at: string;
  total_files_scanned: number;
  total_findings: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  unknown_count: number;
  readiness_score: number;
  scenario_year: number;
  findings: Finding[];
}

export interface TimeMachineShift {
  finding_id: string;
  algorithm: string;
  file_path: string;
  old_priority: QuantumExposure;
  new_priority: QuantumExposure;
  old_risk_score: number;
  new_risk_score: number;
  data_lifetime_years?: number;
  hndl_exposed: boolean;
  overlap_years: number;
}

export interface TimeMachineSimulationResult {
  scenario_year: number;
  total_findings: number;
  exposure_counts: {
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
    UNKNOWN: number;
  };
  shifts?: any;
  detailed_shifts?: TimeMachineShift[];
  findings: Finding[];
}

export interface ToyShorStep {
  step: string;
  details: string;
  values?: Record<string, any>;
}

export interface ToyShorResult {
  status: "success" | "failure";
  target_integer: number;
  coprime_chosen: number;
  measured_period_r: number;
  derived_factors: number[];
  execution_steps: ToyShorStep[];
  circuit_simulation_notes: string;
}

export interface ResourceEstimate {
  algorithm: string;
  key_size: number;
  logical_qubits: number;
  physical_qubits_estimated: number;
  toffoli_depth: string;
  surface_code_cycles: string;
  estimated_wall_clock_time: string;
  reference_paper: string;
  notes: string;
}
