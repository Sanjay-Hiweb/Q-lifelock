"""Function-aware PQC Migration Planner conforming to NIST FIPS 203, 204, and 205."""
from typing import Tuple, Optional
from core.domain.models import (
    CryptoAlgorithm,
    CryptoFunction,
    PQCTarget,
    MigrationStatus,
    Finding,
)


class MigrationPlanner:
    """
    Evaluates cryptographic findings based on cryptographic PURPOSE and PROTOCOL CONTEXT
    rather than simplistic algorithm name substitution.
    """

    @classmethod
    def plan_migration(cls, finding: Finding) -> Tuple[Optional[PQCTarget], str, str]:
        """
        Determine technically sound PQC target, detailed migration strategy, and compatibility notes.
        
        Returns:
            (recommended_pqc_target, migration_strategy, compatibility_notes)
        """
        algo = finding.algorithm
        func = finding.function
        key_size = finding.key_size or 2048

        # 1. Key Establishment / Encryption Workflows (NIST FIPS 203 - ML-KEM)
        if func in (CryptoFunction.KEY_ESTABLISHMENT, CryptoFunction.ENCRYPTION):
            if key_size >= 3072:
                target = PQCTarget.ML_KEM_1024
            else:
                target = PQCTarget.ML_KEM_768
            
            strategy = (
                f"Replace classical {algo.value} key exchange with NIST FIPS 203 {target.value}. "
                f"For network protocols (TLS 1.3/SSH), deploy a hybrid combiner (e.g., X25519 + {target.value}) "
                f"to preserve classical compliance while mitigating Harvest-Now-Decrypt-Later risk."
            )
            compat = (
                "Ciphertext overhead: ML-KEM-768 ciphertext is ~1,088 bytes (vs classical 32-256 bytes). "
                "Ensure MTU limits and protocol buffer allocations accommodate the increased public key and ciphertext sizes."
            )
            return (target, strategy, compat)

        # 2. Digital Signature / PKI Workflows (NIST FIPS 204 - ML-DSA & FIPS 205 - SLH-DSA)
        elif func in (CryptoFunction.DIGITAL_SIGNATURE, CryptoFunction.AUTHENTICATION, CryptoFunction.CERTIFICATE_PKI):
            # High assurance or firmware signing can benefit from SLH-DSA (stateless hash-based)
            if "firmware" in (finding.file_path or "").lower() or "boot" in (finding.file_path or "").lower():
                target = PQCTarget.SLH_DSA_SHA2_128F
                strategy = (
                    f"Migrate {algo.value} signature to NIST FIPS 205 {target.value}. "
                    f"SLH-DSA provides conservative hash-based security with zero lattice assumptions, "
                    f"ideal for long-lived code signing and firmware integrity verification."
                )
                compat = (
                    "Signature size: SLH-DSA signatures are larger (~7.8 KB). "
                    "Verify code-signing manifests and bootloader storage accommodate the signature size."
                )
            else:
                target = PQCTarget.ML_DSA_65
                strategy = (
                    f"Migrate {algo.value} signature to NIST FIPS 204 {target.value}. "
                    f"Implement dual-signature validation during transitional phase (composite classical + PQC signatures) "
                    f"to maintain interoperability with non-PQC clients."
                )
                compat = (
                    f"Signature size: ML-DSA-65 signatures are ~3,309 bytes. "
                    "Update X.509 certificate parsing buffers and TLS certificate chain limits."
                )
            return (target, strategy, compat)

        # 3. Symmetric / Hash Workflows
        elif algo in (CryptoAlgorithm.AES, CryptoAlgorithm.CHACHA20, CryptoAlgorithm.SHA256):
            strategy = (
                f"{algo.value} is naturally resilient against quantum Shor's algorithm. "
                "Against Grover's search algorithm, ensure 256-bit key length is used (AES-256 / SHA-256+), "
                "providing a post-quantum security level of at least 128 bits."
            )
            compat = "Fully compliant with NIST post-quantum guidance with zero protocol changes."
            return (None, strategy, compat)

        # 4. Unknown / Generic Workflows
        else:
            strategy = (
                f"Review usage of {algo.value} in {finding.file_path}:{finding.line_number}. "
                "Determine if function is confidentiality or signature before selecting FIPS 203 (ML-KEM) or FIPS 204 (ML-DSA)."
            )
            compat = "Requires manual cryptographic review to resolve function context."
            return (PQCTarget.UNKNOWN, strategy, compat)
