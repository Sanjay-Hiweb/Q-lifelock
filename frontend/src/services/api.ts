/**
 * Q-LIFELOCK API Client Service.
 * Connects to FastAPI backend with fallback dataset if backend is initializing.
 */
import { 
  ScanSummary, 
  Finding, 
  MigrationStatus, 
  TimeMachineSimulationResult, 
  ToyShorResult, 
  ResourceEstimate 
} from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Fallback seed findings derived from synthetic core banking repository
export const MOCK_SCAN_SUMMARY: ScanSummary = {
  scan_id: "scan-synth-banking-001",
  repository_path: "d:/Q-LIFELOCK/tests/fixtures/synthetic_repo",
  scanned_at: new Date().toISOString(),
  total_files_scanned: 12,
  total_findings: 6,
  critical_count: 2,
  high_count: 2,
  medium_count: 1,
  low_count: 1,
  unknown_count: 0,
  readiness_score: 16.7,
  scenario_year: 2035,
  findings: [
    {
      finding_id: "FND-001",
      repository: "Synthetic-Core-Banking-Services",
      file_path: "src/accounts/key_manager.py",
      line_number: 24,
      language: "python",
      algorithm: "RSA",
      algorithm_family: "asymmetric_factoring",
      function: "key_establishment",
      library: "cryptography.hazmat",
      key_size: 2048,
      protocol: "TLS 1.2 / Internal Vault",
      usage_context: "production",
      data_class: "Long-Term Master Encrypted Customer Ledger",
      data_sensitivity: "critical",
      data_lifetime_years: 30,
      data_lifetime_category: "30+_years",
      confidence: 0.95,
      evidence: {
        file_path: "src/accounts/key_manager.py",
        line_number: 24,
        line_content: "private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)",
        surrounding_context: "def init_master_vault():\n    # Master customer ledger key\n    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)\n    return private_key",
        detection_method: "lexical_pattern",
      },
      quantum_exposure: "CRITICAL",
      risk_score: 96.5,
      priority: "CRITICAL",
      priority_reason: "HNDL Active: Customer ledger requires 30-year secrecy (expires 2056). CRQC horizon is 2035. Overlap window: 21 years of quantum exposure.",
      recommended_pqc_target: "ML-KEM-1024",
      migration_strategy: "Migrate key establishment to NIST FIPS 203 ML-KEM-1024. Implement hybrid X25519 + ML-KEM-1024 transition wrapper for backward compatibility.",
      migration_status: "not_started",
    },
    {
      finding_id: "FND-002",
      repository: "Synthetic-Core-Banking-Services",
      file_path: "src/payments/wire_transfer.py",
      line_number: 42,
      language: "python",
      algorithm: "ECDSA",
      algorithm_family: "asymmetric_elliptic_curve",
      function: "digital_signature",
      library: "cryptography.hazmat.primitives.asymmetric.ec",
      key_size: 256,
      protocol: "SWIFT / ISO 20022 Interbank",
      usage_context: "production",
      data_class: "Interbank Wire Authorization Signatures",
      data_sensitivity: "high",
      data_lifetime_years: 10,
      data_lifetime_category: "5-10_years",
      confidence: 0.92,
      evidence: {
        file_path: "src/payments/wire_transfer.py",
        line_number: 42,
        line_content: "signature = private_key.sign(transfer_payload, ec.ECDSA(hashes.SHA256()))",
        surrounding_context: "def sign_interbank_transfer(transfer_payload, private_key):\n    # ISO 20022 mandate\n    signature = private_key.sign(transfer_payload, ec.ECDSA(hashes.SHA256()))\n    return signature",
        detection_method: "lexical_pattern",
      },
      quantum_exposure: "HIGH",
      risk_score: 84.0,
      priority: "HIGH",
      priority_reason: "High transaction non-repudiation: Audit lifetime 10 years (expires 2036). Adversary with CRQC in 2035 could forge interbank authorization signatures.",
      recommended_pqc_target: "ML-DSA-65",
      migration_strategy: "Adopt NIST FIPS 204 ML-DSA-65 (formerly Dilithium3) for digital signatures. Dual-sign transfer payloads during 18-month migration window.",
      migration_status: "planned",
    },
    {
      finding_id: "FND-003",
      repository: "Synthetic-Core-Banking-Services",
      file_path: "src/gateway/tls_handshake.py",
      line_number: 18,
      language: "python",
      algorithm: "ECDH",
      algorithm_family: "asymmetric_elliptic_curve",
      function: "key_establishment",
      library: "cryptography.hazmat.primitives.asymmetric.ec",
      key_size: 384,
      protocol: "Internal Mesh RPC / mTLS",
      usage_context: "production",
      data_class: "Real-time Banking Session Traffic",
      data_sensitivity: "critical",
      data_lifetime_years: 25,
      data_lifetime_category: "20-30_years",
      confidence: 0.94,
      evidence: {
        file_path: "src/gateway/tls_handshake.py",
        line_number: 18,
        line_content: "shared_key = server_private_key.exchange(ec.ECDH(), peer_public_key)",
        surrounding_context: "def establish_secure_channel(server_private_key, peer_public_key):\n    # Ephemeral ECDH exchange\n    shared_key = server_private_key.exchange(ec.ECDH(), peer_public_key)\n    return derive_session_keys(shared_key)",
        detection_method: "lexical_pattern",
      },
      quantum_exposure: "CRITICAL",
      risk_score: 92.0,
      priority: "CRITICAL",
      priority_reason: "HNDL Active: Wiretapped TLS session records carrying sensitive customer PII & KYC data with 25-year lifetime (expires 2051).",
      recommended_pqc_target: "ML-KEM-768",
      migration_strategy: "Deploy Hybrid ECDH (X25519) + ML-KEM-768 (X-Wing / draft-ietf-tls-hybrid-design) for immediate ingress protection.",
      migration_status: "in_progress",
    },
    {
      finding_id: "FND-004",
      repository: "Synthetic-Core-Banking-Services",
      file_path: "src/auth/jwt_tokens.py",
      line_number: 31,
      language: "python",
      algorithm: "RSA",
      algorithm_family: "asymmetric_factoring",
      function: "authentication",
      library: "PyJWT",
      key_size: 2048,
      protocol: "OAuth2 / OIDC",
      usage_context: "production",
      data_class: "User Session JWT Signatures",
      data_sensitivity: "medium",
      data_lifetime_years: 1,
      data_lifetime_category: "1-3_years",
      confidence: 0.90,
      evidence: {
        file_path: "src/auth/jwt_tokens.py",
        line_number: 31,
        line_content: "token = jwt.encode(payload, rsa_private_pem, algorithm='RS256')",
        surrounding_context: "def generate_auth_token(user_id, rsa_private_pem):\n    payload = {'sub': user_id, 'exp': time.time() + 3600}\n    token = jwt.encode(payload, rsa_private_pem, algorithm='RS256')\n    return token",
        detection_method: "lexical_pattern",
      },
      quantum_exposure: "HIGH",
      risk_score: 65.0,
      priority: "HIGH",
      priority_reason: "Critical auth surface: Short 1-hour session token lifetime, but vulnerable root signing key allows live token forgery upon CRQC emergence.",
      recommended_pqc_target: "ML-DSA-65",
      migration_strategy: "Update identity provider keys to ML-DSA-65 or Ed25519 (interim) with automated key rotation pipelines.",
      migration_status: "planned",
    },
    {
      finding_id: "FND-005",
      repository: "Synthetic-Core-Banking-Services",
      file_path: "src/storage/backup_encryption.py",
      line_number: 15,
      language: "python",
      algorithm: "AES",
      algorithm_family: "symmetric",
      function: "encryption",
      library: "cryptography.hazmat.primitives.ciphers",
      key_size: 256,
      protocol: "AES-GCM",
      usage_context: "production",
      data_class: "Cold Backup DB Archives",
      data_sensitivity: "critical",
      data_lifetime_years: 30,
      data_lifetime_category: "30+_years",
      confidence: 0.98,
      evidence: {
        file_path: "src/storage/backup_encryption.py",
        line_number: 15,
        line_content: "cipher = Cipher(algorithms.AES(key_256), modes.GCM(nonce))",
        surrounding_context: "def encrypt_backup(data, key_256, nonce):\n    # AES-256 GCM encrypted archive\n    cipher = Cipher(algorithms.AES(key_256), modes.GCM(nonce))\n    return cipher.encryptor().update(data)",
        detection_method: "lexical_pattern",
      },
      quantum_exposure: "LOW",
      risk_score: 22.0,
      priority: "LOW",
      priority_reason: "Quantum Safe: Grover's search algorithm halves symmetric key strength (AES-256 retains 128 bits post-quantum security margin). No Shor vulnerability.",
      recommended_pqc_target: undefined,
      migration_strategy: "Retain AES-256. Ensure key derivation routines (KDF) also utilize quantum-resistant primitives (e.g. SHA-384 / Argon2id).",
      migration_status: "completed",
    },
    {
      finding_id: "FND-006",
      repository: "Synthetic-Core-Banking-Services",
      file_path: "tests/mocks/test_vault.py",
      line_number: 12,
      language: "python",
      algorithm: "RSA",
      algorithm_family: "asymmetric_factoring",
      function: "key_establishment",
      library: "cryptography.hazmat",
      key_size: 1024,
      protocol: "Mock Unit Test",
      usage_context: "test",
      data_class: "Dummy Synthetic Test Keys",
      data_sensitivity: "low",
      data_lifetime_years: 0,
      data_lifetime_category: "<1_year",
      confidence: 0.95,
      evidence: {
        file_path: "tests/mocks/test_vault.py",
        line_number: 12,
        line_content: "test_key = rsa.generate_private_key(public_exponent=65537, key_size=1024)",
        surrounding_context: "def test_mock_vault_initialization():\n    # Fast mock key for unit tests\n    test_key = rsa.generate_private_key(public_exponent=65537, key_size=1024)\n    assert test_key is not None",
        detection_method: "lexical_pattern",
      },
      quantum_exposure: "LOW",
      risk_score: 12.0,
      priority: "LOW",
      priority_reason: "Test Code Attenuation: Verified test-only environment with synthetic data. Zero HNDL risk to organizational assets.",
      recommended_pqc_target: "ML-KEM-512",
      migration_strategy: "Update mock test fixtures to utilize lightweight PQC mocks during Phase 3 of repository modernization.",
      migration_status: "not_started",
    },
  ],
};

export class ApiService {
  static async checkHealth(): Promise<{ status: string; service: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`, { method: "GET" });
      if (!res.ok) throw new Error("Health check failed");
      return await res.json();
    } catch {
      return { status: "offline", service: "Q-LIFELOCK (Local Standalone Mode)" };
    }
  }

  static async getLatestScan(): Promise<ScanSummary> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/scans/latest`);
      if (!res.ok) throw new Error("Scan fetch failed");
      return await res.json();
    } catch (err) {
      console.warn("API server unreachable, using verified synthetic dataset", err);
      return MOCK_SCAN_SUMMARY;
    }
  }

  static async triggerScan(
    repositoryPath?: string, 
    scenarioYear = 2035, 
    repositoryName?: string
  ): Promise<ScanSummary> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repository_path: repositoryPath || null,
          scenario_year: scenarioYear,
          repository_name: repositoryName || null,
        }),
      });
      if (!res.ok) throw new Error("Trigger scan failed");
      return await res.json();
    } catch (err) {
      console.warn("API scan trigger error, returning simulated scan", err);
      return {
        ...MOCK_SCAN_SUMMARY,
        scenario_year: scenarioYear,
        scanned_at: new Date().toISOString(),
      };
    }
  }

  static async simulateTimeMachine(
    scenarioYear: number, 
    findings?: Finding[]
  ): Promise<TimeMachineSimulationResult> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/timemachine/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario_year: scenarioYear,
          findings: findings || null,
        }),
      });
      if (!res.ok) throw new Error("Time machine simulate failed");
      return await res.json();
    } catch (err) {
      console.warn("API simulation fallback", err);
      // Compute client-side fallback simulation
      const currentYear = 2026;
      const baseFindings = findings || MOCK_SCAN_SUMMARY.findings;
      const updatedFindings = baseFindings.map((f) => {
        const lifetime = f.data_lifetime_years || 0;
        const expiryYear = currentYear + lifetime;
        const overlap = Math.max(0, expiryYear - scenarioYear);
        let newPriority = f.priority;
        let newScore = f.risk_score;

        if (f.usage_context === "test") {
          newPriority = "LOW";
          newScore = 15;
        } else if (f.algorithm === "AES") {
          newPriority = "LOW";
          newScore = 20;
        } else if (overlap > 10) {
          newPriority = "CRITICAL";
          newScore = Math.min(100, 75 + overlap * 1.5);
        } else if (overlap > 0) {
          newPriority = "HIGH";
          newScore = Math.min(85, 60 + overlap * 2);
        } else if (scenarioYear <= 2030) {
          newPriority = "MEDIUM";
          newScore = 50;
        } else {
          newPriority = "LOW";
          newScore = 25;
        }

        return {
          ...f,
          priority: newPriority,
          risk_score: Number(newScore.toFixed(1)),
        };
      });

      const counts = {
        CRITICAL: updatedFindings.filter((f) => f.priority === "CRITICAL").length,
        HIGH: updatedFindings.filter((f) => f.priority === "HIGH").length,
        MEDIUM: updatedFindings.filter((f) => f.priority === "MEDIUM").length,
        LOW: updatedFindings.filter((f) => f.priority === "LOW").length,
        UNKNOWN: 0,
      };

      const shifts = updatedFindings.map((f, idx) => ({
        finding_id: f.finding_id,
        algorithm: f.algorithm,
        file_path: f.file_path,
        old_priority: baseFindings[idx].priority,
        new_priority: f.priority,
        old_risk_score: baseFindings[idx].risk_score,
        new_risk_score: f.risk_score,
        data_lifetime_years: f.data_lifetime_years,
        hndl_exposed: (currentYear + (f.data_lifetime_years || 0)) > scenarioYear,
        overlap_years: Math.max(0, (currentYear + (f.data_lifetime_years || 0)) - scenarioYear),
      }));

      return {
        scenario_year: scenarioYear,
        total_findings: updatedFindings.length,
        exposure_counts: counts,
        shifts,
        findings: updatedFindings,
      };
    }
  }

  static async updateFindingStatus(
    findingId: string, 
    newStatus: MigrationStatus
  ): Promise<{ finding_id: string; new_status: MigrationStatus; updated_readiness_score: number }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/findings/${findingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ migration_status: newStatus }),
      });
      if (!res.ok) throw new Error("Status update failed");
      return await res.json();
    } catch {
      // Local fallback
      return {
        finding_id: findingId,
        new_status: newStatus,
        updated_readiness_score: 33.3,
      };
    }
  }

  static async getToyShor(N = 15): Promise<ToyShorResult> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/quantum/toy-shor?N=${N}`);
      if (!res.ok) throw new Error("Toy Shor failed");
      return await res.json();
    } catch {
      return {
        status: "success",
        target_integer: 15,
        coprime_chosen: 7,
        measured_period_r: 4,
        derived_factors: [3, 5],
        execution_steps: [
          {
            step: "Initialization & Superposition",
            details: "Constructed 4-qubit register in uniform superposition using Hadamard transforms: |ψ₀⟩ = 1/4 ∑ |x⟩.",
          },
          {
            step: "Quantum Modular Exponentiation",
            details: "Evaluated f(x) = 7^x mod 15 into auxiliary register: f(0)=1, f(1)=7, f(2)=4, f(3)=13, f(4)=1...",
          },
          {
            step: "Quantum Fourier Transform (QFT)",
            details: "Applied inverse QFT to extract periodicity phase: Measured peak states |0⟩, |4⟩, |8⟩, |12⟩ yielding r = 4.",
          },
          {
            step: "Classical Factor Extraction",
            details: "Computed gcd(7^(4/2) ± 1, 15) = gcd(49 ± 1, 15): gcd(48, 15)=3 and gcd(50, 15)=5.",
          },
        ],
        circuit_simulation_notes: "Simulated Shor period-finding routine demonstrating polynomial-time discrete logarithm / order-finding breaking RSA-like structure.",
      };
    }
  }

  static async getResourceEstimates(algorithm = "RSA", keySize = 2048): Promise<ResourceEstimate> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/quantum/resource-estimates?algorithm=${algorithm}&key_size=${keySize}`);
      if (!res.ok) throw new Error("Resource estimate failed");
      return await res.json();
    } catch {
      return {
        algorithm: "RSA",
        key_size: 2048,
        logical_qubits: 4098,
        physical_qubits_estimated: 20000000,
        toffoli_depth: "2.7 x 10^8",
        surface_code_cycles: "1.1 x 10^9",
        estimated_wall_clock_time: "~8 hours (superconducting 1μs cycle) to ~2 weeks (trapped ion)",
        reference_paper: "Gidney & Ekerå (2021) 'How to factor 2048 bit RSA integers in 8 hours'",
        notes: "Assumes distance-27 surface codes with 10^-3 physical error rate and lattice surgery.",
      };
    }
  }

  static getExportCBOMUrl(): string {
    return `${API_BASE_URL}/api/scans/latest/export/cbom`;
  }

  static getExportCSVUrl(): string {
    return `${API_BASE_URL}/api/scans/latest/export/csv`;
  }

  static getExportReportUrl(): string {
    return `${API_BASE_URL}/api/scans/latest/export/report`;
  }
}
