"""
CycloneDX 1.6 Cryptographic Bill of Materials (CBOM) Generator for Q-LIFELOCK.
Conforms to the CycloneDX v1.6 specification with Cryptography Asset extensions.
"""
from datetime import datetime, timezone
from typing import Dict, Any, List
from core.domain.models import ScanSummary, Finding, CryptoAlgorithm, CryptoFunction, QuantumExposure


class CBOMGenerator:
    """Generates CycloneDX 1.6 CBOM formatted JSON from Q-LIFELOCK scan findings."""

    @staticmethod
    def _map_primitive(algorithm: CryptoAlgorithm) -> str:
        if algorithm in (CryptoAlgorithm.RSA, CryptoAlgorithm.DIFFIE_HELLMAN, CryptoAlgorithm.DSA):
            return "pke"  # public key encryption / asymmetric
        elif algorithm in (CryptoAlgorithm.ECDSA, CryptoAlgorithm.ED25519):
            return "signature"
        elif algorithm == CryptoAlgorithm.ECDH:
            return "key-agree"
        elif algorithm in (CryptoAlgorithm.AES, CryptoAlgorithm.CHACHA20):
            return "block-cipher" if algorithm == CryptoAlgorithm.AES else "stream-cipher"
        elif algorithm == CryptoAlgorithm.SHA256:
            return "hash"
        return "other"

    @staticmethod
    def _map_nist_quantum_level(exposure: QuantumExposure) -> int:
        # 0 = Quantum-vulnerable (NIST Level 0)
        # 1-5 = NIST PQC security levels
        if exposure in (QuantumExposure.CRITICAL, QuantumExposure.HIGH, QuantumExposure.MEDIUM):
            return 0
        return 1

    @classmethod
    def generate(cls, scan_summary: ScanSummary) -> Dict[str, Any]:
        """Convert a ScanSummary into standard CycloneDX 1.6 CBOM JSON structure."""
        now_iso = datetime.now(timezone.utc).isoformat()
        
        components: List[Dict[str, Any]] = []

        for finding in scan_summary.findings:
            component_ref = f"crypto-asset-{finding.finding_id}"
            
            crypto_properties: Dict[str, Any] = {
                "assetType": "algorithm",
                "algorithmProperties": {
                    "primitive": cls._map_primitive(finding.algorithm),
                    "parameterSetIdentifier": str(finding.key_size) if finding.key_size else "default",
                    "executionEnvironment": finding.usage_context.value,
                    "implementationPlatform": finding.language,
                    "classicalSecurityLevel": finding.key_size or 128,
                    "nistQuantumSecurityLevel": cls._map_nist_quantum_level(finding.priority),
                },
                "protocolProperties": {
                    "type": finding.protocol or "application-level",
                },
            }

            component = {
                "bom-ref": component_ref,
                "type": "cryptographic-asset",
                "name": finding.algorithm.value,
                "version": f"finding-{finding.finding_id}",
                "description": f"{finding.algorithm.value} for {finding.function.value} in {finding.file_path}",
                "evidence": {
                    "occurrences": [
                        {
                            "location": finding.file_path,
                            "line": finding.line_number,
                            "offset": 0,
                            "symbol": finding.evidence.line_content.strip()[:100],
                        }
                    ]
                },
                "cryptoProperties": crypto_properties,
                "properties": [
                    {"name": "qlifelock:finding_id", "value": finding.finding_id},
                    {"name": "qlifelock:risk_score", "value": f"{finding.risk_score:.1f}"},
                    {"name": "qlifelock:priority", "value": finding.priority.value},
                    {"name": "qlifelock:data_lifetime_years", "value": str(finding.data_lifetime_years if finding.data_lifetime_years is not None else -1)},
                    {"name": "qlifelock:recommended_pqc_target", "value": finding.recommended_pqc_target.value if finding.recommended_pqc_target else "N/A"},
                    {"name": "qlifelock:migration_strategy", "value": finding.migration_strategy},
                    {"name": "qlifelock:migration_status", "value": finding.migration_status.value},
                ],
            }
            components.append(component)

        cbom = {
            "bomFormat": "CycloneDX",
            "specVersion": "1.6",
            "serialNumber": f"urn:uuid:{scan_summary.scan_id}",
            "version": 1,
            "metadata": {
                "timestamp": now_iso,
                "tools": {
                    "components": [
                        {
                            "type": "application",
                            "name": "Q-LIFELOCK",
                            "version": "0.1.0",
                            "description": "Quantifying Quantum Exposure & PQC Migration Prioritization",
                        }
                    ]
                },
                "component": {
                    "type": "application",
                    "name": scan_summary.repository_path.split("/")[-1] or "Target-Repository",
                    "description": f"Analyzed repository: {scan_summary.repository_path}",
                },
                "properties": [
                    {"name": "qlifelock:readiness_score", "value": f"{scan_summary.readiness_score:.1f}"},
                    {"name": "qlifelock:scenario_year", "value": str(scan_summary.scenario_year)},
                    {"name": "qlifelock:critical_count", "value": str(scan_summary.critical_count)},
                    {"name": "qlifelock:high_count", "value": str(scan_summary.high_count)},
                    {"name": "qlifelock:medium_count", "value": str(scan_summary.medium_count)},
                    {"name": "qlifelock:low_count", "value": str(scan_summary.low_count)},
                ],
            },
            "components": components,
        }
        return cbom
