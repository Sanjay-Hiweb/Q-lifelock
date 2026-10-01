"""
Cryptographic Detector Suite for Q-LIFELOCK.

Implements regex and syntax-guided pattern matchers for:
- RSA (Key Establishment vs Digital Signature)
- ECDSA (Digital Signature / Authentication)
- ECDH (Key Establishment)
"""
import re
from typing import List, Dict, Any, Optional
from core.domain.models import (
    CryptoAlgorithm,
    AlgorithmFamily,
    CryptoFunction,
    UsageContext,
    DataSensitivity,
    Evidence,
    Finding,
)
from core.domain.lifetime import years_to_category, infer_data_lifetime_preset


class CryptoDetector:
    """Detects quantum-vulnerable cryptographic usage and extracts evidence."""

    # Lexical patterns with contextual categorization
    RULES = [
        # --- RSA KEY ESTABLISHMENT / ENCRYPTION ---
        {
            "id": "RULE_RSA_ENCRYPT_OAEP",
            "algorithm": CryptoAlgorithm.RSA,
            "family": AlgorithmFamily.ASYMMETRIC_FACTORING,
            "function": CryptoFunction.KEY_ESTABLISHMENT,
            "pattern": re.compile(r"(PKCS1_OAEP|padding\.OAEP|RSA/ECB/OAEP|crypto\.publicEncrypt|crypto\.privateDecrypt)", re.IGNORECASE),
            "confidence": 0.95,
            "default_key_size": 2048,
        },
        # --- RSA SIGNATURES ---
        {
            "id": "RULE_RSA_SIGN_PSS",
            "algorithm": CryptoAlgorithm.RSA,
            "family": AlgorithmFamily.ASYMMETRIC_FACTORING,
            "function": CryptoFunction.DIGITAL_SIGNATURE,
            "pattern": re.compile(r"(padding\.PSS|PKCS1v15|RSA-SHA256|RSA-PSS|crypto\.createSign\s*\(\s*['\"]RSA|RS256|RS384|RS512)", re.IGNORECASE),
            "confidence": 0.95,
            "default_key_size": 2048,
        },
        # --- RSA GENERAL KEY GENERATION / USAGE ---
        {
            "id": "RULE_RSA_KEYGEN",
            "algorithm": CryptoAlgorithm.RSA,
            "family": AlgorithmFamily.ASYMMETRIC_FACTORING,
            "function": CryptoFunction.KEY_ESTABLISHMENT,
            "pattern": re.compile(r"(rsa\.generate_private_key|generateKeyPair.*['\"]rsa['\"]|RSA\.generate|forge\.pki\.rsa)", re.IGNORECASE),
            "confidence": 0.92,
            "default_key_size": 2048,
        },
        # --- ECDH (KEY ESTABLISHMENT) ---
        {
            "id": "RULE_ECDH_EXCHANGE",
            "algorithm": CryptoAlgorithm.ECDH,
            "family": AlgorithmFamily.ASYMMETRIC_ELLIPTIC_CURVE,
            "function": CryptoFunction.KEY_ESTABLISHMENT,
            "pattern": re.compile(r"(ec\.ECDH\(\)|createECDH|subtle\.deriveKey.*ECDH|ECDH\(\)|derive_shared_key|X25519)", re.IGNORECASE),
            "confidence": 0.96,
            "default_key_size": 256,
        },
        # --- ECDSA (DIGITAL SIGNATURE) ---
        {
            "id": "RULE_ECDSA_SIGN",
            "algorithm": CryptoAlgorithm.ECDSA,
            "family": AlgorithmFamily.ASYMMETRIC_ELLIPTIC_CURVE,
            "function": CryptoFunction.DIGITAL_SIGNATURE,
            "pattern": re.compile(r"(ec\.ECDSA\s*\(|createSign\s*\(\s*['\"]SHA.*['\"]\s*\).*ec|subtle\.sign.*ECDSA|ES256|ES384|ES512|SECP256R1|SECP384R1|SECP521R1|secp256k1)", re.IGNORECASE),
            "confidence": 0.94,
            "default_key_size": 256,
        },
    ]

    KEY_SIZE_REGEX = re.compile(r"(?:key_size|modulusLength|bits)\s*[:=]\s*(\d{3,4})", re.IGNORECASE)
    DATA_CLASS_REGEX = re.compile(r"(?:data_class|sensitivity_type|classification)\s*[:=]\s*['\"]([a-zA-Z0-9_\-]+)['\"]", re.IGNORECASE)
    LIFETIME_REGEX = re.compile(r"(?:lifetime_years|retention_years|protection_years)\s*[:=]\s*(\d{1,3})", re.IGNORECASE)

    @classmethod
    def scan_file_content(
        cls,
        file_path: str,
        content: str,
        repository_name: str = "workspace",
    ) -> List[Finding]:
        """Scan a single file's text content and extract raw findings."""
        findings: List[Finding] = []
        lines = content.splitlines()

        # Determine file-level usage context
        is_test_file = any(part in file_path.lower() for part in ["test", "spec", "mock", "fixture"])
        is_doc_file = file_path.lower().endswith((".md", ".txt", ".rst", ".doc"))

        for idx, line in enumerate(lines, start=1):
            stripped = line.strip()
            if not stripped:
                continue

            is_comment = stripped.startswith(("#", "//", "/*", "*", "<!--"))
            context = (
                UsageContext.DOCUMENTATION if (is_doc_file or is_comment)
                else (UsageContext.TEST if is_test_file else UsageContext.PRODUCTION)
            )

            # Check each rule
            for rule in cls.RULES:
                match = rule["pattern"].search(line)
                if match:
                    # Extract surrounding snippet (up to 2 lines before and after)
                    start_idx = max(0, idx - 3)
                    end_idx = min(len(lines), idx + 2)
                    surrounding = "\n".join(lines[start_idx:end_idx])

                    # Check for explicit key size in line or surroundings
                    key_size = rule["default_key_size"]
                    ks_match = cls.KEY_SIZE_REGEX.search(surrounding)
                    if ks_match:
                        try:
                            key_size = int(ks_match.group(1))
                        except ValueError:
                            pass

                    # Check for explicit data class or lifetime annotations in surroundings
                    data_class = None
                    lifetime_years = None
                    sensitivity = DataSensitivity.UNKNOWN

                    dc_match = cls.DATA_CLASS_REGEX.search(surrounding)
                    if dc_match:
                        data_class = dc_match.group(1)
                        sensitivity, preset_lifetime = infer_data_lifetime_preset(data_class)
                        if preset_lifetime is not None:
                            lifetime_years = preset_lifetime

                    lt_match = cls.LIFETIME_REGEX.search(surrounding)
                    if lt_match:
                        try:
                            lifetime_years = int(lt_match.group(1))
                        except ValueError:
                            pass

                    # Contextual heuristic for data sensitivity if not explicitly annotated
                    if sensitivity == DataSensitivity.UNKNOWN:
                        lower_context = surrounding.lower()
                        if any(w in lower_context for w in ["patient", "health", "medical", "classified", "ssn", "top_secret"]):
                            sensitivity = DataSensitivity.CRITICAL
                            if lifetime_years is None:
                                lifetime_years = 30
                        elif any(w in lower_context for w in ["banking", "payment", "credit_card", "financial", "salary", "pii", "user_identity"]):
                            sensitivity = DataSensitivity.HIGH
                            if lifetime_years is None:
                                lifetime_years = 10
                        elif any(w in lower_context for w in ["session", "telemetry", "ephemeral", "temp"]):
                            sensitivity = DataSensitivity.LOW
                            if lifetime_years is None:
                                lifetime_years = 0

                    confidence = rule["confidence"]
                    if is_comment:
                        confidence = max(0.4, confidence - 0.3)

                    evidence = Evidence(
                        file_path=file_path,
                        line_number=idx,
                        line_content=line.strip(),
                        surrounding_context=surrounding,
                        character_range=(match.start(), match.end()),
                        detection_method=rule["id"],
                    )

                    finding_id = f"QL-{rule['algorithm'].value}-{idx:04d}-{abs(hash(file_path)) % 10000}"

                    finding = Finding(
                        finding_id=finding_id,
                        repository=repository_name,
                        file_path=file_path,
                        line_number=idx,
                        language=cls._detect_language(file_path),
                        algorithm=rule["algorithm"],
                        algorithm_family=rule["family"],
                        function=rule["function"],
                        key_size=key_size,
                        usage_context=context,
                        data_class=data_class,
                        data_sensitivity=sensitivity,
                        data_lifetime_years=lifetime_years,
                        data_lifetime_category=years_to_category(lifetime_years),
                        confidence=round(confidence, 2),
                        evidence=evidence,
                    )
                    findings.append(finding)
                    break  # Avoid double matching the exact same line for multiple overlapping rules

        return findings

    @staticmethod
    def _detect_language(file_path: str) -> str:
        ext = file_path.lower().split(".")[-1] if "." in file_path else ""
        mapping = {
            "py": "python",
            "js": "javascript",
            "jsx": "javascript",
            "ts": "typescript",
            "tsx": "typescript",
            "go": "go",
            "java": "java",
            "pem": "certificate_pem",
            "crt": "certificate_x509",
            "json": "json",
            "yaml": "yaml",
            "yml": "yaml",
            "md": "markdown",
        }
        return mapping.get(ext, "unknown")
