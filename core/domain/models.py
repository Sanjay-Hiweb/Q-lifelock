"""Domain models for Q-LIFELOCK."""
from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class CryptoAlgorithm(str, Enum):
    RSA = "RSA"
    ECDSA = "ECDSA"
    ECDH = "ECDH"
    DSA = "DSA"
    DIFFIE_HELLMAN = "Diffie-Hellman"
    ED25519 = "Ed25519"
    AES = "AES"
    CHACHA20 = "ChaCha20"
    SHA256 = "SHA-256"
    UNKNOWN = "UNKNOWN"


class AlgorithmFamily(str, Enum):
    ASYMMETRIC_FACTORING = "asymmetric_factoring"  # Vulnerable to Shor's (RSA)
    ASYMMETRIC_DISCRETE_LOG = "asymmetric_discrete_log"  # Vulnerable to Shor's (DH, DSA)
    ASYMMETRIC_ELLIPTIC_CURVE = "asymmetric_elliptic_curve"  # Vulnerable to Shor's (ECDSA, ECDH)
    SYMMETRIC = "symmetric"  # Grover impact only (AES-256 is safe)
    HASH = "hash"  # Grover impact only (SHA-256/384/512 safe)
    UNKNOWN = "unknown"


class CryptoFunction(str, Enum):
    KEY_ESTABLISHMENT = "key_establishment"
    DIGITAL_SIGNATURE = "digital_signature"
    AUTHENTICATION = "authentication"
    ENCRYPTION = "encryption"
    CERTIFICATE_PKI = "certificate_pki"
    CONFIGURATION = "configuration"
    UNKNOWN = "unknown"


class UsageContext(str, Enum):
    PRODUCTION = "production"
    TEST = "test"
    SAMPLE = "sample"
    DOCUMENTATION = "documentation"
    GENERATED = "generated"
    CONFIGURATION = "configuration"
    UNKNOWN = "unknown"


class DataSensitivity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"
    UNKNOWN = "unknown"


class DataLifetimeCategory(str, Enum):
    UNDER_1_YEAR = "<1_year"
    Y1_TO_3 = "1-3_years"
    Y3_TO_5 = "3-5_years"
    Y5_TO_10 = "5-10_years"
    Y10_TO_20 = "10-20_years"
    Y20_TO_30 = "20-30_years"
    OVER_30_YEARS = "30+_years"
    UNKNOWN = "unknown"


class QuantumExposure(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    UNKNOWN = "UNKNOWN"


class MigrationStatus(str, Enum):
    NOT_STARTED = "not_started"
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    VALIDATED = "validated"
    COMPLETED = "completed"


class PQCTarget(str, Enum):
    # NIST FIPS 203 (ML-KEM)
    ML_KEM_512 = "ML-KEM-512"
    ML_KEM_768 = "ML-KEM-768"
    ML_KEM_1024 = "ML-KEM-1024"
    # NIST FIPS 204 (ML-DSA)
    ML_DSA_44 = "ML-DSA-44"
    ML_DSA_65 = "ML-DSA-65"
    ML_DSA_87 = "ML-DSA-87"
    # NIST FIPS 205 (SLH-DSA)
    SLH_DSA_SHA2_128F = "SLH-DSA-SHA2-128f"
    SLH_DSA_SHAKE_128F = "SLH-DSA-SHAKE-128f"
    SLH_DSA_SHA2_256F = "SLH-DSA-SHA2-256f"
    # Hybrid Transitions
    HYBRID_ECDH_ML_KEM = "Hybrid-ECDH-ML-KEM"
    HYBRID_ECDSA_ML_DSA = "Hybrid-ECDSA-ML-DSA"
    UNKNOWN = "UNKNOWN"


class Evidence(BaseModel):
    file_path: str
    line_number: int
    line_content: str
    surrounding_context: Optional[str] = None
    character_range: Optional[tuple[int, int]] = None
    detection_method: str = "lexical_pattern"


class Finding(BaseModel):
    finding_id: str
    repository: str
    file_path: str
    line_number: int
    language: str
    algorithm: CryptoAlgorithm
    algorithm_family: AlgorithmFamily = AlgorithmFamily.UNKNOWN
    function: CryptoFunction
    library: Optional[str] = None
    key_size: Optional[int] = None
    protocol: Optional[str] = None
    usage_context: UsageContext = UsageContext.PRODUCTION
    data_class: Optional[str] = None
    data_sensitivity: DataSensitivity = DataSensitivity.UNKNOWN
    data_lifetime_years: Optional[int] = None
    data_lifetime_category: DataLifetimeCategory = DataLifetimeCategory.UNKNOWN
    confidence: float = Field(ge=0.0, le=1.0, default=0.85)
    evidence: Evidence
    quantum_exposure: QuantumExposure = QuantumExposure.UNKNOWN
    risk_score: float = Field(ge=0.0, le=100.0, default=0.0)
    priority: QuantumExposure = QuantumExposure.UNKNOWN
    priority_reason: str = ""
    recommended_pqc_target: Optional[PQCTarget] = None
    migration_strategy: str = ""
    migration_status: MigrationStatus = MigrationStatus.NOT_STARTED


class QuantumScenario(BaseModel):
    scenario_id: str = "default_2035"
    name: str = "Standard 2035 Scenario"
    threat_horizon_year: int = 2035
    crqc_arrival_year: int = 2035
    hndl_active: bool = True
    description: str = "Assumes Cryptographically Relevant Quantum Computer (CRQC) emergence around 2035."


class ScanSummary(BaseModel):
    scan_id: str
    repository_path: str
    scanned_at: str
    total_files_scanned: int
    total_findings: int
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    unknown_count: int
    readiness_score: float = Field(ge=0.0, le=100.0)
    scenario_year: int
    findings: List[Finding] = []
